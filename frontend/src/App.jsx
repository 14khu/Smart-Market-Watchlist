import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Login from './components/login';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const hasToken = !!localStorage.getItem('token');
  const [screen, setScreen] = useState(hasToken ? 'dashboard' : 'landing');

  if (screen === 'dashboard') {
    return <Dashboard onLogout={() => setScreen('landing')} />;
  }
  if (screen === 'auth') {
    return <Login onLoggedIn={() => setScreen('dashboard')} />;
  }
  return <LandingPage onGetStarted={() => setScreen('auth')} />;
}