import { useEffect, useState } from 'react';
import { api } from '../api';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diffMs / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getNews()
      .then(setNews)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="watchlist-page">
      <div className="welcome-header">
        <h1>Latest Market News</h1>
        <p>Real news for the companies on your watchlist.</p>
      </div>

      {loading && <p className="empty-state">Loading news...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && news.length === 0 && (
        <p className="empty-state">No recent news found for your watchlist symbols.</p>
      )}

      <div className="news-list">
        {news.map((n, i) => (
          <a key={i} href={n.link} target="_blank" rel="noopener noreferrer" className="news-card">
            <div>
              <span className="news-symbol-tag">{n.relatedSymbol}</span>
              <h3>{n.title}</h3>
              <p className="news-meta">{n.publisher} · {timeAgo(n.publishedAt)}</p>
            </div>
            <span className="news-arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}