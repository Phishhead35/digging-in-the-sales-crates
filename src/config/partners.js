/**
 * src/config/partners.js
 *
 * Single source of truth for every outbound partner on DITSC.
 *
 * WHY THIS FILE EXISTS
 * Vinyl Castle was removed and Vinyl Flat was closed by Awin on 2026-05-20,
 * but links to both may still be live on the site. Dead affiliate links earn
 * nothing, and a closed program's tracking parameters can look like link
 * stuffing to the merchant. Keeping partner data in one typed list means a
 * program that ends gets flipped in one place and disappears everywhere.
 *
 * It also drives the affiliate DISCLOSURE. `disclose: true` is what puts an
 * "affiliate" badge next to a link, so a badge can never disagree with
 * reality: flip a partner to unmonetized and its badge disappears on every
 * surface at once. Never hardcode a badge on a page.
 *
 * And it feeds the `monetized` GA4 dimension so the NO_LEAK check keeps
 * working automatically as partners come and go.
 *
 * HOW TO USE
 *   import { ACTIVE_PARTNERS, isMonetized, buildPartnerUrl } from '../config/partners';
 *
 *   ACTIVE_PARTNERS.filter(p => p.surfaces.includes('deals'))
 *   {isMonetized('ebay') && <AffiliateBadge />}
 *   buildPartnerUrl('turntablelab', '/products/some-record')
 *
 * Never render from PARTNERS directly. Always go through ACTIVE_PARTNERS so
 * a retired program cannot leak back onto a page.
 */

/**
 * status:
 *   'live'        earning, safe to render
 *   'unmonetized' rendered on purpose, earns nothing (goodwill link)
 *   'closed'      program ended, never render
 *
 * monetized: the value sent to GA4's `monetized` dimension on store_click.
 *   'yes'            affiliate tracking present and correct
 *   'not_affiliate'  deliberately unmonetized, not a bug
 *   'n_a_discogs'    Discogs has no program, goodwill only
 *
 * surfaces: where this partner's links actually appear today. Used by the
 *   disclosure components to decide whether a page needs a notice at all.
 *   Known surfaces: 'home', 'search', 'wishlist', 'deals', 'blog', 'artist'.
 *
 * disclose: true means links to this partner earn a commission and MUST
 *   carry a visible disclosure near the link. This is the flag the badge
 *   reads. Do not set it true for a goodwill link.
 */
export const PARTNERS = [
  {
    key: 'amazon',
    name: 'Amazon',
    status: 'live',
    network: 'Amazon Associates',
    monetized: 'yes',
    // digginginthesalescrates.com was declared and approved in the
    // Associates account on 2026-09-15. Live on artist and blog pages, but
    // ONLY on the individual artist entries that carry amazonEligible: true
    // in src/data/artists.js and each blog post's shopArtists list. That
    // flag, not this surfaces array, is what decides which specific search
    // links render, because Amazon's catalog is thin on obscure and library
    // pressings and a search link landing on nothing is worse than no link.
    surfaces: ['artist', 'blog'],
    base: 'https://www.amazon.com',
    params: { tag: 'josephnicho03-20' },
    disclose: true,
    // Amazon's operating agreement requires ITS OWN wording, not the
    // generic notice. See AMAZON_DISCLOSURE in AffiliateDisclosure.jsx.
    requiresOwnDisclosure: true,
  },
  {
    key: 'ebay',
    name: 'eBay',
    status: 'live',
    network: 'eBay Partner Network',
    monetized: 'yes',
    surfaces: ['search', 'wishlist', 'blog', 'artist'],
    params: {
      mkevt: '1',
      mkcid: '1',
      mkrid: '711-53200-19255-0',
      campid: '5339145834',
      toolid: '10001',
      customid: 'ditsc',
    },
    disclose: true,
  },
  {
    key: 'cdandlp',
    name: 'CDandLP',
    status: 'live',
    network: 'Direct',
    monetized: 'yes',
    surfaces: ['search', 'wishlist', 'blog', 'artist'],
    params: {
      lng: '2',
      affilie: 'digginginthesalescrates',
      utm_source: 'digginginthesalescrates.com',
      utm_medium: 'link',
      utm_campaign: 'affiliation',
    },
    disclose: true,
  },
  {
    key: 'turntablelab',
    name: 'Turntable Lab',
    status: 'live',
    network: 'Affiliatly',
    monetized: 'yes',
    surfaces: ['deals', 'search', 'wishlist'],
    base: 'https://www.turntablelab.com',
    params: { aff: '56122' },
    disclose: true,
    // Andrew Jernigan asked not to be positioned as hip-hop only.
    // Keep any blurb all-genre.
    note: 'All-genre destination, not hip-hop specific.',
  },
  {
    key: 'retrolife',
    name: 'Retrolife',
    status: 'live',
    network: 'Awin',
    advertiserId: '83661',
    publisherId: '2823694',
    monetized: 'yes',
    surfaces: ['home', 'deals'],
    // Awin shortlink currently live on the Deals page. The long form below
    // is the same tracking link unshortened; both credit publisher 2823694
    // against advertiser 83661. The shortlink is what ships, because it is
    // the one already proven in production.
    prebuiltUrl: 'https://tidd.ly/4vOWBpT',
    awinTrackingUrl:
      'https://www.awin1.com/cread.php?awinmid=83661&awinaffid=2823694',
    disclose: true,
  },
  {
    key: 'discogs',
    name: 'Discogs',
    status: 'unmonetized',
    network: null,
    monetized: 'n_a_discogs',
    surfaces: ['search', 'wishlist', 'blog', 'artist'],
    // NO badge. Discogs has no affiliate program and earns nothing.
    // Badging it would be a false disclosure, which is its own problem.
    disclose: false,
  },
  {
    key: 'fatbeats',
    name: 'Fat Beats',
    status: 'unmonetized',
    network: null,
    monetized: 'not_affiliate',
    surfaces: ['deals'],
    base: 'https://www.fatbeats.com',
    disclose: false,
    note: 'Deliberately unmonetized. Not a bug.',
  },

  /* ---- Retired. Kept so nobody re-adds them by mistake. ---- */
  {
    key: 'vinylcastle',
    name: 'Vinyl Castle',
    status: 'closed',
    network: 'Awin',
    advertiserId: '109172',
    monetized: 'not_affiliate',
    surfaces: [],
    disclose: false,
    note: 'Program ended. Remove any remaining links and Awin tracking.',
  },
  {
    key: 'vinylflat',
    name: 'Vinyl Flat Record Flattener',
    status: 'closed',
    network: 'Awin',
    advertiserId: '37520',
    monetized: 'not_affiliate',
    surfaces: [],
    disclose: false,
    note: 'Closed by Awin 2026-05-20 (immediate closure). Remove any links.',
  },
];

/** Everything safe to render. Retired programs can never reach a page. */
export const ACTIVE_PARTNERS = PARTNERS.filter((p) => p.status !== 'closed');

/** Partners that earn a commission, so need a disclosure. */
export const MONETIZED_PARTNERS = ACTIVE_PARTNERS.filter((p) => p.disclose);

const BY_KEY = Object.fromEntries(PARTNERS.map((p) => [p.key, p]));

export function getPartner(key) {
  return BY_KEY[key] || null;
}

/** True if this partner earns a commission and must be disclosed. */
export function isMonetized(key) {
  const p = getPartner(key);
  return Boolean(p && p.status === 'live' && p.disclose);
}

/**
 * Monetized partners whose links actually appear on a given surface.
 * Drives "does this page need a disclosure notice, and who is named in it".
 *
 * @param {string} surface 'home' | 'search' | 'wishlist' | 'deals' | 'blog' | 'artist'
 */
export function monetizedOnSurface(surface) {
  return MONETIZED_PARTNERS.filter(
    (p) => Array.isArray(p.surfaces) && p.surfaces.includes(surface)
  );
}

/**
 * True if any partner on this surface carries its own required disclosure
 * wording on top of the generic FTC notice.
 *
 * Only Amazon does today. Amazon's Operating Agreement requires its own
 * sentence, and the generic "we may earn a commission" line does not satisfy
 * it. Wiring this through config rather than hardcoding it into pages means
 * adding or removing an Amazon surface turns the sentence on or off
 * everywhere at once. Nobody has to remember, and it can never appear on a
 * page with no Amazon link on it.
 */
export function requiresOwnDisclosureOnSurface(surface) {
  return monetizedOnSurface(surface).some((p) => p.requiresOwnDisclosure);
}

/**
 * Every monetized partner actually linked somewhere on the site, by name.
 * The site-wide footer disclosure is built from this, so a program that is
 * added or dropped updates the footer text without anyone editing prose.
 */
export function monetizedPartnerNames() {
  return MONETIZED_PARTNERS.filter(
    (p) => Array.isArray(p.surfaces) && p.surfaces.length > 0
  ).map((p) => p.name);
}

/** GA4 `monetized` value for a partner. Falls back to NO_LEAK, which is
 *  what the weekly check looks for: an outbound link with no tracking. */
export function monetizedValue(key) {
  const p = getPartner(key);
  return p ? p.monetized : 'NO_LEAK';
}

/**
 * Append a partner's affiliate parameters to a destination URL.
 * Returns null for retired programs, so a closed merchant cannot be linked.
 *
 * @param {string} key   partner key, e.g. 'turntablelab'
 * @param {string} path  absolute URL, or a path resolved against partner.base
 */
export function buildPartnerUrl(key, path = '/') {
  const p = getPartner(key);
  if (!p || p.status === 'closed') return null;
  if (p.prebuiltUrl) return p.prebuiltUrl;

  const raw = /^https?:\/\//i.test(path) ? path : `${p.base || ''}${path}`;
  if (!raw) return null;

  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  for (const [k, v] of Object.entries(p.params || {})) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

/**
 * Dev-only guard. Call once at app start. Logs any partner that is live and
 * monetized but has no tracking configured, which is the NO_LEAK condition
 * before it ever reaches GA4.
 */
export function auditPartners() {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') return;
  for (const p of ACTIVE_PARTNERS) {
    if (p.disclose && !p.params && !p.prebuiltUrl) {
      console.warn(`[partners] "${p.name}" is monetized but has no tracking configured.`);
    }
  }
}