// GET /api/breaks-bible/download?session_id=cs_live_...
// GET /api/breaks-bible/download?session_id=cs_live_...&check=1   (JSON status, no file)
//
// The full PDF is never in /public. It lives in a Workers KV namespace and is only
// streamed after Stripe confirms this exact Checkout Session was paid through the
// Breaks Bible payment link.
//
// Pages > Settings > Bindings:   BREAKS_BIBLE_KV   (KV namespace holding key "breaks-bible.pdf")
// Pages > Settings > Variables:  STRIPE_SECRET_KEY       (secret, restricted key, read-only on Checkout Sessions)
//                                STRIPE_PAYMENT_LINK_ID  (plink_... of the Breaks Bible payment link)

const PDF_KEY = 'breaks-bible.pdf';
const FILE_NAME = 'The-Breaks-Bible.pdf';
const MAX_DOWNLOADS_PER_PURCHASE = 10;
const SESSION_ID_RE = /^cs_(live|test)_[A-Za-z0-9]{10,200}$/;

const baseHeaders = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...baseHeaders, 'Content-Type': 'application/json' },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PAYMENT_LINK_ID || !env.BREAKS_BIBLE_KV) {
    return json({ error: 'not_configured' }, 500);
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id') || '';
  const checkOnly = url.searchParams.get('check') === '1';

  if (!SESSION_ID_RE.test(sessionId)) {
    return json({ error: 'invalid_session' }, 400);
  }

  let stripeRes;
  try {
    stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` } }
    );
  } catch (e) {
    return json({ error: 'stripe_unreachable' }, 502);
  }
  if (stripeRes.status === 404) return json({ error: 'session_not_found' }, 404);
  if (!stripeRes.ok) return json({ error: 'stripe_error' }, 502);

  const session = await stripeRes.json();

  if (session.payment_link !== env.STRIPE_PAYMENT_LINK_ID) {
    return json({ error: 'wrong_product' }, 403);
  }
  if (session.status !== 'complete' || session.payment_status !== 'paid') {
    return json({ error: 'not_paid' }, 402);
  }

  const email = (session.customer_details && session.customer_details.email) || null;

  if (checkOnly) {
    const head = await env.BREAKS_BIBLE_KV.get(PDF_KEY, { type: 'stream' });
    if (head) await head.cancel();
    return json({ status: head ? 'ready' : 'pending', email });
  }

  const countKey = `dl:${sessionId}`;
  const used = parseInt((await env.BREAKS_BIBLE_KV.get(countKey)) || '0', 10) || 0;
  if (used >= MAX_DOWNLOADS_PER_PURCHASE) {
    return json({ error: 'download_limit' }, 429);
  }

  const pdf = await env.BREAKS_BIBLE_KV.get(PDF_KEY, { type: 'stream' });
  if (!pdf) return json({ error: 'pdf_not_ready' }, 503);

  await env.BREAKS_BIBLE_KV.put(countKey, String(used + 1), { expirationTtl: 60 * 60 * 24 * 90 });

  return new Response(pdf, {
    status: 200,
    headers: {
      ...baseHeaders,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${FILE_NAME}"`,
    },
  });
}
