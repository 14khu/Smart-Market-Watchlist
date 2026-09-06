export default function WatchlistTable({ stocks, onRemove }) {
  if (stocks.length === 0) {
    return <p className="empty-state">Your watchlist is empty — add a stock below to get started.</p>;
  }

  return (
    <table className="watchlist-table">
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>Change</th>
          <th>Volume</th>
          <th>Updated</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {stocks.map((s) => (
          <tr key={s.symbol}>
            <td className="symbol-cell">{s.symbol}</td>
            <td className="price-cell">₹{s.price}</td>
            <td className={`change-cell ${s.dayChangePct >= 0 ? 'positive' : 'negative'}`}>
              {s.dayChangePct >= 0 ? '+' : ''}
              {s.dayChangePct?.toFixed(2)}%
            </td>
            <td className="volume-cell">{s.volume?.toLocaleString()}</td>
            <td className="meta-cell time-cell">
              {s.source !== 'live' && <span className="stale-badge">stale</span>}
              {new Date(s.fetchedAt).toLocaleTimeString()}
            </td>
            <td>
              <button className="remove-btn" onClick={() => onRemove(s.symbol)}>
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}