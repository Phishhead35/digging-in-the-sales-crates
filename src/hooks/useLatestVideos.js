// src/hooks/useLatestVideos.js
//
// Phase 2: extracted from Home.jsx so the same fetch + fallback logic isn't
// duplicated between the homepage's compact "Latest from DITSC" strip and
// the new Watch & Read page's "Latest from DITSC" section. No new data
// source — this still calls the existing Phase 1 /api/latest-videos
// endpoint, backed by the existing ditsc-notion-sync Worker/KV cache.
// Nothing about the video pipeline itself changed.

import { useState, useEffect } from 'react';

// Last-known-good hardcoded fallback. Renders if the fetch fails, errors, or
// the cache is empty, so neither the homepage strip nor Watch & Read ever
// shows a blank video section. Do not delete without replacing.
export const FALLBACK_VIDEOS = [
  {
    id: 'fallback-1',
    label: 'SAMPLE DNA',
    title: 'James Brown to Redman: The Break That Built an Era',
    url: 'https://youtube.com/shorts/vR_81bXR3JI?si=hpo297xYWZXZ6I9R',
    thumbnail: null,
    publishedAt: null,
  },
  {
    id: 'fallback-2',
    label: 'WU-TANG WEDNESDAY',
    title: 'GZA & Ghostface: The Samples Behind Liquid Swords',
    url: 'https://youtube.com/shorts/JKlC8IN0Hvo?si=cj24315nS8QJXdQj',
    thumbnail: null,
    publishedAt: null,
  },
  {
    id: 'fallback-3',
    label: 'THROWBACK THURSDAY',
    title: 'The Beatnuts: Forgotten Classics Worth Digging For',
    url: 'https://youtube.com/shorts/roBlGste3ik?si=8zD82hVXAHrdYAe1',
    thumbnail: null,
    publishedAt: null,
  },
];

export default function useLatestVideos() {
  const [videos, setVideos] = useState(FALLBACK_VIDEOS);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/latest-videos')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.videos) && data.videos.length > 0) {
          setVideos(data.videos);
        }
      })
      .catch(() => {
        // Silent — fallback array is already the current state.
      });
    return () => { cancelled = true; };
  }, []);

  return videos;
}
