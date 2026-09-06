import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import DigestBanner from './DigestBanner';
import StockCard from './StockCard';
import AddStockForm from './AddStockForm';

export default function WatchlistPage({ onNavigate }) {
  const [stocks, setStocks] = useState([]);
  const [digest, setDigest] = useState(null);
  const [sparklines, setSparklines] = useState({});
  const [loading, setLoading] = useState(true);
  const [digestLoading, setDigestLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showAddTile, setShowAddTile] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      setError('');
      const [watchlistData, digestData, sparkData] = await Promise.all([
        api.getWatchlist(),
        api.getDigest(),
        api.getSparklines(),
      ]);
      setStocks(watchlistData);
      setDigest(digestData);
      setSparklines(sparkData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setDigestLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function handleAdd(symbol) {
    await api.addStock(symbol);
    await loadAll();
    setShowAddTile(false);
  }

  async function handleRemove(symbol) {
    await api.removeStock(symbol);
    setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
  }

  const allDigestItems = digest ? [...digest.meaningful, ...digest.unchanged] : [];
  let combined = stocks.map((s) => {
    const d = allDigestItems.find((item) => item.symbol === s.symbol);
    return d
      ? { ...s, changeSinceLastCheck: d.pctChange, significanceScore: d.significanceScore,
          isMeaningful: d.isMeaningful, reasons: d.reasons, baselineMove: d.baselineMove }
      : s;
  });

  if (filter === 'gainers') combined = combined.filter((s) => s.dayChangePct >= 0);
  if (filter === 'losers') combined = combined.filter((s) => s.dayChangePct < 0);

  combined = [...combined].sort((a, b) => {
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'change') return (b.dayChangePct || 0) - (a.dayChangePct || 0);
    return a.symbol.localeCompare(b.symbol);
  });

  const name = localStorage.getItem('name');

  return (
    <div className="watchlist-page">
      <div className="welcome-header">
        <h1>Welcome back{name ? `, ${name}` : ''}!</h1>
        <p>Here's what's happening with your watchlist today.</p>
      </div>

      <AddStockForm onAdd={handleAdd} />

      <div className="filter-row">
        <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Stocks</button>
        <button className={`filter-chip ${filter === 'gainers' ? 'active' : ''}`} onClick={() => setFilter('gainers')}>↗ Gainers</button>
        <button className={`filter-chip ${filter === 'losers' ? 'active' : ''}`} onClick={() => setFilter('losers')}>↘ Losers</button>
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="change">Sort: Change</option>
        </select>
      </div>

      <DigestBanner digest={digest} loading={digestLoading} />

      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="card-grid">{[1,2,3].map((i) => <div key={i} className="stock-card skeleton" />)}</div>
      ) : (
        <div className="card-grid">
          {combined.map((s) => (
            <StockCard key={s.symbol} stock={s} onRemove={handleRemove} sparklineData={sparklines[s.symbol]} />
          ))}
          <div className="add-tile" onClick={() => setShowAddTile(true)}>
            <span className="add-tile-icon">+</span>
            <span className="add-tile-label">Add a new stock</span>
            <span className="add-tile-sub">Start tracking to get insights →</span>
          </div>
        </div>
      )}

      <div className="bottom-cta-row">
        <button className="bottom-cta" onClick={() => onNavigate('insights')}>
          <div><h3>Market Insights</h3><p>Get insights on your watchlist</p></div>
          <span>View Insights →</span>
        </button>
        <button className="bottom-cta" onClick={() => onNavigate('news')}>
          <div><h3>Latest Market News</h3><p>Stay updated with what moves the market</p></div>
          <span>View News →</span>
        </button>
      </div>
    </div>
  );
}