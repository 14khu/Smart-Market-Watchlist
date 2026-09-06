const BASE_URL = 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  signup: (name, email, password) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  getWatchlist: () => request('/watchlist'),
  addStock: (symbol) =>
    request('/watchlist', { method: 'POST', body: JSON.stringify({ symbol }) }),
  removeStock: (symbol) => request(`/watchlist/${symbol}`, { method: 'DELETE' }),
  getDigest: () => request('/watchlist/digest'),
  getSparklines: () => request('/watchlist/sparklines'),
  searchStocks: (query) => request(`/search?q=${encodeURIComponent(query)}`),
  getNews: () => request('/news'),
};