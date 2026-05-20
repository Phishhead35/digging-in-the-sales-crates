import { useState } from "react";

const faqs = [
  {
    category: "ABOUT THE SITE",
    items: [
      {
        q: "What is Digging in the Sales Crates?",
        a: "Digging in the Sales Crates is a free vinyl price aggregator. You search for a record once and we pull live listings from Discogs, eBay, and CDandLP at the same time, so you can compare prices across all three without jumping between tabs. The tagline says it best: Taking the Dig Out of Digging."
      },
      {
        q: "Can I buy records directly on this site?",
        a: "No. We don't sell records. When you find a listing you like, you click through to the retailer (Discogs, eBay, or CDandLP) and buy it there. We're the finder, not the seller."
      },
      {
        q: "Is it free to use?",
        a: "Yes, completely free. No account required, no paywalls, no subscription. Just search and dig."
      },
      {
        q: "How does the price aggregator work?",
        a: "When you search for a record, we query Discogs, eBay, and CDandLP simultaneously and display the results in one place. Listings are live and pulled in real time from each platform. Prices, conditions, and availability are exactly what those sellers are showing right now."
      },
      {
        q: "Where do the prices come from?",
        a: "Directly from the source platforms via their APIs. Discogs, eBay, and CDandLP each supply their own listing data. We don't set or alter any prices."
      },
    ]
  },
  {
    category: "SEARCHING & RESULTS",
    items: [
      {
        q: "Why are some records missing from one platform but not another?",
        a: "Each platform has its own seller base and inventory. If a record shows up on Discogs but not eBay, it just means no one currently has it listed there. Availability changes constantly as sellers list and sell."
      },
      {
        q: "Can I filter results by condition or format?",
        a: "Yes. On the search results page you can filter by source platform (Discogs, eBay, CDandLP), and results display the condition grade listed by each seller. More filter options are on the roadmap."
      },
      {
        q: "Can I save records I'm hunting for?",
        a: "Yes. You can add records to your Wishlist and come back to them. The Wishlist lives in your browser, so no account is needed."
      },
    ]
  },
  {
    category: "FEATURED STORES",
    items: [
      {
        q: "What are the Featured Partner stores?",
        a: "Independent record stores we've hand-selected and highlighted on the site. These are real brick-and-mortar shops (mostly New England-based) that sell online through Discogs, eBay, or their own sites. We spotlight them because we believe in supporting local shops, not just the big platforms."
      },
      {
        q: "I own a record store. How do I get listed?",
        a: "Reach out to us at hello@digginginthesalescrates.com. We feature independent shops that sell online through Discogs, eBay, or their own site. There's no cost to be listed. We're building out the partner program now and would love to hear from you."
      },
      {
        q: "Do featured stores pay to be on the site?",
        a: "Not right now. The current Featured Partners program is free. We're focused on building a great directory of independent shops first."
      },
    ]
  },
  {
    category: "DEALS & ALERTS",
    items: [
      {
        q: "What's on the Deals page?",
        a: "Curated affiliate store links to places we trust, including partner shops with online storefronts. If you want to browse rather than search for a specific record, that's a good place to start."
      },
      {
        q: "Can I set up price alerts for specific records?",
        a: "Price alert functionality is coming. For now, the Wishlist lets you save records so you can quickly re-run searches and check for new listings or price drops."
      },
    ]
  },
];

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

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(245,158,11,0.15)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
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
