import { useState } from 'react';
import { api, setToken } from '../api';

function PeekingMascot() {
  return (
    <div className="mascot-peek">
      <svg width="140" height="130" viewBox="0 0 140 130" fill="none">
        <g className="mascot-hand-left">
          <ellipse cx="25" cy="80" rx="16" ry="14" fill="#ffffff" />
        </g>
        <g className="mascot-hand-right">
          <ellipse cx="115" cy="80" rx="16" ry="14" fill="#ffffff" />
        </g>
        <circle cx="70" cy="60" r="55" fill="#ffffff" />
        <circle cx="48" cy="70" r="7" fill="#ffb3c6" opacity="0.5" />
        <circle cx="92" cy="70" r="7" fill="#ffb3c6" opacity="0.5" />
        <circle cx="55" cy="58" r="5" fill="#1a1a2e" />
        <circle cx="85" cy="58" r="5" fill="#1a1a2e" />
        <rect className="mascot-eyelids" x="48" y="53" width="44" height="12" fill="#ffffff" />
        <path d="M55 75 Q70 86 85 75" stroke="#1a1a2e" strokeWidth="3" strokeLinecap="round" fill="none" />
        <g className="mascot-sparkle">
          <line x1="15" y1="35" x2="20" y2="24" stroke="#a685ff" strokeWidth="3" strokeLinecap="round" />
          <line x1="28" y1="30" x2="28" y2="18" stroke="#a685ff" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <div className="speech-bubble peek-bubble">Let's see what changed! ✨</div>
    </div>
  );
}

const LEFT_CHIPS = [
  { icon: '📊', text: 'Same stocks. A clearer story.', pos: 'chip-left-1' },
  { icon: '🎯', text: 'You track. We highlight what matters.', pos: 'chip-left-2' },
];
const RIGHT_CHIPS = [
  { icon: '💡', text: 'Less noise. More insights.', pos: 'chip-right-1' },
  { icon: '✨', text: 'Better insights for a brighter tomorrow.', pos: 'chip-right-2' },
];

export default function Login({ onLoggedIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'signup') {
        await api.signup(name, email, password);
      }
      const res = await api.login(email, password);
      setToken(res.access_token);
      localStorage.setItem('name', res.user?.user_metadata?.full_name || '');
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <svg className="chart-bg" viewBox="0 0 800 300" preserveAspectRatio="none">
        <path
          className="chart-line"
          d="M0,220 L80,180 L160,210 L240,120 L320,160 L400,80 L480,110 L560,50 L640,90 L720,30 L800,60"
          fill="none"
        />
      </svg>

      {LEFT_CHIPS.map((c) => (
        <div key={c.text} className={`info-chip ${c.pos}`}>
          <span className="chip-icon">{c.icon}</span>
          <span>{c.text}</span>
        </div>
      ))}
      {RIGHT_CHIPS.map((c) => (
        <div key={c.text} className={`info-chip ${c.pos}`}>
          <span className="chip-icon">{c.icon}</span>
          <span>{c.text}</span>
        </div>
      ))}

      <div className="auth-page-content">
        <div className="auth-card-wrapper">
          <PeekingMascot />
          <div className="auth-card">
            <h1>Smart Market Watchlist</h1>
            <p className="subtitle">
              {mode === 'login' ? 'Log in to see what changed' : 'Create your account'}
            </p>
            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            <button className="link-btn" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>

      <p className="auth-tagline">Markets move. You stay ahead.</p>
    </div>
  );
}