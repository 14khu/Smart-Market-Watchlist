import { useState, useEffect } from 'react';

const MESSAGE = "Welcome. Let's see what changed while you were away.";
const TICKERS = [
  { symbol: 'RELIANCE', change: '+1.5%', up: true },
  { symbol: 'TCS', change: '-0.7%', up: false },
  { symbol: 'INFY', change: '+2.1%', up: true },
  { symbol: 'HDFC', change: '-0.3%', up: false },
];
const RIBBON_ITEMS = [
  { symbol: 'RELIANCE', change: '+1.50%', up: true },
  { symbol: 'TCS', change: '-0.69%', up: false },
  { symbol: 'INFY', change: '-0.03%', up: false },
  { symbol: 'HDFC BANK', change: '+0.82%', up: true },
  { symbol: 'TATA MOTORS', change: '+3.10%', up: true },
  { symbol: 'ICICI BANK', change: '-0.45%', up: false },
  { symbol: 'WIPRO', change: '+1.12%', up: true },
  { symbol: 'SBI', change: '-0.21%', up: false },
];

export default function LandingPage({ onGetStarted }) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(MESSAGE.slice(0, i + 1));
      i++;
      if (i === MESSAGE.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <svg className="chart-bg" viewBox="0 0 800 300" preserveAspectRatio="none">
        <path
          className="chart-line"
          d="M0,220 L80,180 L160,210 L240,120 L320,160 L400,80 L480,110 L560,50 L640,90 L720,30 L800,60"
          fill="none"
        />
      </svg>

      {TICKERS.map((t, i) => (
        <div key={t.symbol} className={`ticker-chip ticker-${i + 1} ${t.up ? 'up' : 'down'}`}>
          <span className="ticker-symbol">{t.symbol}</span>
          <span className="ticker-change">{t.change}</span>
        </div>
      ))}

      <div className="landing-content">
        <h1 className="typing-text">
          {typed}
          <span className="cursor">|</span>
        </h1>

        {done && (
          <>
            <button className="cta-btn pop" onClick={onGetStarted}>
              Let's Get Started
            </button>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">↗</div>
                <h3>Detects what matters</h3>
                <p>Not every price move deserves your attention — we flag only the unusual ones.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✓</div>
                <h3>Explains why</h3>
                <p>Every flagged change comes with a clear reason, not just a red or green number.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">↺</div>
                <h3>Remembers for you</h3>
                <p>Come back anytime — we compare against exactly what you last saw.</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="ticker-ribbon">
        <div className="ticker-ribbon-track">
          {[...RIBBON_ITEMS, ...RIBBON_ITEMS].map((t, i) => (
            <span key={i} className={`ribbon-item ${t.up ? 'up' : 'down'}`}>
              {t.symbol} <b>{t.change}</b>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}