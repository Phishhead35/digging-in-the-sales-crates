import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disc3, Menu, X, Search, Home, Heart, Bell, Store, TrendingDown, Mail, MapPin } from 'lucide-react';
import FollowUs from './FollowUs';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', overflowX: 'hidden', width: '100%' }}>

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
            <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <svg width="46" height="46" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, pointerEvents: 'none' }}>
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
              <div className="nav-logo-text" style={{
                fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 2,
                lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden',
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

      {/* Responsive styles + perf fixes */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-search, .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .nav-logo-text { font-size: 18px !important; letter-spacing: 1px !important; }
        }
        @media (min-width: 769px) {
          .mobile-toggle { display: none !important; }
        }
        .record-card {
          transition: border-color 0.3s, transform 0.3s;
        }
        .record-card:hover {
          border-color: var(--border-hover) !important;
          transform: translateY(-2px);
        }
        .view-deals-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .view-deals-btn:hover { opacity: 0.85; }
        .store-card {
          transition: border-color 0.3s, transform 0.3s;
          text-decoration: none;
        }
        .store-card:hover {
          border-color: var(--border-hover) !important;
          transform: translateY(-3px);
        }
        .footer-logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .footer-email-link {
          color: var(--amber);
          font-size: 13px;
          font-family: var(--font-mono);
          letter-spacing: 1px;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .footer-email-link:hover { opacity: 0.7; }
        .filter-btn {
          padding: 5px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          text-transform: capitalize;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .filter-btn-active {
          background: var(--amber-glow);
          border-color: rgba(245,158,11,0.4) !important;
          color: var(--amber) !important;
        }
        .search-input:focus { border-color: var(--amber) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px var(--bg-card) inset !important;
          -webkit-text-fill-color: var(--text-primary) !important;
          caret-color: var(--text-primary);
        }
      `}</style>

      {/* Main */}
      <main style={{ paddingTop: 64, overflowX: 'hidden', width: '100%' }}>
        {children}
      </main>

       <FollowUs />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', marginTop: 80,
        padding: '40px 24px', textAlign: 'center',
        height: 'auto',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="footer-logo-wrap">
            <svg width="28" height="28" viewBox="0 0 340 340" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
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
            <span style={{
              fontFamily: 'var(--font-display)', letterSpacing: 1, fontSize: 15,
              display: 'inline-block',
            }}>
              DIGGING IN THE <span style={{ color: 'var(--amber)' }}>SALES CRATES</span>
            </span>
          </div>
          <div style={{ marginBottom: 16,}}>
            <p style={{ color: 'var(--text-primary)', fontSize: 13, marginBottom: 6 }}>
              Store owner, label, or affiliate inquiry?
            </p>
            <a
              href="mailto:hello@digginginthesalescrates.com"
              className="footer-email-link"
            >
              hello@digginginthesalescrates.com
            </a>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
            © 2026 Digging in the Sales Crates. Find your perfect record.
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 11, marginTop: 6 }}>
            Pricing data via Discogs &amp; eBay. Not affiliated with, sponsored by, or endorsed by any listed marketplace or store.
          </p>
        </div>
      </footer>
    </div>
  );
}
