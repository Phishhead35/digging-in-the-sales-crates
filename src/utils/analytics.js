// ══════════════════════════════════════════════════════════════
// DITSC ANALYTICS — single source of truth for all GA4 tracking
// ══════════════════════════════════════════════════════════════
//
// Replaces the five separate trackStoreClick/trackPartnerClick
// implementations that used to live in Home.jsx, SearchResults.jsx,
// ArtistPage.jsx, Blog.jsx, and WatchAndRead.jsx.
//
// DESIGN RULES (read before adding an event):
//
// 1. NEVER rename an existing event. store_click, search,
//    view_search_results, blog_post_click, blog_marketplace_click,
//    artist_page_click, artist_marketplace_click, watch_read_click,
//    watch_read_playlist_click, and watch_read_browse_all_click all
//    have historical data behind them. Adding parameters is safe;
//    renaming resets the trend line to zero.
//
// 2. Every custom parameter must be registered as a custom dimension
//    in GA4 Admin before it appears in any report. Unregistered
//    params are still collected (and still land in BigQuery) but are
//    invisible in the GA4 UI. See GA4-SETUP.md for the ordered list.
//
// 3. Keep dimension cardinality low where you can. GA4 collapses
//    high-cardinality dimensions into "(other)" once a property
//    exceeds its daily row limit. That is why we send BOTH
//    item_price (exact, high cardinality, for BigQuery) and
//    price_bucket (7 values, for the GA4 UI).
//
// 4. Tracking must never break a click-through. Every public function
//    here is wrapped so a thrown error can't stop navigation.
//
// ── DEBUGGING ──────────────────────────────────────────────────
// In the browser console on the live site:
//   localStorage.setItem('ditsc_debug', '1')
// Every tracked event then logs to console with its full payload.
// Turn off with localStorage.removeItem('ditsc_debug').

export const NTFY_TOPIC = 'ditsc-clicks-vk8q3zt2npw4';

// ── Internals ─────────────────────────────────────────────────

const isDebug = () => {
  try {
    return localStorage.getItem('ditsc_debug') === '1';
  } catch {
    return false;
  }
};

// GA4 hard limits: parameter names <= 40 chars, string values <= 100
// chars. Values longer than 100 chars are silently DROPPED by GA4, not
// truncated, so we truncate here to keep the data instead of losing it.
const clampString = (value, max = 100) => {
  const str = String(value);
  return str.length <= max ? str : str.slice(0, max - 1) + '…';
};

const cleanParams = (params) => {
  const out = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    // Drop undefined/null/empty rather than sending "(not set)" noise.
    if (value === undefined || value === null || value === '') return;
    const name = key.slice(0, 40);
    out[name] = typeof value === 'string' ? clampString(value) : value;
  });
  return out;
};

/**
 * Core event sender. All tracking in the app funnels through here.
 * Silently no-ops if gtag hasn't loaded (ad blocker, slow network,
 * first paint before the GA snippet resolves).
 */
export function track(eventName, params = {}) {
  try {
    const payload = cleanParams(params);
    if (isDebug()) {
      // eslint-disable-next-line no-console
      console.log('%c[DITSC GA4]', 'color:#f59e0b;font-weight:bold', eventName, payload);
    }
    window.gtag?.('event', eventName, payload);
  } catch {
    // Analytics must never break the page.
  }
}

/**
 * ntfy.sh phone ping. Kept from the original storeClickTracking.js.
 * keepalive lets the request finish even as the browser navigates away.
 */
export function notifyStoreClick(message) {
  try {
    fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      body: message,
      headers: { 'X-Title': 'DITSC Store Click', 'X-Tags': 'dollar' },
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never let a notification failure break the click-through.
  }
}

// ── Normalizers ───────────────────────────────────────────────
// These turn messy real-world values into stable, low-cardinality
// dimensions that stay useful in the GA4 UI.

/**
 * Derives the marketplace from any outbound URL. This is what lets you
 * answer "how many clicks went to eBay vs Discogs vs a partner's own
 * site" from a single dimension, regardless of which page fired it.
 */
export function marketplaceFromUrl(url) {
  const u = String(url || '').toLowerCase();
  if (!u || u === '#') return 'unknown';
  if (u.includes('ebay.com')) return 'ebay';
  if (u.includes('discogs.com')) return 'discogs';
  if (u.includes('cdandlp.com')) return 'cdandlp';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('facebook.com')) return 'facebook';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('bsky.app')) return 'bluesky';
  if (u.includes('reddit.com')) return 'reddit';
  if (u.includes('google.com/maps')) return 'google_maps';
  if (u.startsWith('mailto:')) return 'email';
  return 'partner_site';
}

/**
 * Low-cardinality price band. item_price (exact) is great in BigQuery
 * but useless as a GA4 UI dimension because every distinct price is its
 * own row. These seven buckets are what you actually build reports on.
 */
export function priceBucket(price) {
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return 'unknown';
  if (n < 10) return 'a_under_10';
  if (n < 25) return 'b_10_24';
  if (n < 50) return 'c_25_49';
  if (n < 100) return 'd_50_99';
  if (n < 250) return 'e_100_249';
  return 'f_250_plus';
}

/**
 * Whether an affiliate link is actually carrying its tracking params.
 * Fires as a dimension on every outbound click so a future regression
 * that strips affiliate params shows up in GA4 the same day instead of
 * being discovered months later in an empty EPN report.
 */
export function isMonetized(url) {
  const u = String(url || '').toLowerCase();
  if (u.includes('ebay.com')) return u.includes('campid=') ? 'yes' : 'NO_LEAK';
  if (u.includes('cdandlp.com')) return u.includes('affilie=') ? 'yes' : 'NO_LEAK';
  // Discogs has no affiliate program; partner sites use UTM only.
  if (u.includes('discogs.com')) return 'n_a_discogs';

  // Third-party affiliate networks used on the Deals page.
  // tidd.ly is an affiliate shortlink domain; aff= / awinmid= / awinaffid=
  // are the query-string forms used by Turntable Lab and AWIN merchants.
  if (
    u.includes('tidd.ly') ||
    /[?&]aff=/.test(u) ||
    u.includes('awinmid=') ||
    u.includes('awinaffid=')
  ) {
    return 'yes';
  }

  return u.includes('utm_source=') ? 'utm_only' : 'n_a';
}

// ── Commerce events ───────────────────────────────────────────

/**
 * THE money event. Every outbound click to a marketplace or partner.
 *
 * Preserves the existing 'store_click' name and its store_name /
 * store_url / item_title / click_source params so historical reports
 * keep working, and adds the parameters that were missing.
 *
 * @param {object} o
 * @param {string} o.storeName    Display name ("eBay", "Spin That Records")
 * @param {string} o.storeUrl     Full outbound URL, affiliate params included
 * @param {string} o.clickSource  Which surface fired it (see CLICK_SOURCES)
 * @param {string} [o.itemTitle]  Record title, when clicking a specific item
 * @param {number} [o.itemPrice]  Lowest price shown on the card
 * @param {string} [o.itemCondition]
 * @param {string|number} [o.itemId]
 * @param {number} [o.position]   1-based rank in the result list
 * @param {string} [o.searchTerm] Query that produced this result
 * @param {string} [o.notify]     Custom ntfy message; omit to skip the ping
 * @param {boolean} [o.isAffiliate] Explicit override for the `monetized`
 *   dimension. Use where the data already declares affiliate status (the
 *   Deals page store list) rather than trusting URL sniffing — an
 *   affiliate network can change its link format without warning, and a
 *   declared flag will not silently start reporting 'n_a'.
 */
export function trackStoreClick(o = {}) {
  const {
    storeName,
    storeUrl,
    clickSource,
    itemTitle,
    itemPrice,
    itemCondition,
    itemId,
    position,
    searchTerm,
    notify,
    isAffiliate,
  } = o;

  const marketplace = marketplaceFromUrl(storeUrl);

  track('store_click', {
    // Original params — do not remove, historical reports depend on them.
    store_name: storeName,
    store_url: storeUrl,
    item_title: itemTitle || '(none)',
    click_source: clickSource || '(not set)',
    // Added params.
    marketplace,
    item_price: Number.isFinite(Number(itemPrice)) ? Number(itemPrice) : undefined,
    price_bucket: priceBucket(itemPrice),
    item_condition: itemCondition,
    item_id: itemId !== undefined ? String(itemId) : undefined,
    result_position: Number.isFinite(Number(position)) ? Number(position) : undefined,
    search_term: searchTerm,
    // A declared affiliate flag wins over URL sniffing. `false` is
    // meaningful here (a deliberately unmonetized link), so only an
    // undefined flag falls back to inspecting the URL.
    monetized:
      isAffiliate === true
        ? 'yes'
        : isAffiliate === false
        ? 'not_affiliate'
        : isMonetized(storeUrl),
  });

  if (notify) notifyStoreClick(notify);
}

/**
 * GA4 recommended ecommerce event, fired alongside store_click.
 *
 * This is what unlocks GA4's built-in item reports (Monetization ->
 * Ecommerce purchases, item-level tables) instead of forcing you to
 * build every view from custom dimensions. store_click stays the
 * canonical count; select_item is the richer view of the same click.
 */
export function trackSelectItem(o = {}) {
  const { itemId, itemTitle, itemPrice, marketplace, searchTerm, position, listName } = o;
  track('select_item', {
    item_list_name: listName || 'search_results',
    search_term: searchTerm,
    items: [
      {
        item_id: itemId !== undefined ? String(itemId) : undefined,
        item_name: itemTitle ? clampString(itemTitle) : undefined,
        item_brand: marketplace,
        item_category: 'vinyl',
        price: Number.isFinite(Number(itemPrice)) ? Number(itemPrice) : undefined,
        index: Number.isFinite(Number(position)) ? Number(position) : undefined,
        quantity: 1,
      },
    ],
  });
}

// ── Search events ─────────────────────────────────────────────

/**
 * Canonical search-volume event. Fires exactly once per search on every
 * entry path. Report on THIS, not view_search_results.
 */
export function trackSearch(searchTerm, searchSource = 'direct') {
  track('search', {
    search_term: searchTerm,
    search_source: searchSource,
  });
}

/**
 * Where a search was launched from.
 *
 * Fired on the originating page (homepage box, trending chip, nav),
 * because /search itself cannot tell what sent the visitor there.
 * This is additive and separate from 'search' on purpose: 'search'
 * stays the single canonical volume metric. Join the two on
 * search_term when you want origin-segmented volume.
 */
export function trackSearchOrigin(searchTerm, origin) {
  track('search_origin', {
    search_term: searchTerm,
    search_origin: origin,
  });
}

/**
 * Fired manually, synchronously, right alongside trackSearch.
 *
 * REQUIRES: Enhanced Measurement -> "Site search" must stay OFF in the
 * GA4 data stream. Because /search uses ?q= (a default site-search
 * parameter), leaving it ON makes GA4 fire its own view_search_results
 * on top of this one and double-counts. Do not re-enable Site search.
 * Do not delete this call either: GA4's automatic detection relies on a
 * deferred history-change listener that under-fires in real traffic.
 */
export function trackViewSearchResults(o = {}) {
  const { searchTerm, resultCount, discogs, ebay, cdandlp, latencyMs } = o;
  track('view_search_results', {
    search_term: searchTerm,
    result_count: resultCount,
    results_discogs: discogs,
    results_ebay: ebay,
    results_cdandlp: cdandlp,
    search_latency_ms: Number.isFinite(Number(latencyMs)) ? Math.round(latencyMs) : undefined,
    has_results: resultCount > 0 ? 'yes' : 'no',
  });
}

/**
 * A search that returned nothing.
 *
 * This is the single most actionable event on the site: it is a list of
 * records people came here wanting and you could not deliver. Feeds
 * content decisions, artist-page creation, and API coverage gaps.
 */
export function trackNoResults(searchTerm, latencyMs) {
  track('search_no_results', {
    search_term: searchTerm,
    search_latency_ms: Number.isFinite(Number(latencyMs)) ? Math.round(latencyMs) : undefined,
  });
}

/**
 * Local record-shop finder search.
 *
 * Separate from the record `search` event because it is a different
 * intent entirely: a location, not a title. The search terms here are a
 * direct input to store-outreach decisions — if people keep searching a
 * region with no partners in it, that region is the next outreach list.
 */
export function trackLocalShopSearch(locationQuery, resultCount) {
  track('local_shop_search', {
    // Named search_term (not a new param) so it reuses the existing
    // registered dimension instead of burning another of the 50 slots.
    search_term: locationQuery,
    result_count: resultCount,
    has_results: resultCount > 0 ? 'yes' : 'no',
  });
}

export function trackFilterChange(source, searchTerm, resultCount) {
  track('filter_change', {
    filter_source: source,
    search_term: searchTerm,
    result_count: resultCount,
  });
}

export function trackPagination(pageNumber, searchTerm) {
  track('pagination', {
    page_number: pageNumber,
    search_term: searchTerm,
  });
}

// ── Wishlist events ───────────────────────────────────────────
// Previously untracked entirely. Wishlist is the highest-intent
// surface on the site: a saved record that gets clicked later is a
// much stronger buy signal than a cold search click.

export function trackWishlistAdd(o = {}) {
  const { itemTitle, itemPrice, marketplace, searchTerm } = o;
  track('wishlist_add', {
    item_title: itemTitle,
    item_price: Number.isFinite(Number(itemPrice)) ? Number(itemPrice) : undefined,
    price_bucket: priceBucket(itemPrice),
    marketplace,
    search_term: searchTerm,
  });
}

export function trackWishlistRemove(o = {}) {
  const { itemTitle, marketplace } = o;
  track('wishlist_remove', {
    item_title: itemTitle,
    marketplace,
  });
}

export function trackWishlistView(itemCount) {
  track('wishlist_view', { item_count: itemCount });
}

// ── Content events ────────────────────────────────────────────
// Names preserved exactly from the original per-page implementations.

export function trackArtistPageClick(artistName, source = 'artists_index') {
  track('artist_page_click', { artist_name: artistName, source });
}

export function trackArtistMarketplaceClick(artistName, marketplace, url) {
  track('artist_marketplace_click', {
    artist_name: artistName,
    marketplace,
    monetized: isMonetized(url),
  });
}

export function trackBlogPostClick(slug, source) {
  track('blog_post_click', { post_slug: slug, source });
}

export function trackBlogMarketplaceClick(postSlug, artistName, marketplace, url) {
  track('blog_marketplace_click', {
    post_slug: postSlug,
    artist_name: artistName,
    marketplace,
    monetized: isMonetized(url),
  });
}

export function trackWatchReadClick(source) {
  track('watch_read_click', { source });
}

export function trackWatchReadPlaylistClick(seriesName) {
  track('watch_read_playlist_click', { series_name: seriesName });
}

export function trackWatchReadBrowseAllClick(destination) {
  track('watch_read_browse_all_click', { destination });
}

export function trackVideoClick(videoTitle, videoId, source) {
  track('video_click', {
    video_title: videoTitle,
    video_id: videoId,
    source,
  });
}

// ── Navigation and social ─────────────────────────────────────

export function trackNavClick(label, destination, location = 'header') {
  track('nav_click', {
    nav_label: label,
    nav_destination: destination,
    nav_location: location,
  });
}

export function trackSocialClick(platform, location = 'footer') {
  track('social_click', {
    social_platform: platform,
    nav_location: location,
  });
}

// ── Diagnostics ───────────────────────────────────────────────
// Nobody instruments these, and they are how you find out a marketplace
// went down at 2am instead of noticing a week later that eBay results
// have been empty. DITSC has already had one Discogs 429 incident.

export function trackApiError(apiName, status, message) {
  track('api_error', {
    api_name: apiName,
    error_status: String(status || 'unknown'),
    error_message: message ? clampString(message, 100) : undefined,
  });
}

export function trackJsError(message, source) {
  track('js_error', {
    error_message: message ? clampString(message, 100) : 'unknown',
    error_source: source ? clampString(source, 100) : undefined,
  });
}

/**
 * Registers a global JS error handler that reports to GA4.
 * Call once, from App.jsx. Throttled to 5 errors per page load so a
 * render loop can't flood your event quota.
 */
export function installErrorTracking() {
  if (typeof window === 'undefined') return;
  if (window.__ditscErrorTrackingInstalled) return;
  window.__ditscErrorTrackingInstalled = true;

  let reported = 0;
  const MAX = 5;

  window.addEventListener('error', (e) => {
    if (reported >= MAX) return;
    reported += 1;
    trackJsError(e?.message, `${e?.filename || ''}:${e?.lineno || ''}`);
  });

  window.addEventListener('unhandledrejection', (e) => {
    if (reported >= MAX) return;
    reported += 1;
    const reason = e?.reason;
    trackJsError(
      typeof reason === 'string' ? reason : reason?.message || 'unhandled rejection',
      'promise'
    );
  });
}

// ── SPA page views ────────────────────────────────────────────

/**
 * Manual page_view for React Router navigation.
 *
 * GA4's Enhanced Measurement "page changes based on browser history
 * events" fires on the history event itself, which happens BEFORE React
 * re-renders and before useSEO updates document.title. The result is
 * page_view rows tagged with the PREVIOUS page's title. Firing manually
 * after render, with the title read at that moment, fixes the mismatch.
 *
 * REQUIRES: Enhanced Measurement -> "Page changes based on browser
 * history events" must be turned OFF, or every SPA navigation is
 * counted twice.
 */
export function trackPageView(path, title) {
  track('page_view', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_title: title || (typeof document !== 'undefined' ? document.title : undefined),
  });
}

/**
 * Fires page_view once document.title has SETTLED after a route change.
 *
 * WHY THIS IS NOT JUST requestAnimationFrame:
 *
 * A single rAF fires ~16ms after the route effect, which is far too early
 * on this app. Two things happen after that:
 *
 *   1. Routes are React.lazy chunks. On first visit to a route the chunk
 *      still has to download and mount, so the page component's useSEO
 *      has not run yet. Measured on production: title updated ~100ms
 *      after the rAF, so page_view carried the PREVIOUS page's title.
 *
 *   2. useSEO's cleanup resets document.title to the generic
 *      "Digging in the Sales Crates" when the old page unmounts, and the
 *      new page sets its real title afterwards. So the title changes
 *      TWICE per navigation. Firing on the first change would record the
 *      generic fallback instead of the real title.
 *
 * So: watch document.head for title mutations, restart a short settle
 * timer on every change, and only report once the title has been quiet
 * for `settleMs`. `maxWaitMs` is a hard backstop for routes that never
 * change the title at all (currently /faq, /deals, /wishlist,
 * /local-shops and /alerts, none of which call useSEO).
 *
 * Trade-off: page_view is reported a few hundred ms later than before.
 * A visitor who leaves inside that window is not counted. That is the
 * right trade — a missing row beats a row attributed to the wrong page.
 *
 * @returns {() => void} cancel function; call it on the next route change.
 */
export function schedulePageView(path, { settleMs = 250, maxWaitMs = 2000 } = {}) {
  if (typeof document === 'undefined') return () => {};

  let finished = false;
  let settleTimer = null;
  let hardTimer = null;
  let observer = null;
  // Whether the title has changed at all yet. Critical: before the first
  // mutation, "quiet" means "the new route has not rendered yet", NOT
  // "the title has settled". Starting the settle countdown immediately
  // reports the OLD page's title whenever a lazy chunk takes longer than
  // settleMs to arrive. Measured on /local-shops (a heavy chunk): the
  // route had not committed within 250ms, so nothing had mutated and the
  // previous page's title was reported. Only start settling once we have
  // actually seen a change; maxWaitMs covers the no-change case.
  let sawMutation = false;

  const cleanup = () => {
    if (settleTimer) clearTimeout(settleTimer);
    if (hardTimer) clearTimeout(hardTimer);
    if (observer) observer.disconnect();
    settleTimer = null;
    hardTimer = null;
    observer = null;
  };

  const fire = () => {
    if (finished) return;
    finished = true;
    cleanup();
    trackPageView(path, document.title);
  };

  const onMutation = () => {
    sawMutation = true;
    if (settleTimer) clearTimeout(settleTimer);
    settleTimer = setTimeout(fire, settleMs);
  };

  // Backstop. Covers two cases: a route whose title genuinely never
  // changes (navigating to a page with the same title), and any future
  // page that forgets to call useSEO. Either way we still report, just
  // later and with whatever the title is by then.
  hardTimer = setTimeout(fire, maxWaitMs);

  if (typeof MutationObserver !== 'undefined' && document.head) {
    // Observe head rather than the <title> node itself: a framework that
    // replaces the element instead of mutating its text would otherwise
    // slip past the observer.
    observer = new MutationObserver(onMutation);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  } else {
    // No observer available: fall back to a single delayed read.
    settleTimer = setTimeout(fire, settleMs);
  }

  // Deliberately NOT starting the settle countdown here. See sawMutation.

  return () => {
    finished = true;
    cleanup();
  };
}

/**
 * Scroll-depth milestones at 25/50/75/90 percent.
 *
 * GA4's built-in scroll event only fires at 90%, which tells you almost
 * nothing about where people actually stop reading. Call once from
 * App.jsx; it re-arms on every route change.
 */
export function installScrollTracking() {
  if (typeof window === 'undefined') return () => {};

  let fired = new Set();
  let ticking = false;

  const check = () => {
    ticking = false;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = ((window.scrollY || doc.scrollTop) / scrollable) * 100;
    [25, 50, 75, 90].forEach((mark) => {
      if (pct >= mark && !fired.has(mark)) {
        fired.add(mark);
        track('scroll_depth', {
          percent_scrolled: mark,
          page_path: window.location.pathname,
        });
      }
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(check);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Returned so App.jsx can reset milestones when the route changes.
  return () => {
    fired = new Set();
  };
}

// ── Click-source constants ────────────────────────────────────
// Use these instead of raw strings. A typo in a click_source string
// silently splits one report row into two, and you won't notice.

export const CLICK_SOURCES = {
  HOMEPAGE_PARTNER: 'homepage_partner_card',
  HOMEPAGE_HERO: 'homepage_hero',
  SEARCH_RESULTS: 'search_results',
  SEARCH_SOURCE_CARD: 'search_source_card',
  SEARCH_PARTNER_CARD: 'search_partner_card',
  ARTIST_PAGE: 'artist_page',
  ARTIST_PARTNER: 'artist_page_partner_card',
  BLOG_POST: 'blog_post',
  WISHLIST: 'wishlist',
  DEALS: 'deals_page',
  LOCAL_SHOPS: 'local_shops',
  LOCAL_SHOPS_DIRECTIONS: 'local_shops_directions',
  FEATURED_PARTNERS: 'featured_partners',
  FOOTER: 'footer',
  NAV: 'nav',
};
