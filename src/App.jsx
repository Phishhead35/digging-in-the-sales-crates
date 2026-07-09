import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import CanonicalTag from './components/CanonicalTag';

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

export default function App() {
  return (
    <BrowserRouter>
      <style>{globalStyle}</style>
      <ScrollToTop />
      <CanonicalTag />
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
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
