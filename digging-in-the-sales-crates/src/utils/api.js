// ============================================================
// API CONFIGURATION
// Replace the placeholder values below with your actual tokens
// NEVER commit real tokens to GitHub — use .env instead
// ============================================================

const DISCOGS_TOKEN = process.env.REACT_APP_DISCOGS_TOKEN || 'YOUR_DISCOGS_TOKEN_HERE';
const EBAY_APP_ID = process.env.REACT_APP_EBAY_APP_ID || 'YOUR_EBAY_APP_ID_HERE';
const CDANDLP_UID = process.env.REACT_APP_CDANDLP_UID || 'YOUR_CDANDLP_UID_HERE';

const DISCOGS_BASE = 'https://api.discogs.com';
const EBAY_BASE = 'https://svcs.ebay.com/services/search/FindingService/v1';
const CDANDLP_BASE = 'https://api.cdandlp.com/search/';

// ============================================================
// DISCOGS API
// ============================================================

export async function searchDiscogs(query, page = 1, perPage = 20) {
  const params = new URLSearchParams({
    q: query,
    type: 'release',
    format: 'vinyl',
    page,
    per_page: perPage,
  });

  const res = await fetch(`${DISCOGS_BASE}/database/search?${params}`, {
    headers: {
      Authorization: `Discogs token=${DISCOGS_TOKEN}`,
      'User-Agent': 'DiggingInTheSalesCrates/1.0',
    },
  });

  if (!res.ok) throw new Error(`Discogs search failed: ${res.status}`);
  return res.json();
}

export async function getDiscogsMarketplaceListings(releaseId) {
  const res = await fetch(
    `${DISCOGS_BASE}/marketplace/search?release_id=${releaseId}&format=Vinyl&sort=price&sort_order=asc&per_page=10`,
    {
      headers: {
        Authorization: `Discogs token=${DISCOGS_TOKEN}`,
        'User-Agent': 'DiggingInTheSalesCrates/1.0',
      },
    }
  );

  if (!res.ok) throw new Error(`Discogs marketplace failed: ${res.status}`);
  return res.json();
}

export async function getDiscogsRelease(releaseId) {
  const res = await fetch(`${DISCOGS_BASE}/releases/${releaseId}`, {
    headers: {
      Authorization: `Discogs token=${DISCOGS_TOKEN}`,
      'User-Agent': 'DiggingInTheSalesCrates/1.0',
    },
  });

  if (!res.ok) throw new Error(`Discogs release fetch failed: ${res.status}`);
  return res.json();
}

export async function getDiscogsPriceSuggestions(releaseId) {
  const res = await fetch(`${DISCOGS_BASE}/marketplace/price_suggestions/${releaseId}`, {
    headers: {
      Authorization: `Discogs token=${DISCOGS_TOKEN}`,
      'User-Agent': 'DiggingInTheSalesCrates/1.0',
    },
  });

  if (!res.ok) return null;
  return res.json();
}

// ============================================================
// EBAY FINDING API (free, no OAuth needed for search)
// ============================================================

export async function searchEbay(query) {
  const res = await fetch(`/api/search-ebay?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`eBay search failed: ${res.status}`);
  return res.json();
}

// ============================================================
// CDANDLP API
// Requires a free seller/buyer account at cdandlp.com
// Email them to get a UID key: https://www.cdandlp.com/en/api-developers/
// ============================================================

export async function searchCDandLP(query) {
  const payload = {
    information: {
      uid: CDANDLP_UID,
      action: 'SEARCH',
      lng: 'en',
      artist: query,
      media: 'LP',
      nb_items: '10',
      srt: 'price_asc',
    },
  };

  try {
    const res = await fetch(CDANDLP_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ json_object: JSON.stringify(payload) }),
    });
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
