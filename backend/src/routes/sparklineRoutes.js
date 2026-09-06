const express = require('express');
const supabase = require('../db');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { data: items, error } = await supabase
    .from('watchlist_items')
    .select('symbol')
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  const result = {};
  await Promise.all(
    items.map(async (item) => {
      const { data: snaps } = await supabase
        .from('price_snapshots')
        .select('price')
        .eq('symbol', item.symbol)
        .order('fetched_at', { ascending: false })
        .limit(20);
      result[item.symbol] = (snaps || []).map((s) => s.price).reverse();
    })
  );

  res.json(result);
});

module.exports = router;