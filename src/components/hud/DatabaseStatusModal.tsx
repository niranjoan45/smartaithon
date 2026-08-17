import React from 'react';
import { X, Database, Server, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function DatabaseStatusModal() {
  const { isDbModalOpen, setDbModalOpen, dbConnectionStatus, dbModeName, normalizedIncidents, resources } = useCityStore();

  if (!isDbModalOpen) return null;

  const isConnected = dbConnectionStatus === 'CONNECTED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md pointer-events-auto p-4">
      <div className="glass-panel-glow w-full max-w-lg p-6 rounded-2xl border border-cyan-500/40 shadow-2xl relative font-mono text-xs">
        <button 
          onClick={() => setDbModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
          <Database className={`w-6 h-6 ${isConnected ? 'text-green-400' : 'text-amber-400'}`} />
          <div>
            <h2 className="font-orbitron font-bold text-sm text-cyan-300 hud-text-glow">
              DATABASE & SYSTEM PERSISTENCE STATUS
            </h2>
            <p className="text-[10px] text-slate-400">PostgreSQL Persistence & Simulation Fallback Engine</p>
          </div>
        </div>

        {/* Connection Status Badge Banner */}
        <div className={`p-3 rounded-xl border flex items-center justify-between mb-4 ${
          isConnected 
            ? 'bg-green-950/40 border-green-500/40 text-green-300' 
            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-2 font-bold">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
            <span>MODE: {dbModeName}</span>
          </div>
          <span className="text-[10px] font-mono">{isConnected ? 'LIVE POSTGRESQL PERSISTENCE' : 'OFFLINE SIMULATION FALLBACK'}</span>
        </div>

        {/* Database Telemetry Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-center mb-4">
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div className="text-[9px] text-slate-400">BACKEND REST API</div>
            <div className={`text-xs font-bold ${isConnected ? 'text-green-400' : 'text-slate-300'}`}>
              http://localhost:5000
            </div>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div className="text-[9px] text-slate-400">POSTGRESQL DB</div>
            <div className={`text-xs font-bold ${isConnected ? 'text-green-400' : 'text-amber-400'}`}>
              {isConnected ? 'CONNECTED' : 'OFFLINE'}
            </div>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div className="text-[9px] text-slate-400">PERSISTED INCIDENTS</div>
            <div className="text-xs font-bold text-cyan-300">{normalizedIncidents.length} Active</div>
          </div>
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <div className="text-[9px] text-slate-400">MONITORED RESOURCES</div>
            <div className="text-xs font-bold text-cyan-300">{resources.length} Units</div>
          </div>
        </div>

        {/* PostgreSQL Setup Instructions (if offline) */}
        {!isConnected && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-[10px] text-slate-300">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              HOW TO CONNECT POSTGRESQL (HUMAN INPUT REQUIREMENT):
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Create a PostgreSQL database instance locally or on Railway/Supabase.</li>
              <li>Create a <code className="text-cyan-300">.env</code> file in root workspace directory.</li>
              <li>Set <code className="text-cyan-300">DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/ai_city_guardian"</code>.</li>
              <li>Run <code className="text-cyan-300">npm run db:push && npm run db:seed</code>.</li>
            </ol>
            <div className="text-slate-400 italic pt-1 border-t border-slate-800">
              Note: The application automatically operates in DEMO SIMULATION MODE when PostgreSQL is offline so hackathon demonstrations never fail!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
