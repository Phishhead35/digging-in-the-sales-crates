import React, { useState } from 'react';
import { Mail, Upload, Sparkles, Tag, ExternalLink, Copy, CheckCheck, Trash2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// ============================================================
// CLAUDE AI DEAL EXTRACTOR
// Uses the Anthropic API to parse promo emails and extract deals
// ============================================================

async function extractDealsFromEmail(emailText) {
  const response = await fetch('/api/parse-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailText }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
    throw new Error(err.error || `Request failed: ${response.status}`);
  }

  return await response.json();
}


// ============================================================
// DEAL CARD
// ============================================================
function DealCard({ deal, index }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyDeal = () => {
    const text = [deal.title, deal.discount, deal.price, deal.description, deal.url].filter(Boolean).join(' | ');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tagColors = {
    'Hip-Hop': '#f59e0b', 'Jazz': '#2ec4b6', 'Soul': '#e63946',
    'Limited': '#a78bfa', 'Funk': '#fb923c', 'Rock': '#4ade80',
    'R&B': '#f472b6', 'Electronic': '#38bdf8', 'Classic': '#94a3b8',
  };

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden',
      animation: `fade-up 0.4s ease ${index * 0.06}s both`,
    }}>
      {/* Header */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>
              {deal.title}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {deal.discount && (
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
                  background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)',
                  color: 'var(--amber)', fontFamily: 'var(--font-mono)',
                }}>
                  {deal.discount}
                </span>
              )}
              {deal.price && (
                <span style={{
                  fontSize: 16, fontWeight: 700, color: 'var(--amber)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {deal.price}
                </span>
              )}
              {deal.originalPrice && (
                <span style={{
                  fontSize: 13, color: 'var(--text-muted)',
                  textDecoration: 'line-through', fontFamily: 'var(--font-mono)',
                }}>
                  {deal.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={copyDeal} title="Copy deal info" style={{
              width: 32, height: 32, borderRadius: 8, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: copied ? 'rgba(74,222,128,0.15)' : 'var(--bg-surface)',
              border: `1px solid ${copied ? 'rgba(74,222,128,0.4)' : 'var(--border)'}`,
              color: copied ? '#4ade80' : 'var(--text-muted)', transition: 'all 0.2s',
            }}>
              {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
            </button>
            {deal.url && (
              <a href={deal.url} target="_blank" rel="noopener noreferrer" title="Open link" style={{
                width: 32, height: 32, borderRadius: 8, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', transition: 'all 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tags + description */}
      <div style={{ padding: '12px 20px' }}>
        {deal.tags && deal.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: deal.description ? 10 : 0 }}>
            {deal.tags.map(tag => (
              <span key={tag} style={{
                padding: '2px 10px', borderRadius: 100, fontSize: 11,
                background: `${tagColors[tag] || '#8b8a9b'}18`,
                border: `1px solid ${tagColors[tag] || '#8b8a9b'}33`,
                color: tagColors[tag] || 'var(--text-muted)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {deal.description && (
          <div>
            <button onClick={() => setExpanded(!expanded)} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              color: 'var(--text-muted)', fontSize: 12, background: 'none',
              border: 'none', cursor: 'pointer', padding: 0, marginBottom: expanded ? 8 : 0,
            }}>
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {expanded ? 'Less' : 'Details'}
            </button>
            {expanded && (
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {deal.description}
              </p>
            )}
          </div>
        )}

        {deal.expiry && (
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            EXPIRES: {deal.expiry}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SAVED DEAL BATCH CARD
// ============================================================
function SavedBatch({ batch, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 14, overflow: 'hidden', marginBottom: 12,
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: '16px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer', userSelect: 'none',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{batch.store}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
            {batch.deals.length} deals · {new Date(batch.savedAt).toLocaleDateString()}
            {batch.promoCode && (
              <span style={{
                marginLeft: 10, padding: '1px 8px', borderRadius: 100,
                background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
                color: 'var(--amber)', fontSize: 10, fontFamily: 'var(--font-mono)',
              }}>
                CODE: {batch.promoCode}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={(e) => { e.stopPropagation(); onDelete(batch.id); }} style={{
            width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', color: '#f87171',
          }}>
            <Trash2 size={13} />
          </button>
          {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
        </div>
      </div>

      {open && (
        <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border)' }}>
          {batch.salewide && (
            <div style={{
              margin: '16px 0 12px', padding: '10px 14px', borderRadius: 8,
              background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.2)',
              fontSize: 13, color: 'var(--amber)',
            }}>
              {batch.salewide}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginTop: 16 }}>
            {batch.deals.map((deal, i) => <DealCard key={i} deal={deal} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN EMAIL PARSER PAGE
// ============================================================
export default function EmailParser() {
  const [emailText, setEmailText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('emailDeals') || '[]'); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState('parse'); // parse | saved

  const handleParse = async () => {
    if (!emailText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await extractDealsFromEmail(emailText);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const batch = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      ...result,
    };
    const updated = [batch, ...saved];
    setSaved(updated);
    localStorage.setItem('emailDeals', JSON.stringify(updated));
    setResult(null);
    setEmailText('');
    setActiveTab('saved');
  };

  const handleDelete = (id) => {
    const updated = saved.filter(b => b.id !== id);
    setSaved(updated);
    localStorage.setItem('emailDeals', JSON.stringify(updated));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEmailText(ev.target.result);
    reader.readAsText(file);
  };

  const exampleEmail = `From: Fat Beats <newsletter@fatbeats.com>
Subject: Weekend Flash Sale — 30% Off Hip-Hop Vinyl + New Arrivals

Hey diggers,

This weekend only — take 30% OFF all Hip-Hop vinyl with code DIGDEEP at checkout.

NEW ARRIVALS:
- Pete Rock & CL Smooth - Mecca and the Soul Brother (2xLP Reissue) — $34.99
- Gang Starr - Step in the Arena (Limited Red Vinyl) — $39.99
- Black Moon - Enta da Stage (Anniversary Edition) — $29.99

Sale ends Sunday at midnight EST.

Shop now: https://fatbeats.com/collections/hip-hop`;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '5px 14px', borderRadius: 100, marginBottom: 16,
          background: 'rgba(46,196,182,0.1)', border: '1px solid rgba(46,196,182,0.25)',
          color: '#2ec4b6', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 1,
        }}>
          <Sparkles size={12} /> AI POWERED
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 56px)', letterSpacing: 2, marginBottom: 10 }}>
          EMAIL <span style={{ color: 'var(--amber)' }}>DEAL PARSER</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 520 }}>
          Paste any promo email from Fat Beats, Get On Down, Mass Appeal, or any record store.
          AI extracts every deal automatically.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {[
          { id: 'parse', label: 'Parse Email' },
          { id: 'saved', label: `Saved Deals ${saved.length > 0 ? `(${saved.length})` : ''}` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '10px 20px', fontSize: 14, fontWeight: 500,
            color: activeTab === tab.id ? 'var(--amber)' : 'var(--text-secondary)',
            borderBottom: activeTab === tab.id ? '2px solid var(--amber)' : '2px solid transparent',
            background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--amber)' : '2px solid transparent',
            cursor: 'pointer', transition: 'color 0.2s', marginBottom: -1,
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* PARSE TAB */}
      {activeTab === 'parse' && (
        <div>
          {!result ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

              {/* Left: input */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Paste Email Text
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                      border: '1px solid var(--border)', background: 'var(--bg-card)',
                      color: 'var(--text-secondary)', fontSize: 12, transition: 'all 0.2s',
                    }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--amber)'; e.currentTarget.style.color = 'var(--amber)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <Upload size={13} /> Upload .txt
                      <input type="file" accept=".txt,.eml" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                    <button onClick={() => setEmailText(exampleEmail)} style={{
                      padding: '5px 12px', borderRadius: 8, fontSize: 12,
                      border: '1px dashed var(--border)', background: 'transparent',
                      color: 'var(--text-muted)', cursor: 'pointer',
                    }}>
                      Try Example
                    </button>
                  </div>
                </div>

                <textarea
                  value={emailText}
                  onChange={e => setEmailText(e.target.value)}
                  placeholder="Paste your promo email here...

Copy the full email text from Gmail, Apple Mail, or any email client and paste it here. Include subject line, body, prices, and any promo codes."
                  style={{
                    width: '100%', height: 380, padding: '16px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 12, color: 'var(--text-primary)', fontSize: 13,
                    lineHeight: 1.7, resize: 'vertical', outline: 'none',
                    fontFamily: 'var(--font-mono)', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--amber)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />

                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button
                    onClick={handleParse}
                    disabled={!emailText.trim() || loading}
                    style={{
                      flex: 1, padding: '14px', borderRadius: 10,
                      background: emailText.trim() && !loading
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'var(--bg-card)',
                      color: emailText.trim() && !loading ? '#000' : 'var(--text-muted)',
                      fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                      border: emailText.trim() && !loading ? 'none' : '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: 16, height: 16, border: '2px solid var(--text-muted)',
                          borderTopColor: 'var(--amber)', borderRadius: '50%',
                          animation: 'spin-slow 0.8s linear infinite',
                        }} />
                        Extracting Deals...
                      </>
                    ) : (
                      <><Sparkles size={16} /> Extract Deals</>
                    )}
                  </button>
                  {emailText && (
                    <button onClick={() => setEmailText('')} style={{
                      padding: '14px 16px', borderRadius: 10,
                      border: '1px solid var(--border)', background: 'transparent',
                      color: 'var(--text-muted)',
                    }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Right: instructions */}
              <div>
                <div style={{
                  padding: 24, borderRadius: 12, background: 'var(--bg-card)',
                  border: '1px solid var(--border)', marginBottom: 16,
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Mail size={15} color="var(--amber)" /> How to get email text
                  </h3>
                  {[
                    { step: '1', text: 'Open the promo email in Gmail or Apple Mail' },
                    { step: '2', text: 'Select all text in the email (Ctrl+A or Cmd+A)' },
                    { step: '3', text: 'Copy it (Ctrl+C or Cmd+C)' },
                    { step: '4', text: 'Paste it into the box on the left' },
                    { step: '5', text: 'Hit Extract Deals and let AI do the rest' },
                  ].map(({ step, text }) => (
                    <div key={step} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                        background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--font-mono)',
                      }}>
                        {step}
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: 20, borderRadius: 12, background: 'rgba(46,196,182,0.06)',
                  border: '1px solid rgba(46,196,182,0.2)',
                }}>
                  <div style={{ fontSize: 12, color: '#2ec4b6', fontWeight: 600, marginBottom: 8 }}>
                    Works with any store
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {['Fat Beats', 'Get On Down', 'Mass Appeal', 'Discogs', 'eBay', 'Rough Trade', 'Any record store'].map(s => (
                      <span key={s} style={{
                        padding: '3px 10px', borderRadius: 100, fontSize: 11,
                        background: 'rgba(46,196,182,0.1)', border: '1px solid rgba(46,196,182,0.2)',
                        color: '#2ec4b6',
                      }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (

            /* RESULTS */
            <div>
              {/* Result header */}
              <div style={{
                padding: '20px 24px', borderRadius: 14, background: 'var(--bg-card)',
                border: '1px solid rgba(245,158,11,0.3)', marginBottom: 24,
                display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                    PARSED FROM
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{result.store || 'Unknown Store'}</div>
                  {result.subject && (
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{result.subject}</div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                      background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.3)',
                      color: 'var(--amber)',
                    }}>
                      {result.deals?.length || 0} deals found
                    </span>
                    {result.promoCode && (
                      <span style={{
                        padding: '4px 12px', borderRadius: 100, fontSize: 12, fontFamily: 'var(--font-mono)',
                        background: 'rgba(46,196,182,0.1)', border: '1px solid rgba(46,196,182,0.3)',
                        color: '#2ec4b6',
                      }}>
                        CODE: {result.promoCode}
                      </span>
                    )}
                    {result.expiryDate && (
                      <span style={{
                        padding: '4px 12px', borderRadius: 100, fontSize: 12,
                        background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
                        color: '#f87171',
                      }}>
                        Expires: {result.expiryDate}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setResult(null); }} style={{
                    padding: '10px 18px', borderRadius: 10, fontSize: 13,
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-secondary)',
                  }}>
                    Parse Another
                  </button>
                  <button onClick={handleSave} style={{
                    padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <CheckCheck size={15} /> Save Deals
                  </button>
                </div>
              </div>

              {result.salewide && (
                <div style={{
                  padding: '12px 18px', borderRadius: 10, marginBottom: 20,
                  background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.25)',
                  fontSize: 14, color: 'var(--amber)',
                }}>
                  {result.salewide}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {(result.deals || []).map((deal, i) => (
                  <DealCard key={i} deal={deal} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: 16, padding: '16px 20px', borderRadius: 10,
              background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)',
              color: '#f87171', display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Extraction failed</div>
                <div style={{ fontSize: 13 }}>{error}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SAVED TAB */}
      {activeTab === 'saved' && (
        <div>
          {saved.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px' }}>
              <Mail size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 8 }}>No saved deals yet</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
                Parse an email and save the deals to see them here.
              </div>
              <button onClick={() => setActiveTab('parse')} style={{
                padding: '12px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000', fontWeight: 600, fontSize: 14,
              }}>
                Parse an Email
              </button>
            </div>
          ) : (
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
                {saved.length} saved {saved.length === 1 ? 'batch' : 'batches'} · Click any to expand
              </div>
              {saved.map(batch => (
                <SavedBatch key={batch.id} batch={batch} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
