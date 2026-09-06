const express = require('express');
const supabase = require('../db'); // service-role client
const requireAuth = require('../middleware/requireAuth');
const { getPrice } = require('../priceCache');
const router = express.Router();

router.use(requireAuth); // every route below requires a valid logged-in user

// GET /watchlist - list this user's symbols with live prices
router.get('/', async (req, res) => {
  const { data: items, error } = await supabase
    .from('watchlist_items')
    .select('symbol')
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });

  const withPrices = await Promise.all(
    items.map(async (item) => {
      const price = await getPrice(item.symbol);
      return { symbol: item.symbol, ...price };
    })
  );

  res.json(withPrices);
});

// POST /watchlist - add a symbol
router.post('/', async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: 'symbol is required' });

  const { error } = await supabase
    .from('watchlist_items')
    .insert({ user_id: req.user.id, symbol: symbol.toUpperCase() });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'Added', symbol });
});

// DELETE /watchlist/:symbol
router.delete('/:symbol', async (req, res) => {
  const { error } = await supabase
    .from('watchlist_items')
    .delete()
    .eq('user_id', req.user.id)
    .eq('symbol', req.params.symbol.toUpperCase());

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Removed', symbol: req.params.symbol });
});

module.exports = router;