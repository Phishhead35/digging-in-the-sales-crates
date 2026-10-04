// ditsc-notion-sync-worker.js
//
// Worker name in Cloudflare stays "ditsc-notion-sync" (no rename — Joe's call,
// Phase 1 of the Homepage Content Automation project). This file adds a new
// job to the existing Worker: a YouTube "latest videos" refresh cron, alongside
// its original job (Notion relay for the internal social-analytics dashboard).
//
// SECTION 1 (Notion relay) is the exact same logic that was already deployed —
// same routes (/sync-analytics, /sync-priorities), same NOTION_TOKEN secret
// name, same behavior. Only cosmetic esbuild bundler artifacts (__defProp /
// __name helpers) were dropped since they aren't needed when hand-authoring
// the source; they had no effect on runtime behavior.
//
// SECTION 2 (YouTube refresh) and SECTION 3 (entry points: fetch + scheduled)
// are new in Phase 1.
//
// SECTION 2B (Supabase relay keep-alive) added 2026-10-04. Sections 1 and 2
// are untouched by that change.

// ============================================================
// SECTION 1: Notion relay — UNCHANGED BEHAVIOR
// ============================================================

const ANALYTICS_JOURNAL_DB = "caa26b4f-1e71-4edd-9e4a-b449367a5098";
const ARTIST_PRIORITIES_DB = "fe4d2e83-8a8b-4e56-92df-d18f7ecdaa22";
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  // TODO: change to 'https://digginginthesalescrates.com'
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function notionHeaders(token) {
  return {
    "Authorization": `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

async function queryDB(dbId, filter, token) {
  const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
    method: "POST",
    headers: notionHeaders(token),
    body: JSON.stringify({ filter, page_size: 10 }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion query ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.results || [];
}

async function createPage(dbId, properties, token) {
  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: notionHeaders(token),
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion create ${res.status}: ${text}`);
  }
  return res.json();
}

async function updatePage(pageId, properties, token) {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH",
    headers: notionHeaders(token),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion update ${res.status}: ${text}`);
  }
  return res.json();
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function buildAnalyticsProps(p) {
  return {
    "Snapshot": { title: [{ text: { content: p.snapshotTitle } }] },
    "Platform": { multi_select: (p.platforms || []).map((n) => ({ name: n })) },
    "Date": { date: { start: p.dateRange.from, end: p.dateRange.to || null } },
    "Views": { number: p.totalViews || 0 },
    "Likes": { number: p.totalLikes || 0 },
    "Shares": { number: p.totalShares || 0 },
    "Comments Count": { number: p.totalComments || 0 },
    "Followers Gained": { number: p.totalFollowers || 0 },
    "Notes": { rich_text: [{ text: { content: p.notes || "" } }] },
  };
}

function buildArtistProps(a, dateRange) {
  const props = {
    "Artist": { title: [{ text: { content: a.name } }] },
    "Rank": { number: a.rank },
    "Priority": { select: { name: a.priority ? a.priority.charAt(0).toUpperCase() + a.priority.slice(1) : "Secondary" } },
    "Artist Page Status": { select: { name: a.pageStatus } },
    "Total Views": { number: a.totalViews || 0 },
    "Best Video Views": { number: a.bestVideoViews || 0 },
    "Platform Count": { number: a.platformCount || 0 },
    "Platforms": { multi_select: (a.platforms || []).map((n) => ({ name: n })) },
    "Total Comments": { number: a.totalComments || 0 },
    "Comment Rate %": { number: a.commentRate || 0 },
    "Total Followers Gained": { number: a.totalFollowers || 0 },
    "Total Likes": { number: a.totalLikes || 0 },
    "Total Shares": { number: a.totalShares || 0 },
    "Analytics Period": { date: { start: dateRange.from, end: dateRange.to || null } },
  };
  if (a.artistPageUrl) props["Artist Page URL"] = { url: a.artistPageUrl };
  if (a.notes) props["Notes"] = { rich_text: [{ text: { content: a.notes } }] };
  return props;
}

async function handleSyncAnalytics(payload, token) {
  const result = { created: 0, updated: 0, skipped: 0, errors: [] };
  try {
    const filter = {
      property: "Snapshot",
      title: { equals: payload.snapshotTitle },
    };
    const existing = await queryDB(ANALYTICS_JOURNAL_DB, filter, token);
    const match = existing[0];
    const props = buildAnalyticsProps(payload);
    if (match) {
      await updatePage(match.id, props, token);
      result.updated++;
    } else {
      await createPage(ANALYTICS_JOURNAL_DB, props, token);
      result.created++;
    }
  } catch (err) {
    result.errors.push(err.message);
  }
  return result;
}

async function handleSyncPriorities(payload, token) {
  const { dateRange, artists } = payload;
  const result = { created: 0, updated: 0, skipped: 0, errors: [] };
  for (const artist of artists) {
    try {
      const filter = {
        property: "Artist",
        title: { equals: artist.name },
      };
      const existing = await queryDB(ARTIST_PRIORITIES_DB, filter, token);
      const match = existing.find((p) => {
        const d = p.properties?.["Analytics Period"]?.date;
        return d?.start === dateRange.from;
      });
      const props = buildArtistProps(artist, dateRange);
      if (match) {
        await updatePage(match.id, props, token);
        result.updated++;
      } else {
        await createPage(ARTIST_PRIORITIES_DB, props, token);
        result.created++;
      }
    } catch (err) {
      result.errors.push(`${artist.name}: ${err.message}`);
    }
  }
  return result;
}

// ============================================================
// SECTION 2: YouTube "latest videos" refresh — NEW (Phase 1)
// ============================================================

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

// Config lives as env vars, not hardcoded constants, per the brief's ground rule.
// Defaults below only apply if the env var isn't set.
const DEFAULT_CHANNEL_HANDLE = "@digginginthesalescrates";
const DEFAULT_VIDEO_COUNT = "3";

const VIDEOS_KV_KEY = "youtube:latest-videos";
const PLAYLIST_KV_KEY = "youtube:uploads-playlist-id";
const ERROR_KV_KEY = "youtube:last-error";

// A channel's uploads playlist ID never changes, so cache it long to save API quota.
const PLAYLIST_ID_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Safety-net TTL on the videos cache itself. Under normal operation this key is
// overwritten every 6 hours by a fresh successful refresh, so this TTL should
// never actually elapse. It exists only so that if the cron silently stops
// firing for a long time, the homepage eventually reverts to its hardcoded
// fallback instead of showing indefinitely stale "latest" videos forever.
const VIDEOS_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

async function getUploadsPlaylistId(env) {
  const cached = await env.DITSC_CACHE.get(PLAYLIST_KV_KEY);
  if (cached) return cached;

  const handle = env.YOUTUBE_CHANNEL_HANDLE || DEFAULT_CHANNEL_HANDLE;
  const url = `${YOUTUBE_API}/channels?part=contentDetails&forHandle=${encodeURIComponent(handle)}&key=${env.YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`YouTube channels.list failed: ${res.status}: ${detail}`);
  }
  const data = await res.json();
  const playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) {
    throw new Error(`No uploads playlist found for channel handle ${handle}`);
  }

  await env.DITSC_CACHE.put(PLAYLIST_KV_KEY, playlistId, { expirationTtl: PLAYLIST_ID_TTL_SECONDS });
  return playlistId;
}

function mapVideoItem(item) {
  const s = item.snippet || {};
  const videoId = s.resourceId?.videoId;
  return {
    id: videoId,
    title: s.title || null,
    url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
    thumbnail: s.thumbnails?.medium?.url || s.thumbnails?.default?.url || null,
    publishedAt: s.publishedAt || null,
  };
}

// Shared by both the scheduled() cron and the manual /refresh-videos test route,
// so a manual trigger is guaranteed to produce identical output to the real cron run.
async function refreshVideos(env) {
  const count = parseInt(env.YOUTUBE_VIDEO_COUNT || DEFAULT_VIDEO_COUNT, 10);

  try {
    if (!env.YOUTUBE_API_KEY) {
      throw new Error("YOUTUBE_API_KEY secret not configured on this Worker");
    }
    if (!env.DITSC_CACHE) {
      throw new Error("DITSC_CACHE KV binding not configured on this Worker");
    }

    const playlistId = await getUploadsPlaylistId(env);
    const url = `${YOUTUBE_API}/playlistItems?part=snippet&maxResults=${count}&playlistId=${playlistId}&key=${env.YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`YouTube playlistItems.list failed: ${res.status}: ${detail}`);
    }

    const data = await res.json();
    const videos = (data.items || [])
      .map(mapVideoItem)
      .filter((v) => v.id)
      .slice(0, count);

    if (videos.length === 0) {
      // Zero videos is treated as a failure, not a valid "no videos" state —
      // never overwrite good cached data with an empty result.
      throw new Error("YouTube API returned zero videos");
    }

    await env.DITSC_CACHE.put(
      VIDEOS_KV_KEY,
      JSON.stringify({ videos, updatedAt: new Date().toISOString() }),
      { expirationTtl: VIDEOS_TTL_SECONDS }
    );

    // Clear any stale error record now that a refresh has succeeded.
    await env.DITSC_CACHE.delete(ERROR_KV_KEY).catch(() => {});

    return { success: true, videoCount: videos.length, videos };
  } catch (err) {
    // Dashboard Logs are disabled on this Worker as of Phase 1, so console.error
    // alone won't be visible after the fact — persist the failure to KV too,
    // with a short TTL, purely for after-the-fact debugging.
    console.error("YouTube refresh failed:", err.message);
    try {
      await env.DITSC_CACHE.put(
        ERROR_KV_KEY,
        JSON.stringify({ error: err.message, at: new Date().toISOString() }),
        { expirationTtl: 60 * 60 * 24 * 7 } // 7 days
      );
    } catch {
      // Never let a logging failure mask the original error.
    }
    return { success: false, error: err.message };
  }
}

// ============================================================
// SECTION 2B: Supabase relay keep-alive (added 2026-10-04)
// ============================================================
//
// The DITSC search falls back to a Supabase Edge Function (project
// ditsc-discogs-relay, function discogs-search) when Discogs refuses the
// Cloudflare search function with a 429. Supabase pauses free projects that
// sit idle for about a week, and the relay only gets traffic during Discogs
// throttles, so it could fall asleep exactly when it is needed.
//
// This pings the relay's ?ping=1 mode on the same 6-hour cron as the YouTube
// refresh. That mode writes a timestamp to the project's heartbeat table, so
// Supabase sees regular database activity and never pauses the project.
//
// Needs the DISCOGS_RELAY_KEY secret on THIS Worker (same value as
// DISCOGS_RELAY_KEY on the Pages project and RELAY_KEY in Supabase).
// If it is missing, the ping is skipped and recorded, never thrown.

const RELAY_PING_URL = "https://wdujcqnbhoagospopmvl.supabase.co/functions/v1/discogs-search?ping=1";
const RELAY_PING_KV_KEY = "relay:last-ping";

async function pingRelay(env) {
  let result;
  try {
    if (!env.DISCOGS_RELAY_KEY) {
      throw new Error("DISCOGS_RELAY_KEY secret not configured on this Worker");
    }
    const res = await fetch(RELAY_PING_URL, {
      headers: { "x-relay-key": env.DISCOGS_RELAY_KEY },
      signal: AbortSignal.timeout(15000),
    });
    const body = await res.text();
    result = res.ok
      ? { success: true, status: res.status }
      : { success: false, status: res.status, error: body.slice(0, 300) };
  } catch (err) {
    result = { success: false, error: err.message };
  }

  // Logs are disabled on this Worker (see SECTION 2), so the last ping result
  // is kept in KV for checking after the fact: success or failure, with time.
  try {
    if (env.DITSC_CACHE) {
      await env.DITSC_CACHE.put(
        RELAY_PING_KV_KEY,
        JSON.stringify({ ...result, at: new Date().toISOString() }),
        { expirationTtl: 60 * 60 * 24 * 14 } // 14 days
      );
    }
  } catch {
    // Never let a logging failure mask the ping result.
  }
  return result;
}

// ============================================================
// SECTION 3: Worker entry points
// ============================================================

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const path = new URL(request.url).pathname;

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    // NEW: manual trigger for testing the YouTube refresh. Calls the exact same
    // function the cron calls, so acceptance-test parity (manual vs scheduled)
    // is guaranteed by construction, not by keeping two code paths in sync.
    if (path === "/refresh-videos") {
      const result = await refreshVideos(env);
      return jsonResponse(result, result.success ? 200 : 500);
    }

    // NEW (2026-10-04): manual trigger for the Supabase relay keep-alive.
    // Same function the cron calls, same parity reasoning as above.
    if (path === "/ping-relay") {
      const result = await pingRelay(env);
      return jsonResponse(result, result.success ? 200 : 500);
    }

    // UNCHANGED: Notion relay routes below — same gating, same error shapes.
    const token = env.NOTION_TOKEN;
    if (!token) {
      return jsonResponse({ error: "NOTION_TOKEN secret not configured on this Worker" }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Request body must be valid JSON" }, 400);
    }

    try {
      if (path === "/sync-analytics") {
        return jsonResponse(await handleSyncAnalytics(body, token));
      }
      if (path === "/sync-priorities") {
        return jsonResponse(await handleSyncPriorities(body, token));
      }
      return jsonResponse({ error: `Unknown endpoint: ${path}` }, 404);
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  },

  // NEW: cron entry point. Cloudflare invokes this on the schedule configured
  // in the dashboard's Trigger Events tab (recommended: 0 */6 * * *, every 6
  // hours UTC — see deployment notes).
  //
  // 2026-10-04: the relay keep-alive runs on the same schedule. allSettled so
  // one job failing can never stop the other.
  async scheduled(event, env, ctx) {
    ctx.waitUntil(Promise.allSettled([refreshVideos(env), pingRelay(env)]));
  },
};
