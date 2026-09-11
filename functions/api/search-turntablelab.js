/**
 * functions/api/search-turntablelab.js
 *
 * Cloudflare Pages Function. Adds Turntable Lab as a search source.
 * Matches the existing /api/search-discogs, /api/search-ebay,
 * /api/search-cdandlp pattern.
 *
 * NO API KEY REQUIRED. Turntable Lab is a Shopify store; this uses public
 * storefront JSON. Nothing needs to be requested from Andrew.
 *
 * Outbound URLs carry aff=56122 already, so dealUrl in SearchResults.jsx
 * can use result.url directly with no extra params.
 *
 * ---------------------------------------------------------------------------
 * ENDPOINT VERIFIED LIVE 2026-09-11 against:
 *   /search/suggest.json?q=coltrane&resources[type]=product&resources[limit]=5
 *
 * Returns valid JSON. USE_SUGGEST = true is correct; do not flip it.
 *
 * The real response differs from Shopify's documented products.json in ways
 * that matter, all handled below:
 *   - `variants` comes back as an EMPTY ARRAY. Price must come from `price`.
 *   - `price` is a decimal STRING ("19.95"), not integer cents.
 *   - the field is `type`, not `product_type`, and its value is internal
 *     junk ("_music-FUNK"). Genre has to come from `tags` instead.
 *   - `vendor` is the ARTIST ("John Coltrane"), not the record label.
 *     Do not map it to `label`, it renders as nonsense.
 *   - `url` carries Shopify search params (?_pos=&_psq=&_psid=&_ss=),
 *     which must be stripped before the affiliate param is added.
 * ---------------------------------------------------------------------------
 */

const AFFILIATE_ID = '56122';
const STORE = 'https://www.turntablelab.com';
const SOURCE = 'turntablelab';

// Verified working 2026-09-11. Only set false if suggest.json is ever
// disabled on the store, which would show up as an empty column.
const USE_SUGGEST = true;

const CACHE_TTL_SECONDS = 900; // 15 min. TTL inventory does not move fast.
const UPSTREAM_TIMEOUT_MS = 6000;
const DEFAULT_LIMIT = 20;

/* ------------------------------------------------------------------ */
/* RELEVANCE AND CATEGORY FILTERING                                     */
/*                                                                      */
/* WHY THIS EXISTS (added 2026-09-11)                                   */
/* A search for "The Masterdon Committee - Funkbox Party" came back     */
/* with two Audio-Technica cartridges and a $1,359 Rega turntable.      */
/*                                                                      */
/* Shopify's /search/suggest.json is a STOREFRONT SUGGESTER, not a      */
/* catalog search. It matches loosely and fuzzily, and when nothing     */
/* matches well it still returns its best partial guesses rather than   */
/* an empty list. Turntable Lab sells turntables, cartridges, slipmats, */
/* headphones, shirts and toys alongside records, so a query for a      */
/* record TTL does not stock comes back as hardware.                    */
/*                                                                      */
/* Verified live 2026-09-11. Even a clean query leaks: "nas it was      */
/* written" returned the right record plus a Nas T-shirt, an unrelated  */
/* Hiatus Kaiyote LP, an Erasmo Carlos LP, and the same Rega turntable. */
/*                                                                      */
/* Two things made it newly visible rather than newly broken:           */
/*   1. Price sorting shipped the same day, so a cheap accessory now    */
/*      outranks a real LP instead of sitting at the bottom.            */
/*   2. Narrower follow-up queries return fewer records from Discogs    */
/*      and eBay, so the junk becomes a bigger share of the page.       */
/* ------------------------------------------------------------------ */

/**
 * GATE 1: category.
 *
 * TTL's `type` field is an internal category code and it is RELIABLE, which
 * makes it a much better filter than guessing from the title. Confirmed
 * values on the live store:
 *
 *   music     _music-HIPHOP  _music-hiphop  _music-FUNK  _music-FUNK-ROCK
 *   clothing  _CLOTHING-shirt  _CLOTHING-hat  _CLOTHING-bagacc-object
 *   hardware  _STEREO  _STEREO-COMP-turntable  _STEREO-COMP-hificartridge
 *             _EQ-HW-djcartridge  _MOBI-headphone-listening
 *   accessory _STEREO-HIFIACC-recordmat  ..._EQ-DJACC-slipmat
 *
 * Case varies between products, hence the /i flag. Everything that is not a
 * record starts with something other than `_music`.
 */
const MUSIC_TYPE = /^_music/i;

/** Last-resort format sniff, used only when `type` is missing entirely. */
const FORMAT_IN_TITLE = /\bvinyl\b|\blp\b|\b7"|\b12"|\bcassette\b|\bcd\b/i;

function isMusicProduct(p) {
  const t = String(p.type || p.product_type || '');
  if (MUSIC_TYPE.test(t)) return true;
  // Typed, but not music. Trust the store's own categorization.
  if (t) return false;
  // Untyped product: fall back to the title rather than dropping a record.
  return FORMAT_IN_TITLE.test(p.title || '');
}

/**
 * Is the SEARCHER after gear rather than a record?
 *
 * Someone typing "slipmat" or "Audio-Technica turntable" genuinely wants the
 * hardware, and Turntable Lab is a real place to buy it. Gate 1 is skipped
 * for those queries, so DITSC still answers them. Verified: "turntable" and
 * "slipmat" keep all 10 results, while "mf doom" drops three Super7 toys.
 */
const GEAR_QUERY = new RegExp(
  [
    'turntable', 'cartridge', 'stylus', 'needle', 'slipmat', 'slip mat',
    'headphone', 'mixer', 'speaker', 'amplifier', 'preamp', 'phono',
    'record mat', 'shirt', 'tee\\b', 'hoodie', 'hat\\b', 'bag\\b',
    'crate\\b', 'sleeve', 'cleaner', 'cleaning', 'brush', 'adapter',
    'adaptor', 'stereo', 'hifi', 'hi-fi',
  ].join('|'),
  'i'
);

/**
 * GATE 2: relevance.
 *
 * Category alone is not enough: "nas it was written" returned a real but
 * unrelated Erasmo Carlos LP, which is correctly typed as music.
 *
 * MIN_QUERY_MATCH_RATIO is the share of meaningful query words a product
 * must match. 0.5 means "Masterdon Committee Funkbox Party" (4 meaningful
 * words) needs 2 hits, and hardware matching none is dropped, while "nas it
 * was written" reduces to 2 meaningful words and needs only 1, so every Nas
 * record passes. Raise it toward 1 for stricter matching and an emptier
 * Turntable Lab column. Do not set it to 0: that is the behavior that
 * produced the turntables.
 */
const MIN_QUERY_MATCH_RATIO = 0.5;

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'by',
  'it', 'is', 'was', 'were', 'be', 'with', 'from', 'this', 'that',
  // Format words carry no artist or title signal and every record has them.
  'vinyl', 'lp', 'record', 'records', 'album', 'ep',
]);

function queryTokens(query) {
  return String(query)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function haystack(p) {
  return [
    p.title,
    p.vendor,
    p.type || p.product_type,
    Array.isArray(p.tags) ? p.tags.join(' ') : '',
  ].join(' ').toLowerCase();
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Word-START matching, not substring.
 *
 * Substring matching would let the token "nas" match "Renaissance" and
 * "gymnasium". Word-start still matches "Nas:" and "Nas's", and still lets a
 * partial query like "colt" find "Coltrane", which is what people type.
 */
function matchesToken(hay, token) {
  return new RegExp('\\b' + escapeRe(token)).test(hay);
}

function filterProducts(products, query) {
  const tokens = queryTokens(query);
  const gearWanted = GEAR_QUERY.test(query);
  const needed = Math.max(1, Math.ceil(tokens.length * MIN_QUERY_MATCH_RATIO));
  const phrase = String(query).toLowerCase().trim();

  return products.filter((p) => {
    if (!gearWanted && !isMusicProduct(p)) return false;

    // Nothing meaningful to match on ("the", "12"). Category gate only.
    if (tokens.length === 0) return true;

    // Exact phrase in the title always wins.
    if (String(p.title || '').toLowerCase().includes(phrase)) return true;

    const hay = haystack(p);
    let hits = 0;
    for (const t of tokens) if (matchesToken(hay, t)) hits++;
    return hits >= needed;
  });
}

/**
 * Genre from the category code rather than from tags.
 *
 * Tags were the wrong source. On real records they carry merchandising junk
 * ("Get On Down", "Gift Guide - Vinyl Classics", "free mp3"), and on
 * hardware they produced genre badges reading "Audio-Technica Cartridges".
 * `type` carries the actual genre: _music-FUNK-ROCK -> Funk, Rock.
 */
const GENRE_LABELS = {
  hiphop: 'Hip-Hop',
  rnb: 'R&B',
  randb: 'R&B',
  dnb: 'Drum & Bass',
  ost: 'Soundtrack',
};

function genreFromType(p) {
  const t = String(p.type || p.product_type || '');
  if (!MUSIC_TYPE.test(t)) return [];
  return t
    .replace(/^_music-?/i, '')
    .split(/[-_]/)
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean)
    .map((x) => GENRE_LABELS[x] || x.charAt(0).toUpperCase() + x.slice(1))
    .filter((x, i, arr) => arr.indexOf(x) === i)
    .slice(0, 2);
}

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') || '').trim();
  const limit = Math.min(
    parseInt(url.searchParams.get('limit') || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT,
    50
  );

  if (query.length < 2) {
    return json({ results: [], source: SOURCE });
  }

  try {
    const products = USE_SUGGEST
      ? await searchViaSuggest(query, limit)
      : await searchViaProductsJson(query, limit);

    // Shopify returns its best partial guesses even when none are good.
    // Everything dropped here would otherwise render as a real result card,
    // and since price sorting shipped a cheap accessory outranks a real LP.
    const relevant = filterProducts(products, query);

    return json({
      results: relevant.map(normalize).filter(Boolean),
      source: SOURCE,
      // Diagnostics. Harmless to expose (this is a public catalog search) and
      // it makes "why is the Turntable Lab column empty" answerable from the
      // network tab instead of by guesswork.
      returned: products.length,
      kept: relevant.length,
    });
  } catch (err) {
    // Fail soft. A dead source must never break the results page: the other
    // three still render and Turntable Lab simply shows nothing.
    console.error('Turntable Lab search failed:', err && err.message);
    return json({ results: [], source: SOURCE, error: true });
  }
}

/* ------------------------------------------------------------------ */
/* Upstream                                                            */
/* ------------------------------------------------------------------ */

async function searchViaSuggest(query, limit) {
  const endpoint =
    `${STORE}/search/suggest.json` +
    `?q=${encodeURIComponent(query)}` +
    `&resources[type]=product` +
    `&resources[limit]=${limit}` +
    `&resources[options][unavailable_products]=last`;

  const data = await fetchJson(endpoint);
  const products =
    data && data.resources && data.resources.results
      ? data.resources.results.products
      : null;

  if (!Array.isArray(products)) throw new Error('Unexpected suggest.json shape');
  return products;
}

/** Fallback only. Pages the catalog and filters locally. Capped at 3 pages. */
async function searchViaProductsJson(query, limit) {
  const needle = query.toLowerCase();
  const matches = [];

  for (let page = 1; page <= 3 && matches.length < limit; page++) {
    const data = await fetchJson(`${STORE}/products.json?limit=250&page=${page}`);
    const batch = data && data.products;
    if (!Array.isArray(batch) || batch.length === 0) break;

    for (const p of batch) {
      const hay = `${p.title} ${p.vendor} ${p.product_type} ${(p.tags || []).join(' ')}`.toLowerCase();
      if (hay.includes(needle)) {
        matches.push(p);
        if (matches.length >= limit) break;
      }
    }
  }
  return matches;
}

async function fetchJson(endpoint) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        // Honest identification. If Andrew checks their logs, this is what
        // he sees, and it helps the case that DITSC sends real traffic.
        'User-Agent': 'DiggingInTheSalesCrates/1.0 (+https://digginginthesalescrates.com)',
        Accept: 'application/json',
      },
      cf: { cacheTtl: CACHE_TTL_SECONDS, cacheEverything: true },
    });
    if (!res.ok) throw new Error(`Turntable Lab returned ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Normalization -> the shape SearchResults.jsx already reads          */
/* id, title, cover_image, thumb, lowest_price, lowest_condition,      */
/* year, country, label, format, genre, source, uri, url              */
/* ------------------------------------------------------------------ */

function normalize(p) {
  if (!p) return null;
  const handle = p.handle;
  if (!handle) return null;

  const path = p.url ? String(p.url).split('?')[0] : `/products/${handle}`;
  const image = pickImage(p);

  return {
    id: `ttl-${p.id || handle}`,

    // TTL titles already read "Artist: Album (details) Vinyl LP", and
    // `vendor` is the artist. Only prefix when the title doesn't already
    // lead with it, so we never get "John Coltrane - John Coltrane: ...".
    title: buildTitle(p),

    cover_image: sized(image, 400),
    thumb: sized(image, 150),

    lowest_price: parsePrice(p.price),
    lowest_condition: 'New',

    year: null,             // not exposed by the API, only prose in `body`
    country: null,
    label: null,            // `vendor` is the ARTIST here, not the label

    // ARRAYS, not strings. RecordCard does format.slice(0,4).join(' · ')
    // and genre.slice(0,2).map(...). A string has .slice but no .join/.map,
    // so returning a string here throws a TypeError and kills the card.
    format: guessFormat(p),
    // `type` first, tags only as a fallback. See genreFromType for why.
    genre: (() => {
      const fromType = genreFromType(p);
      return fromType.length ? fromType : pickGenre(p);
    })(),

    source: SOURCE,
    uri: null,
    url: affiliateUrl(path),   // already carries aff=56122
  };
}

function buildTitle(p) {
  const title = String(p.title || '').trim();
  const vendor = String(p.vendor || '').trim();
  if (!vendor) return title;
  return title.toLowerCase().startsWith(vendor.toLowerCase())
    ? title
    : `${vendor} - ${title}`;
}

function affiliateUrl(path) {
  const abs = /^https?:\/\//i.test(path) ? path : `${STORE}${path}`;
  try {
    const u = new URL(abs);
    u.searchParams.set('aff', AFFILIATE_ID);
    return u.toString();
  } catch {
    return `${STORE}?aff=${AFFILIATE_ID}`;
  }
}

/** TTL returns decimal strings ("19.95"). Tolerate numbers and cents too. */
function parsePrice(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  if (typeof raw === 'number') {
    const n = raw > 1000 ? raw / 100 : raw;
    return Math.round(n * 100) / 100;
  }
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

function pickImage(p) {
  if (p.featured_image && p.featured_image.url) return p.featured_image.url;
  if (typeof p.featured_image === 'string') return p.featured_image;
  if (typeof p.image === 'string') return p.image;
  if (p.image && p.image.src) return p.image.src;
  if (Array.isArray(p.images) && p.images.length) {
    const first = p.images[0];
    return typeof first === 'string' ? first : first.src;
  }
  return null;
}

/**
 * Shopify CDN image transform. Fixed widths keep the CLS fix intact.
 * TTL image URLs carry a ?v= cache-buster, so match the extension
 * immediately before "?" or end of string.
 */
function sized(src, px) {
  if (!src) return null;
  const abs = src.startsWith('//') ? `https:${src}` : src;
  return abs.replace(/(\.(?:jpe?g|png|webp))(\?|$)/i, `_${px}x$1$2`);
}

/**
 * `type` is internal ("_music-FUNK") and useless for display. Tags carry
 * the real category ("Jazz Vinyl"). Skip internal (#-prefixed) and
 * merchandising tags so we don't render "WMG Vinyl Sale" as a genre.
 */
const TAG_NOISE = /^(#|deluxe$|staple$|noteworthy$|recommended$|limited edition$)/i;
const TAG_SALE = /(sale|special|clearance|deal)/i;

function pickGenre(p) {
  const tags = Array.isArray(p.tags) ? p.tags : [];
  const clean = tags
    .filter((t) => t && !TAG_NOISE.test(t) && !TAG_SALE.test(t))
    .map((t) => String(t).replace(/\s*vinyl\s*$/i, '').trim())
    .filter(Boolean);
  // De-dupe, cap at 2 (the card only renders two anyway).
  return [...new Set(clean)].slice(0, 2);
}

/** TTL puts the format in the title ("Vinyl LP", "Vinyl 3LP", "Vinyl 7\""). */
function guessFormat(p) {
  const hay = `${p.title || ''} ${p.type || p.product_type || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
  const multi = hay.match(/\bvinyl (\d)lp\b/);
  if (multi) return [`${multi[1]}LP`];
  if (/\b7"|\b7 inch|\b45 rpm/.test(hay)) return ['7"'];
  if (/\b12"|\b12 inch/.test(hay)) return ['12"'];
  if (/\bcassette\b/.test(hay)) return ['Cassette'];
  if (/\bcd\b/.test(hay)) return ['CD'];
  if (/\blp\b|\bvinyl\b|\brecord\b/.test(hay)) return ['LP'];
  return [];
}

function json(body) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
    },
  });
}