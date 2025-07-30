import LandingPage from './components/LandingPage';
import About from './components/About';
import { useState } from 'react';
import './index.css';

type AppState = 'landing' | 'about';

function LandingOnly() {
  const [appState, setAppState] = useState<AppState>('landing');

  const handleNavigateToAbout = () => {
    setAppState('about');
  };

  const handleNavigateToHome = () => {
    setAppState('landing');
  };

  if (appState === 'about') {
    return <About onNavigateToHome={handleNavigateToHome} />;
  }

  return <LandingPage onNavigateToAbout={handleNavigateToAbout} />;
}

export default LandingOnly;