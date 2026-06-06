// KV_SETUP_REQUIRED: Bind a KV namespace named DITSC_CACHE to this Pages project.
// Cloudflare Dashboard → digging-in-the-sales-crates → Settings → Functions →
// KV namespace bindings → Add binding → Variable name: DITSC_CACHE → select your namespace.

// eBay OAuth token: still cached via Cache API (token is not search-specific,
// so edge-local caching is fine here — any edge can fetch a fresh token if needed).
const TOKEN_CACHE_KEY = 'https://cache.ebay-proxy/oauth-token';
const TOKEN_TTL_SECONDS = 6000; // 100 minutes — eBay tokens expire after 2 hours
const KV_TTL_SECONDS = 1800;   // 30 minutes for search result caching

async function getAccessToken(env) {
  const cache = caches.default;
  const cached = await cache.match(new Request(TOKEN_CACHE_KEY, { method: 'GET' }));
  if (cached) {
    const { access_token } = await cached.json();
    return access_token;
  }

  const clientId = env.EBAY_CLIENT_ID;
  const clientSecret = env.EBAY_CLIENT_SECRET;
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const tokenRes = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`eBay auth failed: ${tokenRes.status} - ${err}`);
  }

  const tokenData = await tokenRes.json();

  const tokenToCache = new Response(JSON.stringify(tokenData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${TOKEN_TTL_SECONDS}`,
    },
  });
  // fire-and-forget
  cache.put(new Request(TOKEN_CACHE_KEY, { method: 'GET' }), tokenToCache);

  return tokenData.access_token;
}

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
    const kvKey = `ebay:${query.toLowerCase().trim()}`;

    // Check KV cache — globally consistent, no cold-edge-node misses
    const cached = await env.DITSC_CACHE.get(kvKey);
    if (cached) {
      return new Response(cached, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
      });
    }

    const accessToken = await getAccessToken(env);

    const searchParams = new URLSearchParams({
      q: `"${query}" vinyl record`,
      category_ids: '306',
      limit: '10',
      sort: 'price',
      filter: 'deliveryCountry:US',
    });

    const searchRes = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!searchRes.ok) {
      const err = await searchRes.text();
      return new Response(JSON.stringify({ error: `eBay search failed: ${searchRes.status}`, detail: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const searchData = await searchRes.json();

    const items = (searchData.itemSummaries || []).map(item => ({
      itemId: [item.itemId],
      title: [item.title],
      galleryURL: [item.image?.imageUrl || null],
      sellingStatus: [{
        currentPrice: [{ __value__: parseFloat(item.price?.value || 0) }]
      }],
      viewItemURL: [item.itemWebUrl],
      condition: [{ conditionDisplayName: [item.condition || 'Not Specified'] }],
    }));

    const responseData = {
      findItemsByKeywordsResponse: [{
        searchResult: [{ item: items }]
      }]
    };

    const dataStr = JSON.stringify(responseData);

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
