import React from "react";
import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import { track, trackNewsletterClick, CLICK_SOURCES } from "../utils/analytics";
import { newsletterUrl } from "../components/NewsletterCta";
import { BUNDLE, SIGNUP_REDIRECT_CONFIRMED } from "../data/bundle";

// ── Free Hip-Hop Dig Bundle pages (added 2026-10-05) ───────────
// One component, two modes:
//   <BundlePage />                the landing page at /bundle
//   <BundlePage mode="thanks" />  the download page at /bundle/thanks
// All text lives in src/data/bundle.js, which scripts/prerender.mjs also
// reads, so the HTML crawlers see always matches this page.
//
// Styling follows About.jsx and GuidePage.jsx: solid white text (no muted
// grays), amber accents.

const AMBER = "#f59e0b";

// utm_medium=bundle separates bundle signups from every other placement
// in beehiiv.
const NEWSLETTER_URL = newsletterUrl("bundle");

const styles = {
  page: { minHeight: "100vh", background: "#0a0a0f", paddingBottom: "5rem", color: "#fff" },
  hero: { borderBottom: "1px solid rgba(245,158,11,0.2)", padding: "4rem 1.5rem 2.5rem" },
  heroInner: { maxWidth: "672px", margin: "0 auto" },
  kicker: {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    color: AMBER,
    textTransform: "uppercase",
    margin: "0 0 1rem",
  },
  h1: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(2.6rem, 8vw, 5rem)",
    color: "#fff",
    letterSpacing: "0.03em",
    lineHeight: 0.95,
    margin: 0,
  },
  body: { maxWidth: "720px", margin: "0 auto", padding: "2.5rem 1.5rem 0" },
  lead: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1.2rem",
    lineHeight: 1.65,
    color: "#fff",
    fontWeight: 500,
    margin: "0 0 1.5rem",
  },
  p: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1.05rem",
    lineHeight: 1.75,
    color: "#fff",
    margin: "0 0 1.25rem",
  },
  h2: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(1.6rem, 4vw, 2.1rem)",
    letterSpacing: "0.04em",
    color: "#fff",
    lineHeight: 1,
    margin: "2.5rem 0 1rem",
  },
  ul: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1.05rem",
    lineHeight: 1.7,
    color: "#fff",
    margin: "0 0 1.5rem",
    paddingLeft: "1.25rem",
  },
  li: { margin: "0 0 0.6rem" },
  button: {
    display: "inline-block",
    background: AMBER,
    color: "#0a0a0f",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "1rem",
    padding: "0.9rem 1.6rem",
    borderRadius: "8px",
    textDecoration: "none",
    margin: "0.5rem 0.75rem 0.5rem 0",
  },
  buttonOutline: {
    display: "inline-block",
    background: "transparent",
    color: AMBER,
    border: `1px solid ${AMBER}`,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "0.8rem 1.5rem",
    borderRadius: "8px",
    textDecoration: "none",
    margin: "0.5rem 0.75rem 0.5rem 0",
  },
  card: {
    border: "1px solid rgba(245,158,11,0.3)",
    background: "rgba(245,158,11,0.05)",
    borderRadius: "10px",
    padding: "1.25rem 1.4rem",
    margin: "2rem 0 1rem",
  },
  link: { color: AMBER, textDecoration: "underline", textUnderlineOffset: "3px" },
};

export default function BundlePage({ mode = "landing" }) {
  const thanks = mode === "thanks";

  // SEO strings match src/data/bundle.js, which prerender.mjs bakes into the
  // static HTML crawlers receive.
  useSEO({
    title: thanks ? BUNDLE.thanksSeoTitle : BUNDLE.seoTitle,
    description: thanks ? "Download the free Hip-Hop Dig Bundle." : BUNDLE.description,
  });

  const onSignup = () => trackNewsletterClick(CLICK_SOURCES.BUNDLE_PAGE);
  const onDownload = () =>
    track("bundle_download", { click_source: thanks ? "bundle_thanks" : "bundle_page" });

  const signupLink = (label) => (
    <a
      href={NEWSLETTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onSignup}
      style={styles.button}
    >
      {label}
    </a>
  );

  // ── Download page ───────────────────────────────────────────
  if (thanks) {
    return (
      <div style={styles.page}>
        <header style={styles.hero}>
          <div style={styles.heroInner}>
            <p style={styles.kicker}>Free download</p>
            <h1 style={styles.h1}>{BUNDLE.thanksTitle}</h1>
          </div>
        </header>
        <main style={styles.body}>
          <p style={styles.lead}>{BUNDLE.thanksLead}</p>
          <a
            href={BUNDLE.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDownload}
            style={styles.button}
          >
            {BUNDLE.downloadButton}
          </a>
          <p style={styles.p}>{BUNDLE.thanksNote}</p>
          <p style={styles.p}>{BUNDLE.thanksFriday}</p>
          {!SIGNUP_REDIRECT_CONFIRMED && signupLink(BUNDLE.signupButton)}
          <p style={{ ...styles.p, marginTop: "1.5rem" }}>
            <Link to="/search" style={styles.link}>
              Search Discogs, eBay, CDandLP, and Turntable Lab at once
            </Link>
          </p>
        </main>
      </div>
    );
  }

  // ── Landing page ────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.kicker}>Free for crate diggers</p>
          <h1 style={styles.h1}>{BUNDLE.title}</h1>
        </div>
      </header>

      <main style={styles.body}>
        {BUNDLE.intro.map((text, i) => (
          <p key={i} style={styles.lead}>{text}</p>
        ))}

        <h2 style={styles.h2}>{BUNDLE.forYouHeading}</h2>
        <ul style={styles.ul}>
          {BUNDLE.forYouIf.map((text) => (
            <li key={text} style={styles.li}>{text}</li>
          ))}
        </ul>

        <h2 style={styles.h2}>{BUNDLE.insideHeading}</h2>
        <ul style={styles.ul}>
          {BUNDLE.inside.map((item) => (
            <li key={item.name} style={styles.li}>
              <strong>{item.name}</strong>: {item.what}
            </li>
          ))}
        </ul>

        <p style={styles.p}>{BUNDLE.note}</p>

        {SIGNUP_REDIRECT_CONFIRMED ? (
          <div style={styles.card}>
            {signupLink(BUNDLE.signupButtonGated)}
            <p style={{ ...styles.p, margin: "0.5rem 0 0" }}>{BUNDLE.gatedPromise}</p>
          </div>
        ) : (
          <>
            <Link to={BUNDLE.thanksPath} style={styles.button}>
              {BUNDLE.downloadButton}
            </Link>
            <div style={styles.card}>
              <p style={{ ...styles.p, margin: "0 0 0.75rem" }}>{BUNDLE.newsletterPitch}</p>
              {signupLink(BUNDLE.signupButton)}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
