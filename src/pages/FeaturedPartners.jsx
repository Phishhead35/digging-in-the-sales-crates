import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { withSlash } from '../utils/withSlash';
import useSEO from '../hooks/useSEO';
import { PARTNER_PAGE as C } from '../data/partnerPage';
import { track } from '../utils/analytics';

// ── Partner With Us (/featured-partners) ──────────────────────
// Store-owner landing page. All the words live in src/data/partnerPage.js,
// which scripts/prerender.mjs also reads for the crawler copy.
//
// The form has no server behind it. Submitting builds a mailto: link with
// every answer filled in and opens the owner's email app, so applications
// arrive at hello@ as ordinary email. That keeps this free and secret-free.
// If it turns out owners on webmail never get their email app to open, swap
// onSubmit for a hosted form (Tally, Formspree) and keep the same fields.

const fieldStyle = {
  width: '100%', padding: '12px 14px', boxSizing: 'border-box',
  background: 'var(--bg-card)', border: '1px solid var(--border)',
  borderRadius: 10, color: 'var(--text-primary)', fontSize: 15,
  fontFamily: 'inherit', outline: 'none',
};

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: 'var(--text-primary)', marginBottom: 6,
};

const h2Style = {
  fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 1,
  color: 'var(--text-primary)', margin: '0 0 12px',
};

const bodyStyle = { color: 'var(--text-primary)', fontSize: 15, lineHeight: 1.7, margin: 0 };

export default function FeaturedPartners() {
  useSEO({ title: C.seoTitle, description: C.description });

  const [values, setValues] = useState({});
  const [video, setVideo] = useState(false);

  const setField = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const line = (label, value) => `${label}: ${(value || '').trim() || '(not given)'}`;
    const body = [
      'Partner application',
      '',
      line('Shop', values.shop),
      line('City and state', values.location),
      line('Website', values.website),
      line('Discogs store', values.discogs),
      line('Owner', values.owner),
      line('Email', values.emailAddress),
      line('Specialties', values.genres),
      '',
      'What makes the shop worth digging:',
      (values.about || '').trim() || '(not given)',
      '',
      'Anything buyers should know:',
      (values.notes || '').trim() || '(not given)',
      '',
      `Open to a video feature: ${video ? 'yes' : 'no'}`,
    ].join('\n');

    const subject = `Partner application: ${(values.shop || '').trim() || 'new shop'}`;
    track('partner_apply_submit', { video_ok: video ? 'yes' : 'no' });
    window.location.href =
      `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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

          <form onSubmit={handleSubmit} style={{
            display: 'grid', gap: 16, padding: 24, borderRadius: 16,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
          }}>
            {C.fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={`partner-${f.name}`} style={labelStyle}>
                  {f.label}{f.required ? ' *' : ''}
                </label>
                {f.textarea ? (
                  <textarea
                    id={`partner-${f.name}`}
                    rows={3}
                    value={values[f.name] || ''}
                    onChange={setField(f.name)}
                    style={{ ...fieldStyle, resize: 'vertical' }}
                  />
                ) : (
                  <input
                    id={`partner-${f.name}`}
                    type={f.type || 'text'}
                    required={!!f.required}
                    placeholder={f.placeholder}
                    value={values[f.name] || ''}
                    onChange={setField(f.name)}
                    style={fieldStyle}
                  />
                )}
              </div>
            ))}

            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={video} onChange={(e) => setVideo(e.target.checked)} />
              {C.videoLabel}
            </label>

            <button type="submit" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000', border: 'none', cursor: 'pointer', justifySelf: 'start',
            }}>
              <Mail size={16} /> {C.submitLabel}
            </button>
          </form>

          <p style={{ ...bodyStyle, fontSize: 14, marginTop: 14 }}>
            {C.emailFallbackLead}{' '}
            <a href={`mailto:${C.email}`} style={{ color: 'var(--amber)' }}>{C.email}</a>.
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
