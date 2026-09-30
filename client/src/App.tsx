import { useState } from 'react';
import { ToastProvider } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { DebugLab } from './pages/DebugLab';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'lab'>('landing');
  const [initialPreset, setInitialPreset] = useState<string | undefined>(undefined);

  const handleLaunchLab = (presetId?: string) => {
    setInitialPreset(presetId);
    setCurrentView('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ToastProvider>
      {currentView === 'landing' ? (
        <LandingPage onLaunchLab={handleLaunchLab} />
      ) : (
        <DebugLab onBackToLanding={handleBackToLanding} initialPresetId={initialPreset} />
      )}
    </ToastProvider>
  );
}

export default App;
