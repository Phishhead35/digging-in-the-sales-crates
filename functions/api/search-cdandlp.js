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

    if (!query) {
      return new Response(JSON.stringify({ error: 'No query provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Normalize key: lowercase, trim whitespace
    const kvKey = `cdandlp:${query.toLowerCase().trim()}`;

    // Check KV cache — globally consistent, no cold-edge-node misses
    const cached = await env.DITSC_CACHE.get(kvKey);
    if (cached) {
      return new Response(cached, {
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
    const dataStr = JSON.stringify(data);

    // Write to KV with TTL — fire-and-forget
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

// onRequestOptions removed — OPTIONS is handled inside onRequestGet above.
// Cloudflare Pages Functions routes OPTIONS to onRequestGet when onRequestOptions
// is absent, so the CORS preflight response is identical. No functional change.
