import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { withSlash } from '../utils/withSlash';
import useSEO from '../hooks/useSEO';
import { MA_STORES, RINH_STORES } from '../data/partnerStores';
import { AffiliateDisclosure, AffiliateBadge } from '../components/AffiliateDisclosure';
import { isMonetized } from '../config/partners';
import { trackStoreClick } from '../utils/analytics';

// ── Shops directory (/shops/) ─────────────────────────────────
// The full list of partner record stores, grouped by state. Reads the same
// data file as the homepage and the search card (src/data/partnerStores.js),
// so adding a shop there adds it here. Nothing is hardcoded in this file.
//
// Every shop on the site is listed here, including ones left out of the
// search and artist-page rotation (excludeFromRotation): that flag only
// controls where a shop is auto-picked, not whether it is a partner.
//
// scripts/prerender.mjs builds the crawler copy of this page from the same
// data and carries the same title and description as useSEO below. Edit
// them together or browsers and crawlers disagree.

// Own click_source for this page, so store clicks from the directory can be
// told apart from the homepage cards and the search card. To move it into
// CLICK_SOURCES in analytics.js later, add SHOPS_DIRECTORY: 'shops_directory'.
const SHOPS_CLICK_SOURCE = 'shops_directory';

// Display order. A state not listed here still shows, after these.
const STATE_ORDER = [
  ['MA', 'Massachusetts'],
  ['RI', 'Rhode Island'],
  ['NH', 'New Hampshire'],
];

const stateOf = (store) => {
  const m = /,\s*([A-Z]{2})\s*$/.exec(store.location || '');
  return m ? m[1] : '';
};

// Same store, two cities (The Time Capsule) needs two distinct anchors, so
// the slug carries the city. Partners can link straight to
// /shops/#the-time-capsule-cranston.
const slugOf = (store) => {
  const city = (store.location || '').split(',')[0];
  return `${store.name} ${city}`
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

function groupByState(stores) {
  const known = STATE_ORDER.map(([code, name]) => ({
    code,
    name,
    stores: stores.filter((s) => stateOf(s) === code),
  }));
  const knownCodes = STATE_ORDER.map(([code]) => code);
  const other = stores.filter((s) => !knownCodes.includes(stateOf(s)));
  const groups = known.filter((g) => g.stores.length > 0);
  if (other.length) groups.push({ code: 'OTHER', name: 'More Shops', stores: other });
  return groups;
}

const linkBtn = (primary) => ({
  display: 'inline-flex', alignItems: 'center',
  fontSize: 12, fontWeight: primary ? 700 : 600, textDecoration: 'none',
  padding: '6px 12px', borderRadius: 6,
  color: primary ? '#0a0a0f' : 'var(--amber)',
  background: primary ? 'var(--amber)' : 'rgba(245,158,11,0.08)',
  border: primary ? 'none' : '1px solid rgba(245,158,11,0.4)',
});

function ShopCard({ store }) {
  const click = (url) => trackStoreClick({
    storeName: store.name,
    storeUrl: url,
    clickSource: SHOPS_CLICK_SOURCE,
    notify: `${store.name} (shops directory)`,
  });

  // Buttons depend on which links the shop has. A shop with only one link
  // gets one button, labelled for where it actually goes.
  const onlyLabel = /discogs\.com/i.test(store.url)
    ? 'Discogs →'
    : /instagram\.com/i.test(store.url)
    ? 'Instagram →'
    : 'Website →';

  return (
    <div id={slugOf(store)} className="store-card"
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        padding: 20, borderRadius: 14, scrollMarginTop: 88,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
      }}>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', margin: 0 }}>{store.name}</h3>
      <div style={{ fontSize: 11, color: 'var(--amber)', marginTop: 3, fontFamily: 'var(--font-mono)' }}>
        {store.type} · {store.location}
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: '12px 0 16px' }}>
        {store.desc}
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
        {store.siteUrl ? (
          <>
            <a href={store.siteUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => click(store.siteUrl)} style={linkBtn(true)}>
              Website →
            </a>
            <a href={store.url} target="_blank" rel="noopener noreferrer"
              onClick={() => click(store.url)} style={linkBtn(false)}>
              Discogs →
            </a>
          </>
        ) : (
          <a href={store.url} target="_blank" rel="noopener noreferrer"
            onClick={() => click(store.url)} style={linkBtn(true)}>
            {onlyLabel}
          </a>
        )}
        {/* eBay store links carry the EPN campid, so they earn a commission:
            badge it and mark it sponsored, same as the homepage card. */}
        {store.ebayUrl && (
          <a href={store.ebayUrl} target="_blank" rel="sponsored nofollow noopener noreferrer"
            onClick={() => click(store.ebayUrl)}
            style={{ ...linkBtn(false), background: 'transparent' }}>
            eBay →
            {isMonetized('ebay') && <AffiliateBadge spaced />}
          </a>
        )}
      </div>
    </div>
  );
}

export default function ShopsDirectory() {
  const stores = [...MA_STORES, ...RINH_STORES];
  const groups = groupByState(stores);

  useSEO({
    title: 'Independent Record Stores in New England | Digging in the Sales Crates',
    description:
      'Hand-picked independent record stores in Massachusetts, Rhode Island, and New Hampshire, with locations, specialties, and links to each shop\'s site and Discogs store.',
  });

  // Jump to a shop when the URL carries its anchor (/shops/#planet-records).
  // The route loads as a lazy chunk, and the page keeps settling after the
  // first render (fonts, the footer, the scroll-to-top reset), so a single
  // smooth scroll lands a little off. Jump instantly, then again once the
  // layout has settled. scrollMarginTop on each card clears the fixed nav.
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return undefined;
    const jump = () => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ block: 'start' });
    };
    const timers = [setTimeout(jump, 100), setTimeout(jump, 500)];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ padding: '48px 24px 24px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <div style={{ marginBottom: 32 }}>
          <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
            FEATURED PARTNERS
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 56px)', letterSpacing: 1, lineHeight: 1, marginBottom: 12 }}>
            INDEPENDENT RECORD SHOPS WE DIG
          </h1>
          <p style={{ color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
            {stores.length} independent stores in Massachusetts, Rhode Island, and New Hampshire that
            we think are worth your time and money. Click through to a shop's site or Discogs store
            to see what's in the bins.
          </p>
          {/* Built from partners.js, so it names only the programs linked on
              this page (today, the eBay button on Planet Records) and
              disappears if none are. Uses the homepage's rule, since this
              page carries the same shop cards. */}
          <div style={{ marginTop: 12, maxWidth: 640 }}>
            <AffiliateDisclosure variant="compact" surface="home" />
          </div>
        </div>

        {groups.map((group) => (
          <section key={group.code} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1,
              color: 'var(--text-primary)', marginBottom: 16,
              display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap',
            }}>
              {group.name.toUpperCase()}
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: 1, color: 'var(--amber)' }}>
                {group.stores.length} {group.stores.length === 1 ? 'SHOP' : 'SHOPS'}
              </span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {group.stores.map((store) => <ShopCard key={slugOf(store)} store={store} />)}
            </div>
          </section>
        ))}

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16,
          marginTop: 8,
        }}>
          <div style={{
            padding: '18px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Own a record store?</div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>Get your shop in front of serious collectors.</div>
            </div>
            <Link to={withSlash('/featured-partners')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8,
              background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--amber)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              Learn more <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{
            padding: '18px 24px', background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Somewhere else?</div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>Search any city or zip code for record shops near you.</div>
            </div>
            <Link to={withSlash('/local-shops')} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 8,
              background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--amber)', fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>
              <MapPin size={13} /> Find shops near me
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
