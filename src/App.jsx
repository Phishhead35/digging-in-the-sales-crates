import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';
import { Deals, Alerts } from './pages/DealsAndAlerts';
import EmailParser from './pages/EmailParser';
import LocalShops from './pages/LocalShops';

const globalStyle = `
  *, *::before, *::after { box-sizing: border-box !important; }
  html, body, #root { overflow-x: hidden !important; max-width: 100vw !important; width: 100% !important; }
  img, video, iframe { max-width: 100%; }
`;

export default function App() {
  return (
    <BrowserRouter>
      <style>{globalStyle}</style>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/email-parser" element={<EmailParser />} />
          <Route path="/local-shops" element={<LocalShops />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
