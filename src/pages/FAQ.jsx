import { useState } from "react";
import { track, trackStoreClick, CLICK_SOURCES } from "../utils/analytics";
import useSEO from "../hooks/useSEO";
import { FAQS } from "../data/faq";

// Questions and answers live in src/data/faq.js (moved 2026-10-04) so the
// static HTML that crawlers read (scripts/prerender.mjs) shows the same
// text as this page. Edit them there, not here.
const faqs = FAQS;

function ChevronIcon({ open }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.25s ease",
        flexShrink: 0,
      }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  // Which questions people actually open. A question opened far more
  // than the rest is either a content gap on the main site or a sign
  // the answer belongs somewhere more prominent than the FAQ.
  const toggle = () => {
    if (!open) track('faq_open', { faq_question: q });
    setOpen(!open);
  };

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(245,158,11,0.15)",
      }}
    >
      <button
        onClick={toggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.25rem 0",
          textAlign: "left",
          color: open ? "#f59e0b" : "var(--text-primary)",
          transition: "color 0.2s ease",
        }}
        aria-expanded={open}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1rem",
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {q}
        </span>
        <span style={{ color: "#f59e0b" }}>
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? "500px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            color: "var(--text-primary)",
            paddingBottom: "1.25rem",
            margin: 0,
            opacity: 0.85,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  // SEO strings below are duplicated in scripts/prerender.mjs, which bakes
  // them into the static HTML crawlers receive. Keep the two in sync:
  // prerender wins for Google, this hook wins for the browser tab and GA4's
  // page_title after client-side navigation.
  useSEO({
    title: "FAQ | Digging in the Sales Crates",
    description:
      "How Digging in the Sales Crates works: searching Discogs, eBay, CDandLP, and Turntable Lab at once, affiliate links, wishlists, and more.",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        paddingBottom: "5rem",
      }}
    >
      {/* Hero */}
      <div
        style={{
          borderBottom: "1px solid rgba(245,158,11,0.2)",
          padding: "4rem 1.5rem 3rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            color: "#f59e0b",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          Got Questions?
        </p>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            color: "#fff",
            letterSpacing: "0.04em",
            lineHeight: 1,
            margin: "0 0 1.25rem",
          }}
        >
          Frequently Asked Questions
        </h1>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "1.05rem",
            color: "var(--text-primary)",
            opacity: 0.75,
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Everything you need to know about how Digging in the Sales Crates works.
          Still have a question?{" "}
          <a
            href="mailto:hello@digginginthesalescrates.com"
            onClick={() => trackStoreClick({
              storeName: 'FAQ question email',
              storeUrl: 'mailto:hello@digginginthesalescrates.com',
              clickSource: 'faq_page',
              isAffiliate: false,
            })}
            style={{ color: "#f59e0b", textDecoration: "none" }}
          >
            Drop us a line.
          </a>
        </p>
      </div>

      {/* FAQ Sections */}
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "3rem 1.5rem 0",
        }}
      >
        {faqs.map((section) => (
          <div key={section.category} style={{ marginBottom: "3rem" }}>
            {/* Category label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "0.25rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "28px",
                  height: "2px",
                  background: "#f59e0b",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1rem",
                  letterSpacing: "0.12em",
                  color: "#f59e0b",
                }}
              >
                {section.category}
              </span>
            </div>

            {/* Items */}
            <div
              style={{
                borderTop: "1px solid rgba(245,158,11,0.15)",
              }}
            >
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        {/* Footer CTA */}
        <div
          style={{
            marginTop: "1rem",
            padding: "2rem",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: "8px",
            background: "rgba(245,158,11,0.04)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.5rem",
              color: "#fff",
              letterSpacing: "0.06em",
              margin: "0 0 0.5rem",
            }}
          >
            Still have a question?
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              color: "var(--text-primary)",
              opacity: 0.75,
              margin: "0 0 1.25rem",
            }}
          >
            We're real people. Reach out anytime.
          </p>
          <a
            href="mailto:hello@digginginthesalescrates.com"
            onClick={() => trackStoreClick({
              storeName: 'FAQ question email',
              storeUrl: 'mailto:hello@digginginthesalescrates.com',
              clickSource: 'faq_page',
              isAffiliate: false,
            })}
            style={{
              display: "inline-block",
              background: "#f59e0b",
              color: "#000",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "0.05em",
              padding: "0.65rem 1.5rem",
              borderRadius: "4px",
              textDecoration: "none",
            }}
          >
            hello@digginginthesalescrates.com
          </a>
        </div>
      </div>
    </div>
  );
}
