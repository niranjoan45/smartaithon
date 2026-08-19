import React from 'react';
import { ShieldAlert, Bot, PlusCircle, Clock, UserCheck, ShieldCheck, RefreshCw, LogOut } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface GlobalHeaderProps {
  currentPageTitle: string;
}

export function GlobalHeader({ currentPageTitle }: GlobalHeaderProps) {
  const navigate = useNavigate();
  const { 
    dbConnectionStatus, 
    setDbModalOpen, 
    isCopilotOpen, 
    setCopilotOpen, 
    setReportModalOpen 
  } = useCityStore();

  const { user, toggleRole, logout } = useAuthStore();

  const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });

  const handleRoleToggle = () => {
    toggleRole();
    const newRole = user?.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (newRole === 'USER') {
      navigate('/user-dashboard');
    } else {
      navigate('/command');
    }
  };

  const handleLogoutToLanding = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-[#7a0517] border-b border-red-950 px-4 flex items-center justify-between text-white select-none z-30 shrink-0 font-mono text-xs shadow-md">
      {/* Branding & Workspace Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLogoutToLanding}
          title="Exit to Landing Role Access Page"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left"
        >
          <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          <span className="font-orbitron font-bold text-sm tracking-wider text-white">
            AI CITY GUARDIAN
          </span>
        </button>
        <div className="h-4 w-[1px] bg-white/40" />
        <span className="font-mono text-xs font-bold text-white tracking-wide uppercase">
          {currentPageTitle}
        </span>
      </div>

      {/* Right Controls, Telemetry Status & Role Switcher */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* Role Access Landing Page Switcher */}
        <button
          onClick={handleLogoutToLanding}
          title="Return to Animated Role Access Landing Page"
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-black/40 hover:bg-black/70 text-slate-200 border border-white/20 text-[10px] font-bold transition-all"
        >
          <LogOut className="w-3 h-3 text-orange-400" />
          <span>ROLE PORTAL</span>
        </button>

        {/* Role Switcher Badge */}
        <button
          onClick={handleRoleToggle}
          title="Click to switch role between ADMIN and USER"
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all border shadow-sm ${
            user?.role === 'ADMIN'
              ? 'bg-amber-400 text-black border-amber-300 font-extrabold hover:bg-amber-300'
              : 'bg-cyan-500 text-black border-cyan-300 font-extrabold hover:bg-cyan-400'
          }`}
        >
          {user?.role === 'ADMIN' ? (
            <ShieldCheck className="w-3.5 h-3.5 text-black" />
          ) : (
            <UserCheck className="w-3.5 h-3.5 text-black" />
          )}
          <span>ROLE: {user?.role || 'USER'}</span>
          <RefreshCw className="w-3 h-3 text-black/60 ml-0.5" />
        </button>

        {/* Database Status Badge */}
        <button
          onClick={() => setDbModalOpen(true)}
          className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all flex items-center gap-1.5 ${
            dbConnectionStatus === 'CONNECTED'
              ? 'bg-green-700 text-white border-green-500'
              : 'bg-amber-600 text-white border-amber-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${dbConnectionStatus === 'CONNECTED' ? 'bg-green-300' : 'bg-amber-200'}`} />
          <span>{dbConnectionStatus === 'CONNECTED' ? 'DATABASE CONNECTED' : 'SIMULATION MODE'}</span>
        </button>

        {/* Report Citizen Incident Button */}
        <button
          onClick={() => setReportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-white text-[#7a0517] hover:bg-slate-100 text-xs font-bold transition-all shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#7a0517]" />
          <span>REPORT INCIDENT</span>
        </button>

        {/* Global Copilot Drawer Toggle */}
        <button
          onClick={() => setCopilotOpen(!isCopilotOpen)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-bold transition-all ${
            isCopilotOpen
              ? 'bg-black text-white border-white shadow-md font-bold'
              : 'bg-[#560310] text-white border-red-500 hover:bg-[#680413]'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>GUARDIAN AI</span>
        </button>

        {/* Clock */}
        <div className="flex items-center gap-1.5 text-white pl-2 border-l border-white/40 text-[11px]">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span className="font-bold">{timeString}</span>
        </div>
      </div>
    </header>
  );
}
