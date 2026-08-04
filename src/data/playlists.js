// src/data/playlists.js
//
// Single source of truth for DITSC's recurring YouTube video series, used by
// the Watch & Read page's "Recurring Video Series" section (Phase 2). Edit
// playlist URLs, names, descriptions, and colors here only — do not
// duplicate these anywhere else in the codebase.
//
// Per the Phase 2 brief: static metadata + direct playlist links only. This
// does not fetch playlist contents dynamically and does not touch the
// Phase 1 Worker/KV video pipeline.

export const VIDEO_SERIES = [
  {
    key: 'sample-dna',
    name: 'Sample DNA',
    description: 'Tracing the original samples behind hip-hop’s most famous beats, one flip at a time.',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLr500XsR--cgmB1YDO1_myKQ2WEVA4WMi',
    color: '#a78bfa',
  },
  {
    key: 'wu-tang-wednesday',
    name: 'Wu-Tang Wednesday',
    description: 'A weekly dig into the Wu-Tang Clan catalog, from solo classics to deep cuts.',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLr500XsR--ci8_z-NFaGloVFGhn8PSbbo',
    color: '#2ec4b6',
  },
  {
    key: 'throwback-thursday',
    name: 'Throwback Thursday',
    description: 'Forgotten classics and overlooked records worth digging back into.',
    playlistUrl: 'https://youtube.com/playlist?list=PLr500XsR--cj6na1YQjivAVhZ3B67k-UO&si=L_KbamPVCjy2CWpG',
    color: '#e63946',
  },
  {
    key: 'eff-it-friday',
    name: 'Eff It Friday',
    description: 'End-of-week picks. Whatever’s spinning, no theme required.',
    playlistUrl: 'https://youtube.com/playlist?list=PLN7Gupy4snKk&si=1wQStzHQBLlj05R4',
    color: '#f59e0b',
  },
  {
    // Joe's actual playlist title on YouTube differs from the brief's shorthand
    // "Soundtrack Sunday" — using the real title here so the card matches what
    // visitors see when they land on the playlist.
    key: 'soundtrack-sunday',
    name: 'Good-Bad Movie with Killer Soundtracks',
    description: 'Sunday picks pairing so-bad-they’re-good movies with soundtracks worth owning on vinyl.',
    playlistUrl: 'https://youtube.com/playlist?list=PLr500XsR--cg1DTkXZ91D1s7I0BlwRMJ6&si=pTb9vJJ-putAYIMX',
    color: '#4ade80',
  },
];
