import React from 'react';
import { Mail } from 'lucide-react';
import { trackNewsletterClick } from '../utils/analytics';

// ── This Week in the Sales Crates signup ─────────────────────
// One component for every page that asks for a newsletter signup, so the
// URL, copy and look can't drift apart. Moved here from BlogPost.jsx, where
// it first shipped; the blog-post version renders exactly as before.
//
// ATTRIBUTION. Every placement sends utm_source=website, so all site signups
// land in the same beehiiv group. utm_medium changes per page (blog, about,
// footer, watch_read, artist_page, homepage, blog_index), which is what shows
// in beehiiv which page actually brings in subscribers. Use a new medium for a
// new placement rather than reusing one.
//
// scripts/prerender.mjs keeps its own copy of the BLOG url (utm_medium=blog)
// for the crawler-readable link on post pages. If the blog medium or the
// beehiiv address ever changes, edit that file too.
const NEWSLETTER_BASE = 'https://fromthesalescrates.beehiiv.com/subscribe';

export function newsletterUrl(medium) {
  return (
    `${NEWSLETTER_BASE}?utm_source=website` +
    `&utm_medium=${encodeURIComponent(medium)}` +
    '&utm_campaign=newsletter_signup'
  );
}

// Default wrapper matches the blog-post layout. Pages whose sections use a
// different rhythm (Home's borderTop sections, for one) pass sectionStyle.
const DEFAULT_SECTION_STYLE = { padding: '48px 24px', borderBottom: '1px solid var(--border)' };

/**
 * @param {object} props
 * @param {string} props.medium        utm_medium for this placement
 * @param {string} props.source        CLICK_SOURCES value for the GA4 event
 * @param {string} [props.postSlug]    blog post slug, when on a post
 * @param {string} [props.artistName]  artist name, when on an artist page
 * @param {number} [props.maxWidth]    match the page's content column
 * @param {object} [props.sectionStyle] overrides the outer section padding/borders
 */
export default function NewsletterCta({
  medium,
  source,
  postSlug,
  artistName,
  maxWidth = 760,
  sectionStyle = DEFAULT_SECTION_STYLE,
}) {
  const url = newsletterUrl(medium);
  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        <div style={{
          padding: '28px 32px', borderRadius: 16,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ minWidth: 240, flex: '1 1 300px' }}>
            <p style={{
              color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
              letterSpacing: 2, marginBottom: 10, marginTop: 0,
            }}>
              FREE WEEKLY NEWSLETTER
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 28,
              letterSpacing: 1, margin: '0 0 8px',
            }}>
              THIS WEEK IN THE SALES CRATES
            </h2>
            <p style={{
              color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, margin: 0,
            }}>
              Sample connections, reissue alerts and market finds, once a week. Free, and unsubscribe anytime.
            </p>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12, fontSize: 15,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000', fontWeight: 700, textDecoration: 'none',
              transition: 'opacity 0.2s', flexShrink: 0, whiteSpace: 'nowrap',
            }}
            onClick={() => trackNewsletterClick(source, postSlug, artistName)}
            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >
            <Mail size={16} /> Join Our Free Weekly Newsletter
          </a>
        </div>
      </div>
    </section>
  );
}
