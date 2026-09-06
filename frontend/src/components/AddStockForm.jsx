import { useState, useEffect, useRef } from 'react';
import { api } from '../api';

export default function AddStockForm({ onAdd }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await api.searchStocks(query);
        setSuggestions(results);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  async function handleSelect(stock) {
    try {
      setError('');
      await onAdd(stock.symbol);
      setQuery('');
      setSuggestions([]);
      setShowDropdown(false);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="add-stock-wrapper">
      <input
        type="text"
        className="add-stock-input"
        placeholder="Search for a stock — e.g. Reliance, TCS, Infosys"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />
      {error && <p className="error">{error}</p>}
      {showDropdown && suggestions.length > 0 && (
        <ul className="suggestion-dropdown">
          {suggestions.map((s) => (
            <li key={s.symbol} onMouseDown={() => handleSelect(s)}>
              <span className="suggestion-symbol">{s.symbol}</span>
              <span className="suggestion-name">{s.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}