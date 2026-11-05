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

// SIGNUP_REDIRECT_CONFIRMED controls what the landing page promises.
//
//   false (today): the landing page offers the direct download AND the
//     newsletter signup side by side. Nothing is hidden, and nobody is
//     promised a download that might not arrive.
//   true: the landing page has a single "join, then get the bundle" button
//     and promises the download right after signup. ONLY set this to true
//     after Beehiiv is confirmed to send new subscribers to
//     /bundle/thanks/ when they sign up (test it with a fresh email address).
export const SIGNUP_REDIRECT_CONFIRMED = false;

export const BUNDLE = {
  path: '/bundle',
  thanksPath: '/bundle/thanks',

  title: 'Free Breaks Bible Sampler',
  seoTitle: 'Free Breaks Bible Sampler: 10 Most-Sampled Breaks | Digging in the Sales Crates',
  description:
    'A free PDF with 10 of the most-sampled breaks, the records to hunt, and what to pay. The sampler from the Breaks Bible, for crate diggers.',

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

  note: 'This is the free sample of the Breaks Bible. The full book is on the way. Join the newsletter and you will hear first when the early-bird link goes live.',

  // Landing page buttons and copy
  downloadButton: 'Download the free sampler',
  signupButton: 'Join the free newsletter',
  signupButtonGated: 'Join the free newsletter and get the sampler',
  gatedPromise: "You'll land on the download page right after you sign up.",
  newsletterPitch:
    "While you're here: This Week in the Sales Crates is a free weekly email with the best record sales I find, plus the Wu-Wednesday, Sample DNA, and Throwback Thursday picks.",

  // Thanks / download page
  thanksTitle: 'Your Breaks Bible Sampler',
  thanksSeoTitle: 'Your Breaks Bible Sampler | Digging in the Sales Crates',
  thanksDescription: 'Download the free Breaks Bible sampler.',
  thanksLead: "Here's the sampler:",
  thanksNote:
    "It's a PDF, 13 pages, and it opens on any phone or computer. Save this page if you want to come back to it.",
  thanksFriday:
    'Every Friday you get This Week in the Sales Crates: the best record sales I found that week, plus the Wu-Wednesday, Sample DNA, and Throwback Thursday picks.',
};