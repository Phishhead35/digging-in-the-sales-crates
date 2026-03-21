import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disc3, Menu, X, Search, Home, Heart, Bell, Store, TrendingDown, Mail, MapPin } from 'lucide-react';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/search', label: 'Dig', icon: Search },
    { to: '/deals', label: 'Deals', icon: TrendingDown },
    { to: '/email-parser', label: 'Emails', icon: Mail },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/local-shops', label: "Where's My Shop?", icon: MapPin },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <svg width="46" height="46" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                <circle cx="170" cy="170" r="170" fill="#0a0a0f"/>
                <circle cx="170" cy="170" r="160" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
                <circle cx="170" cy="170" r="140" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
                <circle cx="170" cy="170" r="120" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
                <circle cx="170" cy="170" r="100" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
                <circle cx="170" cy="170" r="80" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
                <circle cx="170" cy="170" r="165" fill="none" stroke="rgba(245,158,11,0.35)" strokeWidth="2"/>
                <circle cx="170" cy="170" r="65" fill="#f59e0b"/>
                <circle cx="170" cy="170" r="58" fill="#d97706"/>
                <circle cx="170" cy="170" r="12" fill="#0a0a0f"/>
                <circle cx="170" cy="170" r="6" fill="#111118"/>
              </svg>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 2,
                lineHeight: 1, whiteSpace: 'nowrap',
              }}>
                DIGGING IN THE <span style={{ color: 'var(--amber)' }}>SALES CRATES</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="desktop-nav" style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  color: isActive(to) ? 'var(--amber)' : 'var(--text-secondary)',
                  background: isActive(to) ? 'var(--amber-glow)' : 'transparent',
                  transition: 'all 0.2s',
                  border: isActive(to) ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                }}>
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{ color: 'var(--text-primary)', padding: 8, borderRadius: 8, marginLeft: 'auto' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{
            background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
            padding: '16px 24px',
          }}>

            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 0', color: isActive(to) ? 'var(--amber)' : 'var(--text-secondary)',
                borderBottom: '1px solid var(--border)', fontSize: 15,
              }}>
                <Icon size={18} /> {label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-search, .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>

      {/* Main */}
      <main style={{ paddingTop: 64 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', marginTop: 80,
        padding: '40px 24px', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
            <svg width="28" height="28" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg">
                <circle cx="170" cy="170" r="170" fill="#0a0a0f"/>
                <circle cx="170" cy="170" r="160" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                <circle cx="170" cy="170" r="140" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                <circle cx="170" cy="170" r="120" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                <circle cx="170" cy="170" r="100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
                <circle cx="170" cy="170" r="165" fill="none" stroke="rgba(245,158,11,0.25)" strokeWidth="1.5"/>
                <circle cx="170" cy="170" r="62" fill="#f59e0b"/>
                <circle cx="170" cy="170" r="57" fill="#d97706"/>
                <circle cx="170" cy="170" r="10" fill="#0a0a0f"/>
              </svg>
            <span style={{ fontFamily: 'var(--font-display)', letterSpacing: 1, fontSize: 15 }}>
              DIGGING IN THE <span style={{ color: 'var(--amber)' }}>SALES CRATES</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            © 2026 Digging in the Sales Crates. Find your perfect record.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 6 }}>
            Pricing data via Discogs &amp; eBay. Not affiliated with, sponsored by, or endorsed by any listed marketplace or store.
          </p>
        </div>
      </footer>
    </div>
  );
}
