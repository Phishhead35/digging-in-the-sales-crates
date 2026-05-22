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

    if (!query) {
      return new Response(JSON.stringify({ error: 'No query provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check Cloudflare cache first
    const cacheKey = new Request(
      `https://cache.cdandlp-proxy/search?q=${encodeURIComponent(query)}`,
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

    const uid = env.CDANDLP_UID;

    const jsonObject = JSON.stringify({
      information: {
        uid,
        action: 'SEARCH',
        lng: 'en',
        artist: query,
        media: 'LP',
        picture: 'YES',
        nb_items: '10',
        srt: '6',
        PAGE_NUMBER: '1',
      },
    });

    const cdUrl = 'https://api.cdandlp.com/search/?callback=jsonpcallback&json_object=' + encodeURIComponent(jsonObject);

    const res = await fetch(cdUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: 'CDandLP search failed: ' + res.status, detail: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // CDandLP returns JSONP: jsonpcallback({...}) — strip the wrapper
    let text = await res.text();
    text = text.replace(/^jsonpcallback\(/, '').replace(/\);?\s*$/, '');

    const data = JSON.parse(text);

    // Cache for 5 minutes
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

// onRequestOptions removed — OPTIONS is handled inside onRequestGet above.
// Cloudflare Pages Functions routes OPTIONS to onRequestGet when onRequestOptions
// is absent, so the CORS preflight response is identical. No functional change.
