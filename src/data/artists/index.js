// ─────────────────────────────────────────────────────────────
//  DITSC Artist & Genre Data
//  Add a new entry here + a route in App.jsx to publish a page.
//  searchTerms drive the Discogs / eBay / CDandLP buttons.
//
//  amazonEligible: true turns on an Amazon Associates search button for
//  this artist, on both the artist page and any blog post that lists them
//  in shopArtists. Only set it when Amazon's vinyl catalog clearly carries
//  the artist — reissues through a major label or a real reissue house
//  (Get On Down, Craft Recordings, UMe, Rhino, and similar). Amazon's
//  catalog skews new pressings and reissues, so a search link on a small
//  or deep-crates label is more likely to land on nothing, or on unrelated
//  merch, than to convert. amazonSearchTerm overrides the default
//  "<name> vinyl" query, same idea as ebayUrlOverride above it.
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
    // Reissues of Return to the 36 Chambers circulate widely (Get On Down's
    // Wu-Tang reissue series covers exactly this era). The apostrophe in
    // "Ol'" caused enough trouble for eBay to need a plain-text override
    // above, so Amazon gets the same plain-text term rather than testing it.
    amazonEligible: true,
    amazonSearchTerm: 'Old Dirty Bastard vinyl',
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
    // Donuts has stayed in active vinyl print through Stones Throw for
    // years. One of the safest bets on this whole list.
    amazonEligible: true,
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
    // Not eligible. The Cold Vein's original Definitive Jux pressing is
    // deep-crates territory, and most of the catalog hasn't been reissued.
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
    // Not eligible. Spring Records catalog, no evidence of a real Amazon-
    // scale reissue presence, same bar as Cannibal Ox and The Moments.
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
    // Epic/Legacy keeps this catalog in heavy vinyl print. As safe a bet
    // as this list has.
    amazonEligible: true,
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
    // Madvillainy, MM..FOOD, and Operation: Doomsday have all had official
    // reissue runs, and demand since 2020 has kept them in circulation.
    amazonEligible: true,
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
    // UMe's reissue program keeps this catalog permanently in print.
    amazonEligible: true,
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
    // Not eligible. All Platinum/Stang is a small soul singles label with
    // no real Amazon-scale reissue presence, same bar as Fatback Band.
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
    // Interscope/Death Row catalog reissues are widely available. Search
    // term matches the "2Pac" phrasing already used everywhere else on
    // this entry rather than the page's display name.
    amazonEligible: true,
    amazonSearchTerm: '2Pac vinyl',
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
    // Not flagged yet. Tommy Boy has reissued some of this catalog, but
    // not confidently enough to call it "clearly carried." Worth checking
    // Amazon directly and flipping to true if you find real stock.
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
    // 36 Chambers and the group's landmark solo albums have a well-
    // documented, active reissue history. Confident yes.
    amazonEligible: true,
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
    // Sire/Rhino has kept this catalog in active reissue. Confident yes.
    amazonEligible: true,
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
    // Blue Note, Atlantic, and Impulse! all run active reissue programs
    // (Craft Recordings among them) covering this exact catalog.
    amazonEligible: true,
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
    // Not flagged yet. Paid in Full is a landmark record that may well have
    // a real reissue on Amazon, but I don't have solid enough footing to
    // call it "clearly." Worth checking directly before flipping to true.
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

  'boogie-down-productions': {
    slug: 'boogie-down-productions',
    name: 'Boogie Down Productions',
    tagline: 'South Bronx, 1986. KRS-One and Scott La Rock built the blueprint for conscious hip-hop.',
    genres: ['Hip-Hop', 'Golden Era'],
    searchTerms: {
      discogs: 'Boogie Down Productions',
      ebay: 'Boogie Down Productions vinyl',
      cdandlp: 'Boogie Down Productions',
    },
    // Not flagged yet. Criminal Minded may have a real reissue in
    // circulation, but same reasoning as Eric B. & Rakim: check first.
    bio: [
      'Boogie Down Productions formed in the South Bronx in 1986 around KRS-One and DJ Scott La Rock. Their 1987 debut, Criminal Minded, is one of hip-hop\'s foundational records: raw, minimal, and built from James Brown breaks and dancehall reggae inflections that few rap records were using yet. Scott La Rock was murdered months after its release, at just 25 years old.',
      'KRS-One kept the group going, and By All Means Necessary (1988) turned BDP into hip-hop\'s most visible political voice. Its cover, a direct nod to a famous Malcolm X photograph, signaled the shift; "My Philosophy" and "Stop the Violence" became genre-defining statements. Ghetto Music: The Blueprint of Hip Hop and Edutainment followed, cementing KRS-One\'s reputation as "The Teacher."',
      'Original B-Boy Records pressings of Criminal Minded are the real grail here: hard to find in strong condition and expensive when they surface. The Jive-era albums, from By All Means Necessary through Sex and Violence, are more accessible entry points. KRS-One went fully solo after 1992, and Return of the Boom Bap (1993) is often collected alongside the BDP catalog as a continuation of the same body of work.',
    ],
    essentialRecords: [
      { title: 'Criminal Minded', year: 1987, label: 'B-Boy Records' },
      { title: 'By All Means Necessary', year: 1988, label: 'Jive' },
      { title: 'Ghetto Music: The Blueprint of Hip Hop', year: 1989, label: 'Jive' },
      { title: 'Edutainment', year: 1990, label: 'Jive' },
      { title: 'Sex and Violence', year: 1992, label: 'Jive' },
      { title: 'Return of the Boom Bap', year: 1993, label: 'Jive' },
    ],
    producerCredits: [
      'Scott La Rock — Criminal Minded (1987)',
      'KRS-One — self-produced, By All Means Necessary onward',
    ],
    seo: {
      title: 'Boogie Down Productions Vinyl Records | Digging in the Sales Crates',
      description: 'Find Boogie Down Productions and KRS-One vinyl across Discogs, eBay, and CDandLP. Shop Criminal Minded, By All Means Necessary, and rare B-Boy Records pressings.',
    },
  },

  'pete-rock': {
    slug: 'pete-rock',
    name: 'Pete Rock',
    tagline: 'The Soul Brother. Boom bap\'s most sampled sampler.',
    genres: ['Hip-Hop', 'Golden Era'],
    searchTerms: {
      discogs: 'Pete Rock',
      ebay: 'Pete Rock vinyl',
      cdandlp: 'Pete Rock',
    },
    // Not flagged yet. Mecca and the Soul Brother may have a real reissue
    // in circulation, but same reasoning as Eric B. & Rakim: check first.
    bio: [
      'Pete Rock is half of Pete Rock & CL Smooth and one of hip-hop\'s most influential producers, full stop. "They Reminisce Over You (T.R.O.Y.)," released April 2, 1992 as an Elektra 12" ahead of the album, is his signature: a tribute to Trouble T Roy of Heavy D & the Boyz, built from a loop of Tom Scott and The California Dreamers\' 1967 cover of Jefferson Airplane\'s "Today." Pete Rock flipped that same source two more times on the same album, on "Return of the Mecca" and "Skinz" — three different chops of one loop, and none of them sound repetitive.',
      'Mecca and the Soul Brother, the album built around T.R.O.Y., dropped June 9, 1992 on Elektra and is a cornerstone of golden-era boom bap: dense soul horns, drums mixed loud and dry. The Main Ingredient followed on November 8, 1994, also on Elektra — a tighter, moodier record and the duo\'s final album together, still underrated relative to Mecca.',
      'Pete Rock\'s solo debut, Soul Survivor, arrived November 10, 1998 on Loud/RCA, almost entirely self-produced. His outside production work runs deep too: he produced Nas\'s "The World Is Yours" (1994, Columbia), built from an Ahmad Jamal loop, and spent the mid-1990s on InI\'s Center of Attention, a shelved group album that finally surfaced in 2003 on BBE\'s Lost & Found: Hip Hop Underground Soul Classics. Deep-catalog territory for collectors chasing the full production discography, not just the CL Smooth albums.',
    ],
    essentialRecords: [
      { title: 'Pete Rock & CL Smooth — They Reminisce Over You (T.R.O.Y.) 12"', year: 1992, label: 'Elektra' },
      { title: 'Pete Rock & CL Smooth — Mecca and the Soul Brother', year: 1992, label: 'Elektra' },
      { title: 'Pete Rock & CL Smooth — The Main Ingredient', year: 1994, label: 'Elektra' },
      { title: 'Nas — The World Is Yours 12" (Pete Rock production)', year: 1994, label: 'Columbia' },
      { title: 'Soul Survivor', year: 1998, label: 'Loud / RCA' },
      { title: 'InI — Center of Attention (Lost & Found: Hip Hop Underground Soul Classics)', year: 2003, label: 'BBE' },
    ],
    producerCredits: [
      'Pete Rock — self-produced, Pete Rock & CL Smooth catalog and Soul Survivor',
      'Pete Rock — Nas, "The World Is Yours" (1994)',
      'Pete Rock — InI, Center of Attention (recorded mid-1990s, released 2003)',
    ],
    seo: {
      title: 'Pete Rock Vinyl Records | Digging in the Sales Crates',
      description: 'Find Pete Rock and Pete Rock & CL Smooth vinyl across Discogs, eBay, and CDandLP. Shop Mecca and the Soul Brother, T.R.O.Y., and rare Elektra pressings.',
    },
  },

  'marvin-gaye': {
    slug: 'marvin-gaye',
    name: 'Marvin Gaye',
    tagline: 'Motown\'s most fearless voice. Soul music\'s most sampled architect.',
    genres: ['Soul', 'R&B', 'Motown'],
    searchTerms: {
      discogs: 'Marvin Gaye',
      ebay: 'Marvin Gaye vinyl',
      cdandlp: 'Marvin Gaye',
    },
    partnerOverride: ['GOOD TASTE Records'],
    // Motown/Universal runs one of the most active reissue programs in
    // soul music, and What's Going On is a perennial vinyl reissue title.
    amazonEligible: true,
    bio: [
      'Marvin Gaye signed to Motown\'s Tamla label at the start of the 1960s and built one of the label\'s defining voices: "How Sweet It Is (to Be Loved by You)," "Ain\'t That Peculiar," and 1968\'s "I Heard It Through the Grapevine" (written by Norman Whitfield and Barrett Strong) became the biggest-selling single in Motown\'s history at the time. He was also the label\'s most consistent duet partner, first with Tammi Terrell on "Ain\'t No Mountain High Enough" and "You\'re All I Need to Get By," then with Diana Ross on the 1973 album Diana & Marvin.',
      'What\'s Going On (1971) changed the terms entirely. Gaye pushed Motown to release it against resistance and became one of the first artists at the label to produce his own work, opening the door to Let\'s Get It On (1973), I Want You (1976), and Here, My Dear (1978), a raw, deeply personal record built around the end of his first marriage. These albums, along with the What\'s Going On single itself, are among the most sampled recordings in hip-hop and R&B production.',
      'Gaye left Motown for Columbia Records in 1982 and returned immediately with "Sexual Healing" and its album Midnight Love, his biggest commercial hit and a two-time Grammy winner. He was shot and killed by his father on April 1, 1984, the day before his 45th birthday. Original Tamla pressings from the Motown years, along with Columbia\'s Midnight Love, form the backbone of Marvin Gaye collecting; the Diana & Marvin duet album is a smaller but steadily traded corner of the same catalog.',
    ],
    essentialRecords: [
      { title: 'What\'s Going On', year: 1971, label: 'Tamla' },
      { title: 'Let\'s Get It On', year: 1973, label: 'Tamla' },
      { title: 'I Want You', year: 1976, label: 'Tamla' },
      { title: 'Here, My Dear', year: 1978, label: 'Tamla' },
      { title: 'Midnight Love', year: 1982, label: 'Columbia' },
      { title: 'Diana Ross & Marvin Gaye — Diana & Marvin', year: 1973, label: 'Motown' },
    ],
    producerCredits: [
      'Norman Whitfield — "I Heard It Through the Grapevine" (1968)',
      'Marvin Gaye — self-produced, What\'s Going On (1971) onward',
      'Marvin Gaye and Ed Townsend — Let\'s Get It On (1973)',
    ],
    seo: {
      title: 'Marvin Gaye Vinyl Records | Digging in the Sales Crates',
      description: 'Find Marvin Gaye vinyl records across Discogs, eBay, and CDandLP. Shop What\'s Going On, Let\'s Get It On, Midnight Love, and rare Tamla and Motown pressings.',
    },
  },

  'dj-quik': {
    slug: 'dj-quik',
    name: 'DJ Quik',
    tagline: 'Compton. He built the G-funk blueprint before anyone called it that.',
    genres: ['Hip-Hop', 'West Coast'],
    searchTerms: {
      discogs: 'DJ Quik',
      ebay: 'DJ Quik vinyl',
      cdandlp: 'DJ Quik',
    },
    // Not eligible. Profile Records catalog, no strong evidence of an
    // Amazon-scale reissue presence.
    bio: [
      'David Blake, known everywhere as DJ Quik, released Quik Is the Name on Profile in January 1991, almost two years before The Chronic. The whole G-funk vocabulary is already on it: the high synth lead, the rolling bassline, the live-feel drums, the party-first Compton perspective. He produced all of it himself at twenty years old.',
      'He never stopped producing. Across Way 2 Fonky, Safe + Sound and Rhythm-al-ism he built a catalog that other West Coast records were measured against, and he spent the next three decades behind the boards for everyone from 2Pac to Jay-Z to Kendrick Lamar. Musicians who work with him tend to describe him as a bandleader more than a beatmaker.',
      'The collecting case is straightforward: Quik has never carried the Death Row markup despite getting there first. Original Profile pressings turn up at prices that look like mistakes next to comparable West Coast titles from the same years. Condition is the real hunt, because these were records people played rather than archived.',
    ],
    essentialRecords: [
      { title: 'Quik Is the Name', year: 1991, label: 'Profile' },
      { title: 'Way 2 Fonky', year: 1992, label: 'Profile' },
      { title: 'Safe + Sound', year: 1995, label: 'Profile' },
      { title: 'Rhythm-al-ism', year: 1998, label: 'Profile / Arista' },
      { title: 'Balance & Options', year: 2000, label: 'Arista' },
      { title: 'The Book of David', year: 2011, label: 'Mad Science' },
    ],
    producerCredits: [
      'DJ Quik, self-produced across his entire studio catalog',
      'Quik Is the Name (1991), produced start to finish at age twenty',
      'Later production for 2Pac, Snoop Dogg, Jay-Z and Kendrick Lamar',
    ],
    seo: {
      title: 'DJ Quik Vinyl Records | Digging in the Sales Crates',
      description: 'Find DJ Quik vinyl records across Discogs, eBay, and CDandLP. Shop Quik Is the Name, Way 2 Fonky, Safe + Sound, Rhythm-al-ism, and original Profile Records pressings.',
    },
  },

  'fleetwood-mac': {
    slug: 'fleetwood-mac',
    name: 'Fleetwood Mac',
    tagline: 'The best-selling record in every bin, and the deadwax decides what it is worth.',
    genres: ['Rock', 'Pop'],
    searchTerms: {
      discogs: 'Fleetwood Mac',
      ebay: 'Fleetwood Mac vinyl',
      cdandlp: 'Fleetwood Mac',
    },
    // Warner/Rhino keeps Rumours and the surrounding catalog in constant
    // vinyl reissue. Confident yes.
    amazonEligible: true,
    bio: [
      'Fleetwood Mac started in 1967 as a British blues band built around Peter Green, and became something else entirely once Lindsey Buckingham and Stevie Nicks joined in 1975. Both eras are worth digging. The blues records are scarcer; the Buckingham and Nicks records are everywhere, which is exactly what makes them interesting.',
      'Rumours (1977) is the one every store has. It sold in numbers that put a copy in nearly every American household with a turntable, and that ubiquity is why it belongs in a sample digger\'s crate as much as a rock collector\'s. Bone Thugs-N-Harmony built "Wind Blow" on "The Chain," and producers have been pulling from Warner Bros. rock of this era for decades precisely because the supply is endless.',
      'For collectors, Rumours is the clearest lesson in why pressing details matter more than catalog numbers. The US original is Warner Bros. BSK 3010, but Discogs documents multiple pressing plants under that same number, and they do not all sound alike. Two copies with identical jackets and labels can be a five dollar record and a serious one. Read the runout etchings, not the seller\'s title.',
    ],
    essentialRecords: [
      { title: 'Rumours', year: 1977, label: 'Warner Bros.' },
      { title: 'Fleetwood Mac', year: 1975, label: 'Reprise' },
      { title: 'Tusk', year: 1979, label: 'Warner Bros.' },
      { title: 'Mirage', year: 1982, label: 'Warner Bros.' },
      { title: 'Tango in the Night', year: 1987, label: 'Warner Bros.' },
      { title: 'Then Play On', year: 1969, label: 'Reprise' },
    ],
    producerCredits: [
      'Fleetwood Mac, Ken Caillat and Richard Dashut, Rumours (1977)',
      'Lindsey Buckingham, principal architect of the Tusk sessions (1979)',
      'Sampled by Bone Thugs-N-Harmony, "Wind Blow," from "The Chain"',
    ],
    seo: {
      title: 'Fleetwood Mac Vinyl Records | Digging in the Sales Crates',
      description: 'Find Fleetwood Mac vinyl records across Discogs, eBay, and CDandLP. Shop Rumours, Tusk, Mirage, Tango in the Night, and original Warner Bros. and Reprise pressings.',
    },
  },

};

export const GENRES = {

  // Neither genre page below is flagged amazonEligible. A broad genre-name
  // search ("golden era hip hop vinyl") is a far worse Amazon query than a
  // specific artist name; it's much more likely to return unrelated
  // inventory than a real result worth linking to.

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