import React from "react";
import { Link } from "react-router-dom";
import { withSlash } from "../utils/withSlash";
import { track, trackNewsletterClick, CLICK_SOURCES } from "../utils/analytics";
import useSEO from "../hooks/useSEO";
import { newsletterUrl } from "../components/NewsletterCta";
import { ABOUT } from "../data/about";

// ── Links waiting on setup ─────────────────────────────────────
// Built by the shared helper in src/components/NewsletterCta.jsx, so
// the beehiiv address lives in one place. utm_medium=about separates
// About-page signups from the blog, footer and other placements in
// beehiiv. Set to "" to hide the button.
const NEWSLETTER_URL = newsletterUrl("about");

// Buy Me a Coffee page. Same rule: empty means the support block
// is hidden entirely.
const SUPPORT_URL = "";

// Page text (bio, the three family crates, section copy) lives in
// src/data/about.js since 2026-10-04, so the static HTML crawlers read
// (scripts/prerender.mjs) carries the full bio, not a shorter summary.
// Edit the words there; layout and styling stay here.

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

// Renders one paragraph's "parts": plain text, an internal link, or italics.
function Parts({ parts }) {
  return parts.map((part, i) => {
    if (typeof part === "string") return <React.Fragment key={i}>{part}</React.Fragment>;
    if (part.em) return <em key={i}>{part.em}</em>;
    return (
      <Link key={i} to={withSlash(part.href)} style={styles.inlineLink}>
        {part.text}
      </Link>
    );
  });
}

export default function About() {
  // SEO strings below are duplicated in scripts/prerender.mjs, which bakes
  // them into the static HTML crawlers receive (plus the AboutPage/Person
  // JSON-LD). Keep the two in sync.
  useSEO({
    title: "About | Digging in the Sales Crates",
    description:
      "Why Joe Nicholas built Digging in the Sales Crates: 30 years of collecting records, too many browser tabs, and a free search across Discogs, eBay, CDandLP, and Turntable Lab.",
  });

  // Same newsletter_signup_click event every other placement fires, so
  // all newsletter clicks report together in GA4.
  const onNewsletter = () => trackNewsletterClick(CLICK_SOURCES.ABOUT);
  const onSupport = () =>
    track("support_click", { click_source: "about_page", destination: SUPPORT_URL });

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.h1}>{ABOUT.title}</h1>
          <p style={styles.mission}>{ABOUT.mission}</p>
        </div>
      </header>

      <main style={styles.body}>
        {ABOUT.intro.map((parts, i) => (
          <p key={i} style={styles.p}>
            <Parts parts={parts} />
          </p>
        ))}

        <div style={styles.crateGrid}>
          {ABOUT.crates.map((c) => (
            <div key={c.who} style={styles.crate}>
              <p style={styles.crateWho}>{c.who}</p>
              <p style={styles.crateWhat}>{c.what}</p>
            </div>
          ))}
        </div>

        {ABOUT.sections.map((section) => (
          <React.Fragment key={section.heading}>
            <h2 style={styles.h2}>{section.heading}</h2>
            {section.paragraphs.map((parts, i) => (
              <p key={i} style={styles.p}>
                <Parts parts={parts} />
              </p>
            ))}
          </React.Fragment>
        ))}

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

        <p style={styles.signoff}>{ABOUT.signoff}</p>
        <p style={styles.p}>
          {ABOUT.contactLead}{" "}
          <a href={`mailto:${ABOUT.email}`} style={styles.inlineLink}>
            {ABOUT.email}
          </a>
        </p>
      </main>
    </div>
  );
}
