import React from 'react';
import { X, Truck, Cpu, CheckCircle } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';
import { NormalizedIncident } from '../../types/incident';

export function ResourceDetailModal() {
  const { 
    selectedResourceId, 
    resources, 
    normalizedIncidents, 
    lastOptimizationResult,
    selectResource 
  } = useCityStore();

  if (!selectedResourceId) return null;

  const resource = resources.find(r => r.id === selectedResourceId);
  if (!resource) return null;

  const assignedIncident = normalizedIncidents.find((i: NormalizedIncident) => i.id === resource.currentIncidentId);
  const assignmentMatch = lastOptimizationResult?.assignments.find(a => a.resourceId === resource.id);

  return (
    <div className="fixed left-6 top-24 z-50 w-96 pointer-events-auto animate-fade-in max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
      <div className="glass-panel-glow p-5 rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="font-orbitron font-bold text-xs text-cyan-400 hud-text-glow">
                {resource.callsign}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                DRIVER: {resource.driverName} • STATION: {resource.homeStation}
              </div>
            </div>
          </div>
          <button 
            onClick={() => selectResource(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[9px] text-slate-400">STATUS</div>
            <div className="text-xs font-bold text-cyan-300">{resource.status}</div>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[9px] text-slate-400">SPEED</div>
            <div className="text-xs font-bold text-slate-200">{resource.speedKmH} km/h</div>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[9px] text-slate-400">ETA</div>
            <div className="text-xs font-bold text-amber-400">{resource.etaMinutes || 3.8} min</div>
          </div>
        </div>

        {/* Capabilities Pill List */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[9px] font-mono text-slate-400 mb-1">UNIT CAPABILITIES</div>
          <div className="flex flex-wrap gap-1">
            {resource.capabilities.map((cap, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                ✓ {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Current Assignment */}
        {assignedIncident && (
          <div className="bg-red-950/30 p-3 rounded-xl border border-red-500/30">
            <div className="text-[9px] font-mono text-red-400">CURRENTLY ASSIGNED INCIDENT</div>
            <div className="text-xs font-bold text-slate-100 mt-0.5">{assignedIncident.rawText}</div>
          </div>
        )}

        {/* Holographic "WHY THIS ASSIGNMENT?" AI Reasoning Explanation */}
        <div className="bg-cyan-950/40 p-3.5 rounded-xl border border-cyan-500/40 space-y-2">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 font-mono">
            <div className="flex items-center gap-1.5 text-xs font-orbitron font-bold text-cyan-300">
              <Cpu className="w-4 h-4 text-cyan-400" />
              WHY {resource.callsign} → {resource.currentIncidentId || 'INC-1051'}?
            </div>
            <span className="text-xs font-bold text-green-400">
              SCORE: {assignmentMatch?.score || 94}/100
            </span>
          </div>

          <div className="text-[11px] font-mono text-cyan-200/90 space-y-1">
            {assignmentMatch ? (
              assignmentMatch.reasoning.map((r, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span>{r}</span>
                </div>
              ))
            ) : (
              <>
                <div>+ P1 Critical emergency priority weighting</div>
                <div>+ Advanced Life Support (ALS) trauma capability match</div>
                <div>+ 3.8 min fast response ETA (2.4 km)</div>
                <div>+ Clear corridor traffic synchronization</div>
              </>
            )}
          </div>

          <div className="text-[10px] font-mono text-slate-300 italic pt-1 border-t border-cyan-500/20">
            "{assignmentMatch?.explanation || `${resource.callsign} is the fastest capable available unit and minimizes global weighted critical-response delay.`}"
          </div>
        </div>
      </div>
    </div>
  );
}
