import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { withSlash } from '../utils/withSlash';
import useSEO from '../hooks/useSEO';
import { PARTNER_PAGE as C } from '../data/partnerPage';
import { track } from '../utils/analytics';

// ── Partner With Us (/featured-partners) ──────────────────────
// Store-owner landing page. All the words live in src/data/partnerPage.js,
// which scripts/prerender.mjs also reads for the crawler copy.
//
// The application is a Google Form (C.formUrl) opened in a new tab. It has no
// code behind it on this site: responses go to the DITSC Gmail and a linked
// Google Sheet. See the note at the top of partnerPage.js for why an
// in-page form was dropped.

const h2Style = {
  fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1,
  color: 'var(--text-primary)', margin: '0 0 12px',
};

const bodyStyle = { color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.7, margin: 0 };

export default function FeaturedPartners() {
  useSEO({ title: C.seoTitle, description: C.description });

  return (
    <div style={{ padding: '48px 24px 24px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>

        <p style={{ color: 'var(--amber)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 8 }}>
          {C.eyebrow}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 56px)',
          letterSpacing: 1, lineHeight: 1.05, margin: '0 0 16px',
        }}>
          {C.title.toUpperCase()}
        </h1>
        <p style={{ ...bodyStyle, fontSize: 17, marginBottom: 40 }}>{C.lead}</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={h2Style}>{C.stepsHeading.toUpperCase()}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {C.steps.map((s, i) => (
              <div key={s.title} style={{
                padding: 20, borderRadius: 14,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
              }}>
                <div style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: 2, marginBottom: 8 }}>
                  STEP {i + 1}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ ...bodyStyle, fontSize: 14 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={h2Style}>{C.getHeading.toUpperCase()}</h2>
          <ul style={{ ...bodyStyle, paddingLeft: 20, display: 'grid', gap: 8 }}>
            {C.gets.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={h2Style}>{C.costHeading.toUpperCase()}</h2>
          <p style={bodyStyle}>{C.cost}</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={h2Style}>{C.honestHeading.toUpperCase()}</h2>
          <p style={bodyStyle}>{C.honest}</p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={h2Style}>{C.videoHeading.toUpperCase()}</h2>
          <p style={bodyStyle}>{C.video}</p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={h2Style}>{C.applyHeading.toUpperCase()}</h2>
          <p style={{ ...bodyStyle, marginBottom: 20 }}>{C.applyIntro}</p>

          <a
            href={C.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('partner_apply_click')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000', textDecoration: 'none',
            }}
          >
            {C.applyButtonLabel} <ExternalLink size={16} />
          </a>
          <p style={{ ...bodyStyle, fontSize: 13, marginTop: 8 }}>{C.applyButtonNote}</p>

          <p style={{ ...bodyStyle, fontSize: 14, marginTop: 20 }}>
            {C.emailFallbackLead}{' '}
            <a href={`mailto:${C.email}`} style={{ color: 'var(--amber)' }}>{C.email}</a>.{' '}
            {C.emailCopyNote}
          </p>
        </section>

        <p style={{ ...bodyStyle, fontSize: 14 }}>
          <Link to={withSlash('/shops')} style={{ color: 'var(--amber)', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontWeight: 600 }}>
            See the shops already listed <ArrowRight size={14} />
          </Link>
        </p>

      </div>
    </div>
  );
}
