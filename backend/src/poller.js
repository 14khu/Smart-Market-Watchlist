const supabase = require('./db');
const { fetchQuote } = require('./priceService');

const POLL_INTERVAL_MS = 60 * 1000; // every 60 seconds

async function pollAllSymbols() {
  // Get every distinct symbol across all users' watchlists
  const { data, error } = await supabase
    .from('watchlist_items')
    .select('symbol');

  if (error) {
    console.error('Poller: failed to get symbols:', error.message);
    return;
  }

  const uniqueSymbols = [...new Set(data.map((d) => d.symbol))];

  for (const symbol of uniqueSymbols) {
    const quote = await fetchQuote(symbol);
    if (quote) {
      await supabase.from('price_snapshots').insert({
        symbol: quote.symbol,
        price: quote.price,
        volume: quote.volume,
        day_change_pct: quote.dayChangePct,
        fetched_at: quote.fetchedAt,
      });
      console.log(`Poller: saved snapshot for ${symbol} @ ${quote.price}`);
    }
  }
}

function startPoller() {
  console.log('Background poller started');
  pollAllSymbols(); // run once immediately
  setInterval(pollAllSymbols, POLL_INTERVAL_MS);
}

module.exports = { startPoller };