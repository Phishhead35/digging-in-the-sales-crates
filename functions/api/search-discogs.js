// KV_SETUP_REQUIRED: Bind a KV namespace named DITSC_CACHE to this Pages project.
// Cloudflare Dashboard → digging-in-the-sales-crates → Settings → Functions →
// KV namespace bindings → Add binding → Variable name: DITSC_CACHE → select your namespace.

const KV_TTL_SECONDS = 1800; // 30 minutes — globally consistent across all edge nodes

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
    const kvKey = `discogs:${query.toLowerCase().trim()}:${page}:${perPage}`;

    // Check KV cache — globally consistent, no cold-edge-node misses
    const cached = await env.DITSC_CACHE.get(kvKey);
    if (cached) {
      return new Response(cached, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
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
      return new Response(JSON.stringify({ error: `Discogs search failed: ${res.status}`, detail: err }), {
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
