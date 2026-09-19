import React from 'react';

// Live "as you type" suggestion dropdown, shown BEFORE the person hits
// search. Complements SearchSuggestion.jsx, which only appears AFTER a
// search comes back with zero results. This one uses fuzzyMatchArtistTop
// (top N matches) rather than fuzzyMatchArtist (single best match), since
// showing 3-5 candidates while typing is more useful than committing to one.
const SearchTypeahead = ({
  suggestions,
  activeIndex,
  onSelect,
  onHover,
}) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      style={{
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        right: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        overflow: 'hidden',
        zIndex: 20,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      {suggestions.map((match, i) => (
        <div
          key={match.artist.canonicalForm}
          role="option"
          aria-selected={i === activeIndex}
          onMouseDown={(e) => {
            // onMouseDown (not onClick) fires before the input's onBlur,
            // so the click registers before the dropdown closes itself.
            e.preventDefault();
            onSelect(match.artist.canonicalForm);
          }}
          onMouseEnter={() => onHover(i)}
          style={{
            padding: '10px 14px',
            cursor: 'pointer',
            fontSize: 14,
            color: 'var(--text-primary)',
            background: i === activeIndex ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
            borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{match.artist.canonicalForm}</span>
          {match.matchType === 'fuzzy' && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {match.similarity}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchTypeahead;
