import React from 'react';

const SearchSuggestion = ({
  suggestion,
  onSuggestionClick
}) => {
  if (!suggestion || !suggestion.artist) return null;

  const { artist, similarity } = suggestion;
  const handleClick = () => {
    if (onSuggestionClick && artist.canonicalForm) {
      onSuggestionClick(artist.canonicalForm);
    }
  };

  // Only show suggestion if similarity is reasonable
  if (similarity < 70) return null;

  const confidenceLabel =
    similarity >= 90
      ? 'Did you mean'
      : similarity >= 80
      ? 'Did you mean'
      : 'Perhaps you meant';

  return (
    <div
      style={{
        padding: '24px',
        marginBottom: '32px',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        borderLeft: '4px solid #f59e0b',
        borderRadius: '8px',
        fontFamily: 'inherit'
      }}
    >
      <p
        style={{
          margin: '0 0 12px 0',
          fontSize: '14px',
          color: '#ffffff',
          opacity: 0.8
        }}
      >
        {confidenceLabel}
      </p>
      <button
        onClick={handleClick}
        style={{
          display: 'inline-block',
          padding: '10px 18px',
          backgroundColor: '#f59e0b',
          color: '#0a0a0f',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          fontFamily: 'inherit'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#d97706';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#f59e0b';
        }}
      >
        Search for "{artist.canonicalForm}"
      </button>
      <p
        style={{
          margin: '12px 0 0 0',
          fontSize: '12px',
          color: '#ffffff',
          opacity: 0.6
        }}
      >
        (Similarity: {similarity}%)
      </p>
    </div>
  );
};

export default SearchSuggestion;
