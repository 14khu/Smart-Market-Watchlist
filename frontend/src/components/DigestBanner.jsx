const MAX_SHOWN = 6;

export default function DigestBanner({ digest, loading }) {
  if (loading) {
    return <div className="digest-banner loading">Checking what's changed...</div>;
  }
  if (!digest) return null;

  const { meaningful } = digest;

  if (meaningful.length === 0) {
    return (
      <div className="digest-banner calm">
        <span className="digest-icon">✓</span>
        Nothing unusual since you last checked.
      </div>
    );
  }

  const shown = meaningful.slice(0, MAX_SHOWN);
  const remaining = meaningful.length - shown.length;

  return (
    <div className="digest-banner alert">
      <h3>Here's what changed since you last checked</h3>
      {shown.map((item) => (
        <div key={item.symbol} className="digest-item">
          <span className="digest-symbol">{item.symbol}</span>
          <span className="digest-reasons">{item.reasons.join(' · ')}</span>
        </div>
      ))}
      {remaining > 0 && (
        <p className="digest-more">
          +{remaining} more flagged — see the "Unusual" badge on their cards below.
        </p>
      )}
    </div>
  );
}