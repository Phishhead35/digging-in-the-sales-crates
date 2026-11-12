import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { withSlash } from "../utils/withSlash";
import useSEO from "../hooks/useSEO";
import { track } from "../utils/analytics";
import { newsletterUrl } from "../components/NewsletterCta";
import { BB_DOWNLOAD as T } from "../data/breaksBibleDownload";

// ── Breaks Bible post-purchase download page (added 2026-11-12) ──
// Route: /breaks-bible/download?session_id=cs_live_...
// The Stripe payment link redirects here. This page never holds the PDF.
// It asks /api/breaks-bible/download?check=1 whether Stripe says the session
// is paid, then points one button at the same endpoint, which streams the PDF.
// All text lives in src/data/breaksBibleDownload.js.
//
// One primary button (the download). Everything else is small and below it.
// Mobile first, solid white text, amber accents (same look as BundlePage).

const AMBER = "#f59e0b";
const NEWSLETTER_URL = newsletterUrl("breaks_bible_download");

const styles = {
  page: { minHeight: "100vh", background: "#0a0a0f", paddingBottom: "4rem", color: "#fff" },
  hero: { borderBottom: "1px solid rgba(245,158,11,0.2)", padding: "2.25rem 1.25rem 1.25rem" },
  inner: { maxWidth: "672px", margin: "0 auto" },
  h1: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(2.4rem, 9vw, 4.2rem)",
    color: "#fff",
    letterSpacing: "0.03em",
    lineHeight: 0.98,
    margin: 0,
  },
  body: { maxWidth: "672px", margin: "0 auto", padding: "1.5rem 1.25rem 0" },
  lead: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1.1rem",
    lineHeight: 1.6,
    color: "#fff",
    fontWeight: 500,
    margin: "0 0 1.5rem",
  },
  button: {
    display: "block",
    width: "100%",
    maxWidth: "460px",
    boxSizing: "border-box",
    textAlign: "center",
    background: AMBER,
    color: "#0a0a0f",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontSize: "1.1rem",
    lineHeight: 1.3,
    padding: "1.05rem 1.25rem",
    borderRadius: "10px",
    textDecoration: "none",
    margin: "0 0 1.75rem",
  },
  buttonOff: {
    display: "block",
    width: "100%",
    maxWidth: "460px",
    boxSizing: "border-box",
    textAlign: "center",
    background: "rgba(245,158,11,0.18)",
    color: "#fff",
    border: "1px dashed rgba(245,158,11,0.6)",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: 1.4,
    padding: "1rem 1.25rem",
    borderRadius: "10px",
    margin: "0 0 1.75rem",
  },
  p: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    lineHeight: 1.65,
    color: "#fff",
    margin: "0 0 1.1rem",
  },
  h2: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.7rem",
    letterSpacing: "0.04em",
    color: "#fff",
    lineHeight: 1,
    margin: "1.5rem 0 0.9rem",
  },
  ul: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "1rem",
    lineHeight: 1.6,
    color: "#fff",
    margin: "0 0 1.5rem",
    padding: 0,
    listStyle: "none",
  },
  li: { margin: "0 0 0.7rem" },
  small: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    color: "#fff",
    margin: "0 0 0.7rem",
  },
  rule: { border: 0, borderTop: "1px solid rgba(245,158,11,0.2)", margin: "1.75rem 0 1.25rem" },
  link: { color: AMBER, textDecoration: "underline", textUnderlineOffset: "3px" },
};

const fill = (text, vars) =>
  text.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));

export default function BreaksBibleDownload() {
  useSEO({ title: T.seoTitle, description: T.description });

  const { search } = useLocation();
  const sessionId = new URLSearchParams(search).get("session_id") || "";

  // phase: loading | ready | pending | problem
  const [phase, setPhase] = useState(sessionId ? "loading" : "problem");
  const [problem, setProblem] = useState(sessionId ? "" : "nosession");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setPhase("problem");
      setProblem("nosession");
      return undefined;
    }
    let cancelled = false;
    setPhase("loading");
    fetch(`${T.apiPath}?check=1&session_id=${encodeURIComponent(sessionId)}`, {
      cache: "no-store",
    })
      .then(async (res) => {
        let data = null;
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
        if (cancelled) return;
        if (res.ok && data && (data.status === "ready" || data.status === "pending")) {
          setEmail(data.email || "");
          setPhase(data.status);
          return;
        }
        setPhase("problem");
        if (res.status === 402) setProblem("notpaid");
        else if (res.status === 400 || res.status === 403 || res.status === 404) setProblem("notfound");
        else setProblem("trouble");
      })
      .catch(() => {
        if (cancelled) return;
        setPhase("problem");
        setProblem("trouble");
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const vars = { email, support: T.supportEmail };
  const support = (
    <a href={`mailto:${T.supportEmail}`} style={styles.link}>
      {T.supportEmail}
    </a>
  );

  // Swap {support} for a real mailto link inside a sentence.
  const withSupport = (text) => {
    const parts = fill(text, { ...vars, support: "\u0000" }).split("\u0000");
    return parts.flatMap((part, i) => (i < parts.length - 1 ? [part, React.cloneElement(support, { key: i })] : [part]));
  };

  const onDownload = () => track("breaks_bible_download", { click_source: "breaks_bible_download_page" });

  // ── Could not confirm the purchase ──
  if (phase === "problem") {
    return (
      <div style={styles.page}>
        <header style={styles.hero}>
          <div style={styles.inner}>
            <h1 style={styles.h1}>{T.problemTitle}</h1>
          </div>
        </header>
        <main style={styles.body}>
          <p style={styles.lead}>{withSupport(T.problems[problem] || T.problems.trouble)}</p>
        </main>
      </div>
    );
  }

  const downloadHref = `${T.apiPath}?session_id=${encodeURIComponent(sessionId)}`;
  const receiptText = email ? T.receipt : T.receiptNoEmail;

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.inner}>
          <h1 style={styles.h1}>{T.title}</h1>
        </div>
      </header>

      <main style={styles.body}>
        <p style={styles.lead}>{T.lead}</p>

        {phase === "ready" ? (
          <a href={downloadHref} onClick={onDownload} style={styles.button}>
            {T.downloadButton}
          </a>
        ) : (
          <div style={styles.buttonOff} role="button" aria-disabled="true">
            {phase === "pending" ? T.pendingButton : T.checkingButton}
          </div>
        )}

        <h2 style={styles.h2}>{T.insideHeading}</h2>
        <ul style={styles.ul}>
          {T.inside.map((item) => (
            <li key={item} style={styles.li}>{item}</li>
          ))}
        </ul>

        <p style={styles.p}>{withSupport(receiptText)}</p>

        <hr style={styles.rule} />

        <p style={styles.small}>
          {T.newsletterLine}
          <a href={NEWSLETTER_URL} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {T.newsletterLink}
          </a>
          .
        </p>
        <p style={styles.small}>
          {T.searchLine}
          <Link to={withSlash("/")} style={styles.link}>{T.searchLink}</Link>.
        </p>
        <p style={styles.small}>
          {T.bookSiteLine}
          <a href={T.bookSiteUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
            {T.bookSiteLabel}
          </a>
        </p>
        <p style={{ ...styles.small, marginTop: "1.25rem", fontSize: "0.8rem" }}>
          {withSupport(T.refund)}
        </p>
      </main>
    </div>
  );
}
