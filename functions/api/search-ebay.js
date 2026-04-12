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

    // Step 1: Get OAuth token using client credentials
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
      return new Response(JSON.stringify({ error: `eBay auth failed: ${tokenRes.status}`, detail: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Step 2: Search using Browse API
    const searchParams = new URLSearchParams({
      q: `${query} vinyl record`,
      category_ids: '306',
      limit: '10',
      sort: 'price',
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

    // Step 3: Transform Browse API response to match our existing format
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

    return new Response(JSON.stringify({
      findItemsByKeywordsResponse: [{
        searchResult: [{ item: items }]
      }]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
