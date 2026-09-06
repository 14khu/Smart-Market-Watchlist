# Smart Market Watchlist

A watchlist built for Groww's "Code 2026" hackathon that answers one question every time you open it: **"What actually changed since I last checked, and does it deserve my attention?"** — instead of just re-displaying today's prices.

**Live demo:** [https://smart-market-watchlist-ten.vercel.app]
**Backend API:** [https://smart-market-watchlist-unv8.onrender.com]

## The core idea

Most watchlists show you a flat list of prices. This one remembers exactly what you saw last time, compares it to now, and surfaces only the changes that are genuinely unusual — with a plain-language reason for each one.

## What makes it "smart" (not just a CRUD list)

1. **Relative significance, not a flat threshold.** A 2% move means different things for different stocks. Instead of a fixed "±2% = alert" rule, every stock's move is compared against *its own* recent volatility baseline. A move is only flagged if it's meaningfully larger than that stock's normal behavior — so the bar adapts per stock instead of treating every company the same.
2. **Ranked, capped digest.** On a volatile day, many stocks could technically cross the threshold. Rather than dumping all of them (which just recreates the noise problem), the digest ranks by significance and shows only the top 6 — with the rest still visible via an "Unusual" badge on their card.
3. **Explainability.** Every flagged change shows *why* — e.g. "+4.2% — about 2.8x this stock's usual move" — not just a colored number.
4. **Resilience.** If the live price API fails or is slow, the app serves the last known price from its own history with a visible "stale" indicator, instead of showing nothing or crashing.
5. **Shared caching.** Prices are cached server-side (~45s TTL) and shared across all users, so many people watching the same stock doesn't multiply API calls.

## Architecture

React (Vite) frontend
│ REST + JWT
Node/Express backend
├── Watchlist CRUD (RLS-protected)
├── Price cache + stale-fallback layer
├── Background poller (accumulates price history)
├── Change-detection engine (significance scoring)
└── /watchlist/digest, /news, /watchlist/sparklines
Supabase (Postgres + Auth)
├── watchlist_items
├── price_snapshots (append-only history)
└── user_watchlist_meta (last_viewed_at per user)


## Edge cases handled

- **Stale/delayed data:** cache-miss fallback serves the last known snapshot with a "stale" badge rather than failing.
- **Race conditions:** `price_snapshots` is append-only, and every read always takes the row with the latest `fetched_at` — so a delayed or out-of-order write can never be mistaken for "current," even if the background poller and an on-demand fetch land close together.
- **New symbols with no history:** the significance engine falls back to a sensible default baseline (1.5%) until enough real snapshots accumulate.

## What I'd add with more time

- Per-stock detail page with longer price history
- Real sector/index-relative comparison ("this stock moved against the market's grain")
- WebSocket push instead of polling, for true real-time updates
- Re-enable email confirmation on signup (disabled during development for faster testing)

## Tech stack

React, Vite, Node.js, Express, Supabase (Postgres + Auth), yahoo-finance2 for live market data.

## Running locally

**Backend:**
```bash
cd backend
npm install
# create a .env file with SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY
node src/server.js
```

**Frontend:**
```bash
cd frontend
npm install
# create a .env file with VITE_API_URL=http://localhost:4000
npm run dev
```