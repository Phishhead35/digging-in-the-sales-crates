import React, { useState, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingDown, Disc3, Zap, Globe, ShieldCheck } from 'lucide-react';
import useSEO from '../hooks/useSEO';

const TRENDING_SEARCHES = [
  'Eric B & Rakim', 'A Tribe Called Quest', 'Wu-Tang Clan',
  'J Dilla', 'Pete Rock', 'Nas Illmatic', 'De La Soul',
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useSEO({
    title: 'Digging in the Sales Crates | Vinyl Record Price Comparison',
    description: 'Find the lowest prices on vinyl records across Discogs, eBay, and CDandLP. Search rare hip-hop, jazz, and classic rock LPs in seconds. Taking the Dig Out of Digging.',
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

      {/* HERO */}
      <section style={{
        minHeight: '85vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background vinyl rings */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {[600, 500, 400, 300, 200].map((size, i) => (
            <div key={i} style={{
              position: 'absolute', width: size, height: size, borderRadius: '50%',
              border: `1px solid rgba(245,158,11,${0.03 + i * 0.01})`,
            }} />
          ))}
        </div>

        {/* Amber glow center */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 760 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 100,
            background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
            color: 'var(--amber)', fontSize: 12, fontWeight: 500, letterSpacing: 1,
            marginBottom: 32, fontFamily: 'var(--font-mono)',
          }}>
            <TrendingDown size={13} />
            VINYL DEAL AGGREGATOR
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(52px, 10vw, 96px)',
            letterSpacing: 2, lineHeight: 0.95, marginBottom: 24,
          }}>
            STOP OVERPAYING<br />
            <span style={{ color: 'var(--amber)' }}>FOR RECORDS</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)', fontSize: 18, fontWeight: 300,
            maxWidth: 500, margin: '0 auto 48px', lineHeight: 1.7,
          }}>
            Search Discogs, eBay, and CDandLP simultaneously. Find the lowest price on any vinyl in seconds.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: 560, margin: '0 auto 32px' }}>
            <div style={{ position: 'relative', display: 'flex', gap: 0 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={18} style={{
                  position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1, flexShrink: 0,
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
              <button type="submit" className="dig-btn">
                DIG
              </button>
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

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24,
        }}>
          {[
            {
              icon: Globe,
              title: 'Multi-Marketplace Search',
              desc: 'Search Discogs, eBay, and CDandLP simultaneously. One query, all the deals.',
              color: '#2ec4b6',
              colorName: 'teal',
            },
            {
              icon: TrendingDown,
              title: 'Lowest Price First',
              desc: 'Results sorted by price so you always see the best deal at the top.',
              color: '#f59e0b',
              colorName: 'amber',
            },
            {
              icon: ShieldCheck,
              title: 'Condition Graded',
              desc: 'Every listing shows vinyl condition so you know exactly what you\'re buying.',
              color: '#4ade80',
              colorName: 'green',
            },
            {
              icon: Zap,
              title: 'Price Alerts',
              desc: 'Set a target price on any record and get notified when it drops.',
              color: '#e63946',
              colorName: 'red',
            },
          ].map(({ icon: Icon, title, desc, color, colorName }) => (
            <div key={title} className="feature-card" data-color={colorName}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: color + '18', border: `1px solid ${color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <Icon size={20} color={color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOURCES */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 24 }}>
            POWERED BY
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            {[
              { name: 'Discogs', desc: 'Used marketplace', url: 'https://discogs.com' },
              { name: 'eBay', desc: 'Auctions + Fixed Price', url: 'https://ebay.com' },
              { name: 'CDandLP', desc: 'Euro marketplace', url: 'https://cdandlp.com' },
              { name: 'Fat Beats', desc: 'Hip-hop new releases', url: 'https://fatbeats.com' },
              { name: 'HHV Records', desc: 'Berlin hip-hop', url: 'https://hhv.de' },
              { name: 'Get On Down', desc: 'Limited editions', url: 'https://getondown.com' },
              { name: 'Mass Appeal', desc: 'Hip-hop exclusives', url: 'https://shop.massappeal.com' },
              { name: 'Rough Trade', desc: 'Indie exclusives', url: 'https://roughtrade.com' },
              { name: 'Amoeba Music', desc: 'Rare & used', url: 'https://amoeba.com' },
              { name: 'Bandcamp', desc: 'Artist direct', url: 'https://bandcamp.com' },
              { name: 'Vinyl Castle', desc: 'New & used', url: 'http://www.awin1.com/awclick.php?mid=109172&id=2823694' },
            ].map(({ name, desc, url }) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="source-pill">
                <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>{desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
