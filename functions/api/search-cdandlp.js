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

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
