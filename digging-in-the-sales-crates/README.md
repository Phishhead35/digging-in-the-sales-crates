# 🎵 Digging in the Sales Crates

> Find the best vinyl deals across Discogs, eBay, and top specialty stores.

## What It Does

- Search Discogs and eBay simultaneously for any vinyl record
- Compare prices across marketplaces in one place
- Save records to your wishlist
- Set price alerts for records you're hunting
- Quick links to Fat Beats, Get On Down, and Mass Appeal

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/digging-in-the-sales-crates.git
cd digging-in-the-sales-crates
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API tokens

Copy the example env file:

```bash
cp .env.example .env
```

Open `.env` and fill in your tokens:

```
REACT_APP_DISCOGS_TOKEN=your_discogs_token_here
REACT_APP_EBAY_APP_ID=your_ebay_app_id_here
```

**Getting your Discogs token:**
1. Log into discogs.com
2. Go to Settings → Developers
3. Click "Generate new token"
4. Paste it into .env

**Getting your eBay App ID:**
1. Go to developer.ebay.com
2. Create a free developer account
3. Create an app to get your App ID (Client ID)
4. Paste it into .env

### 4. Run locally

```bash
npm start
```

Open http://localhost:3000

---

## Deploy to GitHub Pages (Free Hosting)

### 1. Update package.json homepage

Open `package.json` and update this line with your actual GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/digging-in-the-sales-crates"
```

### 2. Install gh-pages

```bash
npm install gh-pages --save-dev
```

### 3. Deploy

```bash
npm run deploy
```

Your site will be live at the homepage URL within a few minutes.

---

## Tech Stack

- React 18
- React Router v6
- Framer Motion
- Discogs API (free)
- eBay Finding API (free)
- Hosted on GitHub Pages (free)

---

## Important Notes

- Never commit your `.env` file. It is listed in `.gitignore` by default.
- The eBay Finding API is free but has rate limits. For heavy usage, consider caching results.
- Discogs rate limits: 60 requests/minute authenticated, 25/minute unauthenticated.

---

© 2026 Digging in the Sales Crates
