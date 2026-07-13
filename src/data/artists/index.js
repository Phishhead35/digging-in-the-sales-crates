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

  'tupac': {
    slug: 'tupac',
    name: 'Tupac Shakur',
    tagline: 'The most urgent voice in hip-hop history. Still moving vinyl.',
    genres: ['Hip-Hop', 'West Coast'],
    searchTerms: {
      discogs: '2Pac',
      ebay: '2Pac vinyl',
      cdandlp: '2Pac',
    },
    ebayUrlOverride: 'https://www.ebay.com/sch/i.html?_nkw=2Pac+Tupac+vinyl&_sacat=0&_from=R40&_trksid=m570.l1313&mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=5339145834&toolid=10001&customid=ditsc',
    bio: [
      'Tupac Shakur released five studio albums before his death at 25 in September 1996, and the posthumous catalog has kept coming ever since. His 1995 album Me Against the World — recorded while he was incarcerated — debuted at number one on the Billboard 200 and remains one of the most emotionally direct rap records ever made.',
      'All Eyez on Me (1996), his Death Row debut, was a double album that moved in two directions at once: raw West Coast party rap on disc one, dense introspective writing on disc two. The Don Killuminati: The 7 Day Theory — released under the Makaveli alias just two months after his death — hits differently knowing the timeline.',
      'Death Row Records vinyl is where collectors focus. Original pressings of All Eyez on Me and The Don Killuminati are increasingly hard to find unscratched. Interscope pressings of his early Jive-era work surface less often. The market is active and prices have climbed steadily.',
    ],
    essentialRecords: [
      { title: '2Pacalypse Now', year: 1991, label: 'Interscope' },
      { title: 'Strictly 4 My N.I.G.G.A.Z.', year: 1993, label: 'Interscope' },
      { title: 'Me Against the World', year: 1995, label: 'Interscope' },
      { title: 'All Eyez on Me', year: 1996, label: 'Death Row' },
      { title: 'The Don Killuminati: The 7 Day Theory', year: 1996, label: 'Death Row' },
      { title: 'R U Still Down? (Remember Me)', year: 1997, label: 'Amaru / Jive' },
    ],
    producerCredits: [
      'Dr. Dre — California Love, All Eyez on Me',
      'DJ Quik — several Death Row-era tracks',
      'Johnny "J" — Me Against the World, All Eyez on Me',
      'Shock G — 2Pacalypse Now',
      'RZA — "Can U Get Away" (Me Against the World)',
    ],
    seo: {
      title: 'Tupac Shakur Vinyl Records | Digging in the Sales Crates',
      description: 'Find Tupac Shakur vinyl records across Discogs, eBay, and CDandLP. Shop 2Pac\'s Death Row pressings, Me Against the World, All Eyez on Me, and Makaveli.',
    },
  },

  'naughty-by-nature': {
    slug: 'naughty-by-nature',
    name: 'Naughty by Nature',
    tagline: 'East Orange, NJ. They didn\'t want rap — they needed it.',
    genres: ['Hip-Hop', 'East Coast'],
    searchTerms: {
      discogs: 'Naughty by Nature',
      ebay: 'Naughty by Nature vinyl',
      cdandlp: 'Naughty by Nature',
    },
    bio: [
      'Naughty by Nature — Treach, Vin Rock, and DJ Kay Gee — came out of East Orange, New Jersey in 1991 with one of the most immediate debut singles in hip-hop history. "O.P.P." flipped the Jackson 5\'s "ABC" into a street anthem that spent 18 weeks on the Billboard Hot 100. The self-titled debut on Tommy Boy is a stone classic.',
      '19 Naughty III (1993) pushed harder: "Hip Hop Hooray" became the crossover moment, but the deep cuts — "The Hood Comes First," "Daddy Was a Street Corner" — showed the range. Poverty\'s Paradise (1995) won the Grammy for Best Rap Album and remains underrated relative to what came before it.',
      'Tommy Boy Records 12" singles are what crate diggers chase. "O.P.P." original pressings show up on Discogs regularly. The albums are accessible and affordable — strong entry point for East Coast collectors who want catalog depth without the premium prices of the elite tier.',
    ],
    essentialRecords: [
      { title: 'Naughty by Nature', year: 1991, label: 'Tommy Boy' },
      { title: '19 Naughty III', year: 1993, label: 'Tommy Boy' },
      { title: 'Poverty\'s Paradise', year: 1995, label: 'Tommy Boy' },
      { title: 'O.P.P. (12" single)', year: 1991, label: 'Tommy Boy' },
      { title: 'Hip Hop Hooray (12" single)', year: 1993, label: 'Tommy Boy' },
      { title: 'Feel Me Flow (12" single)', year: 1995, label: 'Tommy Boy' },
    ],
    producerCredits: [
      'DJ Kay Gee — self-titled debut, 19 Naughty III',
      'Kay Gee and L.E.S. — Poverty\'s Paradise',
      'Queen Latifah — executive produced debut (Flavor Unit connection)',
    ],
    seo: {
      title: 'Naughty by Nature Vinyl Records | Digging in the Sales Crates',
      description: 'Find Naughty by Nature vinyl records across Discogs, eBay, and CDandLP. Shop O.P.P., Hip Hop Hooray, and Tommy Boy pressings from one of NJ\'s finest.',
    },
  },

  'wu-tang-clan': {
    slug: 'wu-tang-clan',
    name: 'Wu-Tang Clan',
    tagline: 'Staten Island. Nine MCs. One of the most important groups in rap history.',
    genres: ['Hip-Hop', 'East Coast'],
    searchTerms: {
      discogs: 'Wu-Tang Clan',
      ebay: 'Wu-Tang Clan vinyl',
      cdandlp: 'Wu-Tang Clan',
    },
    bio: [
      'The Wu-Tang Clan released Enter the Wu-Tang (36 Chambers) on Loud Records in 1993 and changed hip-hop permanently. Nine MCs from Staten Island, production from RZA built on chopped soul samples and martial arts movie audio — raw, cinematic, and unlike anything else in the game. Original Loud pressings are among the most sought-after records in hip-hop collecting.',
      'Wu-Tang Forever (1997) arrived as a double album and debuted at number one. The production had evolved: bigger, more layered, still unmistakably RZA. The W (2000) and Iron Flag (2001) followed. Each member\'s solo output added another layer to one of the most interconnected catalogs in rap — GZA\'s Liquid Swords, Raekwon\'s Only Built 4 Cuban Linx, Ghostface\'s Ironman, Method Man\'s Tical.',
      'Wu-Tang vinyl collecting is its own subculture. The clan\'s deal with Loud allowed members to sign solo deals with other labels, which means the catalog is spread across Loud, Def Jam, Epic, Elektra, and more. Original pressings of 36 Chambers, Liquid Swords, and Only Built 4 Cuban Linx are all serious grails. See also the Ol\' Dirty Bastard page for ODB solo collecting.',
    ],
    essentialRecords: [
      { title: 'Enter the Wu-Tang (36 Chambers)', year: 1993, label: 'Loud' },
      { title: 'Wu-Tang Forever', year: 1997, label: 'Loud / RCA' },
      { title: 'The W', year: 2000, label: 'Loud' },
      { title: 'GZA — Liquid Swords', year: 1995, label: 'Geffen' },
      { title: 'Raekwon — Only Built 4 Cuban Linx...', year: 1995, label: 'Loud' },
      { title: 'Ghostface Killah — Ironman', year: 1996, label: 'Epic' },
      { title: 'Method Man — Tical', year: 1994, label: 'Def Jam' },
      { title: 'Inspectah Deck — Uncontrolled Substance', year: 1999, label: 'Loud' },
    ],
    producerCredits: [
      'RZA — Enter the Wu-Tang, Wu-Tang Forever, The W, all solo albums',
      'True Master — contributed to Wu-Tang Forever onward',
      'Mathematics — The W, Iron Flag',
    ],
    seo: {
      title: 'Wu-Tang Clan Vinyl Records | Digging in the Sales Crates',
      description: 'Find Wu-Tang Clan vinyl records across Discogs, eBay, and CDandLP. Shop 36 Chambers, Wu-Tang Forever, and rare Loud Records pressings.',
    },
  },

  'madonna': {
    slug: 'madonna',
    name: 'Madonna',
    tagline: 'The most sampled woman in hip-hop. The most collectable pop catalog outside the Beatles.',
    genres: ['Pop', 'Dance', 'R&B'],
    searchTerms: {
      discogs: 'Madonna',
      ebay: 'Madonna vinyl',
      cdandlp: 'Madonna',
    },
    bio: [
      'Madonna\'s Sire Records catalog — from her 1983 debut through Like a Prayer (1989) — is one of the most actively traded pop catalogs in the vinyl market. Original Sire pressings, especially UK and German editions, command premiums over domestic US copies. Her 12" single catalog is enormous and widely collected: "Holiday," "Lucky Star," "Material Girl," "Like a Virgin," and dozens more.',
      'Like a Prayer (1989) is the critical and commercial peak for collectors. The original Sire pressing with the prayer book insert intact is the one to find. The album\'s production — Patrick Leonard and Prince each contributed — holds up as one of the best-sounding pop records of the decade.',
      'The hip-hop connection runs deep. Her vocal samples have appeared in tracks by Jay-Z, Missy Elliott, and others, and "Justify My Love" drew from industrial and hip-hop production techniques. For crate diggers, her 12" singles in VG+ or better condition are steady flips — buy at estate sales, sell on Discogs.',
    ],
    essentialRecords: [
      { title: 'Madonna', year: 1983, label: 'Sire' },
      { title: 'Like a Virgin', year: 1984, label: 'Sire' },
      { title: 'True Blue', year: 1986, label: 'Sire' },
      { title: 'Like a Prayer', year: 1989, label: 'Sire' },
      { title: 'The Immaculate Collection', year: 1990, label: 'Sire' },
      { title: 'Erotica', year: 1992, label: 'Maverick / Sire' },
      { title: 'Ray of Light', year: 1998, label: 'Maverick / Warner' },
    ],
    producerCredits: [
      'Nile Rodgers — Like a Virgin (1984)',
      'Patrick Leonard — True Blue, Like a Prayer',
      'Prince — "Love Song" on Like a Prayer',
      'William Orbit — Ray of Light (1998)',
    ],
    seo: {
      title: 'Madonna Vinyl Records | Digging in the Sales Crates',
      description: 'Find Madonna vinyl records across Discogs, eBay, and CDandLP. Shop Like a Prayer, Like a Virgin, rare Sire pressings, and her massive 12" single catalog.',
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
