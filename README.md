# 🎵 Digging in the Sales Crates

> Taking the Dig Out of Digging

Find the best vinyl deals across Discogs, eBay, and CDandLP — all in one search.

**Live site:** [digginginthesalescrates.com](https://digginginthesalescrates.com)

---

## What It Does

- Search Discogs, eBay, and CDandLP simultaneously for any vinyl record
- Compare prices across all three marketplaces in one place
- Filter results by source (Discogs, eBay, CDandLP, or All)
- Save records to your Wishlist with persistent local storage
- Set price alerts for records you are hunting
- Browse curated store cards on the Deals page including local MA shops
- Find independent record stores near you with Where's My Shop?
- Parse vinyl listing emails with the AI-powered Email Parser
- Full PWA support for mobile install

---

## Tech Stack

- React 18
- React Router v6
- Framer Motion
- Discogs API
- eBay Finding API (via Cloudflare Worker)
- CDandLP API (via Cloudflare Worker)
- Claude AI API (Email Parser via Cloudflare Worker)
- Google Places API (local shop finder)
- Hosted on Cloudflare Pages

---

## Environment Variables

Set these in Cloudflare Pages under Settings, Variables and Secrets:

| Variable | Description |
|---|---|
| `REACT_APP_DISCOGS_TOKEN` | Discogs personal access token |
| `EBAY_CLIENT_ID` | eBay API client ID |
| `EBAY_CLIENT_SECRET` | eBay API client secret |
| `REACT_APP_CLAUDE_API_KEY` | Claude API key (frontend) |
| `CLAUDE_API_KEY` | Claude API key (Cloudflare Worker) |
| `GOOGLE_PLACES_API_KEY` | Google Places API key |
| `CDANDLP_UID` | CDandLP affiliate UID |

For local development, copy `.env.example` to `.env` and fill in your values.

---

## Affiliate Tracking

### eBay
Results link out with affiliate parameters automatically appended:
```
mkevt=1&mkcid=1&mkrid=711-53200-19255-0&campid=5339145834&toolid=10001&customid=ditsc
```
eBay Partner Network publisher ID: `7103481`

### CDandLP
Affiliate UID is passed via the `CDANDLP_UID` environment variable to the Cloudflare Worker. Results return with `?affilie=digginginthesalescrates` appended to shop URLs automatically.

### Vinyl Castle (AWIN)
Store card on Deals page links via AWIN affiliate URL.
AWIN publisher ID: `2823694`

---

## Cloudflare Workers (Functions)

Located in `/functions/api/`:

| File | Purpose |
|---|---|
| `search-ebay.js` | Proxies eBay Finding API calls, injects client credentials |
| `search-cdandlp.js` | Proxies CDandLP API calls, injects UID |
| `parse-email.js` | Passes listing email text to Claude API for parsing |
| `local-shops.js` | Proxies Google Places API for local store finder |

---

## Local Development

### 1. Clone the repo

```bash
git clone https://github.com/Phishhead35/digging-in-the-sales-crates.git
cd digging-in-the-sales-crates
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in your API tokens in `.env`.

### 4. Run locally

```bash
npm start
```

Open http://localhost:3000

---

## Deploying to Cloudflare Pages

### Build settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `build` |
| Root directory | `digging-in-the-sales-crates` |
| Node version | `18` (set via `NODE_VERSION` environment variable) |

### Push to GitHub

```bash
cd digging-in-the-sales-crates
git init
git add .
git commit -m "your commit message"
git remote add origin https://github.com/Phishhead35/digging-in-the-sales-crates.git
git push -f origin master
```

Cloudflare Pages will detect the push and deploy automatically.

---

## Contact

Store owner, label, or affiliate inquiry: hello@digginginthesalescrates.com

---

© 2026 Digging in the Sales Crates. Find your perfect record.
