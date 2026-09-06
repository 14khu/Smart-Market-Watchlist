const supabase = require('./db');

// Gets all snapshots for a symbol, most recent first
async function getSnapshots(symbol, limit = 30) {
  const { data, error } = await supabase
    .from('price_snapshots')
    .select('*')
    .eq('symbol', symbol)
    .order('fetched_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`Failed to get snapshots for ${symbol}:`, error.message);
    return [];
  }
  return data;
}

// Baseline "normal move" = average absolute % change between consecutive snapshots
function calculateBaseline(snapshots) {
  if (snapshots.length < 3) return 1.5; // default until we have enough history

  const sorted = [...snapshots].sort(
    (a, b) => new Date(a.fetched_at) - new Date(b.fetched_at)
  );

  let totalMove = 0;
  let count = 0;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].price;
    const curr = sorted[i].price;
    if (prev > 0) {
      totalMove += Math.abs(((curr - prev) / prev) * 100);
      count++;
    }
  }

  return count > 0 ? totalMove / count : 1.5;
}

// Core function: for one symbol, compare snapshot-at-last-visit vs latest,
// and decide if the change is meaningful
async function analyzeSymbol(symbol, lastViewedAt) {
  const snapshots = await getSnapshots(symbol);
  if (snapshots.length === 0) return null;

  const latest = snapshots[0]; // most recent (already sorted desc)

  // Find the snapshot closest to (but not after) last_viewed_at
  const baseline_snapshot =
    snapshots.find((s) => new Date(s.fetched_at) <= new Date(lastViewedAt)) ||
    snapshots[snapshots.length - 1]; // fallback: oldest we have

  const oldPrice = baseline_snapshot.price;
  const newPrice = latest.price;
  const pctChange = oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 : 0;

  const baseline = calculateBaseline(snapshots);
  const significanceScore = baseline > 0 ? Math.abs(pctChange) / baseline : 0;

  const reasons = [];
  if (significanceScore >= 2) {
    reasons.push(
      `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(2)}% — about ${significanceScore.toFixed(
        1
      )}x this stock's usual move`
    );
  }

  // Volume spike check
  const avgVolume =
    snapshots.reduce((sum, s) => sum + (s.volume || 0), 0) / snapshots.length;
  if (avgVolume > 0 && latest.volume > avgVolume * 2) {
    reasons.push(`Volume spike — ${(latest.volume / avgVolume).toFixed(1)}x average`);
  }

  return {
    symbol,
    currentPrice: newPrice,
    pctChange: Number(pctChange.toFixed(2)),
    baselineMove: Number(baseline.toFixed(2)),
    significanceScore: Number(significanceScore.toFixed(2)),
    isMeaningful: reasons.length > 0,
    reasons,
    lastCheckedPrice: oldPrice,
    fetchedAt: latest.fetched_at,
  };
}

module.exports = { analyzeSymbol };