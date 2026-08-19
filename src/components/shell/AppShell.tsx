import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { UserDashboardPage } from '../../pages/UserDashboardPage';
import { LandingLoginPage } from '../../pages/LandingLoginPage';
import { useAuthStore } from '../../stores/useAuthStore';
import { useCityStore } from '../../stores/useCityStore';
import { Lock, RefreshCw } from 'lucide-react';

function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, toggleRole } = useAuthStore();
  const navigate = useNavigate();

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950 p-6 text-center font-mono">
        <div className="max-w-md bg-slate-900 border border-red-900/60 p-8 rounded-2xl shadow-2xl space-y-4">
          <Lock className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="font-orbitron font-bold text-lg text-red-400">ADMIN ACCESS RESTRICTED</h2>
          <p className="text-xs text-slate-300">
            This operational workspace is restricted to Command Staff with <strong className="text-amber-400">ADMIN</strong> privileges. You are currently in <strong className="text-cyan-400">CITIZEN USER</strong> mode.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={toggleRole}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-orbitron font-bold text-xs hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>SWITCH TO ADMIN ROLE</span>
            </button>
            <button
              onClick={() => navigate('/user-dashboard')}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs transition-all"
            >
              RETURN TO USER DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AppShell() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const checkDatabaseHealthAction = useCityStore((state) => state.checkDatabaseHealthAction);

  React.useEffect(() => {
    checkDatabaseHealthAction();
  }, [checkDatabaseHealthAction]);

  // If not authenticated or on /login, render Landing Role Access page
  if (!isAuthenticated || location.pathname === '/login') {
    return <LandingLoginPage />;
  }

  const currentRole = user?.role || 'USER';

  // Determine current page title from pathname
  const getPageTitle = (path: string) => {
    if (path.startsWith('/incidents/')) return 'INCIDENT INVESTIGATION WORKSPACE';
    if (path.startsWith('/resources/')) return 'RESOURCE FLEET DETAIL';
    switch (path) {
      case '/user-dashboard': return 'CITIZEN PORTAL & EMERGENCY REPORTING';
      case '/command': return 'COMMAND CENTER EXECUTIVE OVERVIEW';
      case '/incidents': return 'INCIDENT INTELLIGENCE MANAGEMENT';
      case '/resources': return 'EMERGENCY FLEET MANAGEMENT';
      case '/dispatch': return 'TACTICAL DISPATCH MAP';
      case '/risk': return 'PREDICTIVE RISK & PROACTIVE PLANNING';
      case '/intelligence': return 'MULTI-SOURCE INCIDENT FUSION';
      case '/optimization': return 'RESOURCE OPTIMIZATION ENGINE';
      case '/analytics': return 'OPERATIONAL TELEMETRY & ANALYTICS';
      case '/simulation': return 'HACKATHON DEMO SIMULATION LAB';
      default: return currentRole === 'ADMIN' ? 'COMMAND CENTER EXECUTIVE OVERVIEW' : 'CITIZEN PORTAL';
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
            <Route 
              path="/" 
              element={<Navigate to={currentRole === 'ADMIN' ? '/command' : '/user-dashboard'} replace />} 
            />
            <Route path="/login" element={<LandingLoginPage />} />
            <Route path="/user-dashboard" element={<UserDashboardPage />} />
            
            {/* Protected Admin Routes */}
            <Route path="/command" element={<AdminRouteGuard><CommandPage /></AdminRouteGuard>} />
            <Route path="/incidents" element={<IncidentsPage />} />
            <Route path="/incidents/:id" element={<IncidentDetailPage />} />
            <Route path="/resources" element={<AdminRouteGuard><ResourcesPage /></AdminRouteGuard>} />
            <Route path="/resources/:id" element={<AdminRouteGuard><ResourceDetailPage /></AdminRouteGuard>} />
            <Route path="/dispatch" element={<AdminRouteGuard><DispatchPage /></AdminRouteGuard>} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/intelligence" element={<AdminRouteGuard><IntelligencePage /></AdminRouteGuard>} />
            <Route path="/optimization" element={<AdminRouteGuard><OptimizationPage /></AdminRouteGuard>} />
            <Route path="/analytics" element={<AdminRouteGuard><AnalyticsPage /></AdminRouteGuard>} />
            <Route path="/simulation" element={<AdminRouteGuard><SimulationPage /></AdminRouteGuard>} />
            
            <Route path="*" element={<Navigate to={currentRole === 'ADMIN' ? '/command' : '/user-dashboard'} replace />} />
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
