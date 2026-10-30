// ── "Partner With Us" page copy (/featured-partners) ──────────
// One copy of the words, read by two places: src/pages/FeaturedPartners.jsx
// (what visitors see) and scripts/prerender.mjs (what crawlers see). Edit
// the text here and both follow. Plain ESM, no imports, so Node can load it
// at build time.
//
// FACTS THAT AGE (check these before relying on the page):
//   - "679,000 views in the last 90 days" is Joe's number from 2026-10-29.
//     It is a video-view count, not a count of people or site visitors. When
//     it gets old, update it here or drop the sentence.
//   - The monthly click report is a promise. It is backed by GA4 store_click
//     events by store_name; someone has to actually send it each month.
//   - The video-visit area (MA, RI, southern NH, southern Maine) is Joe's
//     stated travel limit as of 2026-10-29.
//
// Deliberately NOT claimed: that videos never push big-box links (Amazon
// links do run in Facebook videos), that DITSC takes no cut (the Planet
// Records eBay store button earns a commission), or any number of
// "collectors" or site visitors.
//
// THE APPLICATION is a Google Form (formUrl below), opened in a new tab.
// Responses go to the DITSC Gmail and to a linked Google Sheet. An in-page
// form was tried first: a mailto: form failed on machines with no default
// mail app, and Formspree's verification email never arrived (2026-10-29).
// Keep the form's access set to "Anyone", with no sign-in required, or store
// owners without a Google account hit an access-denied page.

export const PARTNER_PAGE = {
  path: '/featured-partners',
  seoTitle: 'List Your Record Store | Digging in the Sales Crates',
  description:
    'Get your independent record store listed on Digging in the Sales Crates. Free while we build the directory. Our videos pulled 679,000 views in the last 90 days.',

  eyebrow: 'FOR RECORD STORES',
  title: 'Get your shop in front of people who buy records',
  lead:
    'Our videos pulled 679,000 views in the last 90 days. The people watching are hunting for records, and our site sends them to independent shops. Listing your shop is free.',

  stepsHeading: 'How it works',
  steps: [
    { title: 'Apply', text: 'Fill out the short application. It takes two minutes.' },
    {
      title: 'We take a look',
      text: "We check that you're a real shop with real stock and fair grading. If you are, you're in.",
    },
    {
      title: 'You get listed',
      text: 'Your shop goes on our Partner Shops page with its location, what you carry, and links to your website and Discogs store.',
    },
  ],

  getHeading: 'What you get',
  gets: [
    'A listing on the Partner Shops page, with a link of its own that you can share and put on your own site.',
    'A spot in the rotation of shops we show next to search results and on artist pages.',
    'A monthly count of the clicks we sent to your shop.',
    'A chance to be featured in a video (see below).',
  ],

  costHeading: 'What it costs',
  cost:
    "Nothing. Listing is free while we build the directory. If that ever changes, we'll tell you first, and no one gets charged without saying yes.",

  honestHeading: "What we can't promise",
  honest:
    "We're a small site, and we won't promise you sales. What we can promise is a real page for your shop and a count of the clicks we send you, so you can see for yourself what it's worth.",

  videoHeading: 'Shop visits',
  video:
    "We like to feature shops on camera when we can get there. We don't travel far, so visits are limited to Massachusetts, Rhode Island, southern New Hampshire, and southern Maine. If your shop is outside that area, you can still be listed.",

  applyHeading: 'Apply to be listed',
  applyIntro:
    'The application is a short form: your shop, where it is, your links, and what you carry. We read every one and write back by email.',
  formUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSdvMqamfLcDRnWXCocudKKJQmWoRqXaHT4BtObeMnAGe77Z-w/viewform',
  applyButtonLabel: 'Fill out the application',
  applyButtonNote: 'Opens in a new tab.',

  email: 'hello@digginginthesalescrates.com',
  emailFallbackLead: 'Prefer to write it yourself? Email',
  emailCopyNote: "If the link doesn't open your email, copy the address.",
};
