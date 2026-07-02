import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Disc3, Search } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { BLOG_POSTS } from '../data/blog';

// ── 404 / not found ───────────────────────────────────────────
function NotFound() {
  return (
    <div style={{ padding: '120px 24px', textAlign: 'center' }}>
      <Disc3 size={48} color="var(--amber)" style={{ marginBottom: 20, opacity: 0.5 }} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, letterSpacing: 1, marginBottom: 12 }}>
        POST NOT FOUND
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
        That post doesn't exist yet, but check back soon.
      </p>
      <Link to="/blog" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '10px 20px', borderRadius: 8,
        background: 'var(--amber)', color: '#0a0a0f',
        fontWeight: 700, textDecoration: 'none', fontSize: 14,
      }}>
        <ArrowLeft size={14} /> Back to Blog
      </Link>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function BlogPost() {
  const { slug } = useParams();
  const post = BLOG_POSTS[slug];

  useSEO(post
    ? { title: post.seo.title, description: post.seo.description }
    : { title: 'Post Not Found | Digging in the Sales Crates', description: '' }
  );

  if (!post) return <NotFound />;

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        padding: '72px 24px 56px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Back link */}
          <Link to="/blog" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-muted)', fontSize: 12,
            fontFamily: 'var(--font-mono)', letterSpacing: 1,
            textDecoration: 'none', marginBottom: 28,
            transition: 'color 0.2s',
          }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--amber)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <ArrowLeft size={12} /> BACK TO BLOG
          </Link>

          {/* Series badge + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: 1.5,
              padding: '3px 10px', borderRadius: 100,
              background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--amber)',
            }}>
              {post.series}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {post.dateDisplay}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 56px)',
            letterSpacing: 1, lineHeight: 1.05,
            marginBottom: 0,
          }}>
            {post.title}
          </h1>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {post.body.map((para, i) => (
            <p key={i} style={{
              color: 'var(--text-primary)', fontSize: 16, lineHeight: 1.85,
              margin: 0,
            }}>
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ───────────────────────────────────────── */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            padding: '32px', borderRadius: 16,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <p style={{
              color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
              letterSpacing: 2, marginBottom: 12,
            }}>
              FIND THE BEST PRICE
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 32,
              letterSpacing: 1, marginBottom: 10,
            }}>
              READY TO DIG?
            </h2>
            <p style={{
              color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28,
              maxWidth: 420, margin: '0 auto 28px',
            }}>
              Search across Discogs, eBay, and CDandLP at once and find the lowest price on any record.
            </p>
            <Link to="/aggregator" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '14px 32px', borderRadius: 12, fontSize: 15,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000', fontWeight: 700, textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              <Search size={16} /> Start Digging <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
