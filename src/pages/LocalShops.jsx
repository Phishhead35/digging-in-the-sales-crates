import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, ExternalLink, Search, Music, Star, Phone, ChevronDown, ChevronUp, Disc3 } from 'lucide-react';

const SPECIALTIES = ['All', 'Hip-Hop', 'Jazz', 'Soul / Funk', 'Rock', 'Electronic', 'Used / Rare', 'New Releases'];

const SPECIALTY_COLORS = {
  'Hip-Hop': '#f59e0b',
  'Jazz': '#2ec4b6',
  'Soul / Funk': '#fb923c',
  'Rock': '#4ade80',
  'Electronic': '#38bdf8',
  'Used / Rare': '#a78bfa',
  'New Releases': '#f472b6',
};

function StoreCard({ store, index }) {
  const [expanded, setExpanded] = useState(false);

  const rating = store.rating || null;
  const totalRatings = store.user_ratings_total || null;

  return (
    <div
      className="store-card"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Store photo if available */}
      {store.photo && (
        <div style={{ height: 140, overflow: 'hidden', position: 'relative' }}>
          <img
            src={store.photo}
            alt={store.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,15,0.8), transparent)',
          }} />
        </div>
      )}

      {/* No photo placeholder */}
      {!store.photo && (
        <div style={{
          height: 100,
          background: 'linear-gradient(135deg, #16161f, #1c1c28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.05), transparent 70%)',
          }} />
          <Disc3 size={40} color="rgba(245,158,11,0.2)" />
        </div>
      )}

      <div style={{ padding: '16px', overflow: 'hidden' }}>
        {/* Name + rating */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3, flex: 1, paddingRight: 8, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {store.name}
          </h3>
          {rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <Star size={12} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>
                {rating.toFixed(1)}
              </span>
              {totalRatings && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  ({totalRatings > 999 ? `${(totalRatings / 1000).toFixed(1)}k` : totalRatings})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Address */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 8 }}>
          <MapPin size={12} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {store.vicinity || store.formatted_address}
          </span>
        </div>

        {/* Hours */}
        {store.opening_hours && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
            <Clock size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: 11, fontWeight: 600,
              color: store.opening_hours.open_now ? '#4ade80' : '#f87171',
            }}>
              {store.opening_hours.open_now ? 'Open Now' : 'Closed'}
            </span>
            {store.opening_hours.weekday_text && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, padding: 0 }}
              >
                Hours {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
              </button>
            )}
          </div>
        )}

        {/* Expanded hours */}
        {expanded && store.opening_hours?.weekday_text && (
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            marginBottom: 10,
          }}>
            {store.opening_hours.weekday_text.map((day, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Phone */}
        {store.formatted_phone_number && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
            <Phone size={12} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {store.formatted_phone_number}
            </span>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12, width: '100%' }}>
          {store.website && (
            <a
              href={store.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000', textDecoration: 'none', minWidth: 0,
              }}
            >
              <ExternalLink size={12} /> Visit Store
            </a>
          )}
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${store.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: store.website ? '0 0 auto' : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', textDecoration: 'none',
            }}
          >
            <MapPin size={12} /> Directions
          </a>
        </div>

        {/* Claim listing */}
        <button
          onClick={() => window.open('mailto:hello@digginginthesalescrates.com?subject=Claim My Listing&body=Store Name: ' + store.name + '%0AWebsite: %0ASpecialties: %0ADiscogs Seller Page: %0AAdditional Info: ', '_blank')}
          style={{
            width: '100%', marginTop: 8, padding: '6px',
            background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: 8, fontSize: 11, color: 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'; e.currentTarget.style.color = 'var(--amber)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          Own this shop? Claim your listing
        </button>
      </div>
    </div>
  );
}

export default function LocalShops() {
  const [query, setQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [locationLoading, setLocationLoading] = useState(false);

  const searchShops = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/local-shops?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setShops(data.results || []);
    } catch (err) {
      setError(err.message);
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setQuery(`${latitude},${longitude}`);
        await searchShops(`${latitude},${longitude}`);
        setLocationLoading(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enter a city or zip code.');
        setLocationLoading(false);
      }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchShops(query);
  };

  const filteredShops = activeFilter === 'All' ? shops : shops;

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px', borderRadius: 100, marginBottom: 16,
          background: 'rgba(46,196,182,0.1)', border: '1px solid rgba(46,196,182,0.25)',
          color: '#2ec4b6', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 1,
        }}>
          <MapPin size={12} /> LOCAL SHOPS
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 5vw, 56px)',
          letterSpacing: 1, marginBottom: 10, wordBreak: 'break-word',
        }}>
          FIND RECORD SHOPS <span style={{ color: 'var(--amber)' }}>NEAR YOU</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: '100%' }}>
          Discover independent vinyl shops in your area. Enter your city, neighborhood, or zip code to get started.
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 32 }}>
        <form onSubmit={handleSearch} style={{ maxWidth: 560, marginBottom: 12 }}>
          <div style={{ position: 'relative', display: 'flex', gap: 0 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1,
              }} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="City, neighborhood, or zip..."
                style={{
                  width: '100%', padding: '14px 14px 14px 42px',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRight: 'none', borderRadius: '10px 0 0 10px',
                  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <button type="submit" style={{
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '0 10px 10px 0', color: '#000',
              fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)',
              letterSpacing: 1, border: 'none', cursor: 'pointer',
            }}>
              FIND
            </button>
          </div>
        </form>

        <button
          onClick={useMyLocation}
          disabled={locationLoading}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 8, fontSize: 13,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: locationLoading ? 'var(--text-muted)' : 'var(--text-secondary)',
            cursor: locationLoading ? 'wait' : 'pointer', transition: 'all 0.2s',
          }}
          onMouseOver={e => { if (!locationLoading) { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <MapPin size={14} />
          {locationLoading ? 'Getting your location...' : 'Use my current location'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '16px 20px', borderRadius: 10, marginBottom: 24,
          background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
          color: '#f87171', fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid var(--border)',
            borderTopColor: 'var(--amber)', borderRadius: '50%',
            animation: 'spin-slow 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Finding record shops near you...</div>
        </div>
      )}

      {/* Results */}
      {!loading && searched && shops.length > 0 && (
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20, flexWrap: 'wrap', gap: 12,
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
              {shops.length} shops found
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 20,
          }}>
            {filteredShops.map((shop, i) => (
              <StoreCard key={shop.place_id} store={shop} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && searched && shops.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
          <Disc3 size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 8 }}>No shops found</div>
          <div style={{ fontSize: 14 }}>Try a different city or zip code.</div>
        </div>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16, maxWidth: 800, margin: '0 auto',
          }}>
            {[
              { icon: '🗺️', title: 'Find Local Shops', desc: 'Discover independent record stores in any city or neighborhood.' },
              { icon: '⭐', title: 'Ratings & Hours', desc: 'See Google ratings and live hours so you never show up to a closed shop.' },
              { icon: '🏪', title: 'Claim Your Shop', desc: 'Own a record store? Claim your listing to add your specialty and Discogs page.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                padding: 24, borderRadius: 14,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
