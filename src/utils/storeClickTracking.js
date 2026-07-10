// ── Shared store-click notification helper ────────────────────
// Single implementation of the ntfy.sh phone-notification ping fired
// on every store_click, used by Home.jsx, SearchResults.jsx, and
// ArtistPage.jsx. GA4 event shapes stay page-specific (each page still
// defines its own trackStoreClick/trackPartnerClick with its own
// click_source and parameters) — only this plumbing is shared, so the
// existing GA4 events for search and homepage are unchanged.
// keepalive lets the request complete even as the browser leaves the page.
export const NTFY_TOPIC = 'ditsc-clicks-vk8q3zt2npw4';

export function notifyStoreClick(message) {
  try {
    fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
      method: 'POST',
      body: message,
      headers: { 'X-Title': 'DITSC Store Click', 'X-Tags': 'dollar' },
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never let a notification failure break the click-through.
  }
}
