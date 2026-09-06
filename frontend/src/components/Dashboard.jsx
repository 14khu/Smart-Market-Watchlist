import { useState } from 'react';
import { clearToken } from '../api';
import TopNav from './TopNav';
import WatchlistPage from './WatchlistPage';
import InsightsPage from './InsightsPage';
import NewsPage from './NewsPage';

export default function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('watchlist');

  function handleLogout() {
    clearToken();
    onLogout();
  }

  return (
    <div className="app-shell">
      <TopNav active={tab} onNavigate={setTab} onLogout={handleLogout} />
      {tab === 'watchlist' && <WatchlistPage onNavigate={setTab} />}
      {tab === 'insights' && <InsightsPage />}
      {tab === 'news' && <NewsPage />}
    </div>
  );
}