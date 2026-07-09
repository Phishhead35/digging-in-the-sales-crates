import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Home, Heart, TrendingDown, Mail, MapPin, BookOpen, Star, HelpCircle, Disc3 } from 'lucide-react';
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
    { to: '/',                   label: 'Home',              icon: Home },
    { to: '/aggregator',         label: 'Aggregator-Dig',    icon: Search },
    { to: '/artists',            label: 'Artists',           icon: Disc3 },
    { to: '/deals',              label: 'Deals',             icon: TrendingDown },
    { to: '/blog',               label: 'Blog',              icon: BookOpen,  comingSoon: true },
    { to: '/featured-partners',  label: 'Featured Partners', icon: Star,      comingSoon: true },
    { to: '/local-shops',        label: "Where's My Shop?",  icon: MapPin },
    { to: '/wishlist',           label: 'Wishlist',          icon: Heart },
    { to: '/faq',                label: 'FAQ',               icon: HelpCircle },
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

            {/* Logo — gold record PNG cropped in circle + wordmark */}
            <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <img
                src="/ditsc-logo-small.webp"
                alt="DITSC"
                style={{
                  width: 42, height: 42, borderRadius: '50%',
                  objectFit: 'cover', objectPosition: 'center center',
                  flexShrink: 0, pointerEvents: 'none',
                }}
              />
              <div className="nav-logo-text" style={{
                fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2,
                lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden',
              }}>
                DIGGING IN THE <span style={{ color: 'var(--amber)' }}>SALES CRATES</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="desktop-nav" style={{ display: 'flex', gap: 2, marginLeft: 'auto', alignItems: 'center' }}>
              {navLinks.map(({ to, label, icon: Icon, comingSoon }) => (
                <Link key={to} to={to} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                  color: isActive(to) ? 'var(--amber)' : 'var(--text-primary)',
                  background: isActive(to) ? 'var(--amber-glow)' : 'transparent',
                  transition: 'all 0.2s',
                  border: isActive(to) ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                  position: 'relative',
                  whiteSpace: 'nowrap',
                }}>
                  <Icon size={14} />
                  {label}
                  {comingSoon && (
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: 0.5,
                      background: 'rgba(245,158,11,0.2)', color: 'var(--amber)',
                      padding: '1px 5px', borderRadius: 4,
                      fontFamily: 'var(--font-mono)',
                    }}>
                      NEW
                    </span>
                  )}
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
            {navLinks.map(({ to, label, icon: Icon, comingSoon }) => (
              <Link key={to} to={to} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 0', color: isActive(to) ? 'var(--amber)' : 'var(--text-primary)',
                borderBottom: '1px solid var(--border)', fontSize: 15,
              }}>
                <Icon size={18} />
                {label}
                {comingSoon && (
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    background: 'rgba(245,158,11,0.2)', color: 'var(--amber)',
                    padding: '1px 6px', borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .nav-logo-text { font-size: 15px !important; letter-spacing: 1px !important; }
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
        }
        .record-card { transition: border-color 0.3s, transform 0.3s; }
        .record-card:hover { border-color: var(--border-hover) !important; transform: translateY(-2px); }
        .view-deals-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000; text-decoration: none; transition: opacity 0.2s;
        }
        .view-deals-btn:hover { opacity: 0.85; }
        .store-card { transition: border-color 0.3s, transform 0.3s; text-decoration: none; }
        .store-card:hover { border-color: rgba(245,158,11,0.4) !important; transform: translateY(-3px); }
        .footer-logo-wrap { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 12px; }
        .footer-email-link { color: var(--amber); font-size: 13px; font-family: var(--font-mono); letter-spacing: 1px; text-decoration: none; transition: opacity 0.2s; }
        .footer-email-link:hover { opacity: 0.7; }
        .filter-btn { padding: 5px 16px; border-radius: 100px; font-size: 12px; font-weight: 500; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); text-transform: capitalize; cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s; }
        .filter-btn-active { background: var(--amber-glow); border-color: rgba(245,158,11,0.4) !important; color: var(--amber) !important; }
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
        padding: '40px 24px', textAlign: 'center', height: 'auto',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="footer-logo-wrap">
            <img
              src="/ditsc-logo-small.webp"
              alt="DITSC"
              style={{
                width: 52, height: 52, borderRadius: '50%',
                objectFit: 'cover', objectPosition: 'center center',
                flexShrink: 0,
              }}
            />
            <span style={{ fontFamily: 'var(--font-display)', letterSpacing: 1, fontSize: 18 }}>
              DIGGING IN THE <span style={{ color: 'var(--amber)' }}>SALES CRATES</span>
            </span>
          </div>

          {/* Footer nav links */}
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{ fontSize: 11, color: 'var(--text-primary)', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ color: 'var(--text-primary)', fontSize: 13, marginBottom: 6 }}>
              Store owner, label, or affiliate inquiry?
            </p>
            <a href="mailto:hello@digginginthesalescrates.com" className="footer-email-link">
              hello@digginginthesalescrates.com
            </a>
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: 12 }}>
            © 2026 Digging in the Sales Crates. Find your perfect record.
          </p>
          <p style={{ color: 'var(--text-primary)', fontSize: 11, marginTop: 6 }}>
            Pricing data via Discogs &amp; eBay. Not affiliated with, sponsored by, or endorsed by any listed marketplace or store.
          </p>
        </div>
      </footer>
    </div>
  );
}
