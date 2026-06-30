import React from 'react';
import { useParams, Link, useNavigate, startTransition } from 'react-router-dom';
import { Search, ExternalLink, Disc3, ArrowRight, ArrowLeft } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { ARTISTS, GENRES } from '../data/artists';

// ── Affiliate link builders ───────────────────────────────────
function discogsUrl(term) {
  return `https://www.discogs.com/search/?q=${encodeURIComponent(term)}&type=all`;
}
function ebayUrl(term) {
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(term)}&mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=5339145834&toolid=10001&customid=ditsc`;
}
function cdandlpUrl(term) {
  return `https://www.cdandlp.com/en/search/?q=${encodeURIComponent(term)}&affilie=digginginthesalescrates&utm_source=digginginthesalescrates.com&utm_medium=link&utm_campaign=affiliation`;
}

// ── GA4 tracker ───────────────────────────────────────────────
function trackClick(artistName, marketplace) {
  window.gtag?.('event', 'artist_marketplace_click', {
    artist_name: artistName,
    marketplace,
  });
}

// ── Marketplace search buttons ────────────────────────────────
function SearchButtons({ artist, size = 'normal' }) {
  const btnStyle = size === 'large'
    ? { padding: '14px 24px', fontSize: 14, borderRadius: 10 }
    : { padding: '10px 18px', fontSize: 13, borderRadius: 8 };

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <a
        href={discogsUrl(artist.searchTerms.discogs)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(artist.name, 'discogs')}
        style={{
          ...btnStyle,
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'var(--amber)',
          color: '#0a0a0f', fontWeight: 700, textDecoration: 'none',
          transition: 'opacity 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
        onMouseOut={e => e.currentTarget.style.opacity = '1'}
      >
        <Search size={14} /> Discogs
      </a>
      <a
        href={ebayUrl(artist.searchTerms.ebay)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(artist.name, 'ebay')}
        style={{
          ...btnStyle,
          display: 'inline-flex', alignItems: 'center', gap: 7,
          border: '1px solid rgba(245,158,11,0.4)',
          background: 'rgba(245,158,11,0.08)',
          color: 'var(--amber)', fontWeight: 600, textDecoration: 'none',
          transition: 'border-color 0.2s, background 0.2s',
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.7)'; e.currentTarget.style.background = 'rgba(245,158,11,0.14)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.background = 'rgba(245,158,11,0.08)'; }}
      >
        <Search size={14} /> eBay
      </a>
      <a
        href={cdandlpUrl(artist.searchTerms.cdandlp)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackClick(artist.name, 'cdandlp')}
        style={{
          ...btnStyle,
          display: 'inline-flex', alignItems: 'center', gap: 7,
          border: '1px solid rgba(245,158,11,0.4)',
          background: 'transparent',
          color: 'var(--amber)', fontWeight: 600, textDecoration: 'none',
          transition: 'border-color 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.7)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'}
      >
        <Search size={14} /> CDandLP
      </a>
    </div>
  );
}

// ── 404 / not found ───────────────────────────────────────────
function NotFound() {
  return (
    <div style={{ padding: '120px 24px', textAlign: 'center' }}>
      <Disc3 size={48} color="var(--amber)" style={{ marginBottom: 20, opacity: 0.5 }} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, letterSpacing: 1, marginBottom: 12 }}>
        PAGE NOT FOUND
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
        That artist page doesn't exist yet — but it might soon.
      </p>
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '10px 20px', borderRadius: 8,
        background: 'var(--amber)', color: '#0a0a0f',
        fontWeight: 700, textDecoration: 'none', fontSize: 14,
      }}>
        <ArrowLeft size={14} /> Back Home
      </Link>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function ArtistPage({ type = 'artist' }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const artist = type === 'genre' ? GENRES[slug] : ARTISTS[slug];

  useSEO(artist
    ? { title: artist.seo.title, description: artist.seo.description }
    : { title: 'Artist Not Found | Digging in the Sales Crates', description: '' }
  );

  if (!artist) return <NotFound />;

  const handleSiteSearch = (term) => {
    startTransition(() => {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    });
  };

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        padding: '72px 24px 56px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Back link */}
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-muted)', fontSize: 12,
            fontFamily: 'var(--font-mono)', letterSpacing: 1,
            textDecoration: 'none', marginBottom: 28,
            transition: 'color 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--amber)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={12} /> BACK
          </Link>

          {/* Genre badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {artist.genres.map(g => (
              <span key={g} style={{
                fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: 1.5,
                padding: '3px 10px', borderRadius: 100,
                background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
                color: 'var(--amber)',
              }}>
                {g.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Artist name */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 80px)',
            letterSpacing: 2, lineHeight: 0.95,
            marginBottom: 14,
          }}>
            {artist.name.toUpperCase()}
          </h1>

          {/* Tagline */}
          <p style={{
            color: 'var(--text-secondary)', fontSize: 16, fontWeight: 300,
            marginBottom: 36, lineHeight: 1.6, maxWidth: 600,
          }}>
            {artist.tagline}
          </p>

          {/* Search buttons — hero size */}
          <SearchButtons artist={artist} size="large" />
        </div>
      </section>

      {/* ── BIO ──────────────────────────────────────────────── */}
      <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{
            color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
            letterSpacing: 2, marginBottom: 20,
          }}>
            ABOUT
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {artist.bio.map((para, i) => (
              <p key={i} style={{
                color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.8,
                maxWidth: 720, margin: 0,
              }}>
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESSENTIAL RECORDS ────────────────────────────────── */}
      <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{
            color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
            letterSpacing: 2, marginBottom: 8,
          }}>
            WHERE TO START
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 32,
            letterSpacing: 1, marginBottom: 28,
          }}>
            ESSENTIAL RECORDS
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
          }}>
            {artist.essentialRecords.map((rec, i) => (
              <button
                key={i}
                onClick={() => handleSiteSearch(rec.title)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  textAlign: 'left', cursor: 'pointer', width: '100%',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                title={`Search "${rec.title}" on DITSC`}
              >
                {/* Disc icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#1a1a20', border: '2px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Disc3 size={18} color="var(--amber)" />
                </div>

                {/* Text */}
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                    lineHeight: 1.3, marginBottom: 3,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {rec.title}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {rec.year} · {rec.label}
                  </div>
                </div>

                <Search size={13} color="var(--text-muted)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </button>
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
            Click any record to search it on DITSC across all three marketplaces.
          </p>
        </div>
      </section>

      {/* ── PRODUCER CREDITS ─────────────────────────────────── */}
      {artist.producerCredits && artist.producerCredits.length > 0 && (
        <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <p style={{
              color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
              letterSpacing: 2, marginBottom: 20,
            }}>
              {artist.producerCredits[0].includes('—') ? 'NOTABLE PRODUCTION CREDITS' : 'PRODUCTION'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {artist.producerCredits.map((credit, i) => (
                <div key={i} style={{
                  fontSize: 14, color: 'var(--text-primary)',
                  padding: '10px 0',
                  borderBottom: i < artist.producerCredits.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  {credit}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BOTTOM ───────────────────────────────────────── */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{
            padding: '32px', borderRadius: 16,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <p style={{
              color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
              letterSpacing: 2, marginBottom: 12,
            }}>
              FIND THE BEST PRICE
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 36,
              letterSpacing: 1, marginBottom: 10,
            }}>
              READY TO DIG?
            </h2>
            <p style={{
              color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28,
              maxWidth: 420, margin: '0 auto 28px',
            }}>
              Search all three marketplaces at once and find the lowest price on any {artist.name} record.
            </p>
            <SearchButtons artist={artist} size="large" />
          </div>
        </div>
      </section>

    </div>
  );
}
