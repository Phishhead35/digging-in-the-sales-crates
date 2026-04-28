// ============================================================
// API CONFIGURATION
// ============================================================

const EBAY_APP_ID = process.env.REACT_APP_EBAY_APP_ID || 'YOUR_EBAY_APP_ID_HERE';
const CDANDLP_UID = process.env.REACT_APP_CDANDLP_UID || 'YOUR_CDANDLP_UID_HERE';

// NOTE: DISCOGS_TOKEN has been moved server-side to the Cloudflare Worker.
// It is no longer needed in this file and should not be added back here.

// ============================================================
// DISCOGS API
// Routed through Cloudflare Worker — token stays server-side
// ============================================================

export async function searchDiscogs(query, page = 1, perPage = 20) {
  const params = new URLSearchParams({ q: query, page, per_page: perPage });
  const res = await fetch(`/api/search-discogs?${params}`);
  if (!res.ok) throw new Error(`Discogs search failed: ${res.status}`);
  return res.json();
}

// ============================================================
// EBAY BROWSE API
// Routed through Cloudflare Worker
// ============================================================

export async function searchEbay(query) {
  const res = await fetch(`/api/search-ebay?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`eBay search failed: ${res.status}`);
  return res.json();
}

// ============================================================
// CDANDLP API
// Routed through Cloudflare Worker
// ============================================================

export async function searchCDandLP(query) {
  try {
    const res = await fetch(`/api/search-cdandlp?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`CDandLP search failed: ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn('CDandLP search unavailable:', err.message);
    return null;
  }
}

// ============================================================
// HELPERS
// ============================================================

export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

export function getConditionColor(condition) {
  const map = {
    'Mint (M)': '#2ec4b6',
    'Near Mint (NM or M-)': '#2ec4b6',
    'Very Good Plus (VG+)': '#4ade80',
    'Very Good (VG)': '#a3e635',
    'Good Plus (G+)': '#facc15',
    'Good (G)': '#fb923c',
    'Fair (F)': '#f87171',
    'Poor (P)': '#f87171',
  };
  return map[condition] || '#8b8a9b';
}

export function getConditionShort(condition) {
  const map = {
    'Mint (M)': 'M',
    'Near Mint (NM or M-)': 'NM',
    'Very Good Plus (VG+)': 'VG+',
    'Very Good (VG)': 'VG',
    'Good Plus (G+)': 'G+',
    'Good (G)': 'G',
    'Fair (F)': 'F',
    'Poor (P)': 'P',
  };
  return map[condition] || condition;
}
