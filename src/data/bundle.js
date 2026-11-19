// ─────────────────────────────────────────────────────────────
// Free Breaks Bible Sampler (added 2026-10-05 as the Hip-Hop Dig Bundle,
// swapped to the sampler 2026-11-04)
//
// Text and settings for the two bundle pages, read by both:
//   • src/pages/BundlePage.jsx   (what visitors see)
//   • scripts/prerender.mjs      (the static HTML crawlers read)
// Edit the words here only.
//
//   /bundle         the landing page (indexed, in the sitemap)
//   /bundle/thanks  the download page (noindex, not in the sitemap)
//
// The old Hip-Hop Dig Bundle (a zip on Google Drive) is no longer offered on
// the site. Its Drive link still works for anyone who saved it, and it is
// kept here as HIP_HOP_DIG_LEGACY_URL so the link is not lost.
//
// Plain ESM, no JSX: prerender.mjs imports this with Node.
// ─────────────────────────────────────────────────────────────

// UNGATED 2026-11-20: the landing page gives the sampler as a direct download,
// no email needed, with the $19 buy button right under it and the newsletter
// as an optional signup further down. The goal is book sales, so nothing
// stands between a visitor and the sampler.
//
// SIGNUP_REDIRECT_CONFIRMED now only decides whether /bundle/thanks shows a
// newsletter button (false = show it). The landing page no longer reads it.
// Leave it false unless Beehiiv is confirmed to send new subscribers to
// /bundle/thanks/ (in which case they are already on the list).
export const SIGNUP_REDIRECT_CONFIRMED = false;

export const BUNDLE = {
  path: '/bundle',
  thanksPath: '/bundle/thanks',

  title: 'Free Breaks Bible Sampler',
  seoTitle: 'Free Breaks Bible Sampler: 10 Most-Sampled Breaks | Digging in the Sales Crates',
  description:
    'A free PDF with 10 of the most-sampled breaks, the records to hunt, and what to pay. No email needed. The sampler from the Breaks Bible.',

  // The sampler PDF, hosted on the site (public/breaks-bible-sampler.pdf).
  // Never rename that file; every link to the free download points here.
  downloadUrl: '/breaks-bible-sampler.pdf',

  // The old Hip-Hop Dig Bundle zip on Google Drive, shared with "anyone
  // with the link". Not linked from anywhere on the site anymore.
  HIP_HOP_DIG_LEGACY_URL:
    'https://drive.google.com/file/d/1uXMsEXOpcDPgRzIxdQST5ZNhOsxG0O8M/view?usp=drive_link',

  intro: [
    'Ten of the most-sampled breaks, with the records to hunt and what to pay. Free PDF, 13 pages.',
  ],
  // Shown under the download button on the landing page (2026-11-20).
  downloadNote: 'No email needed. It opens right in your browser.',

  forYouHeading: 'This is for you if',
  forYouIf: [
    'You want to know which records the famous samples came from.',
    "You dig used bins, Discogs, and shop walls, and you'd like to know what a fair price looks like before you pull out your wallet.",
    "You'd rather find the source record than pay for a hyped copy.",
    'You want a short list so every dig has a point.',
  ],

  insideHeading: "What's in the sampler",
  inside: [
    { name: '10 breaks', what: 'Ten of the most-sampled records, one entry each.' },
    { name: 'Records to hunt', what: 'The source records to look for in the bins.' },
    { name: 'What to pay', what: 'A fair price for each, so you know a deal when you see one.' },
  ],

  // Buy block, shown near the top of the landing page. buyUrl is the Stripe
  // payment link for the full book. To pre-fill the early-bird code, add
  // ?prefilled_promo_code=EARLYBIRD to it (test that first).
  buyHeading: 'Get the full Breaks Bible',
  buyLead: 'Like the sampler? The full Breaks Bible is out now: 100 breaks, $19.',
  buyEarlyBird: 'First 100 buyers, while they last: use code EARLYBIRD for $5 off.',
  buyButton: 'Buy the Breaks Bible: $19',
  buyUrl: 'https://buy.stripe.com/28EdR91kX3QpgZwffB0VO02',

  // Landing page buttons and copy
  downloadButton: 'Download the free sampler',
  signupButton: 'Join the free newsletter',
  signupButtonGated: 'Join the free newsletter and get the sampler',
  gatedPromise: "You'll land on the download page right after you sign up.",
  // Optional signup card. The sampler no longer depends on it (2026-11-20).
  newsletterHeading: 'Want more crate finds every Saturday?',
  newsletterPitch:
    'This Week in the Sales Crates is a free weekly email with the best record sales I find, plus the Wu-Wednesday, Sample DNA, and Throwback Thursday picks.',

  // Thanks / download page
  thanksTitle: 'Your Breaks Bible Sampler',
  thanksSeoTitle: 'Your Breaks Bible Sampler | Digging in the Sales Crates',
  thanksDescription: 'Download the free Breaks Bible sampler.',
  thanksLead: "Here's the sampler:",
  thanksNote:
    "It's a PDF, 13 pages, and it opens on any phone or computer. Save this page if you want to come back to it.",
  // Key name kept so nothing that reads it breaks; the newsletter moved to
  // Saturday mornings with the Nov 14 2026 issue.
  thanksFriday:
    'Every Saturday you get This Week in the Sales Crates: the best record sales I found that week, plus the Wu-Wednesday, Sample DNA, and Throwback Thursday picks.',
};