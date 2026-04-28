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

    const token = env.DISCOGS_TOKEN;

    // DEBUG: confirm token is being read
    if (!token) {
      return new Response(JSON.stringify({ error: 'DISCOGS_TOKEN env var is missing or empty' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const params = new URLSearchParams({
      q: query,
      format: 'Vinyl',
      sort: 'price',
      sort_order: 'asc',
      per_page: perPage,
      page: page,
    });

    const res = await fetch(
      `https://api.discogs.com/marketplace/search?${params}`,
      {
        headers: {
          Authorization: `Discogs token=${token}`,
          'User-Agent': 'DiggingInTheSalesCrates/1.0',
        },
      }
    );

    // DEBUG: return exact Discogs error so we can see what's happening
    if (!res.ok) {
      const errText = await res.text();
      return new Response(JSON.stringify({
        error: `Discogs marketplace failed: ${res.status}`,
        discogs_response: errText,
        token_present: !!token,
        token_length: token?.length,
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();

    const results = (data.listings || []).map(listing => ({
      id: listing.release?.id,
      title: listing.release?.description || listing.release?.title || '',
      thumb: listing.release?.thumbnail || null,
      cover_image: listing.release?.thumbnail || null,
      lowest_price: parseFloat(listing.price?.value || 0),
      currency: listing.price?.currency || 'USD',
      condition: listing.condition || null,
      sleeve_condition: listing.sleeve_condition || null,
      source: 'discogs',
      url: listing.uri
        ? `https://www.discogs.com${listing.uri}`
        : `https://www.discogs.com/sell/item/${listing.id}`,
      country: listing.ships_from || null,
      year: listing.release?.year || null,
      label: listing.release?.label ? [listing.release.label] : [],
      format: listing.release?.format ? [listing.release.format] : ['Vinyl'],
      genre: [],
      num_for_sale: null,
    }));

    return new Response(JSON.stringify({
      results,
      pagination: {
        page: data.pagination?.page || 1,
        pages: data.pagination?.pages || 1,
        per_page: data.pagination?.per_page || 20,
        items: data.pagination?.items || 0,
      },
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
