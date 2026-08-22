import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Search } from 'lucide-react';
import { formatPrice } from '../utils/api';
import {
  trackStoreClick,
  trackSelectItem,
  trackWishlistRemove,
  trackWishlistView,
  marketplaceFromUrl,
  CLICK_SOURCES,
} from '../utils/analytics';

// ── Affiliate URL builders ────────────────────────────────────
// Extracted from the inline JSX so the href and the GA4 event always
// use the identical string.
//
// BUGFIX: the CDandLP branch previously returned item.url raw, with no
// affiliate parameters at all — every CDandLP click-through from the
// wishlist was unmonetized. It now appends the same affiliate query
// string SearchResults.jsx uses.

const EBAY_AFFILIATE_PARAMS =
  'mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=5339145834&toolid=10001&customid=ditsc';

const CDANDLP_AFFILIATE_PARAMS =
  'lng=2&affilie=digginginthesalescrates&utm_source=digginginthesalescrates.com&utm_medium=link&utm_campaign=affiliation';

const appendParams = (url, params) => url + (url.includes('?') ? '&' : '?') + params;

function buildDealUrl(item) {
  if (item.source === 'discogs') {
    // Link to sell listings, not the release info page.
    // uri is stored on the item when saved from SearchResults.
    const isMaster = (item.uri || '').includes('/master/');
    const idParam = isMaster ? `master_id=${item.id}` : `release_id=${item.id}`;
    return `https://www.discogs.com/sell/list?${idParam}&sort=price&sort_order=asc`;
  }
  if (item.source === 'ebay') {
    return item.url
      ? appendParams(item.url, EBAY_AFFILIATE_PARAMS)
      : `https://www.ebay.com/itm/${item.id}`;
  }
  if (item.source === 'cdandlp') {
    return item.url
      ? appendParams(item.url, CDANDLP_AFFILIATE_PARAMS)
      : appendParams('https://www.cdandlp.com', CDANDLP_AFFILIATE_PARAMS);
  }
  return item.url || '#';
}

const STORE_NAMES = { discogs: 'Discogs', ebay: 'eBay', cdandlp: 'CDandLP' };

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  // Wishlist size is a returning-visitor signal worth trending.
  // Fires once per page view, not on every add/remove.
  // Empty dep array is deliberate: this is a once-per-page-view
  // snapshot of wishlist size, not a running total that should
  // re-fire on every add or remove.
  useEffect(() => {
    trackWishlistView(wishlist.length);
  }, []);

  const remove = (item) => {
    const next = wishlist.filter(w => !(w.id === item.id && w.source === item.source));
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
    trackWishlistRemove({ itemTitle: item.title, marketplace: item.source });
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
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
          {wishlist.map((item, index) => (
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
                {/* Bug 5 fix: three-source badge matching SearchResults */}
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  background: item.source === 'discogs'
                    ? 'rgba(245,158,11,0.9)'
                    : item.source === 'ebay'
                    ? 'rgba(0,100,210,0.9)'
                    : 'rgba(0,160,100,0.9)',
                  color: item.source === 'discogs' ? '#000' : '#fff',
                  fontFamily: 'var(--font-mono)',
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
                  {(() => {
                    // Compute once so the href and the GA4 event can never diverge.
                    const dealUrl = buildDealUrl(item);
                    const storeName = STORE_NAMES[item.source] || 'Other';
                    return (
                      <a
                        href={dealUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          // Wishlist clicks are the highest-intent event on the
                          // site: the visitor saved this record earlier and came
                          // back for it. Previously untracked entirely.
                          trackStoreClick({
                            storeName,
                            storeUrl: dealUrl,
                            clickSource: CLICK_SOURCES.WISHLIST,
                            itemTitle: item.title,
                            itemPrice: item.lowest_price,
                            itemId: item.id,
                            position: index + 1,
                            notify: `${storeName}: ${item.title} (wishlist)`,
                          });
                          trackSelectItem({
                            itemId: item.id,
                            itemTitle: item.title,
                            itemPrice: item.lowest_price,
                            marketplace: marketplaceFromUrl(dealUrl),
                            position: index + 1,
                            listName: 'wishlist',
                          });
                        }}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000',
                          textDecoration: 'none',
                        }}
                      >
                        <ShoppingCart size={13} /> View Deals
                      </a>
                    );
                  })()}
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
