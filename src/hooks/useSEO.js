import { useEffect } from 'react';

/**
 * useSEO — lightweight per-page SEO hook
 * Sets document.title and meta description on mount.
 * No external dependencies required.
 *
 * Usage:
 *   useSEO({
 *     title: 'Page Title | Digging in the Sales Crates',
 *     description: 'Your page description here.',
 *   });
 */
export default function useSEO({ title, description }) {
  useEffect(() => {
    // Set page title
    if (title) document.title = title;

    // Set meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // Cleanup: restore defaults when navigating away
    return () => {
      document.title = 'Digging in the Sales Crates';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Find the best vinyl deals across Discogs, eBay, and CDandLP. Search, compare prices, and score rare records.');
      }
    };
  }, [title, description]);
}
