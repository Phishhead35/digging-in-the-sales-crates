import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingDown, Bell, BellOff, Trash2, Search, Plus } from 'lucide-react';
import { formatPrice } from '../utils/api';

// ============================================================
// DEALS PAGE — Curated store links + search shortcuts
// ============================================================
export function Deals() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // API-integrated sources (live search)
  const apiSources = [
    { name: 'Discogs', url: 'https://discogs.com/sell/list', desc: 'The definitive used vinyl marketplace. Millions of listings, condition graded, worldwide sellers.', tag: 'Live API', color: '#f59e0b' },
    { name: 'eBay', url: 'https://rover.ebay.com/rover/1/711-53200-19255-0/1?mpre=https%3A%2F%2Fwww.ebay.com%2Fb%2FVinyl-Records%2F306%2Fbn_1852757&campid=5339145834&mkcid=1&mkevt=1&toolid=10001&customid=ditsc', desc: 'Auctions and fixed-price listings. Best for sealed copies, graded records, and quick finds.', tag: 'Live API', color: '#f59e0b' },
    { name: 'CDandLP', url: 'https://www.cdandlp.com/?affilie=digginginthesalescrates&lng=2&utm_source=digginginthesalescrates.com&utm_medium=link&utm_campaign=affiliation', desc: 'European-heavy used marketplace with millions of vinyl listings. Great for international pressings and pricing.', tag: 'Live API', color: '#f59e0b' },
  ];

  // Featured Partners (Local MA stores)
  const featuredPartners = [
    {
  name: 'Spin That Records',
  url: 'https://spinthatspringfield.com?utm_source=ditsc&utm_medium=referral&utm_campaign=spin-that-records',
  desc: "Springfield MA's only vintage vinyl store. Classic Rock, Jazz, Soul, Latin, Folk and more. Plus vintage turntables, receivers, and hi-fi equipment.",
  tag: 'Local MA Shop',
  paying: false,
},
{
  name: 'Village Vinyl and HiFi',
  url: 'https://www.villagevinylhifi.com?utm_source=ditsc&utm_medium=referral&utm_campaign=village-vinyl-hifi',
  desc: 'Located in the Coolidge Corner neighborhood in Boston. Quality records and stereo equipment at prices that keep you coming back.',
  tag: 'Local MA Shop',
  paying: false,
},
{
  name: 'A Damn Shame Records',
  url: 'https://www.instagram.com/adamnshame_records/?utm_source=ditsc&utm_medium=referral&utm_campaign=a-damn-shame-records',
  desc: 'Boston-based record dealer specializing in curated vinyl and quality records. Follow on Instagram for inventory and updates.',
  tag: 'Local MA Shop',
  paying: false,
},
{
  name: 'Soundtracks',
  url: 'https://www.soundtracksbeverly.com?utm_source=ditsc&utm_medium=referral&utm_campaign=soundtracks-beverly',
  desc: 'Beverly, MA record shop with an eclectic mix of vinyl across all genres. A true neighborhood dig spot on the North Shore.',
  tag: 'Local MA Shop',
  paying: false,
},
{
  name: 'GOOD TASTE Records',
  url: 'https://goodtasterecords.com?utm_source=ditsc&utm_medium=referral&utm_campaign=good-taste-records',
  desc: "Boston vinyl boutique and music hub for DJs, collectors, and anyone with GOOD TASTE. Stop in and find something you didn't know you needed.",
  tag: 'Local MA Shop',
  paying: false,
},
  ];

  // Curated store deep-links (no API, non-local)
  const curatedStores = [
    { name: 'Fat Beats', url: 'https://fatbeats.com', desc: 'Hip-hop and rap specialists since 1994. New releases, exclusives, and pre-orders. Subscribe for sale emails.', tag: 'Hip-Hop / New', email: 'https://fatbeats.com' },
    { name: 'Get On Down', url: 'https://getondown.com', desc: 'Limited edition pressings, anniversary editions, and numbered sets. Known for elaborate packaging.', tag: 'Limited Editions', email: 'https://getondown.com' },
    { name: 'HHV Records', url: 'https://www.hhv.de/shop/en/hip-hop-vinyl', desc: 'Berlin-based since 2002. 80,000+ titles, rooted in Hip-Hop, jazz, funk, and soul. Ships worldwide.', tag: 'Hip-Hop / Global', email: 'https://www.hhv.de' },
    { name: 'Mass Appeal', url: 'https://shop.massappeal.com', desc: "Nas's label shop. Exclusive Hip-Hop vinyl, limited color variants, and cultural collectibles.", tag: 'Hip-Hop Exclusives', email: 'https://shop.massappeal.com' },
    { name: 'Rough Trade', url: 'https://www.roughtrade.com/en-us', desc: 'Independent icon since 1976. Exclusive pressings, pre-orders, and a members club with special pricing.', tag: 'Indie / Exclusives', email: 'https://www.roughtrade.com' },
    { name: 'Amoeba Music', url: 'https://www.amoeba.com', desc: 'Largest independent vinyl store in the US. 27,000+ records including rare, vintage, and hard-to-find.', tag: 'Used & Rare', email: 'https://www.amoeba.com' },
    { name: 'Bandcamp', url: 'https://bandcamp.com', desc: 'Buy directly from artists. Best source for indie, underground Hip-Hop, and limited self-released pressings.', tag: 'Artist Direct', email: 'https://bandcamp.com' },
    { name: 'Vinyl Castle', url: 'http://www.awin1.com/awclick.php?mid=109172&id=2823694', desc: 'Over 600,000 titles including vinyl, CDs, cassettes, and turntables. Ships worldwide. Founded by music lovers.', tag: 'New & Used', email: 'https://vinylcastle.com' },
  ];

  const quickSearches = [
    { label: 'Golden Era Hip-Hop', q: 'golden era hip hop vinyl' },
    { label: 'Jazz Originals', q: 'jazz original pressing vinyl' },
    { label: 'Soul 45s', q: 'soul 45 rpm vinyl' },
    { label: 'Sealed Copies', q: 'sealed vinyl mint' },
    { label: 'Rare Pressings', q: 'rare pressing limited vinyl' },
    { label: 'OG Pressings', q: 'original pressing 1st vinyl' },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: 2, marginBottom: 8 }}>
        FIND <span style={{ color: 'var(--amber)' }}>DEALS</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 40 }}>
        Quick access to the best vinyl sources, plus curated search shortcuts.
      </p>

      {/* Quick searches */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 16 }}>
          QUICK SEARCHES
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {quickSearches.map(({ label, q }) => (
            <button key={q} onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)} className="quick-search-pill">
              <Search size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Partners */}
      <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 8 }}>
        FEATURED PARTNERS
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
        Local record shops curated and collector-approved by DITSC.
      </p>
      <div style={{
        background: 'rgba(245,158,11,0.04)',
        border: '1px solid rgba(245,158,11,0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 48,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
           {featuredPartners.map(({ name, url, desc, tag }) => (
            
             <a
	      key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="store-card"
              onClick={() => window.gtag && window.gtag('event', 'store_click', { store_name: name })}
              style={{
                padding: 24, borderRadius: 16, background: 'var(--bg-card)',
                border: '1.5px solid rgba(245,158,11,0.5)',
                display: 'block',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>{name}</h3>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 10,
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.35)',
                  color: 'var(--amber)',
                  fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
                }}>{tag}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, color: 'var(--amber)' }}>Visit store →</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* API Sources */}
      <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 8 }}>
        LIVE API SOURCES
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
        These are searched in real-time when you use the Dig page.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 48 }}>
        {apiSources.map(({ name, url, desc, tag, color }) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="api-source-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{name}</h3>
              <span style={{
                padding: '3px 10px', borderRadius: 100, fontSize: 10,
                background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.4)',
                color: 'var(--amber)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
              }}>{tag}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Visit store →
            </div>
          </a>
        ))}
      </div>

      {/* Curated Store Cards */}
      <h2 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 8 }}>
        CURATED STORES
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
        Subscribe to their email lists and paste promos into the <strong style={{ color: 'var(--text-primary)' }}>Email Parser</strong> to extract deals automatically.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {curatedStores.map(({ name, url, desc, tag }) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer"
            className="store-card"
            style={{
              padding: 24, borderRadius: 16, background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'block',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{name}</h3>
              <span style={{
                padding: '3px 10px', borderRadius: 100, fontSize: 10,
                background: 'rgba(46,196,182,0.1)',
                border: '1px solid rgba(46,196,182,0.25)',
                color: '#2ec4b6',
                fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
              }}>{tag}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{desc}</p>
            <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
              <div style={{ fontSize: 12, color: 'var(--amber)' }}>Visit store →</div>
              <div style={{ fontSize: 12, color: '#2ec4b6', marginLeft: 'auto' }}>✉ Subscribe for emails</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ALERTS PAGE — Local price alert management
// ============================================================
export function Alerts() {
  const [alerts, setAlerts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('priceAlerts') || '[]'); } catch { return []; }
  });
  const [newAlert, setNewAlert] = useState({ title: '', targetPrice: '' });
  const [adding, setAdding] = useState(false);

  const saveAlerts = (updated) => {
    setAlerts(updated);
    localStorage.setItem('priceAlerts', JSON.stringify(updated));
  };

  const addAlert = () => {
    if (!newAlert.title || !newAlert.targetPrice) return;
    const alert = {
      id: Date.now(),
      title: newAlert.title,
      targetPrice: parseFloat(newAlert.targetPrice),
      active: true,
      createdAt: new Date().toISOString(),
    };
    saveAlerts([...alerts, alert]);
    setNewAlert({ title: '', targetPrice: '' });
    setAdding(false);
  };

  const toggleAlert = (id) => {
    saveAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const removeAlert = (id) => {
    saveAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: 2, marginBottom: 8 }}>
            PRICE <span style={{ color: 'var(--amber)' }}>ALERTS</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track records and get notified when prices drop.
          </p>
        </div>
        <button onClick={() => setAdding(!adding)} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 20px', borderRadius: 10,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#000', fontWeight: 600, fontSize: 13,
        }}>
          <Plus size={16} /> Add Alert
        </button>
      </div>

      {/* Add alert form */}
      {adding && (
        <div style={{
          padding: 24, borderRadius: 16, background: 'var(--bg-card)',
          border: '1px solid var(--amber)', marginBottom: 24,
        }}>
          <h3 style={{ fontWeight: 600, marginBottom: 16 }}>New Price Alert</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              type="text" placeholder="Album or artist name..."
              value={newAlert.title} onChange={e => setNewAlert({ ...newAlert, title: e.target.value })}
              style={{
                flex: 2, minWidth: 200, padding: '12px 16px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
              }}
            />
            <input
              type="number" placeholder="Target price ($)"
              value={newAlert.targetPrice} onChange={e => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
              style={{
                flex: 1, minWidth: 120, padding: '12px 16px',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, outline: 'none',
              }}
            />
            <button onClick={addAlert} style={{
              padding: '12px 20px', borderRadius: 8,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000', fontWeight: 600, fontSize: 13,
            }}>
              Save Alert
            </button>
            <button onClick={() => setAdding(false)} style={{
              padding: '12px 20px', borderRadius: 8,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-secondary)', fontSize: 13,
            }}>
              Cancel
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
            Note: Alerts are stored locally. Search manually to check current prices.
          </p>
        </div>
      )}

      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <Bell size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 8 }}>No alerts set</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Add an alert to track when a record hits your target price.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              padding: '20px 24px', borderRadius: 12, background: 'var(--bg-card)',
              border: `1px solid ${alert.active ? 'var(--border)' : 'var(--text-muted)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              opacity: alert.active ? 1 : 0.5, transition: 'all 0.2s', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{alert.title}</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Target: <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {formatPrice(alert.targetPrice)}
                    </span>
                  </span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 100, fontSize: 10, fontFamily: 'var(--font-mono)',
                    background: alert.active ? 'rgba(46,196,182,0.15)' : 'rgba(139,138,155,0.15)',
                    color: alert.active ? '#2ec4b6' : 'var(--text-muted)',
                    border: `1px solid ${alert.active ? 'rgba(46,196,182,0.3)' : 'rgba(139,138,155,0.3)'}`,
                  }}>
                    {alert.active ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/search?q=${encodeURIComponent(alert.title)}`} style={{
                  padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
                  color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <Search size={13} /> Check Now
                </Link>
                <button onClick={() => toggleAlert(alert.id)} style={{
                  padding: '8px 12px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text-secondary)',
                }}>
                  {alert.active ? <BellOff size={14} /> : <Bell size={14} />}
                </button>
                <button onClick={() => removeAlert(alert.id)} style={{
                  padding: '8px 12px', borderRadius: 8,
                  background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
                  color: '#f87171',
                }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
