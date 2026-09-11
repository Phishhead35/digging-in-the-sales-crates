import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ExternalLink, ShoppingCart, Heart, AlertCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { searchDiscogs, searchEbay, searchCDandLP, searchTurntableLab, formatPrice } from '../utils/api';
import useSEO from '../hooks/useSEO';
import { AffiliateDisclosure, AffiliateBadge } from '../components/AffiliateDisclosure';
import { isMonetized } from '../config/partners';
import {
  trackStoreClick,
  trackSelectItem,
  trackSearch,
  trackViewSearchResults,
  trackNoResults,
  trackFilterChange,
  trackPagination,
  trackWishlistAdd,
  trackWishlistRemove,
  trackApiError,
  marketplaceFromUrl,
  CLICK_SOURCES,
} from '../utils/analytics';

// Number of results requested per page. Also used to size the loading-skeleton
// grid below, so the skeleton's height roughly matches the real results grid's
// height and swapping loading -> loaded doesn't cause a big layout shift (CLS).
const RESULTS_PER_PAGE = 20;

// ── Source presentation ───────────────────────────────────────
// Badge label, badge colors, and the human store name used in GA4.
// Previously these were nested ternaries in three separate places, which
// is why adding a fourth source meant touching three spots. One map now.
// The `|| SOURCE_META.cdandlp` fallback below preserves the old behavior
// exactly: anything unrecognized rendered green and read "CDANDLP".
const SOURCE_META = {
  discogs:      { label: 'DISCOGS',       bg: 'rgba(245,158,11,0.9)', fg: '#000', store: 'Discogs' },
  ebay:         { label: 'EBAY',          bg: 'rgba(0,100,210,0.9)',  fg: '#fff', store: 'eBay' },
  cdandlp:      { label: 'CDANDLP',       bg: 'rgba(0,160,100,0.9)',  fg: '#fff', store: 'CDandLP' },
  turntablelab: { label: 'TURNTABLE LAB', bg: 'rgba(139,92,246,0.9)', fg: '#fff', store: 'Turntable Lab' },
};

// Order of the filter tabs. 'all' first, then sources in the order they
// were added to the site.
const SOURCES = ['all', 'discogs', 'ebay', 'cdandlp', 'turntablelab'];

const SOURCE_TAB_LABEL = {
  all: 'All Sources',
  discogs: 'Discogs',
  ebay: 'eBay',
  cdandlp: 'CDandLP',
  turntablelab: 'Turntable Lab',
};

// ── Price normalization and sorting ───────────────────────────
// Results arrive source by source (Discogs, then eBay, then CDandLP, then
// Turntable Lab) and used to render in that order, so page position
// reflected which API answered first rather than which copy was cheapest.
// On a price-comparison site that is the wrong default.
//
// CURRENCY: display and ranking are handled separately and deliberately.
//   - DISPLAY uses the result's own currency, so a CDandLP record shows
//     EUR 15.00 rather than a wrong $15.00. That was a live bug: RecordCard
//     called formatPrice() with no currency argument, so every EUR price
//     rendered with a dollar sign.
//   - RANKING converts to USD with the approximate rates below. Sort order
//     only needs to be roughly right to be useful; a few percent of drift
//     never reorders anything that matters. A displayed price in the wrong
//     currency, by contrast, is simply false.
//
// These rates are for RANKING ONLY. Refresh them occasionally. Do not wire
// them into anything the visitor sees, and do not add a live FX lookup to
// the search path for this: it buys nothing and adds a dependency that can
// fail mid-search.
const FX_TO_USD = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
};

/** Approximate USD value for ranking. null when there is no usable price. */
function priceForRanking(result) {
  const raw = Number(result.lowest_price);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  const code = String(result.currency || 'USD').toUpperCase();
  const rate = FX_TO_USD[code];
  // Unknown currency: rank at face value rather than dropping the result.
  return raw * (rate === undefined ? 1 : rate);
}

/**
 * Cheapest first, among results that actually have a price.
 *
 * Records with no price render "Price varies". Left to a naive numeric sort
 * those become 0 or NaN and float to the top, burying every result that does
 * have a price, so they are pulled out before this comparator ever runs.
 */
function byPriceAsc(a, b) {
  return priceForRanking(a) - priceForRanking(b);
}

// ── Why unpriced results are interleaved, not appended ────────
//
// The first version of this sort pushed every unpriced result to the end of
// the list. That is correct in the narrow sense (you cannot rank a price you
// do not have) and wrong in practice, because it buries an entire source.
//
// Discogs /database/search returns RELEASES, not listings. There is no
// lowest_price on a release, so every Discogs card renders "View Deals" and
// carries no number. Under append-last, all 20 Discogs results landed behind
// every eBay, CDandLP and Turntable Lab result, on page 2 and beyond.
// Discogs is the deepest catalog on the site and often the cheapest copy once
// you click through. Hiding it is a worse outcome than the source-grouped
// ordering this sort replaced.
//
// So: priced results are ranked cheapest first and keep the top slot, and
// unpriced results are woven in at a fixed cadence. A visitor scanning the
// first screen sees the genuinely cheapest listings AND a Discogs entry,
// which is the honest picture. Nothing is hidden and nothing is promoted.
//
// UNPRICED_CADENCE = 3 puts one unpriced card after every three priced ones,
// so roughly a quarter of each screen is catalog matches. Raise it to show
// fewer of them, lower it to show more. Do not set it below 1.
const UNPRICED_CADENCE = 3;

/**
 * Rank the combined result set.
 *
 * Priced results: cheapest first, USD-normalized.
 * Unpriced results: original arrival order preserved (Discogs returns its own
 * relevance ranking, and re-sorting it alphabetically would be worse than
 * leaving it alone).
 *
 * Returns a NEW array. Does not mutate the input.
 */
function rankResults(list) {
  const priced = [];
  const unpriced = [];

  for (const r of list) {
    (priceForRanking(r) === null ? unpriced : priced).push(r);
  }

  // Nothing to weave: one bucket is empty, so the answer is the other bucket.
  if (priced.length === 0) return unpriced;
  if (unpriced.length === 0) return priced.sort(byPriceAsc);

  priced.sort(byPriceAsc);

  const out = [];
  let pi = 0;
  let ui = 0;

  while (pi < priced.length || ui < unpriced.length) {
    for (let n = 0; n < UNPRICED_CADENCE && pi < priced.length; n++) {
      out.push(priced[pi++]);
    }
    if (ui < unpriced.length) out.push(unpriced[ui++]);

    // Priced list exhausted: dump the remaining unpriced results and stop,
    // rather than looping one at a time.
    if (pi >= priced.length) {
      while (ui < unpriced.length) out.push(unpriced[ui++]);
    }
  }

  return out;
}

// ── GA4 tracking ──────────────────────────────────────────────
// All tracking now lives in src/utils/analytics.js. The store_click
// event name and its original parameters (store_name, store_url,
// item_title, click_source) are unchanged, so existing GA4 reports keep
// working. Price, condition, result position, marketplace, and an
// affiliate-params-present flag are added on top.

function RecordCard({ result, onWishlist, wishlisted, onResultClick, priority, position, searchTerm }) {
  const thumb = result.cover_image || result.thumb || result.picture || null;
  const [imgError, setImgError] = useState(false);
  const meta = SOURCE_META[result.source] || SOURCE_META.cdandlp;

  const handleWishlist = useCallback(() => {
    onWishlist(result);
  }, [result, onWishlist]);

  return (
    <div className="record-card" style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 16, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', background: 'var(--bg-surface)' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {thumb && !imgError ? (
            <img
              src={thumb}
              alt={result.title}
              onError={() => setImgError(true)}
              width="220"
              height="220"
              loading={priority ? 'eager' : 'lazy'}
              fetchpriority={priority ? 'high' : 'low'}
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #16161f, #1c1c28)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: '#222', border: '3px solid #333',
                  margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#444' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{
          position: 'absolute', top: 10, left: 10,
          padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600,
          fontFamily: 'var(--font-mono)', letterSpacing: 0.5,
          background: meta.bg,
          color: meta.fg,
        }}>
          {meta.label}
        </div>

        <button onClick={handleWishlist} style={{
          position: 'absolute', top: 10, right: 10,
          width: 32, height: 32, borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: wishlisted ? 'rgba(230,57,70,0.9)' : 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          transition: 'all 0.2s',
        }}>
          <Heart size={14} fill={wishlisted ? 'white' : 'none'} color="white" />
        </button>
      </div>

      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {result.year || '—'} {result.country ? `· ${result.country}` : ''}
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, flex: 1 }}>
          {result.title}
        </h3>
        {result.label && result.label[0] && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {result.label[0]}
          </div>
        )}
        {result.format && result.format.length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
            {result.format.slice(0, 4).join(' · ')}
          </div>
        )}
        {result.genre && result.genre.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
            {result.genre.slice(0, 2).map(g => (
              <span key={g} style={{
                padding: '2px 8px', borderRadius: 100, fontSize: 10,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}>{g}</span>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {result.lowest_price ? (
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>from </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                {/* Pass the currency through. Without it CDandLP's EUR
                    prices rendered with a dollar sign. */}
                {formatPrice(result.lowest_price, result.currency || 'USD')}
              </span>
              {result.lowest_condition && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                  ({result.lowest_condition})
                </span>
              )}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Price varies</span>
          )}
        </div>
        {(() => {
          // Compute the outbound URL once so href and the GA4 event always match.
          // URL construction is byte-identical to the previous inline version.
          const dealUrl =
            result.source === 'discogs'
              ? (() => {
                  const isMaster = (result.uri || '').includes('/master/');
                  // Releases: use path-based URL (/sell/release/{id}) — routes correctly in Discogs mobile app.
                  // Masters: keep query param format (/sell/list?master_id={id}) — spans all pressings of a master.
                  return isMaster
                    ? `https://www.discogs.com/sell/list?master_id=${result.id}&sort=price&sort_order=asc&ev=mr`
                    : `https://www.discogs.com/sell/release/${result.id}?sort=price&sort_order=asc&ev=mr`;
                })()
              : result.source === 'ebay'
              ? (result.url ? result.url + (result.url.includes("?") ? "&" : "?") + "mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=5339145834&toolid=10001&customid=ditsc" : "https://www.ebay.com/itm/" + result.id)
              : result.source === 'cdandlp'
              ? (result.url ? result.url + (result.url.includes("?") ? "&" : "?") + "lng=2&affilie=digginginthesalescrates&utm_source=digginginthesalescrates.com&utm_medium=link&utm_campaign=affiliation" : result.url || '#')
              : result.source === 'turntablelab'
              // Already carries aff=56122 from the Pages Function. Appending
              // anything here would double the param, so use it as-is.
              ? (result.url || '#')
              : result.url || '#';
          const storeName = meta.store;
          return (
            <a
              href={dealUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="view-deals-btn"
              onClick={() => {
                onResultClick();
                trackStoreClick({
                  storeName,
                  storeUrl: dealUrl,
                  clickSource: CLICK_SOURCES.SEARCH_RESULTS,
                  itemTitle: result.title,
                  itemPrice: result.lowest_price,
                  itemCondition: result.lowest_condition,
                  itemId: result.id,
                  position,
                  searchTerm,
                  notify: `${storeName}: ${result.title} (search)`,
                });
                // Fired alongside store_click so GA4's built-in item
                // reports populate. store_click stays the canonical count.
                trackSelectItem({
                  itemId: result.id,
                  itemTitle: result.title,
                  itemPrice: result.lowest_price,
                  marketplace: marketplaceFromUrl(dealUrl),
                  searchTerm,
                  position,
                  listName: 'search_results',
                });
              }}
            >
              <ShoppingCart size={13} /> View Deals
            </a>
          );
        })()}
      </div>

      {/* AFFILIATE DISCLOSURE, per card.
          Rendered only when src/config/partners.js says this source actually
          earns a commission, so the badge can never claim one that does not
          exist. Discogs is unmonetized and gets nothing here, deliberately.
          Sits directly under the View Deals button because the FTC requires
          disclosure close to the link, not only in the footer. */}
      {isMonetized(result.source) && (
        <div style={{
          padding: '0 16px 12px',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <AffiliateBadge />
        </div>
      )}
    </div>
  );
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [allResults, setAllResults] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  // FIX: Split source into two pieces.
  // activeSource drives the UI immediately (button highlight, no delay).
  // deferredSource drives the actual fetch — React defers it until after paint.
  const [activeSource, setActiveSource] = useState('all');
  const lastSearchedRef = useRef('');

  const toTitleCase = (str) =>
    str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const displayQuery = query ? toTitleCase(query) : '';

  useSEO({
    title: displayQuery
      ? `"${displayQuery}" Vinyl Records | Digging in the Sales Crates`
      : 'Search Vinyl Records | Digging in the Sales Crates',
    description: displayQuery
      ? `Compare prices for "${displayQuery}" vinyl records across Discogs, eBay, CDandLP, and Turntable Lab. Find the lowest price in seconds.`
      : 'Search and compare vinyl record prices across Discogs, eBay, CDandLP, and Turntable Lab. Find rare hip-hop, jazz, and classic rock LPs at the lowest price.',
  });

  useEffect(() => {
    const savedScroll = sessionStorage.getItem('searchScrollPos');
    if (savedScroll) {
      sessionStorage.removeItem('searchScrollPos');
      requestAnimationFrame(() => {
        window.scrollTo(0, parseInt(savedScroll));
      });
    }
  }, []);

  const handleResultClick = () => {
    sessionStorage.setItem('searchScrollPos', window.scrollY.toString());
  };

  // FIX: doSearch no longer depends on source at all.
  // It receives source as a parameter so useCallback stays stable.
  const doSearch = useCallback(async (q, pg, src) => {
    if (!q) return;
    setLoading(true);
    setError(null);

    // Per-source counts and wall-clock latency, reported on
    // view_search_results so you can see which marketplace is actually
    // carrying each query and how slow the aggregate search feels.
    const startedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const counts = { discogs: 0, ebay: 0, cdandlp: 0, turntablelab: 0 };

    try {
      const combined = [];

      if (src === 'all' || src === 'discogs') {
        const data = await searchDiscogs(q, pg, RESULTS_PER_PAGE);
        const items = (data.results || []).map(r => ({ ...r, source: 'discogs' }));
        // searchDiscogs swallows its own errors and returns an empty
        // result set, so an empty array here on an 'all' search is the
        // only signal available that Discogs may have rate-limited (429).
        counts.discogs = items.length;
        combined.push(...items);
        if (data.pagination) setTotalPages(data.pagination.pages || 1);
      }

      if (src === 'all' || src === 'ebay') {
        try {
          const ebayData = await searchEbay(q);
          const items = ebayData?.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
          const mapped = items.map(item => ({
            id: item.itemId?.[0],
            title: item.title?.[0],
            thumb: item.galleryURL?.[0],
            lowest_price: parseFloat(item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ || 0),
            source: 'ebay',
            url: item.viewItemURL?.[0],
          }));
          counts.ebay = mapped.length;
          combined.push(...mapped);
        } catch (ebayErr) {
          console.warn('eBay search failed, showing Discogs only:', ebayErr);
          trackApiError('ebay', ebayErr?.message?.match(/\d{3}/)?.[0], ebayErr?.message);
        }
      }

      if (src === 'all' || src === 'cdandlp') {
        try {
          const cdData = await searchCDandLP(q);
          const rawItems = cdData?.information?.items || {};
          const items = Object.values(rawItems);

          const mapped = items.map(item => ({
            id: `cdandlp-${item.shop_url || Math.random()}`,
            title: `${(item.artist || '').trim()} ${item.title ? '- ' + item.title : ''}`.trim(),
            thumb: (item.img_url_1 || item.img_url_2 || item.picture || null)?.replace(/^http:/, 'https:') ?? null,
            lowest_price: parseFloat(item.price || item.price_before_discount || 0),
            source: 'cdandlp',
            url: item.shop_url || 'https://www.cdandlp.com',
            currency: item.currency || 'EUR',
          }));
          counts.cdandlp = mapped.length;
          combined.push(...mapped);
          if (src === 'cdandlp') {
            const nbItems = cdData?.information?.nb_items || 0;
            setTotalPages(Math.ceil(nbItems / 10) || 1);
          }
        } catch (cdErr) {
          console.warn('CDandLP search failed:', cdErr);
          trackApiError('cdandlp', cdErr?.message?.match(/\d{3}/)?.[0], cdErr?.message);
        }
      }

      if (src === 'all' || src === 'turntablelab') {
        try {
          const ttlData = await searchTurntableLab(q);
          // The Pages Function already returns the RecordCard shape
          // (cover_image, lowest_price, format[], genre[], affiliate url),
          // so unlike the other sources there is nothing to map here.
          // `source: 'turntablelab'` is set server-side; re-asserting it
          // keeps the filter tabs working even if that ever changes.
          const mapped = (ttlData?.results || []).map(r => ({ ...r, source: 'turntablelab' }));
          counts.turntablelab = mapped.length;
          combined.push(...mapped);
          // Turntable Lab intentionally does NOT drive setTotalPages.
          // Shopify's suggest endpoint has no page count, and letting it
          // touch pagination would fight Discogs for control of it.
        } catch (ttlErr) {
          console.warn('Turntable Lab search failed:', ttlErr);
          trackApiError('turntablelab', ttlErr?.message?.match(/\d{3}/)?.[0], ttlErr?.message);
        }
      }

      // Rank once, here, so both the full list and every filtered view
      // inherit the order. The activeSource effect below only filters,
      // it never reorders.
      //
      // Note this replaces the earlier `combined.sort(byPriceAsc)`. That
      // sorted in place and sent unpriced results to the back; rankResults
      // returns a new array with them woven through instead. See the comment
      // block above UNPRICED_CADENCE for why.
      const ranked = rankResults(combined);

      setAllResults(ranked);
      setResults(ranked);

      // Fire view_search_results HERE rather than in the query effect, so
      // it can carry the real result counts and latency. 'search' still
      // fires synchronously in the effect below and remains the canonical
      // search-volume metric — report on that, not on this event.
      const latencyMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt;
      if (src === 'all') {
        trackViewSearchResults({
          searchTerm: q,
          resultCount: combined.length,
          discogs: counts.discogs,
          ebay: counts.ebay,
          cdandlp: counts.cdandlp,
          // NOTE: analytics.js must forward this as `results_turntablelab`,
          // and that parameter needs registering as a GA4 custom metric
          // alongside results_discogs / results_ebay / results_cdandlp.
          // Until then the value is collected but invisible in GA4 reports.
          turntablelab: counts.turntablelab,
          latencyMs,
        });
        // The single most actionable event on the site: records people
        // wanted and the aggregator could not deliver.
        if (combined.length === 0) trackNoResults(q, latencyMs);
      }
    } catch (err) {
      setError(err.message);
      trackApiError('search_aggregate', err?.message?.match(/\d{3}/)?.[0], err?.message);
    } finally {
      setLoading(false);
    }
  }, []); // stable — no source dependency

  // Fires on new search query — only when query actually changes
  useEffect(() => {
    if (!query || query === lastSearchedRef.current) return;
    lastSearchedRef.current = query;
    setInputVal(query);
    setPage(1);
    setActiveSource('all');
    // Track search term in GA4 — feeds into artist page + blog recommendations.
    // 'search' is the canonical search-volume event: it fires exactly once per
    // search on every entry path (cold load of /search?q=, in-app re-search,
    // trending chip). Report on THIS event, not view_search_results.
    //
    // view_search_results is NO LONGER fired here. It now fires inside
    // doSearch once results resolve, so it can carry result_count,
    // per-source counts, and search latency. That is a deliberate change:
    // 'search' remains the synchronous, never-missed volume metric, while
    // view_search_results becomes the richer "results actually rendered"
    // event. A visitor who leaves before results load correctly produces
    // a 'search' with no 'view_search_results'.
    //
    // REQUIRES: Enhanced Measurement -> "Site search" must stay OFF in the GA4
    // data stream (Admin -> Data streams -> DITSC Website -> Enhanced
    // measurement). Because /search uses ?q=, a default site-search parameter,
    // leaving it ON makes GA4 fire its OWN view_search_results on top of ours.
    // Verified 2026-08-10 via live /g/collect capture: a cold load of
    // /search/?q=nas produced TWO view_search_results hits (one without _ee=1
    // from Enhanced Measurement, one with _ee=1 from our own call), while an
    // in-app SPA search produced only one — so the inflation varied with
    // traffic mix and corrupted search-volume trending.
    // Do not re-enable Site search.
    trackSearch(query, 'search_page');
    doSearch(query, 1, 'all');
  }, [query]);

  // Filter already-loaded results client-side when tab changes — no re-fetch
  useEffect(() => {
    if (activeSource === 'all') {
      setResults(allResults);
    } else {
      setResults(allResults.filter(r => r.source === activeSource));
    }
  }, [activeSource, allResults]);

  // Pagination — only fires when user explicitly clicks next/prev
  // Uses a ref to detect real page changes vs resets triggered by new searches
  const prevPageRef = useRef(1);
  useEffect(() => {
    if (page > 1 && query && page !== prevPageRef.current) {
      prevPageRef.current = page;
      trackPagination(page, query);
      doSearch(query, page, 'all');
    } else {
      prevPageRef.current = page;
    }
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  const toggleWishlist = useCallback((item) => {
    setWishlist(prev => {
      const exists = prev.find(w => w.id === item.id && w.source === item.source);
      const next = exists ? prev.filter(w => !(w.id === item.id && w.source === item.source)) : [...prev, item];
      localStorage.setItem('wishlist', JSON.stringify(next));
      // Wishlist adds are the strongest intent signal short of an
      // outbound click, and were previously untracked entirely.
      if (exists) {
        trackWishlistRemove({ itemTitle: item.title, marketplace: item.source });
      } else {
        trackWishlistAdd({
          itemTitle: item.title,
          itemPrice: item.lowest_price,
          marketplace: item.source,
          searchTerm: query,
        });
      }
      return next;
    });
  }, [query]);

  const isWishlisted = (item) => wishlist.some(w => w.id === item.id && w.source === item.source);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>

      <form onSubmit={handleSearch} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: 640 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="Search records..."
              className="search-input"
              style={{
                width: '100%', padding: '14px 14px 14px 42px',
                background: 'var(--bg-card)', border: '1px solid var(--border)', borderRight: 'none',
                borderRadius: '10px 0 0 10px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
              }}
            />
          </div>
          <button type="submit" style={{
            padding: '14px 24px', background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            borderRadius: '0 10px 10px 0', color: '#000', fontWeight: 700, fontSize: 14,
          }}>
            DIG
          </button>
        </div>
      </form>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={14} color="var(--text-muted)" />
        {SOURCES.map(s => (
          <button key={s} onClick={() => {
              setActiveSource(s);
              // Which marketplace visitors actually trust enough to
              // filter down to. Fired on the click, not in the effect,
              // so a programmatic reset to 'all' on a new search
              // doesn't register as a deliberate filter choice.
              trackFilterChange(
                s,
                query,
                s === 'all' ? allResults.length : allResults.filter(r => r.source === s).length
              );
            }}
            className={`filter-btn${activeSource === s ? ' filter-btn-active' : ''}`}>
            {SOURCE_TAB_LABEL[s]}
          </button>
        ))}
        {query && (
          <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 8 }}>
            {loading ? 'Searching...' : `${results.length} results for "${query}"`}
          </span>
        )}
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 20 }}>
          {Array(RESULTS_PER_PAGE).fill(0).map((_, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="skeleton" style={{ aspectRatio: '1' }} />
              <div style={{ padding: 16 }}>
                <div className="skeleton" style={{ height: 12, marginBottom: 8, width: '60%' }} />
                <div className="skeleton" style={{ height: 16, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 14, width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
        {/* Names the marketplaces on this page that actually pay a
            commission. Generated from partners.js, so it stays true when a
            program is added or dropped. Placed above the grid, before the
            first link, not after it. */}
        <AffiliateDisclosure variant="compact" surface="search" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 20 }}>
          {results.map((r, index) => (
            <RecordCard
              key={`${r.source}-${r.id}`}
              result={r}
              onWishlist={toggleWishlist}
              wishlisted={isWishlisted(r)}
              onResultClick={handleResultClick}
              priority={index === 0}
              position={index + 1}
              searchTerm={query}
            />
          ))}
        </div>
        </>
      )}

      {!loading && !error && results.length === 0 && query && (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🕳️</div>
          <div style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-secondary)' }}>No results found</div>
          <div style={{ fontSize: 14 }}>Try a different search term or check your API configuration.</div>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40, alignItems: 'center' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
            padding: '8px 16px', borderRadius: 8, background: 'var(--bg-card)',
            border: '1px solid var(--border)', color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
          }}>
            <ChevronLeft size={15} /> Prev
          </button>
          <span style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-mono)', padding: '0 8px' }}>
            {page} / {totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
            padding: '8px 16px', borderRadius: 8, background: 'var(--bg-card)',
            border: '1px solid var(--border)', color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 13,
          }}>
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Live API Sources */}
      <div style={{ marginTop: 64, borderTop: '1px solid var(--border)', paddingTop: 48 }}>
        <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--amber)', marginBottom: 8 }}>
          LIVE API SOURCES
        </h2>
        <p style={{ color: 'var(--text-primary)', fontSize: 13, marginBottom: 24 }}>
          Every search queries these marketplaces in real-time simultaneously.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[
            { name: 'Discogs', url: 'https://discogs.com/sell/list', desc: 'The definitive used vinyl marketplace. Millions of listings, condition graded, worldwide sellers.', tag: 'Live API' },
            { name: 'eBay', url: 'https://rover.ebay.com/rover/1/711-53200-19255-0/1?mpre=https%3A%2F%2Fwww.ebay.com%2Fb%2FVinyl-Records%2F306%2Fbn_1852757&campid=5339145834&mkcid=1&mkevt=1&toolid=10001&customid=ditsc', desc: 'Auctions and fixed-price listings. Best for sealed copies, graded records, and quick finds.', tag: 'Live API' },
            { name: 'CDandLP', url: 'https://www.cdandlp.com/?affilie=digginginthesalescrates&lng=2&utm_source=digginginthesalescrates.com&utm_medium=link&utm_campaign=affiliation', desc: 'European-heavy used marketplace with millions of vinyl listings. Great for international pressings and pricing.', tag: 'Live API' },
            // All-genre framing is deliberate: Andrew at Turntable Lab asked
            // specifically not to be positioned as a hip-hop-only store.
            { name: 'Turntable Lab', url: 'https://www.turntablelab.com/?aff=56122', desc: 'New pressings, reissues, and exclusives across every genre, plus turntables and gear. Stereo and records since 1999.', tag: 'Live API' },
          ].map(({ name, url, desc, tag }) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="api-source-card"
              onClick={() => trackStoreClick({
                storeName: name,
                storeUrl: url,
                clickSource: CLICK_SOURCES.SEARCH_SOURCE_CARD,
                searchTerm: query,
                notify: `${name} (search page source card)`,
              })}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</h3>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 10,
                  background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.4)',
                  color: 'var(--amber)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                }}>{tag}</span>
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--amber)' }}>Visit store →</div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
