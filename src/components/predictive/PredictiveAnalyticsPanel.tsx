import React from 'react';
import { ShieldAlert, TrendingUp, Clock, AlertTriangle, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function PredictiveAnalyticsPanel() {
  const { 
    isPredictivePanelOpen, 
    setPredictivePanelOpen,
    riskZones, 
    predictiveMetrics, 
    selectRiskZone,
    simulatePrepositioningAction 
  } = useCityStore();

  if (!isPredictivePanelOpen) return null;

  const topZone = riskZones[0] || {
    id: 'ZONE-A17',
    name: 'Sector 4 Innovation Highway Corridor',
    riskScore: 87,
    riskLevel: 'HIGH',
    predictedIncidentTypes: [{ type: 'FIRE', percentage: 64 }, { type: 'ACCIDENT', percentage: 21 }, { type: 'MEDICAL', percentage: 15 }],
    currentResponseTimeMin: 8.4,
    projectedResponseTimeMin: 4.1,
    estimatedTimeSavedMin: 4.3,
    timeWindow: 'NEXT 60 MIN (20:00–21:00)'
  };

  return (
    <div className="fixed left-20 bottom-24 z-40 w-96 pointer-events-auto animate-fade-in max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
      <div className="glass-panel-glow p-5 rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h3 className="font-orbitron font-bold text-xs text-amber-300 hud-text-glow">
                PREDICTIVE RISK ANALYTICS
              </h3>
              <div className="text-[9px] font-mono text-slate-400">PROACTIVE POSITIONING [PREDICTIVE MODE: SIMULATION]</div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            SIMULATION MODEL
          </span>
        </div>

        {/* Prediction Timeline: PAST -> NOW -> FUTURE */}
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px] space-y-1.5">
          <div className="flex justify-between text-slate-400 font-bold border-b border-slate-800 pb-1">
            <span>PREDICTION TIMELINE</span>
            <span className="text-amber-400">SIMULATION FORECAST</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            <div className="bg-slate-900 p-1 rounded border border-slate-800 text-slate-400">
              <div className="text-[8px]">PAST</div>
              <div className="font-bold text-slate-300">Fused Density</div>
            </div>
            <div className="bg-slate-900 p-1 rounded border border-cyan-500/40 text-cyan-300">
              <div className="text-[8px]">NOW</div>
              <div className="font-bold text-cyan-400">Real Activity</div>
            </div>
            <div className="bg-amber-950/60 p-1 rounded border border-amber-500/40 text-amber-300">
              <div className="text-[8px]">FUTURE</div>
              <div className="font-bold text-amber-400">Predicted Risk</div>
            </div>
          </div>
        </div>

        {/* Top Risk Zone Highlight Card */}
        <div 
          onClick={() => selectRiskZone(topZone.id)}
          className="bg-slate-900/90 p-4 rounded-xl border border-amber-500/40 cursor-pointer hover:border-amber-400 transition-all font-mono space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>HIGHEST RISK: {topZone.id}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
              {topZone.riskScore}/100 {topZone.riskLevel}
            </span>
          </div>

          <div className="text-[10px] text-slate-300">{topZone.name}</div>

          {/* Simulated Risk Distribution Bars */}
          <div className="space-y-1 pt-1 border-t border-slate-800">
            <div className="text-[9px] text-slate-400 flex justify-between">
              <span>SIMULATED RISK DISTRIBUTION</span>
              <span>{topZone.timeWindow}</span>
            </div>

            {topZone.predictedIncidentTypes.map((pt, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between text-[9px] text-slate-300">
                  <span>{pt.type}</span>
                  <span className="font-bold text-amber-300">{pt.percentage}%</span>
                </div>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-red-500" 
                    style={{ width: `${pt.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Proactive Pre-Positioning Response Time Benefit */}
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-[10px] pt-2">
            <div>
              <div className="text-[8px] text-slate-400">CURRENT ETA</div>
              <div className="font-bold text-slate-300">{topZone.currentResponseTimeMin} min</div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[8px] text-slate-400">PROJECTED ETA</div>
              <div className="font-bold text-green-400">{topZone.projectedResponseTimeMin} min</div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-cyan-400">TIME SAVED</div>
              <div className="font-bold text-cyan-300">-{topZone.estimatedTimeSavedMin} min</div>
            </div>
          </div>
        </div>

        {/* Simulate Pre-positioning Action Button */}
        <button
          onClick={() => simulatePrepositioningAction(topZone.id)}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>⚡ SIMULATE PRE-POSITIONING</span>
        </button>
      </div>
    </div>
  );
}
