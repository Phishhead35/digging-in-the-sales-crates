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

    // Use Cloudflare Cache API to avoid hammering Discogs
    const cacheKey = new Request(
      `https://cache.discogs-proxy/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      { method: 'GET' }
    );
    const cache = caches.default;
    const cached = await cache.match(cacheKey);

    if (cached) {
      const cachedBody = await cached.json();
      return new Response(JSON.stringify(cachedBody), {
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
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();

    // Cache the response for 5 minutes
    const responseToCache = new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
    context.waitUntil(cache.put(cacheKey, responseToCache));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
