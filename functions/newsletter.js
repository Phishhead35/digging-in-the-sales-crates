/**
 * functions/newsletter.js
 *
 * Cloudflare Pages Function for the /newsletter short link.
 *
 * Why this is a Function and not a line in public/_redirects: _redirects
 * cannot read the incoming query string, so the old rule always sent
 * utm_source=direct and every signup looked like a direct visit, even when the
 * visitor arrived from a tagged link.
 *
 * Behavior:
 *   - If the visitor arrives with ANY of the five UTM tags (utm_source,
 *     utm_medium, utm_campaign, utm_content, utm_term), those tags are passed
 *     to Beehiiv unchanged and nothing is filled in for the ones that are
 *     missing.
 *   - If the visitor arrives with none of them, the old defaults are used:
 *     utm_source=direct, utm_medium=shared_link, utm_campaign=newsletter_signup.
 *   - Each parameter is sent once. If a tag appears twice on the incoming URL,
 *     the first value wins.
 *   - Other incoming parameters (fbclid, ttclid and so on) are dropped on
 *     purpose; Beehiiv does not need them.
 *
 * Response is a 302 with no-store so the destination can change later and a
 * browser never caches a tagged redirect for the next visitor.
 *
 * The other short links (/tiktok, /yt, /ig, /fb, /pin, /email) stay in
 * public/_redirects with fixed tags. Those are one-source-per-link by design.
 */

const BEEHIIV_URL = 'https://fromthesalescrates.beehiiv.com/subscribe';

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
];

const DEFAULTS = {
  utm_source: 'direct',
  utm_medium: 'shared_link',
  utm_campaign: 'newsletter_signup',
};

// Guard against absurdly long values being echoed into a redirect.
const MAX_VALUE_LENGTH = 200;

export function onRequest({ request }) {
  const incoming = new URL(request.url).searchParams;

  const passed = {};
  for (const key of UTM_KEYS) {
    const value = incoming.get(key); // first occurrence only
    if (value && value.trim() !== '') {
      passed[key] = value.slice(0, MAX_VALUE_LENGTH);
    }
  }

  const tags = Object.keys(passed).length > 0 ? passed : DEFAULTS;

  const dest = new URL(BEEHIIV_URL);
  for (const key of UTM_KEYS) {
    if (tags[key] !== undefined) dest.searchParams.set(key, tags[key]);
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: dest.toString(),
      'Cache-Control': 'no-store',
    },
  });
}
