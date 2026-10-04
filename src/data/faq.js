// ─────────────────────────────────────────────────────────────
// DITSC FAQ content (moved here from FAQ.jsx 2026-10-04)
//
// One copy of the FAQ text, read by both:
//   • src/pages/FAQ.jsx       (the open/close page visitors use)
//   • scripts/prerender.mjs   (the static HTML crawlers read, plus the
//                              FAQPage JSON-LD that search engines and
//                              AI assistants use to quote answers)
// Edit questions and answers here only.
//
// Plain ESM, no JSX: prerender.mjs imports this with Node.
// ─────────────────────────────────────────────────────────────

export const FAQS = [
  {
    category: "ABOUT THE SITE",
    items: [
      {
        q: "What is Digging in the Sales Crates?",
        a: "Digging in the Sales Crates is a free vinyl price search. You search for a record once and we check Discogs, eBay, CDandLP, and Turntable Lab at the same time, so you can compare prices across all four without jumping between tabs. The tagline says it best: Taking the Dig Out of Digging."
      },
      {
        q: "Can I buy records directly on this site?",
        a: "No. We don't sell records. When you find a listing you like, you click through to the retailer (Discogs, eBay, CDandLP, or Turntable Lab) and buy it there. We're the finder, not the seller."
      },
      {
        q: "Is it free to use?",
        a: "Yes, completely free. No account required, no paywalls, no subscription. Just search and dig."
      },
      {
        q: "How does the price search work?",
        a: "When you search for a record, we query Discogs, eBay, CDandLP, and Turntable Lab simultaneously and display the results in one place. Listings are live and pulled in real time from each platform. Prices, conditions, and availability are exactly what those sellers are showing right now."
      },
      {
        q: "Where do the prices come from?",
        a: "Directly from the source platforms. Discogs, eBay, CDandLP, and Turntable Lab each supply their own listing data. We don't set or alter any prices."
      },
    ]
  },
  {
    category: "SEARCHING & RESULTS",
    items: [
      {
        q: "Why are some records missing from one platform but not another?",
        a: "Each platform has its own seller base and inventory. If a record shows up on Discogs but not eBay, it just means no one currently has it listed there. Availability changes constantly as sellers list and sell."
      },
      {
        q: "Can I filter results by condition or format?",
        a: "Yes. On the search results page you can filter by source platform (Discogs, eBay, CDandLP, Turntable Lab), and results display the condition grade listed by each seller. More filter options are on the roadmap."
      },
      {
        q: "Can I save records I'm hunting for?",
        a: "Yes. You can add records to your Wishlist and come back to them. The Wishlist lives in your browser, so no account is needed."
      },
    ]
  },
  {
    category: "FEATURED STORES",
    items: [
      {
        q: "What are the Featured Partner stores?",
        a: "Independent record stores we've hand-selected and highlighted on the site. These are real brick-and-mortar shops (mostly New England-based) that sell online through Discogs, eBay, or their own sites. We spotlight them because we believe in supporting local shops, not just the big platforms."
      },
      {
        q: "I own a record store. How do I get listed?",
        a: "Reach out to us at hello@digginginthesalescrates.com. We feature independent shops that sell online through Discogs, eBay, or their own site. There's no cost to be listed. We're building out the partner program now and would love to hear from you."
      },
      {
        q: "Do featured stores pay to be on the site?",
        a: "Not right now. The current Featured Partners program is free. We're focused on building a great directory of independent shops first."
      },
    ]
  },
  {
    category: "DEALS & ALERTS",
    items: [
      {
        q: "What's on the Deals page?",
        a: "Curated affiliate store links to places we trust, including partner shops with online storefronts. If you want to browse rather than search for a specific record, that's a good place to start."
      },
      {
        q: "Can I set up price alerts for specific records?",
        a: "Not yet. There's no automatic alert that emails you when a price drops. For now, save records to your Wishlist and re-run the search whenever you want to check for new listings or lower prices. The free weekly newsletter also rounds up the best sales we find."
      },
    ]
  },
];
