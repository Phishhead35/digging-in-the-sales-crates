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

    if (!query) {
      return new Response(JSON.stringify({ error: 'No query provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = env.DISCOGS_TOKEN;

    // Cap at 10 results to stay within Cloudflare Worker CPU limits
    // 10 parallel release calls is reliable; 20 risks timeout
    const params = new URLSearchParams({
      q: query,
      type: 'release',
      format: 'vinyl',
      page: page,
      per_page: '10',
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
    const results = data.results || [];

    // Fire all release detail calls in parallel to get lowest_price + condition
    const releaseDetails = await Promise.all(
      results.map(async (release) => {
        try {
          const releaseRes = await fetch(
            `https://api.discogs.com/releases/${release.id}`,
            {
              headers: {
                Authorization: `Discogs token=${token}`,
                'User-Agent': 'DiggingInTheSalesCrates/1.0',
              },
            }
          );
          if (!releaseRes.ok) return { id: release.id, lowest_price: null, lowest_condition: null };
          const releaseData = await releaseRes.json();

          const lowest_price = releaseData.lowest_price || null;
          const lowest_condition = releaseData.lowest_price
            ? getConditionFromCommunity(releaseData.community?.rating?.average)
            : null;

          return { id: release.id, lowest_price, lowest_condition };
        } catch {
          return { id: release.id, lowest_price: null, lowest_condition: null };
        }
      })
    );

    // Merge price + condition back onto search results
    const detailMap = Object.fromEntries(releaseDetails.map(d => [d.id, d]));
    const enrichedResults = results.map(release => ({
      ...release,
      lowest_price: detailMap[release.id]?.lowest_price || null,
      lowest_condition: detailMap[release.id]?.lowest_condition || null,
    }));

    return new Response(JSON.stringify({
      ...data,
      results: enrichedResults,
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

// Derive condition label from community average rating (1-5 stars)
function getConditionFromCommunity(rating) {
  if (!rating) return null;
  if (rating >= 4.5) return 'M';
  if (rating >= 4.0) return 'NM';
  if (rating >= 3.5) return 'VG+';
  if (rating >= 3.0) return 'VG';
  if (rating >= 2.0) return 'G+';
  return 'G';
}
