import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import CanonicalTag from './components/CanonicalTag';
import {
  schedulePageView,
  installErrorTracking,
  installScrollTracking,
} from './utils/analytics';

// ── Route-level code splitting ────────────────────────────────
// Home stays eager (it's the LCP-critical landing page).
// Every other page loads its chunk only when the route is visited,
// so a blog reader doesn't download the search page, wishlist, etc.
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Deals = lazy(() => import('./pages/DealsAndAlerts').then(m => ({ default: m.Deals })));
const Alerts = lazy(() => import('./pages/DealsAndAlerts').then(m => ({ default: m.Alerts })));
const EmailParser = lazy(() => import('./pages/EmailParser'));
const LocalShops = lazy(() => import('./pages/LocalShops'));
const FeaturedPartners = lazy(() => import('./pages/FeaturedPartners'));
const FAQ = lazy(() => import('./pages/FAQ'));
const ArtistPage = lazy(() => import('./pages/ArtistPage'));
const Artists = lazy(() => import('./pages/Artists'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
// Phase 2 (Homepage & Content Hub): Watch & Read replaces Blog as the primary
// content nav destination. /blog and /blog/:slug stay live and indexed
// (see prerender.mjs) — they're just no longer linked from primary nav.
const WatchAndRead = lazy(() => import('./pages/WatchAndRead'));

// box-sizing is set in index.css; overflow-x and img/video/iframe rules are kept here
// because they use !important to override any inline styles set by third-party scripts.
const globalStyle = `
  html, body, #root { overflow-x: hidden !important; max-width: 100vw !important; width: 100% !important; }
  img, video, iframe { max-width: 100%; }
`;

// Empty placeholder while a route chunk loads; min-height prevents
// the footer from jumping up during the (brief) load.
function RouteFallback() {
  return <div style={{ minHeight: '60vh' }} />;
}

// ── Analytics wiring ──────────────────────────────────────────
// Must live INSIDE BrowserRouter to use useLocation.
//
// Manual page_view on every route change. GA4's Enhanced Measurement
// "page changes based on browser history events" fires on the history
// event itself, which happens BEFORE React re-renders and before
// useSEO updates document.title — producing page_view rows tagged with
// the PREVIOUS page's title.
//
// We report via schedulePageView, which waits for document.title to
// settle before sending. A plain requestAnimationFrame is NOT enough
// here: routes are React.lazy chunks, and useSEO's cleanup briefly
// resets the title to a generic default between pages. See the long
// comment on schedulePageView in utils/analytics.js for the measured
// timings behind this.
//
// REQUIRES: Enhanced Measurement -> "Page changes based on browser
// history events" must be turned OFF in the GA4 data stream, or every
// SPA navigation is counted twice. See GA4-SETUP.md.
function AnalyticsTracker() {
  const location = useLocation();
  const resetScrollRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    installErrorTracking();
    resetScrollRef.current = installScrollTracking();
  }, []);

  useEffect(() => {
    // Skip the very first render: the gtag('config') call in index.html
    // already fires a page_view for the initial page load. Firing again
    // here would double-count every landing.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const cancel = schedulePageView(location.pathname + location.search);

    // Re-arm scroll-depth milestones for the new page.
    if (resetScrollRef.current) resetScrollRef.current();

    // Navigating again before the title settles cancels the pending
    // report, so a rapid click-through never files under the wrong route.
    return cancel;
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <style>{globalStyle}</style>
      <ScrollToTop />
      <CanonicalTag />
      <AnalyticsTracker />
      <Layout>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/aggregator" element={<SearchResults />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/email-parser" element={<EmailParser />} />
            <Route path="/local-shops" element={<LocalShops />} />
            <Route path="/featured-partners" element={<FeaturedPartners />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:slug" element={<ArtistPage type="artist" />} />
            <Route path="/genres/:slug" element={<ArtistPage type="genre" />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/watch-read" element={<WatchAndRead />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
