import React from 'react';
import { X, TrendingUp, ShieldAlert, Clock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function RiskZoneDetailModal() {
  const { selectedRiskZoneId, riskZones, selectRiskZone, simulatePrepositioningAction } = useCityStore();

  if (!selectedRiskZoneId) return null;

  const zone = riskZones.find(z => z.id === selectedRiskZoneId);
  if (!zone) return null;

  return (
    <div className="fixed left-6 top-24 z-50 w-96 pointer-events-auto animate-fade-in max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
      <div className="glass-panel-glow p-5 rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-xs text-amber-300 hud-text-glow">
                  {zone.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  RISK: {zone.riskScore}/100 {zone.riskLevel}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {zone.name}
              </div>
            </div>
          </div>
          <button 
            onClick={() => selectRiskZone(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Disclaimer Badge */}
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[9px] font-mono text-slate-400">
          ⚠️ SIMULATION MODEL: Predictions derived from synthetic incident density and spatial coverage features. Not a real-world forecast.
        </div>

        {/* Category Breakdown Bars */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>PREDICTED INCIDENT CATEGORIES</span>
            <span>{zone.timeWindow}</span>
          </div>

          {zone.predictedIncidentTypes.map((pt, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-200">
                <span>{pt.type}</span>
                <span className="font-bold text-amber-300">{pt.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-red-500"
                  style={{ width: `${pt.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explainable Contributing Factors: WHY HIGH RISK? */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
          <div className="text-[10px] text-slate-400 font-bold border-b border-slate-800 pb-1">
            WHY {zone.riskLevel} RISK ({zone.riskScore}/100)?
          </div>
          {zone.contributingFactors.map((factor, idx) => (
            <div key={idx} className="text-[11px] text-slate-300">
              {factor}
            </div>
          ))}
        </div>

        {/* Before vs After Response Time Calculation */}
        <div className="bg-amber-950/40 p-3.5 rounded-xl border border-amber-500/40 space-y-2 font-mono text-xs">
          <div className="text-[10px] text-amber-300 font-bold border-b border-amber-500/20 pb-1">
            PROACTIVE PRE-POSITIONING RESPONSE BENEFIT
          </div>

          <div className="flex items-center justify-between text-center pt-1">
            <div>
              <div className="text-[9px] text-slate-400">CURRENT ETA</div>
              <div className="text-sm font-bold text-slate-300">{zone.currentResponseTimeMin} min</div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[9px] text-slate-400">PROJECTED ETA</div>
              <div className="text-sm font-bold text-green-400">{zone.projectedResponseTimeMin} min</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-cyan-400">TIME SAVED</div>
              <div className="text-sm font-bold text-cyan-300">-{zone.estimatedTimeSavedMin} min</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => simulatePrepositioningAction(zone.id)}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>⚡ SIMULATE PRE-POSITIONING</span>
        </button>
      </div>
    </div>
  );
}
