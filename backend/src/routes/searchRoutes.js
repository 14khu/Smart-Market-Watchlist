const express = require('express');
const YahooFinance = require('yahoo-finance2').default;
const requireAuth = require('../middleware/requireAuth');

const yahooFinance = new YahooFinance();
const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 1) return res.json([]);

  try {
    const results = await yahooFinance.search(q, { quotesCount: 8 });
    const stocks = (results.quotes || [])
      .filter((r) => r.symbol && (r.shortname || r.longname))
      .map((r) => ({
        symbol: r.symbol,
        name: r.shortname || r.longname,
        exchange: r.exchange,
      }));
    res.json(stocks);
  } catch (err) {
    console.error('Search failed:', err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;