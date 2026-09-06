import { useState } from 'react';
import Sparkline from './Sparkline';

export default function StockCard({ stock, onRemove, sparklineData }) {
  const [expanded, setExpanded] = useState(false);
  const isUp = stock.dayChangePct >= 0;

  return (
    <div className={`stock-card ${stock.isMeaningful ? 'flagged' : ''}`}>
      <div className="stock-card-top">
        <div>
          <div className="stock-name">{stock.name || stock.symbol}</div>
          <div className="stock-symbol">{stock.symbol}</div>
        </div>
        {stock.isMeaningful && <span className="unusual-badge">Unusual</span>}
      </div>

      <div className="stock-card-price-row">
        <div>
          <div className="stock-card-price">
            <span className="price">₹{stock.price}</span>
            <span className={isUp ? 'positive' : 'negative'}>
              {isUp ? '▲' : '▼'} {Math.abs(stock.dayChangePct || 0).toFixed(2)}%
            </span>
          </div>
          {typeof stock.changeSinceLastCheck === 'number' && (
            <div className="since-last-check">
              Since last checked:{' '}
              <span className={stock.changeSinceLastCheck >= 0 ? 'positive' : 'negative'}>
                {stock.changeSinceLastCheck >= 0 ? '+' : ''}
                {stock.changeSinceLastCheck}%
              </span>
            </div>
          )}
        </div>
        <Sparkline data={sparklineData} positive={isUp} />
      </div>

      <div className="stock-card-footer">
        <span className="meta-cell">
          {stock.source !== 'live' && <span className="stale-badge">stale</span>}
          Updated {new Date(stock.fetchedAt).toLocaleTimeString()}
        </span>
        <button className="remove-btn" onClick={() => onRemove(stock.symbol)}>Remove</button>
      </div>

      {stock.isMeaningful && (
        <div className="why-flagged">
          <button className="why-toggle" onClick={() => setExpanded(!expanded)}>
            Why was this flagged? {expanded ? '▲' : '▼'}
          </button>
          {expanded && (
            <div className="why-detail">
              <div className="why-row"><span>Current movement</span><span>{stock.changeSinceLastCheck}%</span></div>
              <div className="why-row"><span>Typical recent movement</span><span>~{stock.baselineMove}%</span></div>
              <p className="why-explanation">
                Today's movement is about {stock.significanceScore}x this stock's usual behavior.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}