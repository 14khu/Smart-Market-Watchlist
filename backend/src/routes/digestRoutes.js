const express = require('express');
const supabase = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { analyzeSymbol } = require('../changeDetection');
const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const userId = req.user.id;

  // Get user's last_viewed_at (or now, if first ever visit)
  const { data: meta } = await supabase
    .from('user_watchlist_meta')
    .select('last_viewed_at')
    .eq('user_id', userId)
    .single();

  const lastViewedAt = meta?.last_viewed_at || new Date(0).toISOString();

  // Get user's watchlist symbols
  const { data: items, error } = await supabase
    .from('watchlist_items')
    .select('symbol')
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });

  const results = await Promise.all(
    items.map((item) => analyzeSymbol(item.symbol, lastViewedAt))
  );

  const valid = results.filter(Boolean);
  const meaningful = valid.filter((r) => r.isMeaningful).sort(
    (a, b) => b.significanceScore - a.significanceScore
  );
  const unchanged = valid.filter((r) => !r.isMeaningful);

  // Update last_viewed_at to now (upsert - insert if first visit, else update)
  await supabase
    .from('user_watchlist_meta')
    .upsert({ user_id: userId, last_viewed_at: new Date().toISOString() });

  res.json({ meaningful, unchanged, checkedAt: new Date().toISOString() });
});

module.exports = router;