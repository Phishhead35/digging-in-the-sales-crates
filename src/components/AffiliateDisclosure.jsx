/**
 * src/components/AffiliateDisclosure.jsx
 *
 * FTC-compliant affiliate disclosure for DITSC.
 *
 * WHY
 * The FTC requires a material connection to be disclosed "clearly and
 * conspicuously" and CLOSE TO THE LINK. A single line buried in the footer
 * is not sufficient on its own. eBay Partner Network, Awin, Affiliatly, and
 * Amazon Associates each require disclosure in their own terms as well.
 *
 * Retrolife in particular appeared on the homepage as "Partner Resource /
 * Online Friend" with no indication it earns a commission. "Online Friend"
 * reads as a personal endorsement rather than a paid relationship, which is
 * exactly the impression the rule exists to prevent.
 *
 * WHAT GETS A BADGE IS NOT DECIDED HERE
 * `src/config/partners.js` owns that. A badge is rendered only where
 * `isMonetized(key)` is true, so a badge can never claim a commission that
 * does not exist. Discogs and Fat Beats are deliberately unmonetized and
 * must never be badged: a false disclosure is its own problem, and it
 * misleads the reader in the opposite direction.
 *
 * No external dependencies, matching the useSEO approach.
 * Styles are injected once and scoped to ditsc-ad-* class names, so this
 * drops in without touching Layout.jsx or the global stylesheet.
 *
 * Fixed sizing throughout so nothing reflows after paint. CLS was
 * deliberately fixed on this site; do not make these elements load-dependent.
 *
 * USAGE
 *
 *   Inline badge next to a single monetized link:
 *     <AffiliateBadge />
 *     <AffiliateBadge label="paid link" />
 *
 *   Conditional, driven by config so it can never disagree with reality:
 *     import { isMonetized } from '../config/partners';
 *     {isMonetized(result.source) && <AffiliateBadge />}
 *
 *   One-line notice above a group of links:
 *     <AffiliateDisclosure variant="compact" />
 *
 *   Notice that names the actual partners on that page:
 *     <AffiliateDisclosure variant="compact" surface="search" />
 *
 *   Footer / policy text:
 *     <AffiliateDisclosure variant="footer" />
 */

// React is imported explicitly even though this file only needs useEffect.
// Every other component in src/ does the same, and it is required if the
// build ever uses the CLASSIC JSX runtime, where JSX compiles to
// React.createElement and React must be in scope. Caught by a
// render test: without it the module throws "React is not defined"
// at import time under classic, which would take the whole site down.
import React, { useEffect } from 'react';
import {
  monetizedOnSurface,
  monetizedPartnerNames,
  requiresOwnDisclosureOnSurface,
} from '../config/partners';

const AMBER = '#f59e0b';

const STYLE_ID = 'ditsc-affiliate-disclosure-styles';

const CSS = `
.ditsc-ad-badge {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 7px;
  border: 1px solid rgba(245, 158, 11, 0.45);
  border-radius: 9px;
  background: rgba(245, 158, 11, 0.10);
  color: ${AMBER};
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  flex-shrink: 0;
  /* Not a button. Do not add hover states, it reads as clickable. */
}

.ditsc-ad-badge--spaced { margin-left: 8px; }

.ditsc-ad-note {
  font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 16px;
}

.ditsc-ad-note--compact {
  font-size: 12px;
  margin: 0 0 10px;
}

.ditsc-ad-note--footer {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  /* auto on the sides: the footer is center-aligned, and a one-sided
     margin would push this block off center. */
  margin: 14px auto 0;
  max-width: 62ch;
  text-align: center;
}

.ditsc-ad-note strong {
  color: rgba(255, 255, 255, 0.75);
  font-weight: 600;
}
`;

/** Inject the stylesheet once, on first mount of any disclosure component. */
function useDisclosureStyles() {
  useEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/**
 * Small inline tag for a single monetized link.
 *
 * Place it immediately next to the link or inside the card's action row,
 * never in a tooltip and never behind a hover. Disclosure has to be visible
 * without interaction to count.
 *
 * @param {string}  label   badge text
 * @param {boolean} spaced  add left margin (use when it follows inline text)
 */
export function AffiliateBadge({ label = 'affiliate', spaced = false }) {
  useDisclosureStyles();
  return (
    <span
      className={`ditsc-ad-badge${spaced ? ' ditsc-ad-badge--spaced' : ''}`}
      // Screen readers get the full meaning, sighted users get the short tag.
      aria-label="Affiliate link. We may earn a commission at no extra cost to you."
      title="Affiliate link. We may earn a commission at no extra cost to you."
    >
      {label}
    </span>
  );
}

/**
 * AMAZON ASSOCIATES
 *
 * Amazon's Operating Agreement requires this specific sentence, or wording
 * "substantially similar," displayed clearly and prominently. The generic
 * notice below does NOT satisfy it: Amazon wants its own statement, and the
 * FTC wants a plain-English commission disclosure. Both, together, near the
 * link. That is why the surface notice renders the two as one line rather
 * than making anyone remember to add the second.
 *
 * The same sentence is required anywhere else Amazon links or Amazon content
 * appear: TikTok and Instagram captions, YouTube descriptions, the
 * newsletter. That part is not code. In a video it has to be said out loud
 * and shown on screen early; a description line alone does not count. On
 * social it goes near the START of the caption, before the "more" cutoff,
 * with #ad. "#aff" and "#sp" do not count.
 *
 * Amazon also prohibits public commentary about the Associates agreement
 * beyond this required statement without written permission, so do not
 * elaborate on the relationship anywhere on the site.
 *
 * NOT RENDERED TODAY. Amazon has no `surfaces` entry in partners.js because
 * Amazon links live only in social posts. Adding 'artist' or 'blog' to
 * Amazon's surfaces array is the single change that turns this on
 * everywhere, and the BLOCKER before that is declaring
 * digginginthesalescrates.com as a site in the Associates account. Verify
 * the wording on Amazon's own policy page at that point rather than
 * trusting this constant, which is a copy and can go stale.
 */
export const AMAZON_DISCLOSURE_TEXT =
  'As an Amazon Associate I earn from qualifying purchases.';

/** Standalone Amazon statement, for a surface the generic notice doesn't cover. */
export function AmazonDisclosure() {
  useDisclosureStyles();
  return (
    <p className="ditsc-ad-note ditsc-ad-note--compact" data-testid="amazon-disclosure">
      {AMAZON_DISCLOSURE_TEXT}
    </p>
  );
}

/** Join names into readable prose: "A, B, and C". */
function listNames(names) {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

/**
 * Block-level disclosure.
 *
 * Put it above a group of links, close enough that a reader connects the two.
 *
 * @param {'default'|'compact'|'footer'} variant
 * @param {string} [surface]  when given, the notice names the monetized
 *   partners actually linked on that surface and renders NOTHING if none of
 *   them are. That keeps a disclosure off a page that has nothing to
 *   disclose, which matters: a notice on an unmonetized page trains readers
 *   to ignore it on the pages where it counts.
 */
export function AffiliateDisclosure({ variant = 'default', surface = null }) {
  useDisclosureStyles();

  if (surface) {
    const partners = monetizedOnSurface(surface);
    if (partners.length === 0) return null;
    const names = listNames(partners.map((p) => p.name));
    const cls =
      variant === 'default'
        ? 'ditsc-ad-note'
        : `ditsc-ad-note ditsc-ad-note--${variant}`;
    return (
      <p className={cls} data-testid="affiliate-disclosure">
        Links to {names} are <strong>affiliate links</strong>. If you buy
        through them we may earn a commission, at no extra cost to you. It
        never changes what we show you or how results are ordered.
        {/* Amazon's own required sentence, appended automatically when an
            Amazon link is present on this surface. Nobody has to remember
            to add it, and it cannot appear on a page with no Amazon link. */}
        {requiresOwnDisclosureOnSurface(surface) ? ` ${AMAZON_DISCLOSURE_TEXT}` : ''}
      </p>
    );
  }

  const cls =
    variant === 'default'
      ? 'ditsc-ad-note'
      : `ditsc-ad-note ditsc-ad-note--${variant}`;

  return (
    <p className={cls} data-testid="affiliate-disclosure">
      {COPY[variant] || COPY.default}
    </p>
  );
}

const COPY = {
  default: (
    <>
      Some links here are <strong>affiliate links</strong>. If you buy through
      them, Digging in the Sales Crates may earn a commission at no extra cost
      to you. It never changes what we show you or how results are ordered.
    </>
  ),
  compact: (
    <>
      Some links are <strong>affiliate links</strong>. We may earn a commission
      at no extra cost to you.
    </>
  ),
  footer: (
    <>
      Digging in the Sales Crates participates in affiliate programs including
      the eBay Partner Network, Awin, and Affiliatly. Outbound links to{' '}
      {listNames(monetizedPartnerNames())} are affiliate links, meaning we may
      earn a commission if you make a purchase, at no additional cost to you.
      Links to Discogs and to independent record shops earn nothing. Search
      results are never ranked or filtered based on commission.
      {monetizedPartnerNames().includes('Amazon') ? ` ${AMAZON_DISCLOSURE_TEXT}` : ''}
    </>
  ),
};

export default AffiliateDisclosure;
