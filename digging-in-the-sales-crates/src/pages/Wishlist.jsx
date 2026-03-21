import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Search } from 'lucide-react';
import { formatPrice } from '../utils/api';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  const remove = (item) => {
    const next = wishlist.filter(w => !(w.id === item.id && w.source === item.source));
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: 2, marginBottom: 8 }}>
          YOUR <span style={{ color: 'var(--amber)' }}>WISHLIST</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {wishlist.length} {wishlist.length === 1 ? 'record' : 'records'} saved
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 8 }}>Your wishlist is empty</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
            Search for records and hit the heart icon to save them here.
          </div>
          <Link to="/search" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 10,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000', fontWeight: 600, fontSize: 14,
          }}>
            <Search size={16} /> Start Digging
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {wishlist.map(item => (
            <div key={`${item.source}-${item.id}`} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 16, overflow: 'hidden',
            }}>
              <div style={{ position: 'relative', aspectRatio: '1', background: 'var(--bg-surface)' }}>
                {item.thumb ? (
                  <img src={item.thumb} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)' }}>
                    <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#222', border: '3px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#444' }} />
                    </div>
                  </div>
                )}
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  background: item.source === 'discogs' ? 'rgba(245,158,11,0.9)' : 'rgba(0,100,210,0.9)',
                  color: item.source === 'discogs' ? '#000' : '#fff', fontFamily: 'var(--font-mono)',
                }}>
                  {item.source?.toUpperCase()}
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{item.title}</h3>
                {item.lowest_price > 0 && (
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
                    {formatPrice(item.lowest_price)}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/release/${item.source}/${item.id}`} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000',
                  }}>
                    <ShoppingCart size={13} /> View Deals
                  </Link>
                  <button onClick={() => remove(item)} style={{
                    padding: '8px 12px', borderRadius: 8, fontSize: 12,
                    background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
                    color: '#f87171',
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
