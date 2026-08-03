// functions/api/latest-videos.js
//
// New in Phase 1 of the Homepage Content Automation project.
//
// Read-only Cloudflare Pages Function. Reads the "youtube:latest-videos" KV key
// that ditsc-automation-worker's scheduled() cron writes every 6 hours into the
// shared DITSC_CACHE KV namespace, and serves it to the homepage.
//
// This function never calls the YouTube API directly and never writes to KV —
// mirrors the read side of the existing search-discogs.js / search-ebay.js /
// search-cdandlp.js pattern (same CORS headers, same KV binding name), but has
// no upstream API call to fall back to on a cache miss. A miss just returns an
// empty videos array; Home.jsx is responsible for falling back to its own
// hardcoded FALLBACK_VIDEOS array in that case (or if this request fails/errors
// for any reason) — the homepage should never show a blank section.

const VIDEOS_KV_KEY = "youtube:latest-videos";

export async function onRequestGet(context) {
  const { env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    const cached = await env.DITSC_CACHE.get(VIDEOS_KV_KEY);

    if (!cached) {
      return new Response(JSON.stringify({ videos: [], updatedAt: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "MISS" },
      });
    }

    return new Response(cached, {
      headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "HIT" },
    });
  } catch (err) {
    // Never let a KV error break the homepage — return an empty payload and let
    // the frontend fall back to its own hardcoded array.
    return new Response(JSON.stringify({ videos: [], updatedAt: null, error: err.message }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
