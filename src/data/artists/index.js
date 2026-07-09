// ─────────────────────────────────────────────────────────────
//  DITSC Artist & Genre Data
//  Add a new entry here + a route in App.jsx to publish a page.
//  searchTerms drive the Discogs / eBay / CDandLP buttons.
// ─────────────────────────────────────────────────────────────

export const ARTISTS = {

  'old-dirty-bastard': {
    slug: 'old-dirty-bastard',
    name: 'Ol\' Dirty Bastard',
    tagline: 'Dirty. Raw. Irreplaceable. Wu-Tang\'s wildest one.',
    genres: ['Hip-Hop', 'Wu-Tang'],
    searchTerms: {
      discogs: 'Ol\' Dirty Bastard',
      ebay: 'Old Dirty Bastard vinyl',
      cdandlp: 'Ol Dirty Bastard',
    },
    ebayUrlOverride: 'https://www.ebay.com/sch/i.html?_nkw=Old+Dirty+Bastard+vinyl&_sacat=0&_from=R40&_trksid=m570.l1313&mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=5339145834&toolid=10001&customid=ditsc',
    bio: [
      'Ol\' Dirty Bastard — born Russell Tyrone Jones — was the most unpredictable member of the Wu-Tang Clan, and that\'s saying something. His 1995 debut, Return to the 36 Chambers: The Dirty Version, hit like nothing else in rap: no rules, no filters, pure Brooklyn chaos over RZA\'s grimy Staten Island production.',
      'His second album, Nigga Please (1999), showed a different side — smoother in places, still unmistakably ODB. He died in 2004 at 35. His records are collected hard because nobody sounded like him, and nobody ever will.',
      'Wu-Tang vinyl commands serious collector premiums. ODB\'s solo pressings, especially originals on Elektra, are increasingly difficult to find in solid condition.',
    ],
    essentialRecords: [
      { title: 'Return to the 36 Chambers: The Dirty Version', year: 1995, label: 'Elektra' },
      { title: 'Nigga Please', year: 1999, label: 'Elektra' },
      { title: 'The Trials and Tribulations of Russell Jones', year: 2002, label: 'Damon Dash Music' },
      { title: 'Wu-Tang Clan — Enter the Wu-Tang (36 Chambers)', year: 1993, label: 'Loud' },
      { title: 'Wu-Tang Clan — Wu-Tang Forever', year: 1997, label: 'Loud' },
      { title: 'Osirus', year: 2005, label: 'D3 Entertainment' },
    ],
    producerCredits: ['RZA', 'Wu-Tang Clan production family'],
    seo: {
      title: 'Ol\' Dirty Bastard Vinyl Records | Digging in the Sales Crates',
      description: 'Find Ol\' Dirty Bastard vinyl records across Discogs, eBay, and CDandLP. Shop Return to the 36 Chambers, Nigga Please, and rare Wu-Tang pressings.',
    },
  },

  'j-dilla': {
    slug: 'j-dilla',
    name: 'J Dilla',
    tagline: 'The architect of modern hip-hop\'s heartbeat.',
    genres: ['Hip-Hop', 'Soul', 'Instrumental'],
    searchTerms: {
      discogs: 'J Dilla',
      ebay: 'J Dilla vinyl',
      cdandlp: 'J Dilla',
    },
    bio: [
      'James Dewitt Yancey — J Dilla — redefined what a drum machine could feel like. Working out of Detroit through the 1990s and early 2000s, he produced for A Tribe Called Quest, Common, Erykah Badu, and D\'Angelo before most fans knew his name.',
      'His solo output, especially Donuts (2006), finished hours before his death, stands as one of the most influential records in hip-hop history. A 31-track collage built entirely from samples, released on Stones Throw Records.',
      'Dilla records are actively collected. Original pressings of Donuts and his Slum Village work fetch serious prices. First pressings and colored variants appear regularly on Discogs.',
    ],
    essentialRecords: [
      { title: 'Donuts', year: 2006, label: 'Stones Throw' },
      { title: 'Ruff Draft', year: 2003, label: 'Groove Attack' },
      { title: 'Welcome 2 Detroit', year: 2001, label: 'BBE' },
      { title: 'Slum Village — Fantastic Vol. 2', year: 2000, label: 'Barak' },
      { title: 'The Shining', year: 2006, label: 'BBE' },
      { title: 'Jay Deelicious: The Delicious Vinyl Sides', year: 2007, label: 'Stones Throw' },
    ],
    producerCredits: [
      'A Tribe Called Quest — Beats, Rhymes and Life (1996)',
      'Common — Like Water for Chocolate (2000)',
      'Erykah Badu — Mama\'s Gun (2000)',
      'D\'Angelo — Voodoo (2000)',
    ],
    seo: {
      title: 'J Dilla Vinyl Records | Digging in the Sales Crates',
      description: 'Find J Dilla vinyl records across Discogs, eBay, and CDandLP. Shop Donuts, Ruff Draft, Slum Village, and rare Stones Throw pressings.',
    },
  },

  'cannibal-ox': {
    slug: 'cannibal-ox',
    name: 'Cannibal Ox',
    tagline: 'El-P\'s coldest production. Vast Aire\'s sharpest pen.',
    genres: ['Hip-Hop', 'Underground'],
    searchTerms: {
      discogs: 'Cannibal Ox',
      ebay: 'Cannibal Ox vinyl',
      cdandlp: 'Cannibal Ox',
    },
    bio: [
      'Cannibal Ox is Vast Aire and Vordul Mega — a Harlem rap duo whose 2001 debut The Cold Vein, produced entirely by El-P, is considered one of the most important underground hip-hop albums ever made. Dark, cinematic, and claustrophobic in the best way.',
      'Original pressings of The Cold Vein on Definitive Jux are the grail. Reissues exist, but collectors want the original. The duo released Blade of the Ronin in 2015 and a handful of follow-ups, but The Cold Vein is what the market chases.',
      'This is deep-crates territory. The person searching Cannibal Ox knows exactly what they\'re looking for.',
    ],
    essentialRecords: [
      { title: 'The Cold Vein', year: 2001, label: 'Definitive Jux' },
      { title: 'Blade of the Ronin', year: 2015, label: 'Brick' },
      { title: 'Iron Galaxy', year: 2012, label: 'Block Recordz' },
      { title: 'Vast Aire — Look Mom... No Hands', year: 2004, label: 'Def Jux' },
    ],
    producerCredits: ['El-P'],
    seo: {
      title: 'Cannibal Ox Vinyl Records | Digging in the Sales Crates',
      description: 'Find Cannibal Ox vinyl records across Discogs, eBay, and CDandLP. Shop The Cold Vein, Blade of the Ronin, and rare Definitive Jux pressings.',
    },
  },

  'fatback-band': {
    slug: 'fatback-band',
    name: 'Fatback Band',
    tagline: 'The Brooklyn funk machine that ran from \'70 to forever.',
    genres: ['Funk', 'Soul'],
    searchTerms: {
      discogs: 'Fatback Band',
      ebay: 'Fatback Band vinyl',
      cdandlp: 'Fatback Band',
    },
    bio: [
      'The Fatback Band formed in Brooklyn in 1970 and spent the next 15 years cranking out some of the most sample-rich funk and soul in the canon. Bill Curtis kept the drum grooves tight; the horns did the rest.',
      'Their catalog is a goldmine for diggers. "I Found Lovin\'," "King Tim III" (one of the earliest hip-hop recordings on wax), and their Spring/Perception label records are all in demand. Easy to find, easy to spend an afternoon getting lost in.',
      'A band where quantity doesn\'t kill quality — they put out a lot of records, and a lot of them are excellent.',
    ],
    essentialRecords: [
      { title: 'Yum Yum (Gimme Some)', year: 1975, label: 'Spring' },
      { title: 'Night Fever', year: 1976, label: 'Spring' },
      { title: 'NYCNYUSA', year: 1977, label: 'Spring' },
      { title: 'Fatback', year: 1980, label: 'Spring' },
      { title: '14 Karat Soul', year: 1982, label: 'Spring' },
      { title: 'Is This the Future?', year: 1983, label: 'Spring' },
    ],
    producerCredits: ['Bill Curtis'],
    seo: {
      title: 'Fatback Band Vinyl Records | Digging in the Sales Crates',
      description: 'Find Fatback Band vinyl records across Discogs, eBay, and CDandLP. Shop rare funk and soul 45s and LPs from the Spring Records catalog.',
    },
  },

  'michael-jackson': {
    slug: 'michael-jackson',
    name: 'Michael Jackson',
    tagline: 'The most collected pop catalog on wax.',
    genres: ['Pop', 'R&B', 'Soul'],
    searchTerms: {
      discogs: 'Michael Jackson',
      ebay: 'Michael Jackson vinyl',
      cdandlp: 'Michael Jackson',
    },
    bio: [
      'Michael Jackson\'s Thriller (1982) is the best-selling album of all time and one of the most collected records on the planet. Original pressings on Epic, Japanese pressings, picture discs, and promo copies all command serious prices — and they move fast.',
      'His catalog from Off the Wall (1979) through Dangerous (1991) covers the peak of his creative run, and each album has its own collector submarket. Japanese and German pressings are particularly sought after for audio quality.',
      'For vinyl collectors, MJ is a blue-chip pick: easy to find entry-level copies, hard to find the grails.',
    ],
    essentialRecords: [
      { title: 'Thriller', year: 1982, label: 'Epic' },
      { title: 'Off the Wall', year: 1979, label: 'Epic' },
      { title: 'Bad', year: 1987, label: 'Epic' },
      { title: 'Dangerous', year: 1991, label: 'Epic' },
      { title: 'The Jacksons — Destiny', year: 1978, label: 'Epic' },
      { title: 'Got to Be There', year: 1972, label: 'Motown' },
    ],
    producerCredits: ['Quincy Jones', 'Rod Temperton', 'Bill Bottrell'],
    seo: {
      title: 'Michael Jackson Vinyl Records | Digging in the Sales Crates',
      description: 'Find Michael Jackson vinyl records across Discogs, eBay, and CDandLP. Shop Thriller, Off the Wall, Bad, and rare Japanese pressings.',
    },
  },

  'mf-doom': {
    slug: 'mf-doom',
    name: 'MF DOOM',
    tagline: 'All caps when you spell the man\'s name.',
    genres: ['Hip-Hop', 'Underground'],
    searchTerms: {
      discogs: 'MF DOOM',
      ebay: 'MF DOOM vinyl',
      cdandlp: 'MF DOOM',
    },
    bio: [
      'Daniel Dumile — MF DOOM, Viktor Vaughn, King Geedorah, Metal Fingers — was the most meticulous wordsmith in underground hip-hop. Born in London and raised on Long Island, he returned to music in 1999 with a metal mask and Operation: Doomsday, one of the most original debut albums in rap history.',
      'His 2004 collaboration with Madlib, Madvillainy on Stones Throw, is widely considered the greatest underground hip-hop record ever made. MM..FOOD followed the same year. His catalog under multiple aliases is dense, rewarding, and endlessly re-listenable.',
      'DOOM passed away on October 31, 2020. Original pressings of Operation: Doomsday on Fondle \'Em are among the most sought-after records in hip-hop collecting — rare, expensive, and worth every penny. Stones Throw pressings of Madvillainy are nearly as fierce. Note: original Fondle \'Em copies are among the most counterfeited records in hip-hop — always verify matrix etchings before buying.',
    ],
    essentialRecords: [
      { title: 'Madvillain — Madvillainy', year: 2004, label: 'Stones Throw' },
      { title: 'Operation: Doomsday', year: 1999, label: 'Fondle \'Em' },
      { title: 'MM..FOOD', year: 2004, label: 'Metal Face' },
      { title: 'Viktor Vaughn — Vaudeville Villain', year: 2003, label: 'Sound-Ink' },
      { title: 'King Geedorah — Take Me to Your Leader', year: 2003, label: 'Big Dada' },
      { title: 'Danger Doom — The Mouse and the Mask', year: 2005, label: 'Epitaph' },
      { title: 'Born Like This', year: 2009, label: 'Lex' },
    ],
    producerCredits: [
      'Madlib — Madvillainy (2004)',
      'Danger Mouse — The Mouse and the Mask (2005)',
      'Self-produced — Operation: Doomsday, MM..FOOD',
    ],
    seo: {
      title: 'MF DOOM Vinyl Records | Digging in the Sales Crates',
      description: 'Find MF DOOM vinyl records across Discogs, eBay, and CDandLP. Shop Madvillainy, Operation: Doomsday, MM..FOOD, and rare Fondle \'Em pressings.',
    },
  },

  'the-beatles': {
    slug: 'the-beatles',
    name: 'The Beatles',
    tagline: 'The most collected catalog in the history of recorded music.',
    genres: ['Rock', 'Pop', 'Psychedelic'],
    searchTerms: {
      discogs: 'The Beatles',
      ebay: 'Beatles vinyl pressing',
      cdandlp: 'The Beatles',
    },
    bio: [
      'No catalog attracts more collector attention than The Beatles. UK Parlophone originals from 1963–1966 are the grail — first pressings identified by specific matrix etchings, label variations, and sleeve conditions that collectors have documented obsessively for decades.',
      'The mono vs. stereo debate is central to Beatles collecting. Early albums were mixed in mono first, and many collectors argue the mono versions are the definitive ones. Original UK mono pressings of Rubber Soul, Revolver, and Sgt. Pepper\'s command serious premiums over their stereo counterparts.',
      'The Apple Records era (1968 onward) has its own collector market — early UK pressings of the White Album, Abbey Road, and Let It Be with original inserts and posters intact are increasingly hard to find in strong condition. Japanese and German pressings are also sought after for audio quality.',
    ],
    essentialRecords: [
      { title: 'Please Please Me', year: 1963, label: 'Parlophone (UK)' },
      { title: 'Rubber Soul', year: 1965, label: 'Parlophone (UK)' },
      { title: 'Revolver', year: 1966, label: 'Parlophone (UK)' },
      { title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967, label: 'Parlophone (UK)' },
      { title: 'The Beatles (White Album)', year: 1968, label: 'Apple' },
      { title: 'Abbey Road', year: 1969, label: 'Apple' },
      { title: 'Let It Be', year: 1970, label: 'Apple' },
    ],
    producerCredits: [
      'George Martin (all studio albums)',
      'Phil Spector — Let It Be (1970)',
    ],
    seo: {
      title: 'The Beatles Vinyl Records | Digging in the Sales Crates',
      description: 'Find Beatles vinyl records across Discogs, eBay, and CDandLP. Shop UK Parlophone originals, mono pressings, Apple Records, and rare first pressings.',
    },
  },

  'the-moments': {
    slug: 'the-moments',
    name: 'The Moments',
    tagline: 'Hackensack soul. Proper and timeless.',
    genres: ['Soul', 'R&B'],
    searchTerms: {
      discogs: 'The Moments',
      ebay: 'The Moments vinyl soul',
      cdandlp: 'The Moments',
    },
    bio: [
      'The Moments were a New Jersey soul vocal group who recorded for Sylvia Robinson\'s All Platinum / Stang label through the 1970s. Smooth, unhurried harmonies over classic soul arrangements — this is Sunday afternoon music.',
      '"Love on a Two-Way Street" (1970) is their signature and a deeply sampled track. "Sexy Mama" and "Dolly My Love" rounded out their run of charting singles. Stang 45s are the format of choice for collectors — affordable entry point, huge catalog to explore.',
      'Later, the group evolved into Ray, Goodman & Brown and kept recording into the 1980s.',
    ],
    essentialRecords: [
      { title: 'Love on a Two-Way Street', year: 1970, label: 'Stang' },
      { title: 'Sexy Mama', year: 1973, label: 'Stang' },
      { title: 'My Thing', year: 1973, label: 'Stang' },
      { title: 'Look at Me (I\'m in Love)', year: 1975, label: 'All Platinum' },
      { title: 'Dolly My Love', year: 1975, label: 'All Platinum' },
    ],
    producerCredits: ['Sylvia Robinson'],
    seo: {
      title: 'The Moments Vinyl Records | Digging in the Sales Crates',
      description: 'Find The Moments vinyl records across Discogs, eBay, and CDandLP. Shop Love on a Two-Way Street, Stang 45s, and classic All Platinum soul.',
    },
  },


  'john-coltrane': {
    slug: 'john-coltrane',
    name: 'John Coltrane',
    tagline: 'The sound of searching. Jazz\'s most collected saxophonist.',
    genres: ['Jazz', 'Spiritual Jazz', 'Hard Bop'],
    searchTerms: {
      discogs: 'John Coltrane',
      ebay: 'John Coltrane vinyl',
      cdandlp: 'John Coltrane',
    },
    bio: [
      'John Coltrane recorded for three labels that define jazz collecting: Blue Note, Atlantic, and Impulse!. Each era sounds different, and each era\'s original pressings are chased hard. Blue Train (1958) is the Blue Note grail; originals with the deep groove and 47 West 63rd Street address routinely outperform reissues by 300 to 500 percent.',
      'The Atlantic years gave us Giant Steps and My Favorite Things; look for bullseye labels on the earliest pressings. The Impulse! era (A Love Supreme through the late spiritual work) is the most affordable entry point, with orange-and-black spine originals still surfacing at fair prices. RVG stamps in the dead wax mean Rudy Van Gelder cut the master.',
      'Coltrane\'s catalog is deep enough to collect for a lifetime, and liquid enough that prices are transparent. Know your pressing variants before paying collector money; the same title spans two figures to four depending on label address and dead wax.',
    ],
    essentialRecords: [
      { title: 'Blue Train', year: 1958, label: 'Blue Note' },
      { title: 'Giant Steps', year: 1960, label: 'Atlantic' },
      { title: 'My Favorite Things', year: 1961, label: 'Atlantic' },
      { title: 'A Love Supreme', year: 1965, label: 'Impulse!' },
      { title: 'Ballads', year: 1963, label: 'Impulse!' },
      { title: 'Crescent', year: 1964, label: 'Impulse!' },
    ],
    producerCredits: ['Alfred Lion (Blue Note)', 'Nesuhi Ertegun (Atlantic)', 'Bob Thiele (Impulse!)', 'Rudy Van Gelder (engineer)'],
    seo: {
      title: 'John Coltrane Vinyl Records | Digging in the Sales Crates',
      description: 'Find John Coltrane vinyl across Discogs, eBay, and CDandLP. Shop Blue Train, Giant Steps, A Love Supreme, and original Blue Note, Atlantic, and Impulse! pressings.',
    },
  },

  'eric-b-and-rakim': {
    slug: 'eric-b-and-rakim',
    name: 'Eric B. & Rakim',
    tagline: 'The blueprint. Every MC after 1987 is downstream.',
    genres: ['Hip-Hop', 'Golden Era'],
    searchTerms: {
      discogs: 'Eric B. & Rakim',
      ebay: 'Eric B Rakim vinyl',
      cdandlp: 'Eric B Rakim',
    },
    bio: [
      'Rakim rewrote the rules of MCing: internal rhyme schemes, laid-back delivery, complexity that made everything before it sound simple. Over Eric B.\'s James Brown-heavy production, the duo cut four albums between 1987 and 1992 that anchor any Golden Era collection.',
      'Paid in Full (1987) is the essential document. Original Fourth & Broadway pressings are getting scarce in clean condition, and the earlier Zakia 12" of "Eric B. Is President" b/w "My Melody" (1986) is the real grail; original Zakia copies command serious money. The Coldcut "Seven Minutes of Madness" remix 12" of "Paid in Full" is its own collecting lane.',
      'The albums stayed in print through various reissues, so check labels and dead wax before paying original-pressing prices. The 12" singles catalog (I Know You Got Soul, Follow the Leader, Microphone Fiend) is an affordable way in and where a lot of the DJ history lives.',
    ],
    essentialRecords: [
      { title: 'Paid in Full', year: 1987, label: 'Fourth & Broadway' },
      { title: 'Follow the Leader', year: 1988, label: 'Uni' },
      { title: 'Let the Rhythm Hit \'Em', year: 1990, label: 'MCA' },
      { title: 'Don\'t Sweat the Technique', year: 1992, label: 'MCA' },
      { title: 'Eric B. Is President / My Melody 12"', year: 1986, label: 'Zakia' },
    ],
    producerCredits: ['Eric B.', 'Rakim', 'Large Professor (uncredited, Let the Rhythm Hit \'Em)'],
    seo: {
      title: 'Eric B. & Rakim Vinyl Records | Digging in the Sales Crates',
      description: 'Find Eric B. & Rakim vinyl across Discogs, eBay, and CDandLP. Shop Paid in Full, Follow the Leader, and the rare Zakia 12" pressings.',
    },
  },

};

export const GENRES = {

  'golden-era-hip-hop': {
    slug: 'golden-era-hip-hop',
    name: 'Golden Era Hip-Hop Vinyl',
    tagline: '1988–1998. The decade that built the canon.',
    genres: ['Hip-Hop'],
    searchTerms: {
      discogs: 'golden era hip hop',
      ebay: 'golden era hip hop vinyl',
      cdandlp: 'hip hop vinyl',
    },
    bio: [
      'Golden Era hip-hop covers roughly 1988–1998 — from It Takes a Nation of Millions through the end of the No Limit / Cash Money era. This is the most actively traded period in hip-hop vinyl, with original pressings of albums by Nas, Biggie, Wu-Tang, EPMD, Gang Starr, and others commanding serious premiums.',
      'The crates reward patience. Original pressings of Illmatic, Ready to Die, and Enter the Wu-Tang on Loud are increasingly scarce in strong condition. Promo copies and regional pressings surface on Discogs regularly for those paying attention.',
      'Golden Era vinyl is where hip-hop collecting starts for most people — and often where it stays.',
    ],
    essentialRecords: [
      { title: 'Nas — Illmatic', year: 1994, label: 'Columbia' },
      { title: 'The Notorious B.I.G. — Ready to Die', year: 1994, label: 'Bad Boy' },
      { title: 'Wu-Tang Clan — Enter the Wu-Tang (36 Chambers)', year: 1993, label: 'Loud' },
      { title: 'EPMD — Strictly Business', year: 1988, label: 'Fresh' },
      { title: 'Gang Starr — Step in the Arena', year: 1991, label: 'Chrysalis' },
      { title: 'Pete Rock & CL Smooth — Mecca and the Soul Brother', year: 1992, label: 'Elektra' },
      { title: 'A Tribe Called Quest — The Low End Theory', year: 1991, label: 'Jive' },
      { title: 'De La Soul — 3 Feet High and Rising', year: 1989, label: 'Tommy Boy' },
      { title: 'Eric B. & Rakim — Paid in Full', year: 1987, label: 'Fourth & Broadway' },
      { title: 'Public Enemy — It Takes a Nation of Millions', year: 1988, label: 'Def Jam' },
    ],
    producerCredits: [],
    seo: {
      title: 'Golden Era Hip-Hop Vinyl Records | Digging in the Sales Crates',
      description: 'Find Golden Era hip-hop vinyl across Discogs, eBay, and CDandLP. Shop rare pressings of Nas, Biggie, Wu-Tang, Gang Starr, and more.',
    },
  },

  'japanese-jazz': {
    slug: 'japanese-jazz',
    name: 'Japanese Jazz Vinyl',
    tagline: 'Tokyo pressings. The audiophile\'s holy grail.',
    genres: ['Jazz'],
    searchTerms: {
      discogs: 'japan pressing jazz vinyl',
      ebay: 'japanese jazz pressing vinyl',
      cdandlp: 'japan jazz pressing',
    },
    bio: [
      'Japanese pressings of jazz records — particularly Victor, Toshiba EMI, and King Records releases from the 1970s — are considered among the finest vinyl pressings ever made. Quiet surfaces, heavy vinyl, exceptional mastering. American collectors actively import them.',
      'The major labels pressed domestic Japanese editions of Blue Note, Impulse!, Prestige, and Verve titles that routinely outperform their American originals in playback quality. King Records and Trio labels are the ones to know.',
      'Prices have climbed steadily as Western collectors discovered the format. A patient eye on Discogs and CDandLP — which has strong European inventory — will still turn up bargains.',
    ],
    essentialRecords: [
      { title: 'Miles Davis — Kind of Blue (CBS/Sony Japan)', year: 1979, label: 'CBS/Sony Japan' },
      { title: 'John Coltrane — A Love Supreme (Impulse! / King)', year: 1976, label: 'King Records Japan' },
      { title: 'Bill Evans — Waltz for Debby (Riverside / King)', year: 1975, label: 'King Records Japan' },
      { title: 'Herbie Hancock — Head Hunters (CBS/Sony Japan)', year: 1978, label: 'CBS/Sony Japan' },
      { title: 'Lee Morgan — The Sidewinder (Blue Note / King)', year: 1975, label: 'King Records Japan' },
      { title: 'Art Blakey — Moanin\' (Blue Note / King)', year: 1974, label: 'King Records Japan' },
    ],
    producerCredits: [],
    seo: {
      title: 'Japanese Jazz Vinyl Records | Digging in the Sales Crates',
      description: 'Find Japanese jazz vinyl pressings across Discogs, eBay, and CDandLP. Shop King Records, CBS/Sony Japan, and Toshiba EMI audiophile pressings.',
    },
  },

};
