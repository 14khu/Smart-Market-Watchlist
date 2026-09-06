export default function Sparkline({ data, positive }) {
  if (!data || data.length < 2) return <svg width="100" height="36" className="sparkline" />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 32 - ((v - min) / range) * 28;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width="100" height="36" viewBox="0 0 100 36" preserveAspectRatio="none" className="sparkline">
      <polyline points={points} fill="none" stroke={positive ? '#4ade80' : '#ff6b6b'} strokeWidth="2" />
    </svg>
  );
}