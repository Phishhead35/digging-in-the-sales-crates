// ── Partner store data ────────────────────────────────────────
// Single source of truth for "Shops We Dig" partner stores.
// Shared by Home.jsx (MA / RI+NH sections), SearchResults.jsx
// (rotating partner card), and ArtistPage.jsx (Dig Our Partners'
// Crates section). Add, remove, or edit a partner here only.

export const MA_STORES = [
  { name: 'Spin That Records', type: 'Vintage Vinyl', location: 'Springfield, MA', desc: "Springfield MA's only vintage vinyl store. Classic Rock, Jazz, Soul, Latin, Folk and more. Plus vintage turntables, receivers, and hi-fi equipment.", url: 'https://spinthatspringfield.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=spin-that-records', specialties: ['Rock', 'Jazz', 'Soul', 'Latin', 'Folk'] },
  { name: 'Village Vinyl and HiFi', type: 'Records & Stereo', location: 'Boston, MA', desc: 'Located in the Coolidge Corner neighborhood in Boston. Quality records and stereo equipment at prices that keep you coming back.', url: 'https://www.villagevinylhifi.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=village-vinyl-hifi' },
  { name: 'ADamnShame Records', type: 'Curated Vinyl', location: 'Lowell, MA', desc: 'Lowell-based record dealer specializing in curated vinyl and quality records. Follow on Instagram for inventory and updates.', url: 'https://www.instagram.com/adamnshame_records/?utm_source=ditsc&utm_medium=referral&utm_campaign=a-damn-shame-records' },
  { name: 'Soundtracks Beverly', type: 'All Genres', location: 'Beverly, MA', desc: 'Beverly, MA record shop with an eclectic mix of vinyl across all genres. A true neighborhood dig spot on the North Shore.', url: 'https://www.soundtracksbeverly.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=soundtracks-beverly' },
  { name: 'GOOD TASTE Records', type: 'Vinyl Boutique', location: 'Boston, MA', desc: "Boston vinyl boutique and music hub for DJs, collectors, and anyone with GOOD TASTE. Stop in and find something you didn't know you needed.", url: 'https://goodtasterecords.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=good-taste-records' },
  { name: 'Big Fun Records', type: 'Multi-Genre', location: 'Beverly, MA', desc: 'Beverly, MA shop at 284A Cabot St. Buying and selling Rock, Jazz, Soul/Funk, Punk, Metal, Hip-Hop, Electronic, and more.', url: 'https://www.discogs.com/seller/bigfunrecords/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=big-fun-records', specialties: ['Rock', 'Jazz', 'Soul', 'Funk', 'Punk', 'Metal', 'Hip-Hop', 'Electronic'] },
  { name: 'Residency Records', type: 'Used Vinyl', location: 'Salem, MA', desc: 'Located in the Witch City Mall in Salem, MA. Find them on Discogs for their full inventory.', url: 'https://www.discogs.com/seller/residencyrecords/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=residency-records' },
  { name: "Joe's Albums", type: 'New & Used', location: 'Worcester, MA', desc: "Worcester's go-to record shop at 317 Main St, housed in a historic performance venue. Open 7 days a week, 10am-6pm. Online since 2010, brick and mortar since 2011.", url: 'https://www.joesalbums.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=joes-albums' },
  { name: 'The Time Capsule', type: 'Records, Comics & Games', location: 'Seekonk, MA', desc: 'Seekonk location at 1733 Fall River Ave. New vinyl hits the bins every Saturday. Also stocking thousands of back-issue comics, new releases every Wednesday, and restocked video games weekly.', url: 'https://www.discogs.com/seller/oftimespast/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=the-time-capsule-seekonk', siteUrl: 'https://www.thetimecapsule.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=the-time-capsule-seekonk' },
  { name: 'Planet Records', type: 'LPs, CDs, Cassettes & DVDs', location: 'Cambridge, MA', desc: 'Quality LPs, CDs, Cassettes, DVDs, and music books at 144 Mt Auburn St, Cambridge. A Cambridge institution for serious collectors.', siteUrl: 'https://planet-records.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=planet-records', url: 'https://www.discogs.com/seller/PlanetRecords/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=planet-records', ebayUrl: 'https://www.ebay.com/str/planetrecordsandcds?mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=5339145834&toolid=10001&customid=ditsc&utm_source=ditsc&utm_medium=referral&utm_campaign=planet-records' },
];

export const RINH_STORES = [
  { name: 'Music Magick', type: 'Multi-Media', location: 'West Warwick, RI', desc: 'The ultimate multi-media store in West Warwick, RI. Over 50,000 CDs and 30,000 DVDs across all genres, plus games and Blu-rays. Most priced at just $2.', url: 'https://www.discogs.com/seller/musicmagickshop/profile?page=1&utm_source=ditsc&utm_medium=referral&utm_campaign=music-magick' },
  { name: 'The Time Capsule', type: 'Records, Comics & Games', location: 'Cranston, RI', desc: 'Cranston location at 537 Pontiac Ave. Massive LP restock every Friday. Plus new comics every Wednesday (80-100 titles), thousands of back issues, and restocked video games weekly.', url: 'https://www.discogs.com/seller/oftimespast/profile?utm_source=ditsc&utm_medium=referral&utm_campaign=the-time-capsule-cranston', siteUrl: 'https://www.thetimecapsule.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=the-time-capsule-cranston' },
  { name: 'New Hampshire Vintage Vinyl', type: 'Pre-Owned Vinyl', location: 'Laconia, NH', desc: 'Laconia, NH record shop at 633 Main St. New crates of pre-owned records hit the floor every Saturday. In-store customers get first dibs; the rest go live online Sunday evenings.', url: 'https://www.nhvintagevinyl.com/?utm_source=ditsc&utm_medium=referral&utm_campaign=nh-vintage-vinyl' },
];

// Flat list of all partners, in the same order Home.jsx renders them
// (MA_STORES followed by RINH_STORES). Used by SearchResults.jsx for
// the randomly rotated partner card, and by getPartnersForArtist below
// for the artist-page "dig our partners' crates" feature.
export const PARTNER_STORES = [...MA_STORES, ...RINH_STORES];

// ── Genre-aware partner picker ─────────────────────────────────
// Picks `count` partner stores for an artist page. Every store stays
// eligible regardless of genre — most partners carry all genres even
// when their listed description calls out a specialty, so `specialties`
// is only a soft nudge (2x weight), never a filter. This guarantees no
// store is silently excluded just because its description leans niche.
// Selection is a weighted draw without replacement, so results vary
// page to page but every partner has a real shot at showing up.
export function getPartnersForArtist(artistGenres = [], count = 2) {
  const pool = PARTNER_STORES.map(store => {
    const isFit = Array.isArray(store.specialties) &&
      store.specialties.some(g => artistGenres.includes(g));
    return { store, weight: isFit ? 2 : 1 };
  });

  const picked = [];
  while (picked.length < count && pool.length > 0) {
    const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = Math.random() * totalWeight;
    let idx = 0;
    while (idx < pool.length - 1 && roll > pool[idx].weight) {
      roll -= pool[idx].weight;
      idx += 1;
    }
    picked.push(pool[idx].store);
    pool.splice(idx, 1);
  }
  return picked;
}
