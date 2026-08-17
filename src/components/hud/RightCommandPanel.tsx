import React from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Flame, 
  Truck, 
  ShieldCheck, 
  ChevronRight,
  Zap
} from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function RightCommandPanel() {
  const { 
    normalizedIncidents, 
    resources, 
    aiActivityLogs, 
    selectIncident,
    triggerReoptimizationEvent 
  } = useCityStore();

  const metrics = useCityStore.getState().getMetrics();

  const availAmbulances = resources.filter(r => r.type === 'AMBULANCE' && r.status === 'AVAILABLE').length;
  const availPolice = resources.filter(r => r.type === 'POLICE' && r.status === 'AVAILABLE').length;
  const availFire = resources.filter(r => r.type === 'FIRE_TRUCK' && r.status === 'AVAILABLE').length;

  return (
    <aside className="fixed right-4 top-20 bottom-20 z-40 w-80 lg:w-96 max-h-[calc(100vh-160px)] pointer-events-none flex flex-col gap-3">
      {/* 1. LIVE STATUS PANEL */}
      <div className="pointer-events-auto glass-panel p-4 rounded-2xl border border-cyan-500/30 shadow-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="font-orbitron font-bold text-xs tracking-wider text-slate-100">
              LIVE STATUS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-400/80">REAL-TIME</span>
        </div>

        {/* Live Status Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-red-500/30">
            <div className="text-[10px] text-slate-400 font-mono">CRITICAL</div>
            <div className="text-lg font-orbitron font-bold text-red-400 hud-text-red-glow">
              {metrics.criticalIncidents}
            </div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-amber-500/30">
            <div className="text-[10px] text-slate-400 font-mono">ACTIVE</div>
            <div className="text-lg font-orbitron font-bold text-amber-400 hud-text-amber-glow">
              {metrics.totalIncidents}
            </div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-cyan-500/30">
            <div className="text-[10px] text-slate-400 font-mono">AVG ETA</div>
            <div className="text-lg font-orbitron font-bold text-cyan-400 hud-text-glow">
              {metrics.avgEtaMinutes}m
            </div>
          </div>
        </div>

        {/* Available Resource Breakdown */}
        <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            AMBULANCE: <strong className="text-white">{availAmbulances}</strong>
          </div>
          <div className="flex items-center gap-1.5 text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            POLICE: <strong className="text-white">{availPolice}</strong>
          </div>
          <div className="flex items-center gap-1.5 text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            FIRE: <strong className="text-white">{availFire}</strong>
          </div>
        </div>
      </div>

      {/* 2. CRITICAL EVENTS FEED */}
      <div className="pointer-events-auto glass-panel p-4 rounded-2xl border border-cyan-500/20 shadow-2xl flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            <h2 className="font-orbitron font-bold text-xs tracking-wider text-slate-100">
              CRITICAL EVENTS
            </h2>
          </div>
          {/* Dynamic Re-Optimization Demo Trigger */}
          <button
            onClick={() => triggerReoptimizationEvent()}
            title="Simulate sudden incident escalation and dynamic route recalculation"
            className="px-2 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-[9px] font-mono text-red-300 hover:bg-red-900 transition-all flex items-center gap-1"
          >
            <Zap className="w-3 h-3 text-red-400 animate-bounce" />
            TRIGGER ESCALATION
          </button>
        </div>

        {/* Scrollable Event Feed */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {normalizedIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => selectIncident(inc.id)}
              className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    inc.severity === 'P1'
                      ? 'bg-red-500 animate-ping'
                      : inc.severity === 'P2'
                      ? 'bg-amber-400'
                      : 'bg-yellow-400'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {inc.id}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold">
                      #{inc.priorityRank}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {inc.formattedTimeAgo}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans truncate max-w-[180px]">
                    {inc.rawText}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* 3. AI ACTIVITY TELEMETRY */}
      <div className="pointer-events-auto glass-panel p-3.5 rounded-2xl border border-cyan-500/20 shadow-2xl flex flex-col gap-2">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <h2 className="font-orbitron font-bold text-[11px] tracking-wider text-slate-100">
            AI ACTIVITY STREAM
          </h2>
        </div>
        <div className="font-mono text-[10px] text-cyan-300/90 space-y-1 max-h-24 overflow-y-auto">
          {aiActivityLogs.slice(-3).map((log, idx) => (
            <div key={idx} className="leading-tight flex items-start gap-1">
              <span className="text-cyan-500">›</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
