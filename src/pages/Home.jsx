import React, { useState, startTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, TrendingDown, Star, ArrowRight, Disc3, ExternalLink } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import useLatestVideos from '../hooks/useLatestVideos';
import VideoCard from '../components/VideoCard';
import { MA_STORES, RINH_STORES } from '../data/partnerStores';

const TRENDING_SEARCHES = [
  'Eric B & Rakim', 'A Tribe Called Quest', 'Wu-Tang Clan',
  'J Dilla', 'Pete Rock', 'Nas Illmatic', 'De La Soul',
];

// Latest deals preview — static placeholder, replace with live data from your API
const DEALS_PREVIEW = [
  { title: 'Herbie Hancock – Head Hunters', store: 'Discogs', price: '$12.99', was: '$24.99', condition: 'VG+' },
  { title: 'Gang Starr – Step in the Arena', store: 'Discogs', price: '$18.50', was: '$32.00', condition: 'VG' },
  { title: 'A Tribe Called Quest – Midnight Marauders', store: 'eBay', price: '$21.00', was: '$40.00', condition: 'NM' },
  { title: 'MF DOOM – Mm..Food', store: 'ADamnShame', price: '$29.99', was: '$55.00', condition: 'VG+' },
];

const VIDEO_CARD_COLORS = ['#f59e0b', '#2ec4b6', '#e63946'];

// ── Online Friends ────────────────────────────────────────────
// Online-only resources (not physical retail), kept separate from
// MA_STORES/RINH_STORES since they have no location/phone/seller page.
// Single-link entries render via StoreCard's default full-card-clickable
// variant (no siteUrl/ebayUrl set). `featured: true` adds the accent
// border + "AS SEEN IN OUR CRATES" badge — Recordbuilds links back to
// DITSC from their vinyl records guide, so it earns the standout look.
// `extra` is a second paragraph (Recordbuilds' About Us copy) rendered
// below the main description.
const ONLINE_FRIENDS = [
  {
    name: 'Recordbuilds',
    type: 'Vinyl Setup Builder',
    location: 'Online',
    desc: 'Pick the right setup before you buy.',
    extra: 'Whether you’re upgrading a setup you already have or buying your very first record player, we’ve got your back. If you want to nerd out on the details, cool. If you just want a simple way to make an easy decision, also cool. Our stuff is built for both.',
    featured: true,
    url: 'https://builder.recordbuilds.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=recordbuilds',
  },
];

// ── Store data ────────────────────────────────────────────────
// MA_STORES and RINH_STORES now live in src/data/partnerStores.js,
// the single source of truth shared with SearchResults.jsx. Add or
// edit a partner there, not here.

// ── GA4 store click tracker ───────────────────────────────────
// Fires store_click with both store name and the specific URL clicked.
// Uses optional chaining so it silently no-ops if gtag isn't loaded yet.
// Also pings ntfy.sh for an instant phone notification per click.
// keepalive lets the request complete even as the browser leaves the page.
const NTFY_TOPIC = 'ditsc-clicks-vk8q3zt2npw4';

function notifyStoreClick(message) {
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

function trackStoreClick(storeName, storeUrl) {
  window.gtag?.('event', 'store_click', {
    store_name: storeName,
    store_url: storeUrl,
  });
  notifyStoreClick(`${storeName} (homepage partner card)`);
}

function trackWatchReadClick(source) {
  window.gtag?.('event', 'watch_read_click', { source });
}

// ── StoreCard component ───────────────────────────────────────
// Extracted to eliminate duplicated map logic between MA and RI/NH sections.
// className="store-card", all href values, and all UTM parameters are byte-identical
// to the original inline code. Do not rename store-card — GTM may reference it.
//
// `store.featured` and `store.extra` are opt-in additions for the single-link
// (default) variant only — existing MA/RI-NH store cards are untouched unless
// they explicitly set these fields.

function StoreCard({ store }) {
  // Three-button variant: Website + Discogs + eBay
  if (store.ebayUrl) {
    return (
      <div className="store-card"
        style={{ display: 'block', padding: '20px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{store.name}</div>
            <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{store.type} · {store.location}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: '0 0 14px' }}>{store.desc}</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <a href={store.siteUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => trackStoreClick(store.name, store.siteUrl)}
            style={{ fontSize: 12, color: '#0a0a0f', fontWeight: 700, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, background: 'var(--amber)' }}>
            Website →
          </a>
          <a href={store.url} target="_blank" rel="noopener noreferrer"
            onClick={() => trackStoreClick(store.name, store.url)}
            style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)' }}>
            Discogs →
          </a>
          <a href={store.ebayUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => trackStoreClick(store.name, store.ebayUrl)}
            style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', background: 'transparent' }}>
            eBay →
          </a>
        </div>
      </div>
    );
  }

  if (store.siteUrl) {
    return (
      <div className="store-card"
        style={{ display: 'block', padding: '20px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{store.name}</div>
            <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{store.type} · {store.location}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: '0 0 14px' }}>{store.desc}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={store.url} target="_blank" rel="noopener noreferrer"
            onClick={() => trackStoreClick(store.name, store.url)}
            style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)' }}>
            Discogs →
          </a>
          <a href={store.siteUrl} target="_blank" rel="noopener noreferrer"
            onClick={() => trackStoreClick(store.name, store.siteUrl)}
            style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', background: 'transparent' }}>
            Website →
          </a>
        </div>
      </div>
    );
  }

  return (
    <a href={store.url} target="_blank" rel="noopener noreferrer" className="store-card"
      onClick={() => trackStoreClick(store.name, store.url)}
      style={{
        display: 'block', padding: '20px', borderRadius: 14, background: 'var(--bg-card)',
        border: store.featured ? '2px solid var(--amber)' : '1px solid var(--border)',
        textDecoration: 'none', position: 'relative',
      }}>
      {store.featured && (
        <span style={{
          position: 'absolute', top: -10, left: 18,
          background: 'var(--amber)', color: '#412402',
          fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
          padding: '3px 10px', borderRadius: 100,
        }}>
          AS SEEN IN OUR CRATES
        </span>
      )}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 8, marginTop: store.featured ? 6 : 0,
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{store.name}</div>
          <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{store.type} · {store.location}</div>
        </div>
        <ExternalLink size={13} color="var(--amber)" style={{ flexShrink: 0, marginTop: 3 }} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{store.desc}</p>
      {store.extra && (
        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: '10px 0 0' }}>{store.extra}</p>
      )}
    </a>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const videos = useLatestVideos();

  useSEO({
    title: 'Digging in the Sales Crates | Vinyl Record Price Comparison',
    description: 'Find the lowest prices on vinyl records across Discogs, eBay, and CDandLP. Taking the Dig Out of Digging™ — search rare hip-hop, jazz, and soul LPs in seconds.',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      });
    }
  };

  const handleTrending = (term) => {
    startTransition(() => {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    });
  };

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px 48px',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center',
      }}>

        {/* Record only on left side, very subtle — no text bleed.
            CSS background-image, not <img>: an <img> here was being picked up as the
            page's Largest Contentful Paint element (it's the biggest paintable thing
            in the hero) even at 4% opacity and aria-hidden. loading="lazy" then delayed
            that "LCP" candidate's paint, which is what drove P99 LCP to ~20s. Background
            images are never LCP candidates, so this removes it from LCP scoring entirely
            and lets the H1 become the real LCP element. 7/18/26 fix.
            
            CLS fix (8/5/26): Repositioned watermark from left: -5%, top: 50%, translateY(-50%)
            to left: 50%, top: 0, translateX(-50%) to eliminate layout shift caused by
            recalculation of the vertical centering transform. Pinned to top instead. */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '50%', top: 0,
              transform: 'translateX(-50%)',
              height: '100%', width: '120%',
              opacity: 0.04,
              clipPath: 'inset(0 55% 0 0)',
              backgroundImage: 'url(/ditsc_banner_svg_v8.svg)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center top',
              backgroundSize: 'auto 100%',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10,10,15,0.7)',
          }} />
        </div>

        <div style={{ position: 'relative', maxWidth: 760 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
            color: 'var(--amber)', fontSize: 12, fontWeight: 500, letterSpacing: 1,
            marginBottom: 28, fontFamily: 'var(--font-mono)',
          }}>
            <TrendingDown size={13} />
            VINYL DEAL AGGREGATOR
          </div>

          {/* Headline with trademark */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 9vw, 88px)',
            letterSpacing: 2, lineHeight: 0.95, marginBottom: 20,
          }}>
            TAKING THE DIG<br />
            OUT OF DIGGING
            <sup style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(10px, 1.5vw, 16px)',
              fontWeight: 600,
              color: 'var(--amber)',
              verticalAlign: 'super',
              marginLeft: 3,
              letterSpacing: 0,
            }}>™</sup>
          </h1>

          <p style={{
            color: 'var(--text-secondary)', fontSize: 17, fontWeight: 300,
            maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7,
          }}>
            Search Discogs, eBay, and CDandLP simultaneously. Find the lowest price on any vinyl in seconds.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: 560, margin: '0 auto 28px' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{
                  position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1,
                }} />
                <input
                  type="text"
                  placeholder="Artist, album, or label..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  autoFocus
                  className="search-input"
                  style={{
                    width: '100%', padding: '18px 18px 18px 48px',
                    background: 'var(--bg-card)', fontSize: 16,
                    border: '1px solid var(--border)', borderRight: 'none',
                    borderRadius: '12px 0 0 12px', color: 'var(--text-primary)',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                />
              </div>
              <button type="submit" className="dig-btn">DIG</button>
            </div>
          </form>

          {/* Trending */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)', alignSelf: 'center' }}>
              TRENDING:
            </span>
            {TRENDING_SEARCHES.map(term => (
              <button key={term} onClick={() => handleTrending(term)} className="trending-pill">
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED STORES ("Shops We Dig") ─────────────────────────
          Phase 2 ground rule: stays in position 2, immediately after the
          hero. Layout, store-card count, and all links are unchanged. */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ marginBottom: 36 }}>
            <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
              FEATURED PARTNERS
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1, color: 'var(--text-primary)' }}>
              SHOPS WE DIG
            </h2>
            <p style={{ color: 'var(--text-primary)', fontSize: 15, marginTop: 8, maxWidth: 560 }}>
              Hand-picked independent stores worth your time and money. These are the real ones.
            </p>
          </div>

          {/* Massachusetts */}
          <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--amber)', marginBottom: 16 }}>MASSACHUSETTS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 40 }}>
            {MA_STORES.map(store => <StoreCard key={store.name} store={store} />)}
          </div>

          {/* Rhode Island & New Hampshire */}
          <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--amber)', marginBottom: 16 }}>RHODE ISLAND & NEW HAMPSHIRE</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
            {RINH_STORES.map(store => <StoreCard key={store.name} store={store} />)}
          </div>

          {/* Store signup CTA */}
          <div style={{
            padding: '18px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Own a record store?</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', marginLeft: 8 }}>Get your shop in front of serious collectors.</span>
            </div>
            <Link to="/featured-partners" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8,
              background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--amber)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              Learn more <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ONLINE FRIENDS ─────────────────────────────────────────
          Position 3 (after Shops We Dig, before Latest From DITSC).
          Online-only resources, not physical stores. Grid capped at
          minmax(280px, 420px) instead of the store grid's minmax(260px, 1fr)
          so a lone card stays a normal card width instead of stretching
          full-bleed across the 1280px container — matters more now that
          featured cards can carry a longer About Us paragraph. */}
      <section style={{ padding: '48px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ marginBottom: 24 }}>
            <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
              PARTNER RESOURCES
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1, color: 'var(--text-primary)' }}>
              ONLINE FRIENDS
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 420px))', gap: 16 }}>
            {ONLINE_FRIENDS.map(store => <StoreCard key={store.name} store={store} />)}
          </div>
        </div>
      </section>

      {/* ── LATEST FROM DITSC ─────────────────────────────────────
          Phase 2, new: compact video strip, position 3. Deliberately not a
          second hero — three cards, a short heading, one link to Watch &
          Read. Reuses the exact Phase 1 /api/latest-videos data via the
          shared useLatestVideos hook; no new fetch, cron, or cache. */}
      <section style={{ padding: '48px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
                FROM THE CHANNEL
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1 }}>
                LATEST FROM DITSC
              </h2>
            </div>
            <Link
              to="/watch-read"
              onClick={() => trackWatchReadClick('homepage_section_link')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                color: 'var(--amber)', fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Watch & Read <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {videos.map((video, i) => (
              <VideoCard
                key={video.id || video.url}
                video={video}
                color={VIDEO_CARD_COLORS[i % VIDEO_CARD_COLORS.length]}
                compact
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── LATEST DEALS PREVIEW ("Fresh in the Crates") ──────────── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
                LATEST DEALS
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1 }}>
                FRESH IN THE CRATES
              </h2>
            </div>
            <Link to="/deals" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--amber)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
            }}>
              See all deals <ArrowRight size={14} />
            </Link>
          </div>

          {/* Phase 2: these cards are still static data (see DEALS_PREVIEW
              above), so no "updated X ago" timestamp is added — that would be
              misleading. This disclosure line makes the static nature
              explicit instead. Remove/replace only once this section is
              wired to a live data source. */}
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24, maxWidth: 560 }}>
            Recent vinyl deals worth checking out. Prices and availability may change.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {DEALS_PREVIEW.map((deal) => (
              <div key={deal.title} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '16px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {deal.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {deal.store} · {deal.condition}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--amber)' }}>{deal.price}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{deal.was}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGGREGATOR CTA (final supporting CTA) ─────────────────── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 20 }}>
            MULTI-MARKETPLACE SEARCH
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 42, letterSpacing: 1, marginBottom: 12 }}>
            STOP OVERPAYING FOR RECORDS
          </h2>
          <p style={{ color: 'var(--text-primary)', fontSize: 15, maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Search Discogs, eBay, and CDandLP at the same time. Condition graded. Lowest price first. Every time.
          </p>
          <Link to="/aggregator" className="view-deals-btn" style={{ display: 'inline-flex', fontSize: 15, padding: '14px 32px', borderRadius: 12 }}>
            Start Digging <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
