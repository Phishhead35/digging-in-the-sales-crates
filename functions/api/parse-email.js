export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailText } = await request.json();

    if (!emailText) {
      return new Response(JSON.stringify({ error: 'No email text provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 4096,
        messages: [{
          role: 'user',
          content: `You are a vinyl record deal extractor. Parse the following promotional email from a record store and extract all deals, discounts, sales, and featured products.

Return ONLY valid JSON with no markdown, no backticks, no preamble. Use this exact format:

{
  "store": "store name",
  "subject": "email subject or campaign name",
  "deals": [
    {
      "title": "product or sale name",
      "discount": "discount amount or percentage if mentioned",
      "price": "price if mentioned",
      "originalPrice": "original price if mentioned",
      "description": "brief description",
      "url": "URL if present in email",
      "expiry": "expiry date if mentioned",
      "tags": ["genre or category tags like Hip-Hop, Jazz, Limited, etc"]
    }
  ],
  "salewide": "any sitewide sale info",
  "promoCode": "promo code if present",
  "expiryDate": "overall sale end date if mentioned"
}

EMAIL TEXT:
${emailText}`
        }]
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return new Response(JSON.stringify({ error: `Claude API error: ${response.status}`, detail: err }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text || '';

    // If Claude hit the token cap mid-generation, the JSON is truncated and
    // will never parse cleanly. Catch this case with a clear message instead
    // of letting a raw JSON.parse error string reach the user.
    if (data.stop_reason === 'max_tokens') {
      return new Response(JSON.stringify({
        error: 'This email has too many deals to extract in one pass. Try splitting it into smaller sections and parsing each separately.',
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      try {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
        else throw new Error('no match');
      } catch {
        return new Response(JSON.stringify({
          error: 'Could not parse the extracted deals. Try again, or try a shorter section of the email.',
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
