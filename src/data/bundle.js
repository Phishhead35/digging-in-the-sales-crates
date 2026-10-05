// ─────────────────────────────────────────────────────────────
// Free Hip-Hop Dig Bundle (added 2026-10-05)
//
// Text and settings for the two bundle pages, read by both:
//   • src/pages/BundlePage.jsx   (what visitors see)
//   • scripts/prerender.mjs      (the static HTML crawlers read)
// Edit the words here only.
//
//   /bundle         the landing page (indexed, in the sitemap)
//   /bundle/thanks  the download page (noindex, not in the sitemap)
//
// The words under "intro" and "forYouIf" are Joe's own, from the Hip-Hop
// Dig Bundle blurb on his Linktree.
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

  title: 'Free Hip-Hop Dig Bundle',
  seoTitle: 'Free Hip-Hop Dig Bundle: Starter Guide and Wantlist | Digging in the Sales Crates',
  description:
    'A free hip-hop vinyl starter guide and wantlist for crate diggers. Get a better eye for condition and pressings, and stop overpaying for scuffed originals.',

  // The Google Drive file (zip). Shared with "anyone with the link".
  downloadUrl:
    'https://drive.google.com/file/d/1uXMsEXOpcDPgRzIxdQST5ZNhOsxG0O8M/view?usp=drive_link',

  intro: [
    "You don't need a lecture on rap history. You want to leave the shop with records you'll play, and you don't want to overpay for a scuffed OG when a clean reissue is sitting two bins over.",
  ],

  forYouHeading: 'This is for you if',
  forYouIf: [
    "You're new to hip-hop vinyl, or new to vinyl, and you want a starter pile.",
    'You dig used bins, Discogs, and shop walls, and you want a better eye for condition and pressings.',
    "You'd rather play albums than show off sealed copies.",
    'You want a simple wantlist so every dig has a point.',
  ],

  insideHeading: "What's in the bundle",
  inside: [
    { name: 'Hip-Hop Dig Guide', what: 'The starter guide, as a PDF.' },
    { name: 'Vinyl Wantlist', what: 'A spreadsheet for tracking the records you are hunting.' },
    { name: 'How to use it', what: 'A short doc that walks you through the wantlist.' },
  ],

  note: 'The brand covers more than hip-hop. This one is hip-hop. Other guides may follow. Same voice, different crates.',

  // Landing page buttons and copy
  downloadButton: 'Download the free bundle',
  signupButton: 'Join the free newsletter',
  signupButtonGated: 'Join the free newsletter and get the bundle',
  gatedPromise: "You'll land on the download page right after you sign up.",
  newsletterPitch:
    "While you're here: This Week in the Sales Crates is a free weekly email with the best record sales I find, plus the Wu-Wednesday, Sample DNA, and Throwback Thursday picks.",

  // Thanks / download page
  thanksTitle: 'Your Hip-Hop Dig Bundle',
  thanksSeoTitle: 'Your Hip-Hop Dig Bundle | Digging in the Sales Crates',
  thanksLead: "Here's the bundle:",
  thanksNote:
    "It's a zip file, so it opens best on a computer. Save this page if you want to come back to it.",
  thanksFriday:
    'Every Friday you get This Week in the Sales Crates: the best record sales I found that week, plus the Wu-Wednesday, Sample DNA, and Throwback Thursday picks.',
};
