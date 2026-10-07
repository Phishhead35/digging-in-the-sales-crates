import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { withSlash } from '../utils/withSlash';

const BASE_URL = 'https://digginginthesalescrates.com';

export default function CanonicalTag() {
  const { pathname } = useLocation();

  useEffect(() => {
    // withSlash keeps this matching the canonical prerender.mjs bakes in,
    // even after an in-app click lands on a slash-less pathname.
    const href = BASE_URL + withSlash(pathname);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = href;
  }, [pathname]);

  return null;
}
