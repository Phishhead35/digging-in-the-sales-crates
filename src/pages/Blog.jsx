import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Disc3 } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { BLOG_POSTS } from '../data/blog';

// ── GA4 tracker ───────────────────────────────────────────────
function trackPostClick(slug) {
  window.gtag?.('event', 'blog_post_click', {
    post_slug: slug,
    source: 'blog_index',
  });
}

// ── Post card ─────────────────────────────────────────────────
function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      onClick={() => trackPostClick(post.slug)}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          padding: '24px', borderRadius: 14,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          height: '100%', display: 'flex', flexDirection: 'column', gap: 14,
          transition: 'border-color 0.2s, transform 0.2s',
        }}
        onMouseOver={e => {
          e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Series badge + date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{
            fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 1.5,
            padding: '2px 8px', borderRadius: 100,
            background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.25)',
            color: 'var(--amber)',
          }}>
            {post.series}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {post.dateDisplay}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(22px, 3vw, 26px)',
          letterSpacing: 1, lineHeight: 1.05,
          color: 'var(--text-primary)', margin: 0,
        }}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p style={{
          fontSize: 13, color: 'var(--text-secondary)',
          lineHeight: 1.6, margin: 0,
        }}>
          {post.excerpt}
        </p>

        {/* CTA */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--amber)', fontSize: 13, fontWeight: 600, marginTop: 'auto',
        }}>
          Read <ArrowRight size={13} />
        </div>
      </div>
    </Link>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function Blog() {
  useSEO({
    title: 'Blog | Digging in the Sales Crates',
    description: 'Sample connections, reissue alerts, artist spotlights, and market trends for vinyl collectors and crate diggers.',
  });

  const posts = Object.values(BLOG_POSTS).sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        padding: '72px 24px 56px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 14px', borderRadius: 100,
            background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
            color: 'var(--amber)', fontSize: 11, fontWeight: 500,
            letterSpacing: 1.5, marginBottom: 24, fontFamily: 'var(--font-mono)',
          }}>
            <BookOpen size={12} />
            DITSC BLOG
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 80px)',
            letterSpacing: 2, lineHeight: 0.95, marginBottom: 16,
          }}>
            FROM THE CRATES
          </h1>

          <p style={{
            color: 'var(--text-secondary)', fontSize: 16,
            fontWeight: 300, maxWidth: 520, lineHeight: 1.7,
          }}>
            Sample connections, reissue alerts, artist spotlights, and what's moving in the market.
          </p>
        </div>
      </section>

      {/* ── POSTS ────────────────────────────────────────────── */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px' }}>
              <Disc3 size={40} color="var(--amber)" style={{ marginBottom: 16, opacity: 0.5 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                New posts coming soon.
              </p>
            </div>
          ) : (
            <>
              <p style={{
                color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
                letterSpacing: 2, marginBottom: 28,
              }}>
                LATEST — {posts.length} {posts.length === 1 ? 'POST' : 'POSTS'}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 16,
              }}>
                {posts.map(post => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
