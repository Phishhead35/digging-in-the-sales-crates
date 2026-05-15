import React, { useState, startTransition } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, TrendingDown, Star, ArrowRight, Disc3, ExternalLink, BookOpen, Youtube } from 'lucide-react';
import useSEO from '../hooks/useSEO';

const TRENDING_SEARCHES = [
  'Eric B & Rakim', 'A Tribe Called Quest', 'Wu-Tang Clan',
  'J Dilla', 'Pete Rock', 'Nas Illmatic', 'De La Soul',
];

// Latest deals preview — static placeholder, replace with live data from your API
const DEALS_PREVIEW = [
  { title: 'Herbie Hancock – Head Hunters', store: 'Vinyl Castle', price: '$12.99', was: '$24.99', condition: 'VG+' },
  { title: 'Gang Starr – Step in the Arena', store: 'Discogs', price: '$18.50', was: '$32.00', condition: 'VG' },
  { title: 'A Tribe Called Quest – Midnight Marauders', store: 'eBay', price: '$21.00', was: '$40.00', condition: 'NM' },
  { title: 'MF DOOM – Mm..Food', store: 'ADamnShame', price: '$29.99', was: '$55.00', condition: 'VG+' },
];

// Blog post preview — links go to YouTube videos until blog is live
const BLOG_PREVIEW = [
  {
    series: 'SAMPLE DNA',
    title: 'James Brown to Redman: The Break That Built an Era',
    date: 'May 2026',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    url: 'https://www.youtube.com/@digginginthesalescrates',
  },
  {
    series: 'WU-TANG WEDNESDAY',
    title: 'GZA & Ghostface: The Samples Behind Liquid Swords',
    date: 'May 2026',
    color: '#2ec4b6',
    bg: 'rgba(46,196,182,0.08)',
    url: 'https://www.youtube.com/@digginginthesalescrates',
  },
  {
    series: 'THROWBACK THURSDAY',
    title: 'The Beatnuts: Forgotten Classics Worth Digging For',
    date: 'May 2026',
    color: '#e63946',
    bg: 'rgba(230,57,70,0.08)',
    url: 'https://www.youtube.com/@digginginthesalescrates',
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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

        {/* Record only on left side, very subtle — no text bleed */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <img
            src="/ditsc_banner_svg_v8.svg"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-5%', top: '50%',
              transform: 'translateY(-50%)',
              height: '120%', width: 'auto',
              opacity: 0.04,
              clipPath: 'inset(0 55% 0 0)',
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

      {/* ── FEATURED STORES ──────────────────────────────────── */}
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
            {[
              { name: 'Spin That Records', type: 'Vintage Vinyl', location: 'Springfield, MA', desc: "Springfield MA's only vintage vinyl store. Classic Rock, Jazz, Soul, Latin, Folk and more. Plus vintage turntables, receivers, and hi-fi equipment.", url: 'https://spinthatspringfield.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=spin-that-records' },
              { name: 'Village Vinyl and HiFi', type: 'Records & Stereo', location: 'Boston, MA', desc: 'Located in the Coolidge Corner neighborhood in Boston. Quality records and stereo equipment at prices that keep you coming back.', url: 'https://www.villagevinylhifi.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=village-vinyl-hifi' },
              { name: 'ADamnShame Records', type: 'Curated Vinyl', location: 'Lowell, MA', desc: 'Lowell-based record dealer specializing in curated vinyl and quality records. Follow on Instagram for inventory and updates.', url: 'https://www.instagram.com/adamnshame_records/?utm_source=ditsc&utm_medium=referral&utm_campaign=a-damn-shame-records' },
              { name: 'Soundtracks Beverly', type: 'All Genres', location: 'Beverly, MA', desc: 'Beverly, MA record shop with an eclectic mix of vinyl across all genres. A true neighborhood dig spot on the North Shore.', url: 'https://www.soundtracksbeverly.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=soundtracks-beverly' },
              { name: 'GOOD TASTE Records', type: 'Vinyl Boutique', location: 'Boston, MA', desc: "Boston vinyl boutique and music hub for DJs, collectors, and anyone with GOOD TASTE. Stop in and find something you didn't know you needed.", url: 'https://goodtasterecords.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=good-taste-records' },
              { name: 'Big Fun Records', type: 'Multi-Genre', location: 'Beverly, MA', desc: 'Beverly, MA shop at 284A Cabot St. Buying and selling Rock, Jazz, Soul/Funk, Punk, Metal, Hip-Hop, Electronic, and more.', url: 'https://www.discogs.com/seller/bigfunrecords/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=big-fun-records' },
              { name: 'Residency Records', type: 'Used Vinyl', location: 'Salem, MA', desc: 'Located in the Witch City Mall in Salem, MA. Find them on Discogs for their full inventory.', url: 'https://www.discogs.com/seller/residencyrecords/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=residency-records' },
              { name: "Joe's Albums", type: 'New & Used', location: 'Worcester, MA', desc: "Worcester's go-to record shop at 317 Main St, housed in a historic performance venue. Open 7 days a week, 10am-6pm. Online since 2010, brick and mortar since 2011.", url: 'https://www.joesalbums.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=joes-albums' },
              { name: 'The Time Capsule', type: 'Records, Comics & Games', location: 'Seekonk, MA', desc: 'Seekonk location at 1733 Fall River Ave. New vinyl hits the bins every Saturday. Also stocking thousands of back-issue comics, new releases every Wednesday, and restocked video games weekly.', url: 'https://www.discogs.com/seller/oftimespast/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=the-time-capsule-seekonk', siteUrl: 'https://www.thetimecapsule.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=the-time-capsule-seekonk' },
            ].map((store) => (
              store.siteUrl ? (
                <div key={store.name} className="store-card"
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
                      style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)' }}>
                      Discogs →
                    </a>
                    <a href={store.siteUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', background: 'transparent' }}>
                      Website →
                    </a>
                  </div>
                </div>
              ) : (
                <a key={store.name} href={store.url} target="_blank" rel="noopener noreferrer" className="store-card"
                  style={{ display: 'block', padding: '20px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{store.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{store.type} · {store.location}</div>
                    </div>
                    <ExternalLink size={13} color="var(--amber)" style={{ flexShrink: 0, marginTop: 3 }} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{store.desc}</p>
                </a>
              )
            ))}
          </div>

          {/* Rhode Island & New Hampshire */}
          <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--amber)', marginBottom: 16 }}>RHODE ISLAND & NEW HAMPSHIRE</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
            {[
              { name: 'Music Magick', type: 'Multi-Media', location: 'West Warwick, RI', desc: 'The ultimate multi-media store in West Warwick, RI. Over 50,000 CDs and 30,000 DVDs across all genres, plus games and Blu-rays. Most priced at just $2.', url: 'https://www.discogs.com/seller/musicmagickshop/profile?page=1&utm_source=ditsc&utm_medium=referral&utm_campaign=music-magick' },
              { name: 'The Time Capsule', type: 'Records, Comics & Games', location: 'Cranston, RI', desc: 'Cranston location at 537 Pontiac Ave. Massive LP restock every Friday. Plus new comics every Wednesday (80-100 titles), thousands of back issues, and restocked video games weekly.', url: 'https://www.discogs.com/seller/oftimespast/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=the-time-capsule-cranston', siteUrl: 'https://www.thetimecapsule.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=the-time-capsule-cranston' },
              { name: 'New Hampshire Vintage Vinyl', type: 'Pre-Owned Vinyl', location: 'Laconia, NH', desc: 'Laconia, NH record shop at 633 Main St. New crates of pre-owned records hit the floor every Saturday. In-store customers get first dibs; the rest go live online Sunday evenings.', url: 'https://www.nhvintagevinyl.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=nh-vintage-vinyl' },
            ].map((store) => (
              store.siteUrl ? (
                <div key={store.name} className="store-card"
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
                      style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)' }}>
                      Discogs →
                    </a>
                    <a href={store.siteUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(245,158,11,0.4)', background: 'transparent' }}>
                      Website →
                    </a>
                  </div>
                </div>
              ) : (
                <a key={store.name} href={store.url} target="_blank" rel="noopener noreferrer" className="store-card"
                  style={{ display: 'block', padding: '20px', borderRadius: 14, background: 'var(--bg-card)', border: '1px solid var(--border)', textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{store.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{store.type} · {store.location}</div>
                    </div>
                    <ExternalLink size={13} color="var(--amber)" style={{ flexShrink: 0, marginTop: 3 }} />
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{store.desc}</p>
                </a>
              )
            ))}
            ))}
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

      {/* ── LATEST DEALS PREVIEW ─────────────────────────────── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
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

      {/* ── BLOG PREVIEW ─────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
                FROM THE BLOG
              </p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 1 }}>
                SAMPLE SCIENCE
              </h2>
            </div>
            <Link to="/blog" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--amber)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
            }}>
              All posts <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {BLOG_PREVIEW.map((post) => (
              <a
                key={post.title}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 16, overflow: 'hidden',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = post.color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Colored series header */}
                <div style={{
                  background: post.bg, padding: '20px 20px 16px',
                  borderBottom: `1px solid ${post.color}22`,
                }}>
                  <div style={{
                    fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2,
                    color: post.color, fontWeight: 600, marginBottom: 10,
                  }}>
                    {post.series}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Youtube size={16} color={post.color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Watch on YouTube</span>
                  </div>
                </div>
                <div style={{ padding: '16px 20px 20px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 10 }}>
                    {post.title}
                  </h3>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{post.date}</div>
                </div>
              </div>
              </a>
            ))}
          </div>

          {/* YouTube CTA */}
          <div style={{
            marginTop: 24, padding: '18px 24px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Youtube size={18} color="#e63946" />
              <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                <strong>29K+ views</strong>
                <span style={{ color: 'var(--text-secondary)', marginLeft: 6 }}>and growing. Watch the full series on YouTube.</span>
              </span>
            </div>
            <a
              href="https://www.youtube.com/@digginginthesalescrates"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 18px', borderRadius: 8,
                background: '#e6394615', border: '1px solid rgba(230,57,70,0.3)',
                color: '#e63946', fontSize: 13, fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Subscribe <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ── AGGREGATOR CTA ────────────────────────────────────── */}
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
