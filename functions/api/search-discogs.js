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

    // Step 1: Database search — 20 results for good coverage
    const params = new URLSearchParams({
      q: query,
      type: 'release',
      format: 'vinyl',
      page: page,
      per_page: '20',
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

    // Step 2: Only fetch release details for the top 5 results
    // Keeps total API calls low, avoids rate limiting, stays fast
    const top5 = results.slice(0, 5);
    const rest = results.slice(5);

    const top5Details = await Promise.all(
      top5.map(async (release) => {
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
          const lowest_condition = lowest_price
            ? getConditionFromCommunity(releaseData.community?.rating?.average)
            : null;

          return { id: release.id, lowest_price, lowest_condition };
        } catch {
          return { id: release.id, lowest_price: null, lowest_condition: null };
        }
      })
    );

    // Step 3: Merge prices onto top 5, leave rest as-is (Price varies)
    const detailMap = Object.fromEntries(top5Details.map(d => [d.id, d]));

    const enrichedResults = [
      ...top5.map(release => ({
        ...release,
        lowest_price: detailMap[release.id]?.lowest_price || null,
        lowest_condition: detailMap[release.id]?.lowest_condition || null,
      })),
      ...rest.map(release => ({
        ...release,
        lowest_price: null,
        lowest_condition: null,
      })),
    ];

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

// Derive condition label from Discogs community average rating (1-5 stars)
function getConditionFromCommunity(rating) {
  if (!rating) return null;
  if (rating >= 4.5) return 'M';
  if (rating >= 4.0) return 'NM';
  if (rating >= 3.5) return 'VG+';
  if (rating >= 3.0) return 'VG';
  if (rating >= 2.0) return 'G+';
  return 'G';
}
