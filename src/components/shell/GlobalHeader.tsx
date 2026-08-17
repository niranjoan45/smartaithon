import React from 'react';
import { ShieldAlert, Bot, PlusCircle, Clock } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

interface GlobalHeaderProps {
  currentPageTitle: string;
}

export function GlobalHeader({ currentPageTitle }: GlobalHeaderProps) {
  const { 
    dbConnectionStatus, 
    setDbModalOpen, 
    isCopilotOpen, 
    setCopilotOpen, 
    setReportModalOpen 
  } = useCityStore();

  const timeString = new Date().toLocaleTimeString('en-US', { hour12: false });

  return (
    <header className="h-14 bg-[#7a0517] border-b border-red-950 px-4 flex items-center justify-between text-white select-none z-30 shrink-0 font-mono text-xs shadow-md">
      {/* Branding & Workspace Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          <span className="font-orbitron font-bold text-sm tracking-wider text-white">
            AI CITY GUARDIAN
          </span>
        </div>
        <div className="h-4 w-[1px] bg-white/40" />
        <span className="font-mono text-xs font-bold text-white tracking-wide uppercase">
          {currentPageTitle}
        </span>
      </div>

      {/* Right Controls & Telemetry Status */}
      <div className="flex items-center gap-3 font-mono text-xs">
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

        {/* AI Mode Badge */}
        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-white/20 text-white border border-white/40">
          MODE: SYNTHETIC DATA
        </span>

        {/* Report Citizen Incident Button */}
        <button
          onClick={() => setReportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-white text-[#7a0517] hover:bg-slate-100 text-xs font-bold transition-all shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#7a0517]" />
          <span>911 REPORT</span>
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
