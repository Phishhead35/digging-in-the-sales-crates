import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Search, ExternalLink, ShoppingCart, Heart, AlertCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { searchDiscogs, searchEbay, formatPrice, getConditionColor, getConditionShort } from '../utils/api';

function RecordCard({ result, onWishlist, wishlisted }) {
  const thumb = result.cover_image || result.thumb || null;
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s',
      display: 'flex', flexDirection: 'column',
    }}
      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Cover */}
      <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--bg-surface)' }}>
        {thumb && !imgError ? (
          <img src={thumb} alt={result.title} onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

        {/* Source badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600,
          fontFamily: 'var(--font-mono)', letterSpacing: 0.5,
          background: result.source === 'discogs'
            ? 'rgba(245,158,11,0.9)' : 'rgba(0,100,210,0.9)',
          color: result.source === 'discogs' ? '#000' : '#fff',
        }}>
          {result.source === 'discogs' ? 'DISCOGS' : 'EBAY'}
        </div>

        {/* Wishlist btn */}
        <button onClick={() => onWishlist(result)} style={{
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

      {/* Info */}
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

      {/* Pricing footer */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {result.lowest_price ? (
            <div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>from </span>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)' }}>
                {formatPrice(result.lowest_price)}
              </span>
            </div>
          ) : (
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Price varies</span>
          )}
          {result.num_for_sale > 0 && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {result.num_for_sale} for sale
            </div>
          )}
        </div>
        <a
          href={
            result.source === 'discogs'
              ? `https://www.discogs.com/release/${result.id}`
              : result.source === 'ebay'
              ? (result.url ? result.url + (result.url.includes("?") ? "&" : "?") + "mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=5339145834&toolid=10001&customid=ditsc" : "https://www.ebay.com/itm/" + result.id)
              : result.url || '#'
          }
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000', transition: 'opacity 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = 0.85}
          onMouseOut={e => e.currentTarget.style.opacity = 1}
        >
          <ShoppingCart size={13} /> View Deals
        </a>
      </div>
    </div>
  );
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [inputVal, setInputVal] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });
  const [source, setSource] = useState('all'); // all | discogs | ebay

  const doSearch = useCallback(async (q, pg) => {
    if (!q) return;
    setLoading(true);
    setError(null);

    try {
      const combined = [];

      if (source === 'all' || source === 'discogs') {
        const data = await searchDiscogs(q, pg, 20);
        const items = (data.results || []).map(r => ({ ...r, source: 'discogs' }));
        combined.push(...items);
        if (data.pagination) setTotalPages(data.pagination.pages || 1);
      }

      if (source === 'all' || source === 'ebay') {
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
          combined.push(...mapped);
        } catch (ebayErr) {
          console.warn('eBay search failed, showing Discogs only:', ebayErr);
        }
      }

      setResults(combined);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    setInputVal(query);
    setPage(1);
    doSearch(query, 1);
  }, [query, doSearch]);

  useEffect(() => {
    if (page > 1) doSearch(query, page);
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputVal.trim()) navigate(`/search?q=${encodeURIComponent(inputVal.trim())}`);
  };

  const toggleWishlist = (item) => {
    setWishlist(prev => {
      const exists = prev.find(w => w.id === item.id && w.source === item.source);
      const next = exists ? prev.filter(w => !(w.id === item.id && w.source === item.source)) : [...prev, item];
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  };

  const isWishlisted = (item) => wishlist.some(w => w.id === item.id && w.source === item.source);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 0, maxWidth: 640 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="Search records..."
              style={{
                width: '100%', padding: '14px 14px 14px 42px',
                background: 'var(--bg-card)', border: '1px solid var(--border)', borderRight: 'none',
                borderRadius: '10px 0 0 10px', color: 'var(--text-primary)', fontSize: 15, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--amber)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
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

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={14} color="var(--text-muted)" />
        {['all', 'discogs', 'ebay'].map(s => (
          <button key={s} onClick={() => setSource(s)} style={{
            padding: '5px 16px', borderRadius: 100, fontSize: 12, fontWeight: 500,
            background: source === s ? 'var(--amber-glow)' : 'var(--bg-card)',
            border: source === s ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--border)',
            color: source === s ? 'var(--amber)' : 'var(--text-secondary)',
            transition: 'all 0.2s', textTransform: 'capitalize',
          }}>
            {s === 'all' ? 'All Sources' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        {query && (
          <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 8 }}>
            {loading ? 'Searching...' : `${results.length} results for "${query}"`}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: 20, borderRadius: 12, background: 'rgba(230,57,70,0.1)',
          border: '1px solid rgba(230,57,70,0.3)', color: '#f87171',
          display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 24,
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Search failed</div>
            <div style={{ fontSize: 13 }}>{error}</div>
            <div style={{ fontSize: 12, marginTop: 8, color: 'rgba(248,113,113,0.7)' }}>
              Make sure your API tokens are set in your .env file.
            </div>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {Array(8).fill(0).map((_, i) => (
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

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {results.map(r => (
            <RecordCard key={`${r.source}-${r.id}`} result={r} onWishlist={toggleWishlist} wishlisted={isWishlisted(r)} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && results.length === 0 && query && (
        <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🕳️</div>
          <div style={{ fontSize: 18, marginBottom: 8, color: 'var(--text-secondary)' }}>No results found</div>
          <div style={{ fontSize: 14 }}>Try a different search term or check your API configuration.</div>
        </div>
      )}

      {/* Pagination */}
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
    </div>
  );
}
