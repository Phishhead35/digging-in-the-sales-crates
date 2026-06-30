import React from 'react';
import { Link } from 'react-router-dom';
import { Disc3, ArrowRight, Music } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { ARTISTS, GENRES } from '../data/artists';

// ── GA4 tracker ───────────────────────────────────────────────
function trackArtistClick(artistName) {
  window.gtag?.('event', 'artist_page_click', {
    artist_name: artistName,
    source: 'artists_index',
  });
}

// ── Artist card ───────────────────────────────────────────────
function ArtistCard({ artist, href }) {
  return (
    <Link
      to={href}
      onClick={() => trackArtistClick(artist.name)}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          padding: '24px', borderRadius: 14,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          height: '100%', display: 'flex', flexDirection: 'column', gap: 14,
          transition: 'border-color 0.2s, transform 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Icon + genre badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Disc3 size={20} color="var(--amber)" />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {artist.genres.slice(0, 2).map(g => (
              <span key={g} style={{
                fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 1.5,
                padding: '2px 8px', borderRadius: 100,
                background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.25)',
                color: 'var(--amber)',
              }}>
                {g.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 28px)',
            letterSpacing: 1, lineHeight: 1,
            color: 'var(--text-primary)', marginBottom: 8,
          }}>
            {artist.name.toUpperCase()}
          </h2>
          <p style={{
            fontSize: 13, color: 'var(--text-secondary)',
            lineHeight: 1.5, margin: 0,
          }}>
            {artist.tagline}
          </p>
        </div>

        {/* Essential records count */}
        <div style={{
          fontSize: 11, color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)', marginTop: 'auto',
        }}>
          {artist.essentialRecords.length} ESSENTIAL RECORDS
        </div>

        {/* CTA */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--amber)', fontSize: 13, fontWeight: 600,
        }}>
          Explore <ArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function Artists() {
  useSEO({
    title: 'Artist Pages | Digging in the Sales Crates',
    description: 'Browse vinyl records by artist. Find essential releases, collector\'s notes, and marketplace links for hip-hop, soul, funk, and jazz artists.',
  });

  const artistList = Object.values(ARTISTS);
  const genreList = Object.values(GENRES);

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        padding: '72px 24px 56px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 100,
            background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
            color: 'var(--amber)', fontSize: 11, fontWeight: 500,
            letterSpacing: 1.5, marginBottom: 24, fontFamily: 'var(--font-mono)',
          }}>
            <Music size={12} />
            ARTIST DIRECTORY
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 80px)',
            letterSpacing: 2, lineHeight: 0.95, marginBottom: 16,
          }}>
            DIG BY ARTIST
          </h1>

          <p style={{
            color: 'var(--text-secondary)', fontSize: 16,
            fontWeight: 300, maxWidth: 520, lineHeight: 1.7,
          }}>
            Essential records, collector notes, and direct marketplace search — one page per artist.
          </p>
        </div>
      </section>

      {/* ── ARTISTS ──────────────────────────────────────────── */}
      <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{
            color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
            letterSpacing: 2, marginBottom: 28,
          }}>
            ARTISTS — {artistList.length} PAGES
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {artistList.map(artist => (
              <ArtistCard
                key={artist.slug}
                artist={artist}
                href={`/artists/${artist.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── GENRES ───────────────────────────────────────────── */}
      <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{
            color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
            letterSpacing: 2, marginBottom: 28,
          }}>
            GENRES & FORMATS — {genreList.length} PAGES
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {genreList.map(genre => (
              <ArtistCard
                key={genre.slug}
                artist={genre}
                href={`/genres/${genre.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <p style={{
            color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
            letterSpacing: 2, marginBottom: 12,
          }}>
            MORE COMING SOON
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 36,
            letterSpacing: 1, marginBottom: 12,
          }}>
            DON'T SEE YOUR ARTIST?
          </h2>
          <p style={{
            color: 'var(--text-secondary)', fontSize: 15,
            maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.7,
          }}>
            Search any artist, album, or label directly across Discogs, eBay, and CDandLP.
          </p>
          <Link to="/aggregator" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '14px 32px', borderRadius: 12, fontSize: 15,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000', fontWeight: 700, textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            Start Digging <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}
