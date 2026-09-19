// Levenshtein distance algorithm for fuzzy string matching
const levenshteinDistance = (str1, str2) => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const lenS1 = s1.length;
  const lenS2 = s2.length;
  
  const matrix = Array(lenS2 + 1)
    .fill(null)
    .map(() => Array(lenS1 + 1).fill(0));

  for (let i = 0; i <= lenS1; i += 1) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= lenS2; j += 1) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= lenS2; j += 1) {
    for (let i = 1; i <= lenS1; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[lenS2][lenS1];
};

// Calculate similarity score (0-100, 100 = exact match)
const calculateSimilarity = (str1, str2) => {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 100;
  
  const distance = levenshteinDistance(str1, str2);
  return Math.round(((maxLen - distance) / maxLen) * 100);
};

// Find the best fuzzy match from a dictionary of artists
// Returns { artist: artistObject, similarity: number } or null if no good match
export const fuzzyMatchArtist = (query, artistList, threshold = 70) => {
  if (!query || query.trim().length < 2) return null;

  const trimmedQuery = query.trim();
  let bestMatch = null;
  let bestSimilarity = threshold;

  for (const artist of artistList) {
    // Check the main name
    let similarity = calculateSimilarity(trimmedQuery, artist.name);
    
    // Check aliases as well, take the best match
    if (artist.aliases && artist.aliases.length > 0) {
      for (const alias of artist.aliases) {
        const aliasSimilarity = calculateSimilarity(trimmedQuery, alias);
        if (aliasSimilarity > similarity) {
          similarity = aliasSimilarity;
        }
      }
    }

    // Update best match if this is better
    if (similarity > bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = {
        artist,
        similarity,
        matchType: similarity === 100 ? 'exact' : 'fuzzy'
      };
    }
  }

  return bestMatch;
};

// Find multiple possible matches ranked by similarity
export const fuzzyMatchArtistTop = (query, artistList, limit = 3, threshold = 60) => {
  if (!query || query.trim().length < 2) return [];

  const trimmedQuery = query.trim();
  const matches = [];

  for (const artist of artistList) {
    let similarity = calculateSimilarity(trimmedQuery, artist.name);
    
    if (artist.aliases && artist.aliases.length > 0) {
      for (const alias of artist.aliases) {
        const aliasSimilarity = calculateSimilarity(trimmedQuery, alias);
        if (aliasSimilarity > similarity) {
          similarity = aliasSimilarity;
        }
      }
    }

    if (similarity >= threshold) {
      matches.push({
        artist,
        similarity,
        matchType: similarity === 100 ? 'exact' : 'fuzzy'
      });
    }
  }

  // Sort by similarity descending
  matches.sort((a, b) => b.similarity - a.similarity);

  return matches.slice(0, limit);
};

// Fuzzy match tuned for LIVE TYPING (typeahead), not a finished query.
// fuzzyMatchArtist / fuzzyMatchArtistTop compare the full query against the
// full artist name, which works well for a completed (if misspelled) search
// but badly for a partial one: a 9-character partial string like "ol dirtey"
// scores low against a 17-character full name like "Ol' Dirty Bastard"
// simply because 8 characters haven't been typed yet, not because anything
// is actually wrong. This function instead compares the typed string against
// an equal-length SLICE of each candidate, so partial input is judged only
// against the part of the name it could plausibly match so far.
export const fuzzyMatchArtistTypeahead = (query, artistList, limit = 5, threshold = 55) => {
  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery.length < 2) return [];

  const scoreCandidate = (candidateName) => {
    const candidate = candidateName.toLowerCase();

    // Exact prefix (person is typing the name correctly) always wins.
    if (candidate.startsWith(trimmedQuery)) return 100;

    // Contains the typed string anywhere (e.g. typed "dirty" mid-name).
    if (trimmedQuery.length >= 4 && candidate.includes(trimmedQuery)) return 95;

    // Otherwise: compare against an equal-length slice of the candidate,
    // so a partially-typed, slightly-misspelled prefix still scores well.
    const slice = candidate.slice(0, trimmedQuery.length);
    const distance = levenshteinDistance(trimmedQuery, slice);
    return Math.round(((trimmedQuery.length - distance) / trimmedQuery.length) * 100);
  };

  const matches = [];

  for (const artist of artistList) {
    let best = scoreCandidate(artist.name);

    if (artist.aliases && artist.aliases.length > 0) {
      for (const alias of artist.aliases) {
        const aliasScore = scoreCandidate(alias);
        if (aliasScore > best) best = aliasScore;
      }
    }

    if (best >= threshold) {
      matches.push({
        artist,
        similarity: best,
        matchType: best === 100 ? 'exact' : 'fuzzy',
      });
    }
  }

  matches.sort((a, b) => b.similarity - a.similarity);

  // Dedupe in case name and an alias both scored (shouldn't happen given
  // the best-of logic above, but cheap insurance).
  const seen = new Set();
  const deduped = matches.filter(m => {
    if (seen.has(m.artist.canonicalForm)) return false;
    seen.add(m.artist.canonicalForm);
    return true;
  });

  return deduped.slice(0, limit);
};

export default {
  levenshteinDistance,
  calculateSimilarity,
  fuzzyMatchArtist,
  fuzzyMatchArtistTop,
  fuzzyMatchArtistTypeahead
};
