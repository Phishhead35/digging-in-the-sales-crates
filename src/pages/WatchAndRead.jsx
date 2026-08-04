import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, BookOpen, Disc3, TrendingUp, Radio, RefreshCw, ArrowRight, ExternalLink, PlayCircle } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import useLatestVideos from '../hooks/useLatestVideos';
import VideoCard from '../components/VideoCard';
import { VIDEO_SERIES } from '../data/playlists';
import { BLOG_POSTS } from '../data/blog';

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@digginginthesalescrates';
const YOUTUBE_VIDEOS_URL = 'https://www.youtube.com/@digginginthesalescrates/videos';

// Same series -> color/icon map as Blog.jsx, kept local rather than imported
// so this page has zero risk of changing Blog.jsx's existing behavior.
const SERIES_STYLES = {
  'CRATE SPOTLIGHT': { color: '#f59e0b', icon: Disc3 },
  'MARKET WATCH': { color: '#2ec4b6', icon: TrendingUp },
  'SAMPLE DNA': { color: '#a78bfa', icon: Radio },
  'REISSUE RADAR': { color: '#e63946', icon: RefreshCw },
};
const DEFAULT_SERIES_STYLE = { color: '#f59e0b', icon: BookOpen };

// ── GA4 trackers — same event-naming convention as Blog.jsx / BlogPost.jsx ──
function trackPlaylistClick(seriesName) {
  window.gtag?.('event', 'watch_read_playlist_click', { series_name: seriesName });
}
function trackPostClick(slug) {
  window.gtag?.('event', 'blog_post_click', { post_slug: slug, source: 'watch_read' });
}
function trackBrowseAllClick(destination) {
  window.gtag?.('event', 'watch_read_browse_all_click', { destination });
}

// ── Section heading helper — consistent with Home.jsx / Blog.jsx style ──
function SectionEyebrow({ children }) {
  return (
    <p style={{
      color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)',
      letterSpacing: 2, marginBottom: 8,
    }}>
      {children}
    </p>
  );
}

// ── Playlist series card ─────────────────────────────────────
function SeriesCard({ series }) {
  return (
    <a
      href={series.playlistUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackPlaylistClick(series.name)}
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          borderRadius: 14, overflow: 'hidden',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          height: '100%', display: 'flex', flexDirection: 'column',
          transition: 'border-color 0.2s, transform 0.2s',
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = `${series.color}66`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Representative image — colored header standing in for a series
            thumbnail, same pattern Blog.jsx uses for posts. Swapping in a real
            playlist thumbnail later is a drop-in change, not a redesign. */}
        <div style={{
          background: `${series.color}18`, borderBottom: `1px solid ${series.color}40`,
          padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PlayCircle size={32} color={series.color} />
        </div>

        <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 0.5,
            color: 'var(--text-primary)', margin: 0, lineHeight: 1.15,
          }}>
            {series.name}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, flex: 1 }}>
            {series.description}
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: series.color, fontSize: 13, fontWeight: 600, marginTop: 4,
          }}>
            Watch the series <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </a>
  );
}

// ── Written story card — same visual language as Blog.jsx's PostCard ──
function StoryCard({ post }) {
  const { color, icon: Icon } = SERIES_STYLES[post.series] || DEFAULT_SERIES_STYLE;
  return (
    <Link to={`/blog/${post.slug}`} onClick={() => trackPostClick(post.slug)} style={{ textDecoration: 'none' }}>
      <div
        style={{
          borderRadius: 14, overflow: 'hidden',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          height: '100%', display: 'flex', flexDirection: 'column',
          transition: 'border-color 0.2s, transform 0.2s',
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = `${color}66`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <div style={{
          background: `${color}18`, borderBottom: `1px solid ${color}40`,
          padding: '22px 20px 16px', display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <Icon size={22} color={color} />
          <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 1.5, color, fontWeight: 600 }}>
            {post.series}
          </span>
        </div>
        <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {post.dateDisplay}
          </span>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 24px)',
            letterSpacing: 1, lineHeight: 1.1, color: 'var(--text-primary)', margin: 0,
          }}>
            {post.title}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {post.excerpt}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color, fontSize: 13, fontWeight: 600, marginTop: 'auto' }}>
            Read <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function WatchAndRead() {
  useSEO({
    title: 'Watch & Read | Digging in the Sales Crates',
    description: 'Videos, stories, and recurring series from DITSC — the latest YouTube uploads, weekly playlist series, and written vinyl-collecting guides.',
  });

  const videos = useLatestVideos();
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
            <Youtube size={12} />
            DITSC CONTENT HUB
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 80px)',
            letterSpacing: 2, lineHeight: 0.95, marginBottom: 16,
          }}>
            WATCH &amp; READ
          </h1>

          <p style={{
            color: 'var(--text-secondary)', fontSize: 16,
            fontWeight: 300, maxWidth: 520, lineHeight: 1.7,
          }}>
            Videos, stories, and recurring series from DITSC.
          </p>
        </div>
      </section>

      {/* ── 1. LATEST FROM DITSC ─────────────────────────────── */}
      <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionEyebrow>LATEST UPLOADS</SectionEyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: 1, marginBottom: 24 }}>
            Latest from DITSC
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {videos.map((video, i) => {
              const colors = ['#f59e0b', '#2ec4b6', '#e63946'];
              return <VideoCard key={video.id || video.url} video={video} color={colors[i % colors.length]} />;
            })}
          </div>
        </div>
      </section>

      {/* ── 2. RECURRING VIDEO SERIES ────────────────────────── */}
      <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionEyebrow>WEEKLY SERIES</SectionEyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: 1, marginBottom: 24 }}>
            Recurring Video Series
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {VIDEO_SERIES.map(series => (
              <SeriesCard key={series.key} series={series} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WRITTEN STORIES ───────────────────────────────── */}
      <section style={{ padding: '56px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <SectionEyebrow>FROM THE CRATES</SectionEyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: 1, marginBottom: 24 }}>
            Written Stories
          </h2>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Disc3 size={36} color="var(--amber)" style={{ marginBottom: 14, opacity: 0.5 }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>New stories coming soon.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {posts.map(post => <StoryCard key={post.slug} post={post} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── 4. BROWSE ALL ────────────────────────────────────── */}
      <section style={{ padding: '40px 24px' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', gap: 24, flexWrap: 'wrap',
          justifyContent: 'center', alignItems: 'center',
        }}>
          <a
            href={YOUTUBE_VIDEOS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBrowseAllClick('watch_all_videos')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}
          >
            Watch all videos <ExternalLink size={12} />
          </a>
          <Link
            to="/blog"
            onClick={() => trackBrowseAllClick('read_all_stories')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}
          >
            Read all stories <ArrowRight size={12} />
          </Link>
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBrowseAllClick('youtube_channel')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#e63946', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            <Youtube size={14} /> Visit the DITSC YouTube channel <ExternalLink size={12} />
          </a>
        </div>
      </section>

    </div>
  );
}
