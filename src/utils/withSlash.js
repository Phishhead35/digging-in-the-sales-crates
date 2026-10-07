// ─────────────────────────────────────────────────────────────
//  withSlash: internal link helper (2026-10-07)
//
//  Every page is served at its trailing-slash URL (/artists/gang-starr/).
//  A slash-less link (/artists/gang-starr) makes Cloudflare answer with a
//  redirect, and Google Search Console reports each one as "Page with
//  redirect". scripts/prerender.mjs already fixed the static HTML
//  (urlPath(), 2026-07-28 and 2026-10-01), but React replaces that HTML on
//  load, so the links Googlebot sees after rendering come from the JSX.
//  Run every internal <Link to> through this so both match.
//
//  Same rule as urlPath() in prerender.mjs: "/" stays "/", anything
//  already ending in "/" is untouched. Query strings and #hashes are kept:
//  /search?q=nas  ->  /search/?q=nas
//  External URLs, mailto: and anything not starting with "/" pass through.
// ─────────────────────────────────────────────────────────────

export function withSlash(href) {
  if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) {
    return href;
  }
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? '' : href.slice(cut);
  if (path === '/' || path.endsWith('/')) return href;
  return `${path}/${rest}`;
}

export default withSlash;
