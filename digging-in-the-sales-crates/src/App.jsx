import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Wishlist from './pages/Wishlist';
import { Deals, Alerts } from './pages/DealsAndAlerts';
import EmailParser from './pages/EmailParser';
import LocalShops from './pages/LocalShops';

export default function App() {
  return (
    <BrowserRouter>
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
