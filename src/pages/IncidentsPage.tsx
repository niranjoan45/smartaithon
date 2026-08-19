import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCityStore } from '../stores/useCityStore';
import { useAuthStore } from '../stores/useAuthStore';
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, Clock, Zap, Check } from 'lucide-react';

export function IncidentsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    normalizedIncidents, 
    selectedIncidentId, 
    selectIncident,
    solveAndDispatchIncidentAction,
    resolveIncidentAction
  } = useCityStore();

  const selectedIncident = normalizedIncidents.find(i => i.id === selectedIncidentId) || normalizedIncidents[0];

  return (
    <div className="w-full h-full flex bg-black p-4 gap-4 font-mono text-xs overflow-hidden select-none text-white">
      {/* Left Incident Table / List Container */}
      <div className="flex-1 glass-white-panel p-5 flex flex-col gap-4 overflow-hidden border border-white/30">
        <div className="flex justify-between items-center border-b border-white/20 pb-3">
          <div>
            <h2 className="font-orbitron font-bold text-base text-white">
              INCIDENT INTELLIGENCE MANAGEMENT
            </h2>
            <p className="text-[10px] text-orange-300">Live Corroborated Emergency Incidents Queue</p>
          </div>
          <span className="px-3 py-1 rounded text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/50">
            {normalizedIncidents.length} INCIDENTS ACTIVE
          </span>
        </div>

        {/* Incidents Table */}
        <div className="flex-1 overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/30 text-[10px] text-orange-300 font-bold uppercase">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">TYPE</th>
                <th className="py-2.5 px-3">SEVERITY</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">LOCATION</th>
                <th className="py-2.5 px-3">AT RISK</th>
                <th className="py-2.5 px-3">ASSIGNED</th>
                <th className="py-2.5 px-3">ADMIN ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {normalizedIncidents.map((inc) => {
                const isSelected = inc.id === selectedIncident?.id;
                return (
                  <tr
                    key={inc.id}
                    onClick={() => selectIncident(inc.id)}
                    className={`cursor-pointer transition-all hover:bg-white/10 ${
                      isSelected ? 'bg-orange-500/30 text-white font-bold' : 'text-white'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-white">{inc.id}</td>
                    <td className="py-3 px-3">{inc.type}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'P1' ? 'badge-critical' : 'badge-warning'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        inc.status === 'ACTIVE' ? 'bg-red-950 text-red-300 border border-red-800' :
                        inc.status === 'DISPATCHED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-[160px] truncate text-white/90">{inc.locationText}</td>
                    <td className="py-3 px-3 text-amber-300 font-bold">{inc.peopleAtRisk} victims</td>
                    <td className="py-3 px-3 text-white/80 font-bold">{inc.assignedResourceId || 'Unassigned'}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {user?.role === 'ADMIN' && inc.status !== 'RESOLVED' && (
                          <button
                            onClick={() => solveAndDispatchIncidentAction(inc.id)}
                            title="Run AI Optimization & Dispatch nearest unit"
                            className="px-2 py-1 rounded bg-amber-400 hover:bg-amber-300 text-black font-bold text-[10px] flex items-center gap-1 shadow"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Dispatch</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            selectIncident(inc.id);
                            navigate(`/incidents/${inc.id}`);
                          }}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Selected Incident Summary Panel STUNNING ORANGE GLASSMORPHISM */}
      {selectedIncident && (
        <div className="w-96 glass-orange-panel p-5 flex flex-col gap-4 overflow-y-auto rounded-2xl">
          <div className="border-b border-orange-500/50 pb-3 flex justify-between items-center">
            <div>
              <div className="text-base font-bold text-white">{selectedIncident.id}</div>
              <div className="text-[10px] text-orange-200">{selectedIncident.locationText}</div>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-bold ${
              selectedIncident.severity === 'P1' ? 'badge-critical' : 'badge-warning'
            }`}>
              {selectedIncident.severity} [{selectedIncident.type}]
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-black/60 p-2.5 rounded-lg border border-orange-500/40">
              <div className="text-[9px] text-orange-200">SEVERITY SCORE</div>
              <div className="text-lg font-bold text-red-400">{selectedIncident.severityScore}/100</div>
            </div>
            <div className="bg-black/60 p-2.5 rounded-lg border border-orange-500/40">
              <div className="text-[9px] text-orange-200">PRIORITY SCORE</div>
              <div className="text-lg font-bold text-amber-300">{selectedIncident.priorityScore}/100</div>
            </div>
            <div className="bg-black/60 p-2.5 rounded-lg border border-orange-500/40">
              <div className="text-[9px] text-orange-200">ESCALATION RISK</div>
              <div className="text-lg font-bold text-orange-400">{selectedIncident.escalationRisk}%</div>
            </div>
            <div className="bg-black/60 p-2.5 rounded-lg border border-orange-500/40">
              <div className="text-[9px] text-orange-200">STATUS</div>
              <div className="text-sm font-bold text-emerald-400">{selectedIncident.status}</div>
            </div>
          </div>

          <div className="bg-black/60 p-3.5 rounded-lg border border-orange-500/40 space-y-1">
            <div className="text-[10px] text-orange-300 font-bold">RAW EMERGENCY DESCRIPTION</div>
            <div className="text-[11px] text-white leading-relaxed">{selectedIncident.rawText}</div>
          </div>

          {/* Admin Direct Action Buttons */}
          {user?.role === 'ADMIN' && (
            <div className="space-y-2 pt-2 border-t border-orange-500/30">
              <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                ADMIN DISPATCH & RESOLUTION ACTIONS
              </div>
              <button
                onClick={() => solveAndDispatchIncidentAction(selectedIncident.id)}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-orbitron font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>RUN OPTIMIZATION & DISPATCH UNIT</span>
              </button>

              {selectedIncident.status !== 'RESOLVED' && (
                <button
                  onClick={() => resolveIncidentAction(selectedIncident.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>MARK INCIDENT AS RESOLVED</span>
                </button>
              )}
            </div>
          )}

          {/* Navigate to Dedicated Investigation Page */}
          <button
            onClick={() => navigate(`/incidents/${selectedIncident.id}`)}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-md mt-auto"
          >
            <span>OPEN DETAILED INVESTIGATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
