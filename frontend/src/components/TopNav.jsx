export default function TopNav({ active, onNavigate, onLogout }) {
  const tabs = [
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'insights', label: 'Insights' },
    { id: 'news', label: 'News' },
  ];
  const name = localStorage.getItem('name');

  return (
    <nav className="dash-nav">
      <div className="dash-nav-inner">
        <span className="brand">Smart Market Watchlist</span>
        <div className="dash-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`dash-tab ${active === t.id ? 'active' : ''}`}
              onClick={() => onNavigate(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="topnav-right">
          {name && <span className="greeting">Hi, {name}</span>}
          <button className="logout-btn" onClick={onLogout}>Log out</button>
        </div>
      </div>
    </nav>
  );
}