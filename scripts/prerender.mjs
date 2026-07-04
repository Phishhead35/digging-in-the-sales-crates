// ─────────────────────────────────────────────────────────────
//  DITSC Build-Time Prerender
//  Runs after `react-scripts build` (see package.json).
//  For every public route, writes build/<route>/index.html with:
//    • correct <title>, meta description, og:*, twitter:*, canonical
//    • crawler-readable page content injected into #root
//    • JSON-LD structured data (Article / MusicGroup)
//  Also regenerates build/sitemap.xml from the same route list,
//  so new blog posts and artist pages are picked up automatically.
//
//  Browsers are unaffected: React 18 createRoot() replaces the
//  injected placeholder content the moment the app mounts.
//
//  To add a static route, edit STATIC_PAGES below.
//  Artist, genre, and blog routes are read from src/data/*.
// ─────────────────────────────────────────────────────────────

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BUILD = path.join(ROOT, 'build');
const BASE = 'https://digginginthesalescrates.com';
const SITE = 'Digging in the Sales Crates';

// ── Load data modules (src/data files are plain ESM; copy to a
//    temp .mjs so Node imports them regardless of package type) ──
async function loadDataModule(relPath) {
  const src = await fs.readFile(path.join(ROOT, relPath), 'utf8');
  const tmp = path.join(
    await fs.mkdtemp(path.join(os.tmpdir(), 'ditsc-')),
    'data.mjs'
  );
  await fs.writeFile(tmp, src);
  return import(pathToFileURL(tmp).href);
}

// ── HTML helpers ──
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function replaceMeta(html, attr, key, value) {
  const re = new RegExp(
    `(<meta\\s+${attr}="${key}"\\s+content=")[^"]*(")`,
    'i'
  );
  if (!re.test(html)) {
    console.warn(`  ⚠ meta ${key} not found in template`);
    return html;
  }
  return html.replace(re, `$1${esc(value)}$2`);
}

function renderPage(template, page) {
  const url = BASE + (page.path === '/' ? '/' : page.path);
  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(page.title)}</title>`);
  html = replaceMeta(html, 'name', 'description', page.description);
  html = replaceMeta(html, 'property', 'og:title', page.title);
  html = replaceMeta(html, 'property', 'og:description', page.description);
  html = replaceMeta(html, 'property', 'og:url', url);
  html = replaceMeta(html, 'name', 'twitter:title', page.title);
  html = replaceMeta(html, 'name', 'twitter:description', page.description);
  if (page.ogType) {
    html = replaceMeta(html, 'property', 'og:type', page.ogType);
  }

  // canonical + JSON-LD go just before </head>.
  // CanonicalTag.jsx updates (not duplicates) an existing canonical link.
  const canonical = BASE + (page.canonical || page.path);
  let headExtra = `<link rel="canonical" href="${esc(canonical)}"/>`;
  if (page.jsonLd) {
    headExtra += `<script type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>`;
  }
  html = html.replace('</head>', `${headExtra}</head>`);

  // Inject crawler-readable content into #root (React clears it on mount)
  if (page.content) {
    const wrapped =
      `<div style="max-width:820px;margin:0 auto;padding:32px 20px;` +
      `color:#e5e5e5;background:#0a0a0f">${page.content}</div>`;
    html = html.replace('<div id="root"></div>', `<div id="root">${wrapped}</div>`);
  }
  return html;
}

const a = (href, text) =>
  `<a href="${esc(href)}" style="color:#f59e0b">${esc(text)}</a>`;
const p = (text) => `<p>${esc(text)}</p>`;
const h1 = (text) => `<h1>${esc(text)}</h1>`;

// ── Main ──
async function main() {
  const template = await fs.readFile(path.join(BUILD, 'index.html'), 'utf8');
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('build/index.html: <div id="root"></div> not found — did the build change?');
  }

  const { BLOG_POSTS } = await loadDataModule('src/data/blog/index.js');
  const { ARTISTS, GENRES } = await loadDataModule('src/data/artists/index.js');

  const pages = [];

  // ── Static pages ──
  const navLinks =
    '<ul>' +
    [
      ['/aggregator', 'Search vinyl across Discogs, eBay & CDandLP'],
      ['/deals', 'Current vinyl deals & price alerts'],
      ['/artists', 'Artist & genre pages'],
      ['/blog', 'Blog: reissue radar, sample connections & more'],
      ['/local-shops', 'New England record shop directory'],
      ['/faq', 'FAQ'],
    ]
      .map(([href, text]) => `<li>${a(href, text)}</li>`)
      .join('') +
    '</ul>';

  const STATIC_PAGES = [
    {
      path: '/',
      title: `${SITE} | Vinyl Record Price Comparison`,
      description:
        'Find the lowest prices on vinyl records across Discogs, eBay, and CDandLP. Taking the Dig Out of Digging™ — search rare hip-hop, jazz, and soul LPs in seconds.',
      content:
        h1(SITE) +
        p('Taking the Dig Out of Digging. Free vinyl record price comparison: search Discogs, eBay, and CDandLP simultaneously and find the lowest price on any record in seconds. No sign-up required.') +
        navLinks,
    },
    {
      path: '/aggregator',
      title: `Search Vinyl Records | ${SITE}`,
      description:
        'Search vinyl records across Discogs, eBay, and CDandLP at once. Compare condition, price, and seller, then buy on the marketplace you prefer.',
      content:
        h1('Search Vinyl Records') +
        p('Search any artist, album, or label and see live listings from Discogs, eBay, and CDandLP side by side, sorted by price.'),
    },
    {
      path: '/search',
      canonical: '/aggregator',
      title: `Search Vinyl Records | ${SITE}`,
      description:
        'Search vinyl records across Discogs, eBay, and CDandLP at once. Compare condition, price, and seller, then buy on the marketplace you prefer.',
      content:
        h1('Search Vinyl Records') +
        p('Search any artist, album, or label and see live listings from Discogs, eBay, and CDandLP side by side, sorted by price.'),
    },
    {
      path: '/deals',
      title: `Vinyl Deals & Price Alerts | ${SITE}`,
      description:
        'Current vinyl record deals, sales, and price alerts from Discogs, eBay, CDandLP, and partner record shops in Massachusetts and New England.',
      content:
        h1('Vinyl Deals & Price Alerts') +
        p('Hand-picked vinyl deals and marketplace sales, updated regularly, plus offers from local partner record shops.'),
    },
    {
      path: '/wishlist',
      title: `Vinyl Wishlist | ${SITE}`,
      description:
        'Save vinyl records you want to find and jump straight to live listings on Discogs, eBay, and CDandLP.',
      content: h1('Your Vinyl Wishlist') + p('Track the records you want and check live marketplace listings anytime.'),
    },
    {
      path: '/alerts',
      title: `Price Alerts | ${SITE}`,
      description:
        'Set vinyl price alerts and catch deals on the records you want across Discogs, eBay, and CDandLP.',
      content: h1('Price Alerts') + p('Get notified when the records you want hit your target price.'),
    },
    {
      path: '/local-shops',
      title: `Local Record Shops in New England | ${SITE}`,
      description:
        'Find independent record stores in Massachusetts and New England. Directory of local vinyl shops for crate diggers.',
      content:
        h1('Local Record Shops') +
        p('A directory of independent record stores across Massachusetts and New England. Support your local crate.'),
    },
    {
      path: '/featured-partners',
      title: `Partner With Us | ${SITE}`,
      description:
        'Get your record store in front of serious vinyl collectors. Partner with Digging in the Sales Crates.',
      content:
        h1('Partner With Us') +
        p('Get your record store in front of serious vinyl collectors and crate diggers.'),
    },
    {
      path: '/faq',
      title: `FAQ | ${SITE}`,
      description:
        'How Digging in the Sales Crates works: searching Discogs, eBay, and CDandLP at once, affiliate links, wishlists, and more.',
      content:
        h1('Frequently Asked Questions') +
        p('How the site works, where listings come from, and how affiliate links keep the tool free.'),
    },
  ];
  pages.push(...STATIC_PAGES);

  // ── Artists index ──
  const artistEntries = Object.values(ARTISTS);
  const genreEntries = Object.values(GENRES);
  pages.push({
    path: '/artists',
    title: `Artist Pages | ${SITE}`,
    description:
      "Browse vinyl records by artist. Find essential releases, collector's notes, and marketplace links for hip-hop, soul, funk, and jazz artists.",
    content:
      h1('Artist & Genre Pages') +
      '<ul>' +
      artistEntries.map((ar) => `<li>${a(`/artists/${ar.slug}`, `${ar.name} vinyl records`)}</li>`).join('') +
      genreEntries.map((g) => `<li>${a(`/genres/${g.slug}`, `${g.name} vinyl records`)}</li>`).join('') +
      '</ul>',
  });

  // ── Artist & genre pages ──
  const artistPage = (entry, kind) => ({
    path: `/${kind}/${entry.slug}`,
    title: entry.seo?.title || `${entry.name} Vinyl Records | ${SITE}`,
    description: entry.seo?.description || '',
    jsonLd:
      kind === 'artists'
        ? {
            '@context': 'https://schema.org',
            '@type': 'MusicGroup',
            name: entry.name,
            genre: entry.genres,
            url: `${BASE}/artists/${entry.slug}`,
          }
        : undefined,
    content:
      h1(`${entry.name} Vinyl Records`) +
      (entry.tagline ? p(entry.tagline) : '') +
      (entry.bio || []).map(p).join('') +
      (entry.essentialRecords?.length
        ? '<h2>Essential Records</h2><ul>' +
          entry.essentialRecords
            .map((r) => `<li>${esc(r.title)} (${esc(r.year)}, ${esc(r.label)})</li>`)
            .join('') +
          '</ul>'
        : '') +
      p('Compare live listings for these records on Discogs, eBay, and CDandLP:') +
      a('/aggregator', `Search ${entry.name} vinyl`),
  });
  pages.push(...artistEntries.map((e) => artistPage(e, 'artists')));
  pages.push(...genreEntries.map((e) => artistPage(e, 'genres')));

  // ── Blog index ──
  const posts = Object.values(BLOG_POSTS).sort((x, y) => (x.date < y.date ? 1 : -1));
  pages.push({
    path: '/blog',
    title: `Blog | ${SITE}`,
    description:
      'Sample connections, reissue alerts, artist spotlights, and market trends for vinyl collectors and crate diggers.',
    content:
      h1('The DITSC Blog') +
      posts
        .map(
          (post) =>
            `<article><h2>${a(`/blog/${post.slug}`, post.title)}</h2>` +
            `<p><em>${esc(post.dateDisplay || post.date)}</em></p>` +
            p(post.excerpt || '') +
            '</article>'
        )
        .join(''),
  });

  // ── Blog posts ──
  pages.push(
    ...posts.map((post) => ({
      path: `/blog/${post.slug}`,
      title: post.seo?.title || `${post.title} | ${SITE}`,
      description: post.seo?.description || post.excerpt || '',
      ogType: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        datePublished: post.date,
        description: post.seo?.description || post.excerpt || '',
        url: `${BASE}/blog/${post.slug}`,
        author: { '@type': 'Organization', name: SITE, url: BASE },
        publisher: { '@type': 'Organization', name: SITE, url: BASE },
      },
      content:
        `<article>${h1(post.title)}` +
        `<p><em>${esc(post.series || '')} · ${esc(post.dateDisplay || post.date)}</em></p>` +
        (post.body || []).map(p).join('') +
        `</article><p>${a('/blog', '← All posts')} · ${a('/aggregator', 'Search vinyl prices')}</p>`,
    }))
  );

  // ── Write pages (root '/' overwrites build/index.html last) ──
  let count = 0;
  for (const page of pages.sort((x) => (x.path === '/' ? 1 : -1))) {
    const outDir = page.path === '/' ? BUILD : path.join(BUILD, ...page.path.split('/').filter(Boolean));
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'index.html'), renderPage(template, page));
    count++;
  }

  // ── Regenerate sitemap.xml from the same route list ──
  const today = new Date().toISOString().slice(0, 10);
  const lastmodFor = (pg) => {
    const post = posts.find((ps) => `/blog/${ps.slug}` === pg.path);
    return post?.date || today;
  };
  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    pages
      .filter((pg) => !pg.canonical) // skip /search (canonical → /aggregator)
      .map(
        (pg) =>
          `  <url>\n    <loc>${BASE}${pg.path === '/' ? '/' : pg.path}</loc>\n` +
          `    <lastmod>${lastmodFor(pg)}</lastmod>\n  </url>`
      )
      .join('\n') +
    '\n</urlset>\n';
  await fs.writeFile(path.join(BUILD, 'sitemap.xml'), sitemap);

  console.log(`✔ Prerendered ${count} routes + sitemap.xml`);
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
