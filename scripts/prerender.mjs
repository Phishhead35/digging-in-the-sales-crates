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
//
//  TRAILING SLASHES (fixed 2026-07-28 — see urlPath() below):
//  Every page is written as build/<route>/index.html, which is a
//  directory-style output. Static hosts (Cloudflare Pages included)
//  serve that by 301-redirecting a slash-less request to the
//  trailing-slash URL. og:url, the canonical tag, and sitemap.xml
//  were previously built from the slash-less `page.path`, so every
//  URL the sitemap told Google to crawl 301'd on arrival — Search
//  Console flagged this as "Redirect error" / "Page with redirect"
//  across 12 pages (GSC audit, 2026-07-28). urlPath() below is the
//  single place that decides the public URL shape; every page this
//  script generates — including next week's blog post or artist
//  page — routes through it automatically. Nothing else to remember
//  when adding new content.
//
//  PHASE 2 (Homepage & Content Hub, Aug 2026): added /watch-read to
//  STATIC_PAGES below and swapped it in for /blog in the crawler nav
//  list. /blog and every /blog/:slug entry (further down, generated
//  from BLOG_POSTS) are UNCHANGED — still generated, still in the
//  sitemap, still indexed. Watch & Read is additive, not a
//  replacement of the blog's URLs or SEO data.
//
//  SOURCE COUNT SYNC (2026-09-11): Turntable Lab became the fourth
//  live search source alongside Discogs, eBay, and CDandLP. Every
//  description/content string below that named the three sources
//  now names four, matching the same sweep already done in
//  Home.jsx, Layout.jsx, ArtistPage.jsx, Artists.jsx, and
//  BlogPost.jsx. This is the pair to useSEO.js: the two files
//  duplicate these strings on purpose (one sets the live meta tag,
//  this one bakes it into the static HTML crawlers see), so they
//  get edited together or crawlers and browsers disagree.
//
//  /search CONSOLIDATION (2026-10-01): /aggregator is retired. /search
//  is the one search URL: it is what every search box already used,
//  and "aggregator" meant nothing to visitors. /aggregator is no longer
//  generated here; public/_redirects 301s it to /search/, and every
//  crawler link below points at /search instead.
//
//  INTERNAL LINK SLASHES (2026-10-01): the a() helper now runs every
//  internal href through urlPath(), so crawler links point straight at
//  the trailing-slash URL instead of costing Googlebot a 308 hop.
//  This is the same fix applied to canonicals and the sitemap on
//  2026-07-28, extended to the links inside page content.
//
//  GUIDE PAGES (2026-10-03): short answer-first pages read from
//  src/data/guides.js, the same file GuidePage.jsx renders from, so
//  this HTML and the live page share one copy of the text. Adding a
//  guide there adds its static HTML and sitemap entry here.
//
//  BUNDLE PAGES (2026-10-05): /bundle (indexed) and /bundle/thanks
//  (noindex, kept out of the sitemap), read from src/data/bundle.js, the
//  same file BundlePage.jsx renders from.
//
//  FULL CRAWLER CONTENT (2026-10-04): the FAQ, About, homepage, Local
//  Shops and Watch & Read pages used to give crawlers one or two
//  sentences while visitors saw full pages. Each now carries the same
//  words people see, read from the same files the site renders from:
//  src/data/faq.js, src/data/about.js, src/data/partnerStores.js,
//  src/data/playlists.js and src/data/blog. Affiliate disclosures on
//  home, search, deals, artist and blog pages are built from
//  src/config/partners.js, the same rules the visible notices follow.
//  Rule: never put text here that a visitor can't see on that page.
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
// This Week in the Sales Crates signup. Kept in sync with NEWSLETTER_URL in
// src/pages/BlogPost.jsx: that one renders the live button, this one bakes the
// crawler-readable link, so they get edited together (same pairing note as
// useSEO.js above).
const NEWSLETTER_URL =
  'https://fromthesalescrates.beehiiv.com/subscribe' +
  '?utm_source=website&utm_medium=blog&utm_campaign=newsletter_signup';
// Guide pages use utm_medium=guide, matching newsletterUrl('guide') in
// GuidePage.jsx.
// About page uses utm_medium=about, matching newsletterUrl('about') in About.jsx.
const NEWSLETTER_ABOUT_URL =
  'https://fromthesalescrates.beehiiv.com/subscribe' +
  '?utm_source=website&utm_medium=about&utm_campaign=newsletter_signup';
// Bundle pages use utm_medium=bundle, matching newsletterUrl('bundle') in
// BundlePage.jsx.
const NEWSLETTER_BUNDLE_URL =
  'https://fromthesalescrates.beehiiv.com/subscribe' +
  '?utm_source=website&utm_medium=bundle&utm_campaign=newsletter_signup';
const NEWSLETTER_GUIDE_URL =
  'https://fromthesalescrates.beehiiv.com/subscribe' +
  '?utm_source=website&utm_medium=guide&utm_campaign=newsletter_signup';

// The one place that decides the public URL shape for a route path.
// Matches the directory+index.html structure written below (outDir),
// so the sitemap/canonical/og:url always match what the static host
// actually serves — no redirect on arrival, ever.
const urlPath = (p) => (p === '/' || p.endsWith('/') ? p : `${p}/`);

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
  const url = BASE + urlPath(page.path);
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
  // Internal/personal pages: override the template's "index, follow".
  // This tag is what keeps /wishlist, /alerts and /email-parser out of
  // Google. robots.txt blocks none of them (as of 2026-10-04 it is just
  // "Allow: /" plus the sitemap), which is what you want: Google can only
  // obey a noindex tag on a page it is allowed to crawl.
  if (page.noindex) {
    html = replaceMeta(html, 'name', 'robots', 'noindex, follow');
  }

  // canonical + JSON-LD go just before </head>.
  // CanonicalTag.jsx updates (not duplicates) an existing canonical link.
  const canonical = BASE + urlPath(page.canonical || page.path);
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

// Internal links (starting with "/") go through urlPath() so they match
// the trailing-slash URL the host actually serves. External links and
// anything else pass through untouched.
const linkHref = (href) => (href.startsWith('/') ? urlPath(href) : href);
const a = (href, text) =>
  `<a href="${esc(linkHref(href))}" style="color:#f59e0b">${esc(text)}</a>`;
const p = (text) => `<p>${esc(text)}</p>`;
const h1 = (text) => `<h1>${esc(text)}</h1>`;

// Guide "parts" (see src/data/guides.js): plain text, an internal link,
// or the newsletter link.
const guidePart = (part) => {
  if (typeof part === 'string') return esc(part);
  if (part.em) return `<em>${esc(part.em)}</em>`;
  if (part.newsletter) return a(NEWSLETTER_GUIDE_URL, part.text);
  return a(part.href, part.text);
};
const guideParts = (parts) => parts.map(guidePart).join('');
// ── Affiliate disclosure, mirroring <AffiliateDisclosure surface=...> ──
// Same rule as the visible notice: name only the monetized partners that
// partners.js says appear on this surface, add Amazon's own sentence only
// where Amazon links appear, and render nothing where nothing earns.
// AMAZON_SENTENCE must match AMAZON_DISCLOSURE_TEXT in
// src/components/AffiliateDisclosure.jsx (a JSX file Node can't import).
const AMAZON_SENTENCE = 'As an Amazon Associate I earn from qualifying purchases.';
const listNames = (names) =>
  names.length <= 1
    ? names.join('')
    : names.length === 2
      ? `${names[0]} and ${names[1]}`
      : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
let PARTNER_CFG = null; // set in main() from src/config/partners.js
const disclosure = (surface) => {
  if (!PARTNER_CFG) return '';
  const partners = PARTNER_CFG.monetizedOnSurface(surface);
  if (partners.length === 0) return '';
  const amazon = PARTNER_CFG.requiresOwnDisclosureOnSurface(surface) ? ` ${AMAZON_SENTENCE}` : '';
  return p(
    `Links to ${listNames(partners.map((x) => x.name))} are affiliate links. If you buy through them we may earn a commission, at no extra cost to you. It never changes what we show you or how results are ordered.${amazon}`
  );
};

const guideBlocks = (blocks) =>
  blocks
    .map((block) =>
      block.type === 'ul'
        ? '<ul>' + block.items.map((item) => `<li>${guideParts(item)}</li>`).join('') + '</ul>'
        : `<p>${guideParts(block.parts)}</p>`
    )
    .join('');

// ── Main ──
async function main() {
  const template = await fs.readFile(path.join(BUILD, 'index.html'), 'utf8');
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('build/index.html: <div id="root"></div> not found — did the build change?');
  }

  const { BLOG_POSTS } = await loadDataModule('src/data/blog/index.js');
  const { ARTISTS, GENRES } = await loadDataModule('src/data/artists/index.js');
  const { GUIDES } = await loadDataModule('src/data/guides.js');
  const { BUNDLE, SIGNUP_REDIRECT_CONFIRMED } = await loadDataModule('src/data/bundle.js');
  const { FAQS } = await loadDataModule('src/data/faq.js');
  const { ABOUT } = await loadDataModule('src/data/about.js');
  const { MA_STORES, RINH_STORES } = await loadDataModule('src/data/partnerStores.js');
  const { VIDEO_SERIES } = await loadDataModule('src/data/playlists.js');
  PARTNER_CFG = await loadDataModule('src/config/partners.js');

  // Latest YouTube uploads, as the live site serves them (the Worker
  // refreshes this list every 6 hours). Read once at build time, so the
  // crawler copy is as fresh as the last deploy. Any failure just leaves
  // the list out; it can never break the build.
  let latestVideos = [];
  try {
    const res = await fetch(`${BASE}/api/latest-videos`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      latestVideos = (Array.isArray(data.videos) ? data.videos : [])
        .filter((v) => v && v.url && v.title)
        .slice(0, 6);
    }
  } catch (err) {
    console.warn(`(latest videos not added to /watch-read: ${err.message})`);
  }

  const pages = [];

  // ── Static pages ──
  const navLinks =
    '<ul>' +
    [
      ['/search', 'Search vinyl across Discogs, eBay, CDandLP & Turntable Lab'],
      // /email-parser removed from this list 2026-10-04 (internal tool, not
      // in the visible nav; the page itself still exists with noindex).
      ['/deals', 'Current vinyl deals'],
      ['/artists', 'Artist & genre pages'],
      ['/watch-read', 'Watch & Read: DITSC videos and written stories'],
      ['/blog', 'Blog: sample connections, reissue alerts, and artist spotlights'],
      ['/local-shops', 'Find record shops near you'],
      ['/faq', 'FAQ'],
      ['/about', 'About Digging in the Sales Crates'],
      // Guide pages, from src/data/guides.js (2026-10-04).
      ...GUIDES.map((g) => [g.path, g.title]),
    ]
      .map(([href, text]) => `<li>${a(href, text)}</li>`)
      .join('') +
    '</ul>';

  const STATIC_PAGES = [
    {
      path: '/',
      title: `${SITE} | Vinyl Record Price Comparison`,
      description:
        'Find the lowest prices on vinyl records across Discogs, eBay, CDandLP, and Turntable Lab. Taking the Dig Out of Digging™. Search rare hip-hop, jazz, and soul LPs in seconds.',
      content:
        h1(SITE) +
        p('Taking the Dig Out of Digging. Free vinyl record price comparison: search Discogs, eBay, CDandLP, and Turntable Lab simultaneously and find the lowest price on any record in seconds. No sign-up required.') +
        // Shops We Dig, the same partner stores the homepage shows.
        '<h2>Shops We Dig</h2>' +
        p('Hand-picked independent stores worth your time and money. These are the real ones.') +
        disclosure('home') +
        [['Massachusetts', MA_STORES], ['Rhode Island & New Hampshire', RINH_STORES]]
          .map(
            ([region, stores]) =>
              `<h3>${esc(region)}</h3><ul>` +
              stores
                .map((st) => `<li><strong>${esc(st.name)}</strong> (${esc(st.type)}, ${esc(st.location)}). ${esc(st.desc)}</li>`)
                .join('') +
              '</ul>'
          )
          .join('') +
        p('Own a record store? Get your shop in front of serious collectors: hello@digginginthesalescrates.com') +
        '<h2>Stop Overpaying for Records</h2>' +
        p('Search Discogs, eBay, CDandLP, and Turntable Lab at the same time. Condition graded. Lowest price first. Every time.') +
        navLinks,
    },
    {
      // The one search URL. /aggregator was retired 2026-10-01 and now
      // 301s here (see public/_redirects). /search used to carry
      // canonical: '/aggregator' and was kept out of the sitemap; both
      // of those are gone, so it is now a normal indexed page.
      path: '/search',
      title: `Search Vinyl Records | ${SITE}`,
      description:
        'Search vinyl records across Discogs, eBay, CDandLP, and Turntable Lab at once. Compare condition, price, and seller, then buy on the marketplace you prefer.',
      content:
        h1('Search Vinyl Records') +
        p('Search any artist, album, or label and see live listings from Discogs, eBay, CDandLP, and Turntable Lab side by side, sorted by price.') +
        disclosure('search'),
    },
    {
      path: '/deals',
      title: `Vinyl Deals & Price Alerts | ${SITE}`,
      description:
        'Current vinyl record deals, sales, and price alerts from Discogs, eBay, CDandLP, Turntable Lab, and partner record shops in Massachusetts and New England.',
      content:
        h1('Vinyl Deals & Price Alerts') +
        p('Hand-picked vinyl deals and marketplace sales, updated regularly, plus offers from local partner record shops.') +
        disclosure('deals'),
    },
    {
      path: '/wishlist',
      noindex: true, // kept out of sitemap.xml, see sitemap block
      title: `Vinyl Wishlist | ${SITE}`,
      description:
        'Save vinyl records you want to find and jump straight to live listings on Discogs, eBay, CDandLP, and Turntable Lab.',
      content: h1('Your Vinyl Wishlist') + p('Track the records you want and check live marketplace listings anytime.'),
    },
    {
      path: '/alerts',
      noindex: true, // kept out of sitemap.xml, see sitemap block
      title: `Price Alerts | ${SITE}`,
      description:
        'Set vinyl price alerts and catch deals on the records you want across Discogs, eBay, CDandLP, and Turntable Lab.',
      // Matches the page since 2026-10-04: alerts are saved in the browser
      // and nothing sends notifications.
      content: h1('Price Alerts') + p('Save records and target prices, then check them with one tap.'),
    },
    {
      path: '/email-parser',
      noindex: true, // kept out of sitemap.xml, see sitemap block
      title: `AI Email Deal Parser | ${SITE}`,
      description:
        'Paste any record store promo email and let AI extract every deal, discount, and promo code automatically.',
      content:
        h1('AI Email Deal Parser') +
        p('Paste a promo email from any record store and extract every deal, discount, and promo code automatically using AI.') +
        p('Works with Fat Beats, Get On Down, Mass Appeal, Discogs, eBay, Rough Trade, and more.'),
    },
    {
      path: '/local-shops',
      title: `Find Record Shops Near You | ${SITE}`,
      description:
        'Find independent record stores near you. Search by city, neighborhood, or zip code to see ratings, hours, and directions for local vinyl shops.',
      content:
        // Describes what this page actually does: a live map search. The
        // partner store directory is on the homepage, so it is linked
        // there rather than repeated here (visitors don't see it on this
        // page, and crawler text must match what visitors see).
        h1('Find Record Shops Near You') +
        p('Discover independent vinyl shops in your area. Enter your city, neighborhood, or zip code to get started.') +
        p('Each result links to the shop and gives you directions.') +
        `<p>${a('/', 'See the partner shops we dig in Massachusetts, Rhode Island, and New Hampshire')}</p>`,
    },
    {
      // Hidden from Google 2026-10-04 until the page has real copy (who it
      // is for, that it is free, how to reach out). The page still works for
      // anyone who clicks to it. Remove noindex when the copy ships.
      path: '/featured-partners',
      noindex: true, // kept out of sitemap.xml, see sitemap block
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
        'How Digging in the Sales Crates works: searching Discogs, eBay, CDandLP, and Turntable Lab at once, affiliate links, wishlists, and more.',
      // Every question and answer, from src/data/faq.js (the same text the
      // page shows), plus FAQPage JSON-LD so search engines and AI
      // assistants can quote the answers directly.
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.flatMap((section) =>
          section.items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          }))
        ),
      },
      content:
        h1('Frequently Asked Questions') +
        p('Everything you need to know about how Digging in the Sales Crates works. Still have a question? Email hello@digginginthesalescrates.com') +
        FAQS.map(
          (section) =>
            `<h2>${esc(section.category)}</h2>` +
            section.items.map((item) => `<h3>${esc(item.q)}</h3>` + p(item.a)).join('')
        ).join(''),
    },
    {
      // About page. SEO strings mirror useSEO in src/pages/About.jsx; keep in sync.
      // The JSON-LD tells search engines and AI answer tools who built the
      // site and why, which is most of this page's SEO job.
      path: '/about',
      title: `About | ${SITE}`,
      description:
        'Why Joe Nicholas built Digging in the Sales Crates: 30 years of collecting records, too many browser tabs, and a free search across Discogs, eBay, CDandLP, and Turntable Lab.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: `About ${SITE}`,
        url: `${BASE}/about/`,
        about: {
          '@type': 'Organization',
          name: SITE,
          url: BASE,
          slogan: 'Taking the Dig Out of Digging',
          founder: { '@type': 'Person', name: 'Joe Nicholas' },
          sameAs: [
            'https://www.tiktok.com/@ditsc.com',
            'https://www.facebook.com/digginginthesalescrates/',
            'https://www.youtube.com/@digginginthesalescrates',
          ],
        },
        mainEntity: {
          '@type': 'Person',
          name: 'Joe Nicholas',
          description: 'Record collector for almost 30 years and creator of Digging in the Sales Crates.',
        },
      },
      // The full bio from src/data/about.js, the same text the page shows
      // (this used to be a shorter summary).
      content:
        h1(ABOUT.title) +
        p(ABOUT.mission) +
        ABOUT.intro.map((parts) => `<p>${guideParts(parts)}</p>`).join('') +
        '<ul>' +
        ABOUT.crates.map((c) => `<li><strong>${esc(c.who)}</strong>: ${esc(c.what)}</li>`).join('') +
        '</ul>' +
        ABOUT.sections
          .map(
            (sec) =>
              `<h2>${esc(sec.heading)}</h2>` +
              sec.paragraphs.map((parts) => `<p>${guideParts(parts)}</p>`).join('')
          )
          .join('') +
        `<p>${a(NEWSLETTER_ABOUT_URL, 'Get the free newsletter')}</p>` +
        p(ABOUT.signoff) +
        `<p>${esc(ABOUT.contactLead)} ${a(`mailto:${ABOUT.email}`, ABOUT.email)}</p>`,
    },
    {
      // Phase 2, new. /blog and /blog/:slug (below) are unchanged and still
      // generated/indexed — this is additive, not a replacement.
      path: '/watch-read',
      title: `Watch & Read | ${SITE}`,
      description:
        'Videos, stories, and recurring series from DITSC: the latest YouTube uploads, weekly playlist series, and written vinyl-collecting guides.',
      content:
        // Same three sections the page shows: latest uploads (as served
        // by /api/latest-videos at build time), the weekly series from
        // src/data/playlists.js, and the written stories.
        h1('Watch & Read') +
        p('Videos, stories, and recurring series from DITSC.') +
        (latestVideos.length
          ? '<h2>Latest from DITSC</h2><ul>' +
            latestVideos.map((v) => `<li>${a(v.url, v.title)}</li>`).join('') +
            '</ul>'
          : '') +
        '<h2>Recurring Video Series</h2><ul>' +
        VIDEO_SERIES.map(
          (sr) => `<li>${a(sr.playlistUrl, sr.name)}: ${esc(sr.description || '')}</li>`
        ).join('') +
        '</ul>' +
        '<h2>Written Stories</h2><ul>' +
        Object.values(BLOG_POSTS)
          .sort((x, y) => (x.date < y.date ? 1 : -1))
          .map((post) => `<li>${a(`/blog/${post.slug}`, post.title)}</li>`)
          .join('') +
        '</ul>' +
        `<p>${a('/blog', 'Read all stories')} · ${a('https://www.youtube.com/@digginginthesalescrates', 'Visit the DITSC YouTube channel')}</p>`,
    },
  ];
  pages.push(...STATIC_PAGES);

  // ── Guide pages ──
  for (const guide of GUIDES) {
    pages.push({
      path: guide.path,
      title: guide.seoTitle,
      description: guide.description,
      ogType: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        url: BASE + urlPath(guide.path),
        author: { '@type': 'Person', name: 'Joe Nicholas' },
        publisher: { '@type': 'Organization', name: SITE, url: BASE },
      },
      content: h1(guide.title) + guideBlocks(guide.blocks),
    });
  }

  // ── Free Hip-Hop Dig Bundle ──
  // Landing page: indexed. Crawler text mirrors what the page shows, which
  // depends on SIGNUP_REDIRECT_CONFIRMED (see src/data/bundle.js).
  pages.push({
    path: BUNDLE.path,
    title: BUNDLE.seoTitle,
    description: BUNDLE.description,
    content:
      h1(BUNDLE.title) +
      BUNDLE.intro.map(p).join('') +
      `<h2>${esc(BUNDLE.forYouHeading)}</h2><ul>` +
      BUNDLE.forYouIf.map((t) => `<li>${esc(t)}</li>`).join('') +
      '</ul>' +
      `<h2>${esc(BUNDLE.insideHeading)}</h2><ul>` +
      BUNDLE.inside.map((i) => `<li><strong>${esc(i.name)}</strong>: ${esc(i.what)}</li>`).join('') +
      '</ul>' +
      p(BUNDLE.note) +
      (SIGNUP_REDIRECT_CONFIRMED
        ? `<p>${a(NEWSLETTER_BUNDLE_URL, BUNDLE.signupButtonGated)}</p>` + p(BUNDLE.gatedPromise)
        : `<p>${a(BUNDLE.thanksPath, BUNDLE.downloadButton)}</p>` +
          p(BUNDLE.newsletterPitch) +
          `<p>${a(NEWSLETTER_BUNDLE_URL, BUNDLE.signupButton)}</p>`),
  });
  // Download page: kept out of Google and out of the sitemap.
  pages.push({
    path: BUNDLE.thanksPath,
    noindex: true, // kept out of sitemap.xml, see sitemap block
    title: BUNDLE.thanksSeoTitle,
    description: 'Download the free Hip-Hop Dig Bundle.',
    content: h1(BUNDLE.thanksTitle) + p(BUNDLE.thanksLead) + p(BUNDLE.thanksNote) + p(BUNDLE.thanksFriday),
  });

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
            url: `${BASE}${urlPath(`/artists/${entry.slug}`)}`,
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
      p('Compare live listings for these records on Discogs, eBay, CDandLP, and Turntable Lab:') +
      a('/search', `Search ${entry.name} vinyl`) +
      disclosure('artist'),
  });
  pages.push(...artistEntries.map((e) => artistPage(e, 'artists')));
  pages.push(...genreEntries.map((e) => artistPage(e, 'genres')));

  // ── Blog index (UNCHANGED in Phase 2 — /blog stays live and indexed.
  //    Linked from the primary nav and footer again since 2026-10-09;
  //    see Layout.jsx) ──
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

  // ── Blog posts (UNCHANGED in Phase 2 — every existing URL keeps working) ──
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
        url: `${BASE}${urlPath(`/blog/${post.slug}`)}`,
        author: { '@type': 'Organization', name: SITE, url: BASE },
        publisher: { '@type': 'Organization', name: SITE, url: BASE },
      },
      content:
        `<article>${h1(post.title)}` +
        `<p><em>${esc(post.series || '')} · ${esc(post.dateDisplay || post.date)}</em></p>` +
        (post.body || []).map(p).join('') +
        `</article>` +
        disclosure('blog') +
        `<p>${a(NEWSLETTER_URL, 'Join This Week in the Sales Crates, our free weekly newsletter')}</p>` +
        `<p>${a('/blog', '← All posts')} · ${a('/search', 'Search vinyl prices')}</p>`,
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
      .filter((pg) => !pg.canonical) // skip any page that canonicals elsewhere (none today)
      // Skip internal/personal pages (noindex: true): /wishlist, /alerts
      // and /email-parser, plus /featured-partners until it has real copy. Listing them here back when robots.txt blocked
      // them triggered the Sep 16, 2026 "Blocked by robots.txt" Search
      // Console warning. robots.txt no longer blocks anything, but these
      // pages still carry noindex, so submitting them would only produce
      // "Excluded by noindex" rows.
      .filter((pg) => !pg.noindex)
      .map(
        (pg) =>
          `  <url>\n    <loc>${BASE}${urlPath(pg.path)}</loc>\n` +
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