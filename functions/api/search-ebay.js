// ⚠️  STAGING NOTE: This file adds OAuth token caching (see getAccessToken below).
// Test on a staging branch before merging to main. Verify that:
//   1. Cache hits return a valid token (check X-Token-Cache header in Worker logs)
//   2. After the 100-minute TTL expires, a fresh token is fetched without errors
//   3. eBay search results are identical to the pre-caching version

const TOKEN_CACHE_KEY = 'https://cache.ebay-proxy/oauth-token';
const TOKEN_TTL_SECONDS = 6000; // 100 minutes — eBay tokens expire after 2 hours

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
    throw new Error(`eBay auth failed: ${tokenRes.status} — ${err}`);
  }

  const tokenData = await tokenRes.json();

  // Cache the token for TOKEN_TTL_SECONDS. We store the full token object so
  // we can extend this later (e.g. to check expires_in dynamically).
  const tokenToCache = new Response(JSON.stringify(tokenData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${TOKEN_TTL_SECONDS}`,
    },
  });
  // fire-and-forget — don't await so we don't add latency to the first request
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

    // Check Cloudflare cache for search results first
    const cacheKey = new Request(
      `https://cache.ebay-proxy/search?q=${encodeURIComponent(query)}`,
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

    // Fetch (or reuse cached) OAuth token
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

    // Cache search results for 5 minutes
    const responseToCache = new Response(JSON.stringify(responseData), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
    });
    context.waitUntil(cache.put(cacheKey, responseToCache));

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
