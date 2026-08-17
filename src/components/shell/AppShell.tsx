import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GlobalHeader } from './GlobalHeader';
import { PersistentSidebar } from './PersistentSidebar';
import { CopilotDrawer } from './CopilotDrawer';
import { DatabaseStatusModal } from '../hud/DatabaseStatusModal';
import { CitizenReportModal } from '../hud/CitizenReportModal';
import { CommandPage } from '../../pages/CommandPage';
import { IncidentsPage } from '../../pages/IncidentsPage';
import { IncidentDetailPage } from '../../pages/IncidentDetailPage';
import { ResourcesPage } from '../../pages/ResourcesPage';
import { ResourceDetailPage } from '../../pages/ResourceDetailPage';
import { DispatchPage } from '../../pages/DispatchPage';
import { RiskPage } from '../../pages/RiskPage';
import { IntelligencePage } from '../../pages/IntelligencePage';
import { OptimizationPage } from '../../pages/OptimizationPage';
import { AnalyticsPage } from '../../pages/AnalyticsPage';
import { SimulationPage } from '../../pages/SimulationPage';
import { useCityStore } from '../../stores/useCityStore';

export function AppShell() {
  const location = useLocation();

  // Determine current page title from pathname
  const getPageTitle = (path: string) => {
    if (path.startsWith('/incidents/')) return 'INCIDENT INVESTIGATION WORKSPACE';
    if (path.startsWith('/resources/')) return 'RESOURCE FLEET DETAIL';
    switch (path) {
      case '/command': return 'COMMAND CENTER EXECUTIVE OVERVIEW';
      case '/incidents': return 'INCIDENT INTELLIGENCE MANAGEMENT';
      case '/resources': return 'EMERGENCY FLEET MANAGEMENT';
      case '/dispatch': return 'TACTICAL DISPATCH MAP';
      case '/risk': return 'PREDICTIVE RISK & PROACTIVE PLANNING';
      case '/intelligence': return 'MULTI-SOURCE INCIDENT FUSION';
      case '/optimization': return 'RESOURCE OPTIMIZATION ENGINE';
      case '/analytics': return 'OPERATIONAL TELEMETRY & ANALYTICS';
      case '/simulation': return 'HACKATHON DEMO SIMULATION LAB';
      default: return 'COMMAND CENTER EXECUTIVE OVERVIEW';
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070a0f] flex flex-col font-mono select-none">
      {/* Global Top Navigation Header */}
      <GlobalHeader currentPageTitle={getPageTitle(location.pathname)} />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Persistent Left Navigation Sidebar */}
        <PersistentSidebar />

        {/* Dynamic Route Workspace Content */}
        <main className="flex-1 h-full overflow-hidden relative bg-[#070a0f]">
          <Routes>
            <Route path="/" element={<Navigate to="/command" replace />} />
            <Route path="/command" element={<CommandPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/incidents/:id" element={<IncidentDetailPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:id" element={<ResourceDetailPage />} />
            <Route path="/dispatch" element={<DispatchPage />} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/intelligence" element={<IntelligencePage />} />
            <Route path="/optimization" element={<OptimizationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="*" element={<Navigate to="/command" replace />} />
          </Routes>
        </main>

        {/* Global Copilot Slide-Out Drawer */}
        <CopilotDrawer />
      </div>

      {/* Global Modals */}
      <DatabaseStatusModal />
      <CitizenReportModal />
    </div>
  );
}
