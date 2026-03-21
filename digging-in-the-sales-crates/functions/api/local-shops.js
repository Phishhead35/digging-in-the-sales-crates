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

    const apiKey = env.GOOGLE_PLACES_API_KEY;
    let searchUrl;

    // Check if query is coordinates (from geolocation)
    const coordMatch = query.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);

    if (coordMatch) {
      // Use nearby search for coordinates
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      const params = new URLSearchParams({
        location: `${lat},${lng}`,
        radius: '8000',
        keyword: 'vinyl record shop',
        type: 'store',
        key: apiKey,
      });
      searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
    } else {
      // Use text search for city/zip
      const params = new URLSearchParams({
        query: `vinyl record shop ${query}`,
        key: apiKey,
      });
      searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`;
    }

    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error(`Places API error: ${res.status}`);
    const data = await res.json();

    if (data.status === 'REQUEST_DENIED') {
      return new Response(JSON.stringify({ error: 'Google Places API key invalid or not enabled.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch additional details for each place (website, phone, hours)
    const results = await Promise.all(
      (data.results || []).slice(0, 12).map(async (place) => {
        try {
          const detailParams = new URLSearchParams({
            place_id: place.place_id,
            fields: 'name,vicinity,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,photos,place_id',
            key: apiKey,
          });
          const detailRes = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${detailParams}`);
          const detailData = await detailRes.json();
          const detail = detailData.result || {};

          // Get photo URL if available
          let photoUrl = null;
          if (detail.photos && detail.photos[0]) {
            const photoRef = detail.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${apiKey}`;
          } else if (place.photos && place.photos[0]) {
            const photoRef = place.photos[0].photo_reference;
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${apiKey}`;
          }

          return {
            place_id: place.place_id,
            name: detail.name || place.name,
            vicinity: detail.vicinity || place.vicinity,
            formatted_address: detail.formatted_address || place.formatted_address,
            formatted_phone_number: detail.formatted_phone_number || null,
            website: detail.website || null,
            opening_hours: detail.opening_hours || place.opening_hours || null,
            rating: detail.rating || place.rating || null,
            user_ratings_total: detail.user_ratings_total || place.user_ratings_total || null,
            photo: photoUrl,
          };
        } catch {
          return {
            place_id: place.place_id,
            name: place.name,
            vicinity: place.vicinity,
            formatted_address: place.formatted_address,
            rating: place.rating || null,
            user_ratings_total: place.user_ratings_total || null,
            photo: null,
          };
        }
      })
    );

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
