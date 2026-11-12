// ─────────────────────────────────────────────────────────────
// Breaks Bible post-purchase download page (added 2026-11-12)
//
// Text and settings for /breaks-bible/download, read by both:
//   • src/pages/BreaksBibleDownload.jsx   (what buyers see)
//   • scripts/prerender.mjs               (the static HTML shell)
// Edit the words here only.
//
// The page is noindex and out of the sitemap. The Stripe payment link sends
// buyers here with ?session_id={CHECKOUT_SESSION_ID} on the end. The page asks
// functions/api/breaks-bible/download.js to check that session with Stripe,
// and the PDF only streams from that function. The PDF is NOT in public/.
//
// Plain ESM, no JSX: prerender.mjs imports this with Node.
// ─────────────────────────────────────────────────────────────

export const BB_DOWNLOAD = {
  path: '/breaks-bible/download',
  apiPath: '/api/breaks-bible/download',

  supportEmail: 'hello@digginginthesalescrates.com',
  bookSiteUrl: 'https://thebreaksbible.com',
  bookSiteLabel: 'thebreaksbible.com',

  seoTitle: 'Your Breaks Bible | Digging in the Sales Crates',
  description: 'Download your copy of The Breaks Bible.',

  title: 'Your Breaks Bible is here. 🎺',
  lead:
    "Thanks for grabbing it. Here's your full guide: the 100 most-sampled breaks every crate digger should know. Original record, who sampled it, which pressing to hunt, what to pay. Download it below and keep it forever.",

  downloadButton: '⬇ Download The Breaks Bible (PDF)',
  checkingButton: 'Checking your purchase...',
  pendingButton: "PDF drops at launch. We'll email you the moment it's ready.",

  insideHeading: "What's inside",
  inside: [
    '🎵 The original record: artist, title, year, label for every break',
    '🎛️ Who sampled it and on what track',
    "💿 Which pressing to hunt, and what's actually a fair price",
    '🔎 One digging tip per entry, from years in the crates',
  ],

  // {email} is replaced with the address on the Stripe receipt. If Stripe
  // did not return one, receiptNoEmail is shown instead.
  receipt:
    "Your receipt went to {email}. If the PDF doesn't start downloading, check spam or email {support}.",
  receiptNoEmail:
    "If the PDF doesn't start downloading, check spam or email {support}.",

  newsletterLine: 'Weekly deals and new digs: ',
  newsletterLink: 'join the newsletter',
  searchLine: 'While you wait: ',
  searchLink: 'compare pressing prices on the site',
  bookSiteLine: 'The Breaks Bible home: ',

  refund: 'Changed your mind? Email {support} within 14 days and we will refund you.',

  // Shown when the purchase cannot be confirmed (headline replaces `title`).
  problemTitle: "Let's find your Breaks Bible.",
  problems: {
    nosession:
      "This page needs the link you were sent right after paying. Go back to your payment confirmation and tap the button there, or email {support} and we'll sort it out.",
    notfound:
      "We couldn't match this page to a purchase. Email {support} with the address you paid with and we'll send it over.",
    notpaid:
      "Your payment hasn't gone through yet. If you were charged, email {support} and we'll fix it.",
    limit:
      'This purchase has hit the download limit. Email {support} and we will send you a fresh copy.',
    trouble:
      'Something went wrong on our end. Refresh the page in a minute, or email {support} and we will send the PDF by hand.',
  },
};
