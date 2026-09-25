import React from "react";
import { Link } from "react-router-dom";
import { track } from "../utils/analytics";
import useSEO from "../hooks/useSEO";

// ── Links waiting on setup ─────────────────────────────────────
// Paste the WEBSITE Beehiiv signup link here (its own form/source,
// separate from the social-platform forms, so site signups are
// attributed on their own). While empty, the newsletter button
// does not render, so this page can ship before the forms exist.
const NEWSLETTER_URL = "";

// Buy Me a Coffee page. Same rule: empty means the support block
// is hidden entirely.
const SUPPORT_URL = "";

// Where the family record collections came from. Order here is the
// order the cards render.
const EARLY_CRATES = [
  {
    who: "Mom's records",
    what: "Jazz, R&B, soul, and funk, with plenty of Beatles in the rotation.",
  },
  {
    who: "My uncle's records",
    what: "He DJed on his college radio station, so through him I heard a lot of 80s new wave, punk, and metal.",
  },
  {
    who: "Dad's records",
    what: "Prog rock and classic rock. King Crimson, Frank Zappa (still not sure what genre he really belongs in), and a steady run of the classics.",
  },
];

const AMBER = "#f59e0b";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    paddingBottom: "5rem",
    color: "#fff",
  },
  hero: {
    borderBottom: "1px solid rgba(245,158,11,0.2)",
    padding: "4rem 1.5rem 3rem",
  },
  heroInner: {
    // 672 = the body column's 720px minus its 24px side padding, so the
    // headline lines up with the paragraphs below it.
    maxWidth: "672px",
    margin: "0 auto",
  },
  h1: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(3rem, 9vw, 6rem)",
    color: "#fff",
    letterSpacing: "0.03em",
    lineHeight: 0.95,
    margin: "0 0 1.25rem",
  },
  mission: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "clamp(1.15rem, 2.6vw, 1.4rem)",
    lineHeight: 1.5,
    color: AMBER,
    margin: 0,
    fontWeight: 500,
  },
  body: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "3rem 1.5rem 0",
  },
  h2: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
    letterSpacing: "0.04em",
    color: "#fff",
    lineHeight: 1,
    margin: "3rem 0 1rem",
  },
  p: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1.05rem",
    lineHeight: 1.75,
    color: "#fff",
    margin: "0 0 1.25rem",
  },
  crateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: "1rem",
    margin: "1.75rem 0 0.5rem",
  },
  crate: {
    borderTop: `3px solid ${AMBER}`,
    background: "rgba(245,158,11,0.05)",
    padding: "1.1rem 1.1rem 1.25rem",
    borderRadius: "0 0 6px 6px",
  },
  crateWho: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.35rem",
    letterSpacing: "0.05em",
    color: AMBER,
    margin: "0 0 0.4rem",
  },
  crateWhat: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: "#fff",
    margin: 0,
  },
  inlineLink: {
    color: AMBER,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },
  ctaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    margin: "1.5rem 0 0",
  },
  buttonSolid: {
    display: "inline-block",
    background: AMBER,
    color: "#0a0a0f",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "0.95rem",
    padding: "0.8rem 1.4rem",
    borderRadius: "8px",
    textDecoration: "none",
  },
  buttonOutline: {
    display: "inline-block",
    background: "transparent",
    color: AMBER,
    border: `1px solid ${AMBER}`,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "0.95rem",
    padding: "0.8rem 1.4rem",
    borderRadius: "8px",
    textDecoration: "none",
  },
  signoff: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.6rem",
    letterSpacing: "0.05em",
    color: "#fff",
    margin: "3rem 0 0",
  },
};

export default function About() {
  // SEO strings below are duplicated in scripts/prerender.mjs, which bakes
  // them into the static HTML crawlers receive (plus the AboutPage/Person
  // JSON-LD). Keep the two in sync.
  useSEO({
    title: "About | Digging in the Sales Crates",
    description:
      "Why Joe Nicholas built Digging in the Sales Crates: 30 years of collecting records, too many browser tabs, and a free search across Discogs, eBay, CDandLP, and Turntable Lab.",
  });

  const onNewsletter = () =>
    track("newsletter_click", { click_source: "about_page", destination: NEWSLETTER_URL });
  const onSupport = () =>
    track("support_click", { click_source: "about_page", destination: SUPPORT_URL });

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.h1}>About Digging in the Sales Crates</h1>
          <p style={styles.mission}>Every record has a story. Let's hear this one.</p>
        </div>
      </header>

      <main style={styles.body}>
        <p style={styles.p}>
          I'm Joe Nicholas, and I've been collecting records for almost 30 years. Before that
          it was CDs. I got into vinyl because I wanted to learn how to DJ and make beats. I
          never really learned either one, but I stayed for the sound. Records have a warmth
          that CDs always missed.
        </p>
        <p style={styles.p}>
          The music was around long before I started buying it. Three collections shaped what
          I listen to, and probably why this site covers so much ground.
        </p>

        <div style={styles.crateGrid}>
          {EARLY_CRATES.map((c) => (
            <div key={c.who} style={styles.crate}>
              <p style={styles.crateWho}>{c.who}</p>
              <p style={styles.crateWhat}>{c.what}</p>
            </div>
          ))}
        </div>

        <h2 style={styles.h2}>Why I built it</h2>
        <p style={styles.p}>
          I wanted as many sellers as possible in front of me when I searched for a record.
          Instead I was jumping between browser tabs, checking one site, then the next, then
          the next. So I built a search that pulled the sites I used most into one place.
          Then it hit me that I probably wasn't the only person who hated doing this, so I
          built a website around it.
        </p>
        <p style={styles.p}>
          Today one{" "}
          <Link to="/aggregator" style={styles.inlineLink}>
            search
          </Link>{" "}
          checks Discogs, eBay, CDandLP, and Turntable Lab at the same time.
        </p>

        <h2 style={styles.h2}>More than a search box</h2>
        <p style={styles.p}>
          Along the way DITSC grew into something bigger than price comparison. I make videos
          and write articles about the stories behind the records: where a sample came from,
          who flipped it, and why a reissue matters. Plenty of sites can tell you what a
          record is and what it costs. I want to tell you why it's worth owning. You can
          find all of it on{" "}
          <Link to="/watch-read" style={styles.inlineLink}>
            Watch &amp; Read
          </Link>
          .
        </p>

        <h2 style={styles.h2}>Free, no sign-up</h2>
        <p style={styles.p}>
          The search tool and everything on this site are free, with no account needed. If
          you want the stories delivered, <em>This Week in the Sales Crates</em> is a free
          weekly newsletter. It covers the week's Wu-Wednesday, Sample DNA, and Throwback
          Thursday picks, plus the best sales I've spotted from record stores. It's optional;
          the site works exactly the same whether you subscribe or not.
        </p>
        <p style={styles.p}>
          Some store links earn a small commission, which never changes what shows up or what
          order it shows up in.
        </p>

        {(NEWSLETTER_URL || SUPPORT_URL) && (
          <div style={styles.ctaRow}>
            {NEWSLETTER_URL && (
              <a
                href={NEWSLETTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onNewsletter}
                style={styles.buttonSolid}
              >
                Get the free newsletter
              </a>
            )}
            {SUPPORT_URL && (
              <a
                href={SUPPORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onSupport}
                style={styles.buttonOutline}
              >
                Buy me a coffee
              </a>
            )}
          </div>
        )}

        {SUPPORT_URL && (
          <p style={{ ...styles.p, marginTop: "1rem", fontSize: "0.95rem" }}>
            Support is optional and never required. Every contribution helps cover the site
            and put more records in the crates for future videos and stories.
          </p>
        )}

        <p style={styles.signoff}>See you in the crates.</p>
        <p style={styles.p}>
          Questions or a record story of your own?{" "}
          <a href="mailto:hello@digginginthesalescrates.com" style={styles.inlineLink}>
            hello@digginginthesalescrates.com
          </a>
        </p>
      </main>
    </div>
  );
}
