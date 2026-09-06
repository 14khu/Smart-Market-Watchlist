const { fetchQuote } = require('./priceService');
const supabase = require('./db');

// In-memory cache: symbol -> { data, expiresAt }
const cache = new Map();
const TTL_MS = 45 * 1000; // 45 seconds - tweak as needed

async function getPrice(symbol) {
  const cached = cache.get(symbol);
  const now = Date.now();

  // Serve from cache if still fresh - this is what stops
  // every user request from hitting Yahoo directly
  if (cached && cached.expiresAt > now) {
    return { ...cached.data, source: 'cache' };
  }

  // Cache miss or expired - fetch fresh data
  const fresh = await fetchQuote(symbol);

  if (fresh) {
    cache.set(symbol, { data: fresh, expiresAt: now + TTL_MS });

    // Persist snapshot to Supabase (fire-and-forget is fine here,
    // we don't want a slow DB write to block the API response)
    supabase
      .from('price_snapshots')
      .insert({
        symbol: fresh.symbol,
        price: fresh.price,
        volume: fresh.volume,
        day_change_pct: fresh.dayChangePct,
        fetched_at: fresh.fetchedAt,
      })
      .then(({ error }) => {
        if (error) console.error('Failed to save snapshot:', error.message);
      });

    return { ...fresh, source: 'live' };
  }

  // Live fetch failed - fall back to last known snapshot in DB
  // This is the resilience piece: never show nothing, show the
  // last good data with a clear "stale" flag instead
  const { data: lastSnapshot, error } = await supabase
    .from('price_snapshots')
    .select('*')
    .eq('symbol', symbol)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single();

  if (lastSnapshot) {
    return {
      symbol,
      price: lastSnapshot.price,
      dayChangePct: lastSnapshot.day_change_pct,
      volume: lastSnapshot.volume,
      fetchedAt: lastSnapshot.fetched_at,
      source: 'stale-fallback',
    };
  }

  // No cache, no DB history, live fetch failed - genuinely nothing to show
  return null;
}

module.exports = { getPrice };