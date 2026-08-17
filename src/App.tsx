import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppShell } from './components/shell/AppShell';
import { useSimulation } from './hooks/useSimulation';
import { useCityStore } from './stores/useCityStore';

export default function App() {
  useSimulation();

  useEffect(() => {
    // Probe database health on mount
    useCityStore.getState().checkDatabaseHealthAction();
  }, []);

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
