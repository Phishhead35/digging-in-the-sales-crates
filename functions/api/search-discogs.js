// KV_SETUP_REQUIRED: Bind a KV namespace named DITSC_CACHE to this Pages project.
// Cloudflare Dashboard → digging-in-the-sales-crates → Settings → Functions →
// KV namespace bindings → Add binding → Variable name: DITSC_CACHE → select your namespace.

const KV_TTL_SECONDS = 21600; // 6 hours — bumped from 30 min. Vinyl search results don't change
// meaningfully hour to hour, and a longer TTL means far fewer live Discogs calls during a
// traffic spike (viral post), which is what triggered the 429s in the first place.

const STALE_TTL_SECONDS = 2592000; // 30 days. A second, long-lived copy of every successful
// search, used ONLY when Discogs refuses a request (see "stale fallback" below). Added
// 2026-10-03 after Discogs returned 429 on every fresh search while this whole project had made
// about 31 outbound calls in 24 hours. Discogs counts its 60/minute limit by network address,
// and Cloudflare's outbound addresses are shared with other sites, so we can be throttled by
// traffic that isn't ours. A slightly old result beats an empty Discogs column.

const RETRY_DELAY_MS = 1500; // One retry on 429 after this pause. Discogs uses a rolling
// 60-second window, so a short wait sometimes clears it. Only one retry: a 429 that survives
// it is a real throttle, and hammering it just extends the window.

// Backup route (added 2026-10-03). When Discogs answers this Cloudflare function with a 429,
// the same search is sent to a small Supabase Edge Function that calls Discogs from Supabase's
// network instead of Cloudflare's shared addresses. Supabase project: ditsc-discogs-relay.
// It only runs when DISCOGS_RELAY_KEY is set in Cloudflare (same value as RELAY_KEY in the
// Supabase project's Edge Function secrets). Unset = this route is skipped entirely, so the
// function behaves exactly as before.
const RELAY_URL = 'https://wdujcqnbhoagospopmvl.supabase.co/functions/v1/discogs-search';
const RELAY_TIMEOUT_MS = 8000; // A slow backup is worse than a fast "busy" notice.

const ERROR_TTL_SECONDS = 60; // Cache a 429/error response briefly so a rate-limit event doesn't
// cascade — every repeat search for the same term in this window gets served the cached error
// instantly instead of re-hitting Discogs and adding to the pile-on.

export async function onRequestGet(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const page = url.searchParams.get('page') || '1';
    const perPage = url.searchParams.get('per_page') || '20';

    if (!query) {
      return new Response(JSON.stringify({ error: 'No query provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Normalize key: lowercase, trim whitespace
    const normalizedQuery = query.toLowerCase().trim();
    const kvKey = `discogs:${normalizedQuery}:${page}:${perPage}`;
    const errorKvKey = `discogs-error:${normalizedQuery}:${page}:${perPage}`;
    const staleKvKey = `discogs-stale:${normalizedQuery}:${page}:${perPage}`;

    // Stale fallback: when Discogs refuses, serve the last good copy if we have one.
    // Same JSON shape as a live result, so the page needs no special handling;
    // X-Cache: STALE marks it for anyone checking the response.
    const serveStale = async () => {
      const stale = await env.DITSC_CACHE.get(staleKvKey);
      if (!stale) return null;
      return new Response(stale, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Cache': 'STALE' },
      });
    };

    // Check KV cache — globally consistent, no cold-edge-node misses
    const cached = await env.DITSC_CACHE.get(kvKey);
    if (cached) {
      return new Response(cached, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      });
    }

    // Check for a recently-cached error (e.g. Discogs rate limit, 429). This stops every
    // visitor searching the same term during a throttling event from separately re-hitting
    // Discogs and extending the rate-limit window.
    const cachedError = await env.DITSC_CACHE.get(errorKvKey);
    if (cachedError) {
      const staleResponse = await serveStale();
      if (staleResponse) return staleResponse;
      const parsed = JSON.parse(cachedError);
      return new Response(JSON.stringify(parsed.body), {
        status: parsed.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Cache': 'ERROR-HIT' },
      });
    }

    const token = env.DISCOGS_TOKEN;

    const params = new URLSearchParams({
      q: query,
      type: 'release',
      format: 'vinyl',
      page: page,
      per_page: perPage,
    });

    const callDiscogs = () =>
      fetch(`https://api.discogs.com/database/search?${params}`, {
        headers: {
          Authorization: `Discogs token=${token}`,
          'User-Agent': 'DiggingInTheSalesCrates/1.0',
        },
      });

    // Returns the relay's Response, or null if the relay is not configured,
    // times out, or cannot be reached. Never throws.
    const callRelay = async () => {
      if (!env.DISCOGS_RELAY_KEY) return null;
      try {
        const relayParams = new URLSearchParams({ q: query, page: page, per_page: perPage });
        return await fetch(`${RELAY_URL}?${relayParams}`, {
          headers: { 'x-relay-key': env.DISCOGS_RELAY_KEY },
          signal: AbortSignal.timeout(RELAY_TIMEOUT_MS),
        });
      } catch (relayErr) {
        return null;
      }
    };

    // Order on a 429: backup route first (different network, so it is the
    // likeliest to succeed and costs no waiting), then one direct retry after
    // RETRY_DELAY_MS only if the backup route did not come back OK.
    let via = 'direct';
    let res = await callDiscogs();
    if (res.status === 429) {
      const relayRes = await callRelay();
      if (relayRes && relayRes.ok) {
        res = relayRes;
        via = 'relay';
      } else {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        res = await callDiscogs();
      }
    }

    if (!res.ok) {
      const err = await res.text();
      const errorPayload = { error: `Discogs search failed: ${res.status}`, detail: err };

      // Cache the error briefly — fire-and-forget, same pattern as the success-path write below.
      context.waitUntil(
        env.DITSC_CACHE.put(
          errorKvKey,
          JSON.stringify({ status: res.status, body: errorPayload }),
          { expirationTtl: ERROR_TTL_SECONDS }
        )
      );

      const staleResponse = await serveStale();
      if (staleResponse) return staleResponse;

      return new Response(JSON.stringify(errorPayload), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const data = await res.json();
    const dataStr = JSON.stringify(data);

    // Write to KV with TTL — fire-and-forget so we don't add latency
    context.waitUntil(
      Promise.all([
        env.DITSC_CACHE.put(kvKey, dataStr, { expirationTtl: KV_TTL_SECONDS }),
        env.DITSC_CACHE.put(staleKvKey, dataStr, { expirationTtl: STALE_TTL_SECONDS }),
      ])
    );

    return new Response(dataStr, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': via === 'relay' ? 'RELAY' : 'MISS' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}