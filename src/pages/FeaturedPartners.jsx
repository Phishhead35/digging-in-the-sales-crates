import React from 'react';
import { Star, Mail, ArrowRight } from 'lucide-react';
import useSEO from '../hooks/useSEO';

export default function FeaturedPartners() {
  useSEO({
    title: 'Partner With Us | Digging in the Sales Crates',
    description: 'Get your record store in front of serious vinyl collectors. Partner with Digging in the Sales Crates.',
  });

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>

      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 28px',
      }}>
        <Star size={28} color="var(--amber)" />
      </div>

      {/* Headline */}
      <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 12 }}>
        PARTNER WITH DITSC
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 7vw, 64px)', letterSpacing: 2, lineHeight: 1, marginBottom: 20 }}>
        GET YOUR STORE<br />IN FRONT OF<br />
        <span style={{ color: 'var(--amber)' }}>SERIOUS COLLECTORS</span>
      </h1>

      <p style={{ color: 'var(--text-primary)', fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 48px' }}>
        Digging in the Sales Crates is where vinyl collectors come to find deals, discover records, and connect with the stores that feed the habit. Our audience is your customer.
      </p>

      {/* Coming soon card */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 16, padding: '36px 32px', marginBottom: 32,
      }}>
        <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 12 }}>
          PARTNERSHIP TIERS — COMING SUMMER 2026
        </p>
        <p style={{ color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.7, marginBottom: 0 }}>
          We're launching our formal partnership program in July/August 2026 with tiered options including featured store placement, TikTok features, and on-location Shop Sessions. Want to be first in line when it launches?
        </p>
      </div>

      {/* CTA */}
      <p style={{ color: 'var(--text-primary)', fontSize: 15, marginBottom: 20 }}>
        Reach out now and we'll add you to the list.
      </p>
      <a
        href="mailto:hello@digginginthesalescrates.com?subject=Partnership Interest"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '14px 28px', borderRadius: 12,
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: '#000', fontWeight: 700, fontSize: 15,
          textDecoration: 'none',
        }}
      >
        <Mail size={18} />
        hello@digginginthesalescrates.com
      </a>

      <p style={{ color: 'var(--text-primary)', fontSize: 13, marginTop: 20 }}>
        We respond within 48 hours.
      </p>

    </div>
  );
}
