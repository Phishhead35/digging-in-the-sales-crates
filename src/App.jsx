import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';
import { Deals, Alerts } from './pages/DealsAndAlerts';
import EmailParser from './pages/EmailParser';
import LocalShops from './pages/LocalShops';
import FeaturedPartners from './pages/FeaturedPartners';
import FAQ from './pages/FAQ';
import ScrollToTop from './components/ScrollToTop';
// import Blog from './pages/Blog';
// import BlogPost from './pages/BlogPost';

// box-sizing is set in index.css; overflow-x and img/video/iframe rules are kept here
// because they use !important to override any inline styles set by third-party scripts.
const globalStyle = `
  html, body, #root { overflow-x: hidden !important; max-width: 100vw !important; width: 100% !important; }
  img, video, iframe { max-width: 100%; }
`;

export default function App() {
  return (
    <BrowserRouter>
      <style>{globalStyle}</style>
      <ScrollToTop />
      <Layout>
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
          {/* <Route path="/blog" element={<Blog />} /> */}
          {/* <Route path="/blog/:slug" element={<BlogPost />} /> */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
