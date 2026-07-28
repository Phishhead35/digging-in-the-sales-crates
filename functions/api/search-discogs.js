// KV_SETUP_REQUIRED: Bind a KV namespace named DITSC_CACHE to this Pages project.
// Cloudflare Dashboard → digging-in-the-sales-crates → Settings → Functions →
// KV namespace bindings → Add binding → Variable name: DITSC_CACHE → select your namespace.

const KV_TTL_SECONDS = 21600; // 6 hours — bumped from 30 min. Vinyl search results don't change
// meaningfully hour to hour, and a longer TTL means far fewer live Discogs calls during a
// traffic spike (viral post), which is what triggered the 429s in the first place.

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

    const res = await fetch(
      `https://api.discogs.com/database/search?${params}`,
      {
        headers: {
          Authorization: `Discogs token=${token}`,
          'User-Agent': 'DiggingInTheSalesCrates/1.0',
        },
      }
    );

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

      return new Response(JSON.stringify(errorPayload), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      });
    }

    const data = await res.json();
    const dataStr = JSON.stringify(data);

    // Write to KV with TTL — fire-and-forget so we don't add latency
    context.waitUntil(
      env.DITSC_CACHE.put(kvKey, dataStr, { expirationTtl: KV_TTL_SECONDS })
    );

    return new Response(dataStr, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
