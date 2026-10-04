// ─────────────────────────────────────────────────────────────
// DITSC guide pages (added 2026-10-03)
//
// Short, answer-first pages for common buying questions. One entry here
// = one page. Both places that render a guide read from this file:
//   • src/pages/GuidePage.jsx  (what visitors see)
//   • scripts/prerender.mjs    (the static HTML crawlers see)
// so the two can never drift apart. Edit the text here only.
//
// Rules for these pages (from the brief): answer in the first paragraph,
// the title is the H1, no prices pulled from listings, no Amazon links.
//
// Paragraph and list text is an array of "parts". A part is either plain
// text or a link object:
//   { href: '/search', text: '...' }      internal link (site pages)
//   { newsletter: true, text: '...' }     newsletter signup link
// The newsletter link is built by newsletterUrl('guide') in React and by
// the same rule in prerender.mjs (utm_medium=guide).
//
// Plain ESM, no JSX: prerender.mjs imports this with Node.
// ─────────────────────────────────────────────────────────────

export const GUIDES = [
  {
    slug: 'where-to-buy-cheap-hip-hop-vinyl',
    path: '/where-to-buy-cheap-hip-hop-vinyl',
    title: 'Where to buy cheap hip-hop vinyl',
    seoTitle: 'Where to Buy Cheap Hip-Hop Vinyl | Digging in the Sales Crates',
    description:
      'The cheap copies are usually on Discogs and eBay, not on a new-release shop. One free search checks both, plus CDandLP and Turntable Lab.',
    blocks: [
      {
        type: 'p',
        parts: [
          'The cheap copies are usually on Discogs and eBay, not on a new-release shop. Digging in the Sales Crates ',
          { href: '/search', text: 'checks both at once' },
          ', plus CDandLP and Turntable Lab, so you can compare sellers without opening four tabs.',
        ],
      },
      {
        type: 'p',
        parts: [
          'Start with the record you actually want, not a random sale. Search the artist and the album. eBay, CDandLP, and Turntable Lab results come sorted by price, and Discogs results open the release page, where you can see every copy for sale. Then look at the seller, the sleeve grade, and the shipping. An $8 record with $12 shipping is not a deal.',
        ],
      },
      { type: 'p', parts: ['A few habits that keep the cost down:'] },
      {
        type: 'ul',
        items: [
          ['Buy the common pressing first. First presses and colored vinyl cost more, and a clean reissue plays fine.'],
          ['Check more than one seller. The same album can be $14 on Discogs and $9 on eBay the same day.'],
          ['Skip sealed if you only want to play it. Used VG+ is often half the price.'],
          [
            'Watch the weekly newsletter, ',
            { newsletter: true, text: 'This Week in the Sales Crates' },
            ', for store sales from shops that ship to the U.S.',
          ],
        ],
      },
      {
        type: 'p',
        parts: [
          'Hip-hop crates fill up fast if you only chase hype. The records people still play, the ones with a real sample or a real single, show up used all the time. Search those.',
        ],
      },
      {
        type: 'p',
        parts: [
          'Digging in the Sales Crates is free. No account. One search, four sellers. ',
          { href: '/about', text: "Here's why I built it." },
        ],
      },
    ],
  },
  {
    slug: 'discogs-vs-ebay-for-records',
    path: '/discogs-vs-ebay-for-records',
    title: 'Discogs vs eBay for records',
    seoTitle: 'Discogs vs eBay for Records | Digging in the Sales Crates',
    description:
      'Use both. Discogs is better when you know the exact pressing. eBay is better when you want the lowest price and you are willing to read the listing.',
    blocks: [
      {
        type: 'p',
        parts: [
          'Use both. Discogs is better when you know the exact pressing. eBay is better when you want the lowest price and you are willing to read the listing.',
        ],
      },
      {
        type: 'p',
        parts: [
          'Discogs lists the release, the label, the year, and the condition in a set format. You can see what other people paid. That makes it the right place to confirm you are buying the record you think you are buying. Prices sit a little higher because sellers know the catalog.',
        ],
      },
      {
        type: 'p',
        parts: [
          'eBay is a pile. The same album shows up with bad photos, wrong years, and shipping that changes the math. It also shows up cheaper, especially on common titles, because a lot of sellers are not pricing off Discogs. Read the description. If the photos are blurry and the grade is a guess, pass.',
        ],
      },
      { type: 'p', parts: ['A simple split:'] },
      {
        type: 'ul',
        items: [
          ['Exact pressing, matrix number, or a rare title: start on Discogs.'],
          ['A record you just want to play, and you know the cover: check eBay too.'],
          ['Shipping to the U.S.: add it before you decide. The item price is not the price.'],
        ],
      },
      {
        type: 'p',
        parts: [
          'Digging in the Sales Crates runs ',
          { href: '/search', text: 'one search' },
          ' across Discogs, eBay, CDandLP, and Turntable Lab. You still pick the seller. The page just puts the options in one place.',
        ],
      },
    ],
  },
];
