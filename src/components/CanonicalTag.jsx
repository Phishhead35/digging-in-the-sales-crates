import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://digginginthesalescrates.com';

export default function CanonicalTag() {
  const { pathname } = useLocation();

  useEffect(() => {
    const href = BASE_URL + pathname;
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
