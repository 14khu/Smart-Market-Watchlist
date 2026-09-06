import { useEffect, useState } from 'react';
import { api } from '../api';
import MultiLineChart from './MultiLineChart';

export default function InsightsPage() {
  const [stocks, setStocks] = useState([]);
  const [digest, setDigest] = useState(null);
  const [sparklines, setSparklines] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getWatchlist(), api.getDigest(), api.getSparklines()])
      .then(([s, d, sp]) => { setStocks(s); setDigest(d); setSparklines(sp); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="watchlist-page"><p className="empty-state">Crunching your watchlist...</p></div>;
  if (stocks.length === 0) return <div className="watchlist-page"><p className="empty-state">Add stocks to your watchlist to see insights.</p></div>;

  const best = [...stocks].sort((a, b) => (b.dayChangePct || 0) - (a.dayChangePct || 0))[0];
  const worst = [...stocks].sort((a, b) => (a.dayChangePct || 0) - (b.dayChangePct || 0))[0];
  const unusualCount = digest?.meaningful?.length || 0;
  const mostUnusual = digest?.meaningful?.[0];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="watchlist-page">
      <div className="insights-header-row">
        <div className="welcome-header">
          <h1>Market Insights</h1>
          <p>A quick read on your watchlist, computed from your real tracked data.</p>
        </div>
        <div className="insights-date-badge">
          <span>{today}</span>
          <span className="insights-tagline">
            {unusualCount === 0 ? 'Small moves today. Steady watchlist.' : `${unusualCount} move(s) worth a look.`}
          </span>
        </div>
      </div>

      <div className="insights-grid">
        <div className="insight-card">
          <span className="insight-label">Best performer today</span>
          <h3>{best.symbol}</h3>
          <p className="positive">+{best.dayChangePct?.toFixed(2)}%</p>
        </div>
        <div className="insight-card">
          <span className="insight-label">Worst performer today</span>
          <h3>{worst.symbol}</h3>
          <p className="negative">{worst.dayChangePct?.toFixed(2)}%</p>
        </div>
        <div className="insight-card">
          <span className="insight-label">Unusual moves flagged</span>
          <h3>{unusualCount}</h3>
          <p>{unusualCount === 0 ? 'All calm right now' : 'stock(s) deserve a look'}</p>
        </div>
      </div>

      <div className="performance-section">
        <div className="performance-chart-card">
          <div className="performance-header">
            <h3>Watchlist Performance</h3>
            <div className="timeframe-tabs">
              <button className="timeframe-tab active">Recent</button>
              <button className="timeframe-tab disabled" disabled title="More history builds up as tracking continues">1W</button>
              <button className="timeframe-tab disabled" disabled title="More history builds up as tracking continues">1M</button>
              <button className="timeframe-tab disabled" disabled title="More history builds up as tracking continues">1Y</button>
            </div>
          </div>
          <MultiLineChart seriesMap={sparklines} />
        </div>

        <div className="takeaways-card">
          <h3>Key Takeaways</h3>
          <div className="takeaway-item">
            <span className="takeaway-icon up">↗</span>
            <span>{best.symbol} is the top gainer, up {best.dayChangePct?.toFixed(2)}% today.</span>
          </div>
          <div className="takeaway-item">
            <span className="takeaway-icon down">↘</span>
            <span>{worst.symbol} is the largest decliner, at {worst.dayChangePct?.toFixed(2)}%.</span>
          </div>
          {mostUnusual ? (
            <div className="takeaway-item">
              <span className="takeaway-icon alert">!</span>
              <span>{mostUnusual.symbol}: {mostUnusual.reasons.join(' · ')}</span>
            </div>
          ) : (
            <div className="takeaway-item">
              <span className="takeaway-icon ok">✓</span>
              <span>No unusual moves detected. Your watchlist is behaving as expected.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}