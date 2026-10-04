import React from "react";
import { Link } from "react-router-dom";
import useSEO from "../hooks/useSEO";
import { trackNewsletterClick, CLICK_SOURCES } from "../utils/analytics";
import { newsletterUrl } from "../components/NewsletterCta";
import { GUIDES } from "../data/guides";

// ── Guide pages (added 2026-10-03) ─────────────────────────────
// One component renders every guide in src/data/guides.js. The text lives
// only in that data file, which scripts/prerender.mjs also reads, so the
// crawler HTML and this page always say the same thing.
//
// Styling follows About.jsx: Bebas headline, DM Sans body, solid white
// text (no muted grays), amber links.

const AMBER = "#f59e0b";

// utm_medium=guide separates guide-page signups in beehiiv.
const NEWSLETTER_URL = newsletterUrl("guide");

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    paddingBottom: "5rem",
    color: "#fff",
  },
  hero: {
    borderBottom: "1px solid rgba(245,158,11,0.2)",
    padding: "4rem 1.5rem 2.5rem",
  },
  heroInner: {
    maxWidth: "672px",
    margin: "0 auto",
  },
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
  body: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "2.5rem 1.5rem 0",
  },
  p: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1.05rem",
    lineHeight: 1.75,
    color: "#fff",
    margin: "0 0 1.25rem",
  },
  lead: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1.2rem",
    lineHeight: 1.65,
    color: "#fff",
    fontWeight: 500,
    margin: "0 0 1.5rem",
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
  link: {
    color: AMBER,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  },
  cta: {
    display: "inline-block",
    marginTop: "1rem",
    background: AMBER,
    color: "#0a0a0f",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "0.95rem",
    padding: "0.8rem 1.4rem",
    borderRadius: "8px",
    textDecoration: "none",
  },
};

// Renders one "part": plain text, an internal link, or the newsletter link.
function Part({ part, slug }) {
  if (typeof part === "string") return part;
  if (part.newsletter) {
    return (
      <a
        href={NEWSLETTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
        // post_slug carries the guide slug here, so GA4 shows which guide
        // the signup click came from.
        onClick={() => trackNewsletterClick(CLICK_SOURCES.GUIDE_PAGE, slug)}
      >
        {part.text}
      </a>
    );
  }
  return (
    <Link to={part.href} style={styles.link}>
      {part.text}
    </Link>
  );
}

function Parts({ parts, slug }) {
  return parts.map((part, i) => <Part key={i} part={part} slug={slug} />);
}

export default function GuidePage({ slug }) {
  const guide = GUIDES.find((g) => g.slug === slug);

  // SEO strings come from src/data/guides.js, the same values prerender.mjs
  // bakes into the static HTML.
  useSEO({
    title: guide ? guide.seoTitle : "Digging in the Sales Crates",
    description: guide ? guide.description : "",
  });

  if (!guide) return null;

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <p style={styles.kicker}>Crate Digging Guide</p>
          <h1 style={styles.h1}>{guide.title}</h1>
        </div>
      </header>

      <main style={styles.body}>
        {guide.blocks.map((block, i) => {
          if (block.type === "ul") {
            return (
              <ul key={i} style={styles.ul}>
                {block.items.map((item, j) => (
                  <li key={j} style={styles.li}>
                    <Parts parts={item} slug={guide.slug} />
                  </li>
                ))}
              </ul>
            );
          }
          // The first paragraph is the answer, so it gets a little more weight.
          return (
            <p key={i} style={i === 0 ? styles.lead : styles.p}>
              <Parts parts={block.parts} slug={guide.slug} />
            </p>
          );
        })}

        <Link to="/search" style={styles.cta}>
          Start a search
        </Link>
      </main>
    </div>
  );
}
