require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPrice } = require('./priceCache');
const authRoutes = require('./routes/authRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const digestRoutes = require('./routes/digestRoutes');
const searchRoutes = require('./routes/searchRoutes');
const { startPoller } = require('./poller');
const sparklineRoutes = require('./routes/sparklineRoutes');
const newsRoutes = require('./routes/newsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test-price/:symbol', async (req, res) => {
  const data = await getPrice(req.params.symbol);
  if (!data) return res.status(502).json({ error: 'Failed to fetch price' });
  res.json(data);
});

app.use('/auth', authRoutes);
app.use('/watchlist/digest', digestRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/search', searchRoutes);
app.use('/watchlist/sparklines', sparklineRoutes);
app.use('/news', newsRoutes);

startPoller();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));