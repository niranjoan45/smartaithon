import React from 'react';
import { CityScene } from '../components/3d/CityScene';
import { useCityStore } from '../stores/useCityStore';
import { TrendingUp, AlertTriangle, ArrowRight, Zap, ShieldAlert } from 'lucide-react';

export function RiskPage() {
  const { riskZones, selectedRiskZoneId, selectRiskZone, simulatePrepositioningAction, predictiveMetrics } = useCityStore();

  const selectedZone = riskZones.find(z => z.id === selectedRiskZoneId) || riskZones[0];

  return (
    <div className="w-full h-full flex flex-col bg-black p-4 gap-4 font-mono text-xs overflow-hidden select-none text-white">
      {/* Top Risk Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-orange-card p-4 rounded-xl flex items-center justify-between border border-orange-500/60">
          <div>
            <div className="text-[10px] text-orange-200 font-bold">HIGH RISK ZONES</div>
            <div className="text-xl font-bold text-amber-400">{predictiveMetrics.totalHighRiskZones}</div>
          </div>
          <TrendingUp className="w-6 h-6 text-amber-400" />
        </div>

        <div className="glass-orange-card p-4 rounded-xl flex items-center justify-between border border-orange-500/60">
          <div>
            <div className="text-[10px] text-orange-200 font-bold">CRITICAL ZONES</div>
            <div className="text-xl font-bold text-red-400">{predictiveMetrics.totalCriticalZones}</div>
          </div>
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>

        <div className="glass-orange-card p-4 rounded-xl flex items-center justify-between border border-orange-500/60">
          <div>
            <div className="text-[10px] text-orange-200 font-bold">FIRE COVERAGE</div>
            <div className="text-xl font-bold text-white">{predictiveMetrics.fireCoveragePercent}%</div>
          </div>
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>

        <div className="glass-orange-card p-4 rounded-xl flex items-center justify-between border border-orange-500/60">
          <div>
            <div className="text-[10px] text-orange-200 font-bold">AVG ETA TIME SAVED</div>
            <div className="text-xl font-bold text-green-400">-{predictiveMetrics.avgTimeSavedMin} min</div>
          </div>
          <Zap className="w-6 h-6 text-green-400" />
        </div>
      </div>

      {/* Main Workspace (3D Map + Risk Inspector) */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left/Center 3D City Risk Map */}
        <div className="flex-1 glass-white-panel rounded-2xl overflow-hidden relative border border-white/30">
          <CityScene />
        </div>

        {/* Right Risk Zone Details STUNNING ORANGE GLASSMORPHISM */}
        {selectedZone && (
          <div className="w-96 glass-orange-panel rounded-2xl p-5 flex flex-col gap-4 overflow-y-auto border border-orange-500/70">
            <div className="border-b border-orange-500/50 pb-3 flex justify-between items-center">
              <div>
                <div className="text-base font-bold text-white">{selectedZone.id}</div>
                <div className="text-[10px] text-orange-200">{selectedZone.name}</div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold badge-warning">
                {selectedZone.riskScore}/100 {selectedZone.riskLevel}
              </span>
            </div>

            {/* Predicted Distribution */}
            <div className="bg-black/60 p-3.5 rounded-xl border border-orange-500/40 space-y-2">
              <div className="text-[10px] text-orange-300 font-bold">PREDICTED CATEGORIES ({selectedZone.timeWindow})</div>
              {selectedZone.predictedIncidentTypes.map((pt, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between text-[10px] text-white font-bold">
                    <span>{pt.type}</span>
                    <span className="text-amber-400">{pt.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-orange-500/30">
                    <div className="h-full bg-orange-500" style={{ width: `${pt.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Contributing Factors */}
            <div className="bg-black/60 p-3.5 rounded-xl border border-orange-500/40 space-y-1">
              <div className="text-[10px] text-orange-300 font-bold">WHY {selectedZone.riskLevel} RISK?</div>
              {selectedZone.contributingFactors.map((factor, idx) => (
                <div key={idx} className="text-[10px] text-white/90">{factor}</div>
              ))}
            </div>

            {/* Response Benefit */}
            <div className="bg-black/60 p-3.5 rounded-xl border border-orange-500/50 flex items-center justify-between text-center">
              <div>
                <div className="text-[9px] text-orange-200">CURRENT ETA</div>
                <div className="font-bold text-white text-sm">{selectedZone.currentResponseTimeMin}m</div>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-[9px] text-orange-200">PROJECTED ETA</div>
                <div className="font-bold text-green-400 text-sm">{selectedZone.projectedResponseTimeMin}m</div>
              </div>
              <div>
                <div className="text-[9px] text-white">SAVING</div>
                <div className="font-bold text-white text-sm">-{selectedZone.estimatedTimeSavedMin}m</div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => simulatePrepositioningAction(selectedZone.id)}
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl mt-auto"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>⚡ SIMULATE PRE-POSITIONING</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
