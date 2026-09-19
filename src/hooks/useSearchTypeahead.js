import { useState, useEffect, useRef } from 'react';
import artistDictionary from '../data/artistDictionary.json';
import { fuzzyMatchArtistTypeahead } from '../utils/fuzzyMatch';

// Shared "as you type" suggestion logic for every search box on the site.
// Used by both the homepage hero search (Home.jsx) and the /aggregator
// search page (SearchResults.jsx), so there is exactly one place this
// behavior lives. Previously the two boxes were separate copies, which is
// how the homepage box silently never got the fix that landed on
// SearchResults.jsx.
//
// Debounced 250ms, 3+ characters minimum, uses fuzzyMatchArtistTypeahead
// (NOT fuzzyMatchArtist/fuzzyMatchArtistTop, which are tuned for a
// completed query, not partial in-progress typing).
export default function useSearchTypeahead(value) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return undefined;
    }

    debounceRef.current = setTimeout(() => {
      const matches = fuzzyMatchArtistTypeahead(value, artistDictionary.artists, 5, 55);
      setSuggestions(matches);
      setIsOpen(matches.length > 0);
      setActiveIndex(-1);
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [value]);

  // Returns the selected canonicalForm on Enter, or null otherwise.
  // The caller is responsible for actually acting on a non-null return
  // (updating its own input state and navigating), since that differs
  // between Home.jsx's `query` and SearchResults.jsx's `inputVal`.
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return null;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % suggestions.length);
      return null;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i <= 0 ? suggestions.length - 1 : i - 1));
      return null;
    }
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      return suggestions[activeIndex].artist.canonicalForm;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      return null;
    }
    return null;
  };

  const close = () => setIsOpen(false);
  const openIfHasSuggestions = () => {
    if (suggestions.length > 0) setIsOpen(true);
  };

  return {
    suggestions,
    isOpen,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    close,
    openIfHasSuggestions,
  };
}
