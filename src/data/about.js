// ─────────────────────────────────────────────────────────────
// DITSC About page content (moved here from About.jsx 2026-10-04)
//
// One copy of the About text, read by both:
//   • src/pages/About.jsx      (what visitors see)
//   • scripts/prerender.mjs    (the static HTML crawlers read)
// Before this, prerender.mjs kept a shorter summary of the bio, so
// crawlers and AI assistants saw less than visitors did. Edit the text
// here only.
//
// Paragraph text is an array of "parts". A part is one of:
//   'plain text'
//   { href: '/search', text: '...' }   internal link
//   { em: '...' }                      italic text
//
// Plain ESM, no JSX: prerender.mjs imports this with Node.
// ─────────────────────────────────────────────────────────────

export const ABOUT = {
  title: 'About Digging in the Sales Crates',
  mission: "Every record has a story. Let's hear this one.",

  intro: [
    [
      "I'm Joe Nicholas, and I've been collecting records for almost 30 years. Before that it was CDs. I got into vinyl because I wanted to learn how to DJ and make beats. I never really learned either one, but I stayed for the sound. Records have a warmth that CDs always missed.",
    ],
    [
      'The music was around long before I started buying it. Three collections shaped what I listen to, and probably why this site covers so much ground.',
    ],
  ],

  // Where the family record collections came from. Order here is the
  // order the cards render.
  crates: [
    {
      who: "Mom's records",
      what: 'Jazz, R&B, soul, and funk, with plenty of Beatles in the rotation.',
    },
    {
      who: "My uncle's records",
      what: 'He DJed on his college radio station, so through him I heard a lot of 80s new wave, punk, and metal.',
    },
    {
      who: "Dad's records",
      what: 'Prog rock and classic rock. King Crimson, Frank Zappa (still not sure what genre he really belongs in), and a steady run of the classics.',
    },
  ],

  sections: [
    {
      heading: 'Why I built it',
      paragraphs: [
        [
          "I wanted as many sellers as possible in front of me when I searched for a record. Instead I was jumping between browser tabs, checking one site, then the next, then the next. So I built a search that pulled the sites I used most into one place. Then it hit me that I probably wasn't the only person who hated doing this, so I built a website around it.",
        ],
        [
          'Today one ',
          { href: '/search', text: 'search' },
          ' checks Discogs, eBay, CDandLP, and Turntable Lab at the same time.',
        ],
      ],
    },
    {
      heading: 'More than a search box',
      paragraphs: [
        [
          "Along the way DITSC grew into something bigger than price comparison. I make videos and write articles about the stories behind the records: where a sample came from, who flipped it, and why a reissue matters. Plenty of sites can tell you what a record is and what it costs. I want to tell you why it's worth owning. You can find all of it on ",
          { href: '/watch-read', text: 'Watch & Read' },
          '.',
        ],
      ],
    },
    {
      heading: 'Free, no sign-up',
      paragraphs: [
        [
          'The search tool and everything on this site are free, with no account needed. If you want the stories delivered, ',
          { em: 'This Week in the Sales Crates' },
          " is a free weekly newsletter. It covers the week's Wu-Wednesday, Sample DNA, and Throwback Thursday picks, plus the best sales I've spotted from record stores. It's optional; the site works exactly the same whether you subscribe or not.",
        ],
        [
          'Some store links earn a small commission, which never changes what shows up or what order it shows up in.',
        ],
      ],
    },
  ],

  signoff: 'See you in the crates.',
  contactLead: 'Questions or a record story of your own?',
  email: 'hello@digginginthesalescrates.com',
};
