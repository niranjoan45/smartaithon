import React from 'react';
import { useCityStore } from '../stores/useCityStore';
import { BarChart3, TrendingUp, Activity, ShieldAlert } from 'lucide-react';

export function AnalyticsPage() {
  const { normalizedIncidents, resources, riskZones, predictiveMetrics } = useCityStore();

  return (
    <div className="w-full h-full flex flex-col bg-black p-6 gap-5 font-mono text-xs overflow-y-auto select-none text-white">
      <div className="border-b border-orange-500/50 pb-4">
        <h1 className="font-orbitron font-bold text-lg text-white">
          HISTORICAL & OPERATIONAL ANALYTICS
        </h1>
        <p className="text-[11px] text-orange-300">Smart City Operational Telemetry & System Optimization Performance</p>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="glass-orange-card p-4 rounded-xl border border-orange-500/60">
          <div className="text-[10px] text-orange-200">TOTAL INCIDENTS INGESTED</div>
          <div className="text-xl font-bold text-white">{normalizedIncidents.length}</div>
        </div>
        <div className="glass-orange-card p-4 rounded-xl border border-orange-500/60">
          <div className="text-[10px] text-orange-200">FLEET UTILIZATION RATE</div>
          <div className="text-xl font-bold text-amber-400">85%</div>
        </div>
        <div className="glass-orange-card p-4 rounded-xl border border-orange-500/60">
          <div className="text-[10px] text-orange-200">OPTIMIZATION SAVINGS</div>
          <div className="text-xl font-bold text-green-400">+38.7% (-5.5m)</div>
        </div>
        <div className="glass-orange-card p-4 rounded-xl border border-orange-500/60">
          <div className="text-[10px] text-orange-200">PREDICTIVE ACCURACY</div>
          <div className="text-xl font-bold text-amber-300">94% Confidence</div>
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-2 gap-5">
        <div className="glass-white-panel p-5 rounded-2xl border border-white/30 space-y-3">
          <div className="font-bold text-white border-b border-white/20 pb-2">
            INCIDENT SEVERITY DISTRIBUTION (P1 - P4)
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] text-white mb-1 font-bold">
                <span>P1 CRITICAL EMERGENCY</span>
                <span className="text-red-400">45%</span>
              </div>
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/20">
                <div className="h-full bg-red-500" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-white mb-1 font-bold">
                <span>P2 SERIOUS INCIDENT</span>
                <span className="text-amber-300">35%</span>
              </div>
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/20">
                <div className="h-full bg-amber-500" style={{ width: '35%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-white mb-1 font-bold">
                <span>P3 MODERATE RESPONSE</span>
                <span className="text-white">20%</span>
              </div>
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/20">
                <div className="h-full bg-white" style={{ width: '20%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-white-panel p-5 rounded-2xl border border-white/30 space-y-3">
          <div className="font-bold text-white border-b border-white/20 pb-2">
            RESOURCE FLEET DISPATCH COVERAGE
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] text-white mb-1 font-bold">
                <span>AMBULANCE COVERAGE</span>
                <span className="text-green-400">{predictiveMetrics.ambulanceCoveragePercent}%</span>
              </div>
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/20">
                <div className="h-full bg-green-500" style={{ width: `${predictiveMetrics.ambulanceCoveragePercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-white mb-1 font-bold">
                <span>FIRE TRUCK COVERAGE</span>
                <span className="text-amber-400">{predictiveMetrics.fireCoveragePercent}%</span>
              </div>
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/20">
                <div className="h-full bg-amber-500" style={{ width: `${predictiveMetrics.fireCoveragePercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-white mb-1 font-bold">
                <span>POLICE COVERAGE</span>
                <span className="text-orange-400">{predictiveMetrics.policeCoveragePercent}%</span>
              </div>
              <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-white/20">
                <div className="h-full bg-orange-500" style={{ width: `${predictiveMetrics.policeCoveragePercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
