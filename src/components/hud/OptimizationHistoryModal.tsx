import React from 'react';
import { X, History, TrendingUp, Cpu, CheckCircle } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function OptimizationHistoryModal() {
  const { isHistoryModalOpen, setHistoryModalOpen, optimizationHistory, lastOptimizationResult } = useCityStore();

  if (!isHistoryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md pointer-events-auto p-4">
      <div className="glass-panel-glow w-full max-w-xl p-6 rounded-2xl border border-cyan-500/40 shadow-2xl relative">
        <button 
          onClick={() => setHistoryModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
          <History className="w-6 h-6 text-cyan-400" />
          <div>
            <h2 className="font-orbitron font-bold text-base text-cyan-300 hud-text-glow">
              OPTIMIZATION HISTORY LOGS
            </h2>
            <p className="text-xs font-mono text-slate-400">Global Min-Cost Assignment History</p>
          </div>
        </div>

        {/* Latest Run Highlights */}
        {lastOptimizationResult && (
          <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30 font-mono text-xs mb-4 space-y-2">
            <div className="flex justify-between text-cyan-300 font-bold border-b border-slate-800 pb-1">
              <span>LATEST RUN: {lastOptimizationResult.runId} ({lastOptimizationResult.formattedTime})</span>
              <span className="text-green-400">SCORE: {lastOptimizationResult.optimizationScore}/100</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">BASELINE ETA</div>
                <div className="text-xs font-bold text-slate-300">{lastOptimizationResult.baselineETA} min</div>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">OPTIMIZED ETA</div>
                <div className="text-xs font-bold text-green-400">{lastOptimizationResult.optimizedETA} min</div>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <div className="text-[9px] text-slate-400">IMPROVEMENT</div>
                <div className="text-xs font-bold text-cyan-400">+{lastOptimizationResult.improvementPercent}%</div>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 italic pt-1">{lastOptimizationResult.reasoning}</div>
          </div>
        )}

        {/* History Table */}
        <div className="space-y-2 font-mono text-xs max-h-60 overflow-y-auto">
          {optimizationHistory.length === 0 ? (
            <div className="text-center py-6 text-slate-500">No previous optimization runs logged yet. Click '⚡ OPTIMIZE RESOURCES' to run global solver.</div>
          ) : (
            optimizationHistory.map((h, idx) => (
              <div key={idx} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">{h.runId} — {h.timestamp}</div>
                  <div className="text-[10px] text-slate-400">{h.incidentsCount} Incidents • {h.assignmentsCount} Assignments</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-green-400">{h.avgEta}m AVG ETA</div>
                  <div className="text-[10px] text-cyan-400">+{h.improvementPercent}% saved</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
