import React from 'react';
import { Zap, CheckCircle2, AlertTriangle, History } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function OptimizationPanel() {
  const { 
    isOptimizing, 
    optimizationStage, 
    optimizationProgress, 
    startOptimizationSequence,
    lastOptimizationResult,
    activeShortages,
    setHistoryModalOpen
  } = useCityStore();

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center max-w-xl w-full px-4">
      {/* Resource Shortage Alert Warning Banner */}
      {activeShortages && activeShortages.length > 0 && !isOptimizing && (
        <div className="pointer-events-auto mb-2 glass-panel-red px-4 py-2 rounded-xl border border-red-500 text-center shadow-xl w-full animate-bounce">
          <div className="flex items-center justify-center gap-2 text-xs font-orbitron font-bold text-red-400">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            RESOURCE SHORTAGE DETECTED: {activeShortages[0].requiredType} NEEDED
          </div>
          <div className="text-[10px] font-mono text-red-300 mt-0.5">
            {activeShortages[0].recommendedAction}
          </div>
        </div>
      )}

      {/* Main Mission Control Command Button */}
      <div className="pointer-events-auto relative group flex items-center gap-2">
        <div className={`relative flex items-center ${
          isOptimizing ? '' : 'group-hover:scale-105'
        }`}>
          <div className={`absolute -inset-1 rounded-2xl blur-md opacity-75 transition-all duration-300 ${
            isOptimizing 
              ? 'bg-gradient-to-r from-cyan-500 via-amber-500 to-red-500 animate-pulse' 
              : 'bg-cyan-500 group-hover:opacity-100 group-hover:blur-lg'
          }`} />

          <button
            onClick={startOptimizationSequence}
            disabled={isOptimizing}
            className={`relative px-8 py-3.5 rounded-2xl font-orbitron font-bold text-sm tracking-widest flex items-center gap-3 transition-all duration-300 shadow-2xl ${
              isOptimizing
                ? 'bg-slate-950 text-cyan-300 border border-cyan-400 cursor-wait'
                : 'bg-slate-950 text-slate-100 border border-cyan-400/60 hover:border-cyan-300 active:scale-95'
            }`}
          >
            <div className="relative">
              <Zap className={`w-5 h-5 text-cyan-400 ${isOptimizing ? 'animate-bounce' : 'group-hover:text-cyan-300'}`} />
              {isOptimizing && (
                <span className="absolute -inset-1 rounded-full border border-cyan-400 animate-ping opacity-75" />
              )}
            </div>

            <span className="hud-text-glow">
              {isOptimizing ? `OPTIMIZING (${optimizationProgress}%)` : '⚡ OPTIMIZE RESOURCES'}
            </span>
          </button>
        </div>

        {/* Inspect Optimization History Button */}
        <button
          onClick={() => setHistoryModalOpen(true)}
          title="Inspect optimization solver history"
          className="pointer-events-auto p-3.5 rounded-2xl glass-panel border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-all shadow-xl"
        >
          <History className="w-5 h-5" />
        </button>
      </div>

      {/* Active Pipeline Stage Banner */}
      {isOptimizing && (
        <div className="pointer-events-auto mt-3 glass-panel-glow px-6 py-3 rounded-2xl border border-cyan-400 text-center shadow-2xl max-w-md w-full animate-fade-in">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
            <span className="tracking-wider">COMPUTATIONAL SOLVER PIPELINE</span>
            <span className="font-bold">{optimizationProgress}%</span>
          </div>

          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-2 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-green-400 transition-all duration-300"
              style={{ width: `${optimizationProgress}%` }}
            />
          </div>

          <div className="text-xs font-orbitron font-bold text-amber-300 tracking-wider flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            {optimizationStage}
          </div>
        </div>
      )}

      {/* Baseline vs Optimized Result Summary Card */}
      {lastOptimizationResult && !isOptimizing && (
        <div className="pointer-events-auto mt-3 glass-panel px-5 py-3 rounded-2xl border border-green-500/40 text-center shadow-2xl animate-fade-in max-w-lg w-full">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-green-400 tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              OPTIMIZATION COMPLETE ({lastOptimizationResult.runId})
            </div>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">
              +{lastOptimizationResult.improvementPercent}% IMPROVEMENT
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <div className="text-[8px] text-slate-400">BASELINE</div>
              <div className="text-xs font-bold text-slate-300">{lastOptimizationResult.baselineETA}m</div>
            </div>
            <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <div className="text-[8px] text-slate-400">OPTIMIZED</div>
              <div className="text-xs font-bold text-green-400 hud-text-glow">{lastOptimizationResult.optimizedETA}m</div>
            </div>
            <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <div className="text-[8px] text-slate-400">TIME SAVED</div>
              <div className="text-xs font-bold text-cyan-400">-{lastOptimizationResult.timeSavedMinutes}m</div>
            </div>
            <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <div className="text-[8px] text-slate-400">CRITICAL ETA</div>
              <div className="text-xs font-bold text-red-400">{lastOptimizationResult.criticalIncidentETA}m</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
