// src/components/VideoCard.jsx
//
// Phase 2: extracted from Home.jsx's Phase 1 video-card markup so the same
// card renders identically on the homepage's compact strip and on Watch &
// Read's "Latest from DITSC" section. Pass compact={true} for the smaller
// homepage version.

import React from 'react';
import { Youtube } from 'lucide-react';
import { trackVideoClick } from '../utils/analytics';

function formatPublished(dateStr) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return null;
  }
}

export default function VideoCard({ video, color, compact = false }) {
  const published = formatPublished(video.publishedAt);
  const thumbHeight = compact ? 110 : 140;

  return (
    <div
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-3px)'; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Thumbnail — fixed height reserved up front to avoid layout shift
          whether or not a real thumbnail URL is present. */}
      <div style={{ height: thumbHeight, background: `${color}14`, position: 'relative', overflow: 'hidden' }}>
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            width={320}
            height={thumbHeight}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Youtube size={compact ? 22 : 28} color={color} />
          </div>
        )}
      </div>

      <div style={{ padding: compact ? '12px 16px 16px' : '16px 20px 20px' }}>
        <div style={{
          fontSize: 9, fontFamily: 'var(--font-mono)', letterSpacing: 2,
          color, fontWeight: 600, marginBottom: 8,
        }}>
          {video.label || 'LATEST UPLOAD'}
        </div>
        <h3 style={{
          fontSize: compact ? 13 : 14, fontWeight: 600, color: 'var(--text-primary)',
          lineHeight: 1.4, marginBottom: 8,
        }}>
          {video.title}
        </h3>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
          {published || 'From the vault'}
        </div>
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackVideoClick(video.title, video.id, 'homepage_video_card')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 20,
            border: `1px solid ${color}`,
            color, fontSize: 11, fontWeight: 600,
            textDecoration: 'none', letterSpacing: 0.3,
            background: 'transparent',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = `${color}22`; }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          ▶ Watch on YouTube
        </a>
      </div>
    </div>
  );
}
