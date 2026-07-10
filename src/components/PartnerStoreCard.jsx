import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';

// ── Shared "Stores We Dig" partner promo card ─────────────────
// Single implementation of the amber-bordered partner card, used by
// SearchResults.jsx (rotating card inline in results) and ArtistPage.jsx
// (Dig Our Partners' Crates section). Pass a trackClick(storeName,
// storeUrl) callback so each page fires its own GA4 click_source
// without this component needing to know about page-specific tracking.

export default function PartnerStoreCard({ store, trackClick, badgeLabel = 'STORES WE DIG' }) {
  // Prefer the store's own website when it has one; fall back to its
  // primary link (Discogs or Instagram for some partners).
  const primaryUrl = store.siteUrl || store.url;

  return (
    <div className="record-card" style={{
      background: 'linear-gradient(165deg, rgba(245,158,11,0.10), var(--bg-card) 55%)',
      border: '1px solid rgba(245,158,11,0.45)',
      borderRadius: 16, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 600,
          fontFamily: 'var(--font-mono)', letterSpacing: 0.5,
          background: 'rgba(245,158,11,0.9)', color: '#000',
        }}>
          {badgeLabel}
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#222', border: '3px solid #333', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)' }} />
        </div>
      </div>

      <div style={{ padding: '12px 16px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, color: '#fff' }}>{store.name}</h3>
        <div style={{ fontSize: 11, color: 'var(--amber)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <MapPin size={11} style={{ flexShrink: 0 }} /> {store.type} · {store.location}
        </div>
        <p style={{
          fontSize: 13, color: '#fff', lineHeight: 1.6, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {store.desc}
        </p>
      </div>

      <div style={{ padding: '14px 16px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <a href={primaryUrl} target="_blank" rel="noopener noreferrer"
          onClick={() => trackClick(store.name, primaryUrl)}
          style={{
            fontSize: 12, color: '#0a0a0f', fontWeight: 700, textDecoration: 'none',
            padding: '7px 14px', borderRadius: 6, background: 'var(--amber)',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
          Visit Shop <ExternalLink size={11} />
        </a>
        {store.siteUrl && (
          <a href={store.url} target="_blank" rel="noopener noreferrer"
            onClick={() => trackClick(store.name, store.url)}
            style={{
              fontSize: 12, color: 'var(--amber)', fontWeight: 600, textDecoration: 'none',
              padding: '7px 14px', borderRadius: 6,
              border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)',
            }}>
            Discogs →
          </a>
        )}
      </div>
    </div>
  );
}
