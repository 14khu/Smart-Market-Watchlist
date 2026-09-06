const COLORS = ['#a685ff', '#4ade80', '#ff6b6b', '#6ea8fe', '#f0b429', '#ff8fab'];

export default function MultiLineChart({ seriesMap }) {
  const symbols = Object.keys(seriesMap).filter((s) => seriesMap[s] && seriesMap[s].length > 1);

  if (symbols.length === 0) {
    return <p className="empty-state">Not enough history yet — check back after a few price updates.</p>;
  }

  const normalized = {};
  symbols.forEach((sym) => {
    const arr = seriesMap[sym];
    const base = arr[0];
    normalized[sym] = arr.map((v) => (base ? ((v - base) / base) * 100 : 0));
  });

  const allValues = Object.values(normalized).flat();
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues, 0);
  const range = max - min || 1;
  const maxLen = Math.max(...symbols.map((s) => normalized[s].length));

  const toPoints = (arr) =>
    arr
      .map((v, i) => {
        const x = (i / (maxLen - 1)) * 700;
        const y = 220 - ((v - min) / range) * 200;
        return `${x},${y}`;
      })
      .join(' ');

  return (
    <div>
      <div className="chart-legend">
        {symbols.map((sym, i) => {
          const latestPct = normalized[sym][normalized[sym].length - 1];
          return (
            <span key={sym} className="legend-item">
              <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
              {sym} {latestPct >= 0 ? '+' : ''}{latestPct.toFixed(2)}%
            </span>
          );
        })}
      </div>
      <svg viewBox="0 0 700 240" width="100%" height="240" preserveAspectRatio="none" className="multiline-chart">
        {symbols.map((sym, i) => (
          <polyline key={sym} points={toPoints(normalized[sym])} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}