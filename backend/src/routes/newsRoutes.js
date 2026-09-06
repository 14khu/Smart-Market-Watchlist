const express = require('express');
const YahooFinance = require('yahoo-finance2').default;
const supabase = require('../db');
const requireAuth = require('../middleware/requireAuth');

const yahooFinance = new YahooFinance();
const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { data: items } = await supabase
      .from('watchlist_items')
      .select('symbol')
      .eq('user_id', req.user.id);

    const symbols = (items || []).map((i) => i.symbol).slice(0, 5);

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const searchRes = await yahooFinance.search(symbol, { newsCount: 4 });
          return (searchRes.news || []).map((n) => ({
            title: n.title,
            publisher: n.publisher,
            link: n.link,
            publishedAt: n.providerPublishTime
              ? new Date(n.providerPublishTime * 1000).toISOString()
              : null,
            relatedSymbol: symbol,
          }));
        } catch {
          return [];
        }
      })
    );

    const flat = results.flat();
    const seen = new Set();
    const deduped = flat
      .filter((n) => {
        if (seen.has(n.title)) return false;
        seen.add(n.title);
        return true;
      })
      .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

    res.json(deduped.slice(0, 12));
  } catch (err) {
    console.error('News fetch failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;