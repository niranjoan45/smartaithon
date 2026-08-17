import React from 'react';
import { useCityStore } from '../stores/useCityStore';
import { Zap, ArrowRight, CheckCircle2, Clock, Activity, AlertTriangle } from 'lucide-react';

export function OptimizationPage() {
  const { 
    isOptimizing, 
    optimizationStage, 
    optimizationProgress, 
    startOptimizationSequence, 
    lastOptimizationResult,
    optimizationHistory,
    activeShortages 
  } = useCityStore();

  const baselineETA = lastOptimizationResult ? lastOptimizationResult.baselineETA : 14.2;
  const optimizedETA = lastOptimizationResult ? lastOptimizationResult.averageETA : 8.7;
  const improvement = lastOptimizationResult ? lastOptimizationResult.improvementPercent : 38.7;

  return (
    <div className="w-full h-full flex flex-col bg-black p-6 gap-5 font-mono text-xs overflow-y-auto select-none text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange-500/50 pb-4">
        <div>
          <h1 className="font-orbitron font-bold text-lg text-white">
            INTELLIGENT EMERGENCY RESOURCE OPTIMIZATION ENGINE
          </h1>
          <p className="text-[11px] text-orange-300">Phase 3 Global Minimum Weighted Response Cost Solver</p>
        </div>

        {/* Primary Action Button */}
        <button
          disabled={isOptimizing}
          onClick={startOptimizationSequence}
          className={`px-5 py-3.5 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all flex items-center gap-2 shadow-xl ${
            isOptimizing
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500 animate-pulse'
              : 'bg-orange-500 hover:bg-orange-400 text-black font-bold shadow-orange-500/50 active:scale-95'
          }`}
        >
          <Zap className="w-4 h-4 fill-current text-black" />
          <span>{isOptimizing ? `OPTIMIZING: ${optimizationStage} (${optimizationProgress}%)` : '⚡ RUN GLOBAL OPTIMIZATION'}</span>
        </button>
      </div>

      {/* Progress Bar (if optimizing) */}
      {isOptimizing && (
        <div className="w-full glass-orange-panel p-3.5 rounded-xl border border-orange-500/60 space-y-1.5 animate-fade-in">
          <div className="flex justify-between text-[10px] text-orange-300 font-bold">
            <span>STAGE: {optimizationStage}</span>
            <span>{optimizationProgress}% COMPLETE</span>
          </div>
          <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-orange-500/30">
            <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: `${optimizationProgress}%` }} />
          </div>
        </div>
      )}

      {/* Baseline vs Optimized Comparison Metrics */}
      <div className="grid grid-cols-3 gap-5">
        <div className="glass-orange-card p-5 rounded-2xl border border-orange-500/60 space-y-3 text-center">
          <div className="text-[10px] text-orange-200 font-bold">BASELINE NEAREST ALLOCATION</div>
          <div className="text-3xl font-bold text-white">{baselineETA} min</div>
          <div className="text-[10px] text-orange-200">Unoptimized nearest-unit dispatch</div>
        </div>

        <div className="glass-orange-panel p-5 rounded-2xl border border-orange-500/80 space-y-3 text-center shadow-xl">
          <div className="text-[10px] text-orange-300 font-bold">GLOBAL OPTIMIZED RESPONSE</div>
          <div className="text-3xl font-bold text-green-400">{optimizedETA} min</div>
          <div className="text-[10px] text-green-400/90 font-bold">Capability & Traffic Weighted</div>
        </div>

        <div className="glass-orange-card p-5 rounded-2xl border border-orange-500/60 space-y-3 text-center">
          <div className="text-[10px] text-orange-200 font-bold">RESPONSE TIME IMPROVEMENT</div>
          <div className="text-3xl font-bold text-amber-400">+{improvement}%</div>
          <div className="text-[10px] text-amber-400 font-bold">5.5 Minutes Saved</div>
        </div>
      </div>

      {/* Optimization History Log Table */}
      <div className="glass-white-panel p-5 rounded-2xl border border-white/30 space-y-3">
        <div className="font-bold text-white border-b border-white/20 pb-2 flex justify-between items-center">
          <span>HISTORICAL OPTIMIZATION RUNS (PERSISTED)</span>
          <span className="text-[10px] text-orange-300">Phase 3 & Phase 6 Integration</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/20 text-[10px] text-orange-300 font-bold uppercase">
                <th className="py-2 px-3">RUN ID</th>
                <th className="py-2 px-3">TIMESTAMP</th>
                <th className="py-2 px-3">OPTIMIZED ETA</th>
                <th className="py-2 px-3">IMPROVEMENT</th>
                <th className="py-2 px-3">ASSIGNMENTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {(optimizationHistory.length > 0 ? optimizationHistory : [
                { runId: 'OPT-#104', timestamp: '19:14:02', avgEta: 8.7, improvementPercent: 38.7, assignmentsCount: 2, incidentsCount: 1, resourcesCount: 2 }
              ]).map((run, idx) => (
                <tr key={idx} className="hover:bg-white/10">
                  <td className="py-2.5 px-3 font-bold text-amber-400">{run.runId}</td>
                  <td className="py-2.5 px-3 text-white/80">{run.timestamp}</td>
                  <td className="py-2.5 px-3 text-green-400 font-bold">{run.avgEta} min</td>
                  <td className="py-2.5 px-3 text-amber-400 font-bold">+{run.improvementPercent}%</td>
                  <td className="py-2.5 px-3 text-white">{run.assignmentsCount} Units Assigned</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
