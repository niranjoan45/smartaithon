import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCityStore } from '../stores/useCityStore';
import { ArrowLeft, Truck, ShieldCheck, Activity, CheckCircle2 } from 'lucide-react';

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resources, lastOptimizationResult } = useCityStore();

  const unit = resources.find(r => r.id === id) || resources[0];

  if (!unit) return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#111315] p-6 gap-5 font-mono text-xs overflow-y-auto select-none text-[#E7E5DF]">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#3A3F42] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/resources')}
            className="p-2 rounded bg-[#191C1F] border border-[#3A3F42] text-[#E7E5DF] hover:text-white hover:border-amber-500 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO FLEET</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-orbitron font-bold text-lg text-white">{unit.callsign}</h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                unit.status === 'AVAILABLE' ? 'badge-success' : 'badge-warning'
              }`}>
                {unit.status}
              </span>
            </div>
            <p className="text-[11px] text-[#A9AAA5] mt-0.5">Driver: {unit.driverName} • Base: {unit.homeStation}</p>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-5">
        {/* Unit Info & Telemetry */}
        <div className="bg-[#191C1F] p-5 rounded-xl border border-[#3A3F42] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold border-b border-[#3A3F42] pb-2">
            <Truck className="w-4 h-4 text-amber-400" />
            <span>UNIT TELEMETRY</span>
          </div>
          <div className="space-y-2 text-[#E7E5DF]">
            <div className="flex justify-between py-1 border-b border-[#3A3F42]/60">
              <span className="text-[#A9AAA5]">TYPE</span>
              <span className="font-bold">{unit.type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#3A3F42]/60">
              <span className="text-[#A9AAA5]">CURRENT SPEED</span>
              <span className="font-bold text-white">{unit.speedKmH} km/h</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#3A3F42]/60">
              <span className="text-[#A9AAA5]">UNIT HEALTH</span>
              <span className="font-bold text-green-400">{unit.unitHealth}%</span>
            </div>
            <div className="pt-2">
              <div className="text-[10px] text-[#A9AAA5] mb-1">CAPABILITIES</div>
              <div className="flex flex-wrap gap-1.5">
                {unit.capabilities.map((cap, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-[#111315] text-white border border-[#3A3F42] font-bold">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 3 Assignment Scoring Reasoning */}
        <div className="col-span-2 bg-[#191C1F] p-5 rounded-xl border border-[#3A3F42] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold border-b border-[#3A3F42] pb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>WHY THIS ASSIGNMENT? (ASSIGNMENT REASONING ENGINE)</span>
          </div>

          <div className="bg-[#111315] p-4 rounded border border-[#3A3F42] space-y-2 text-[#E7E5DF]">
            <div className="flex justify-between items-center text-sm font-bold border-b border-[#3A3F42] pb-2">
              <span>ASSIGNED INCIDENT: {unit.currentIncidentId || 'INC-1051'}</span>
              <span className="text-amber-400">ESTIMATED ETA: {unit.etaMinutes || 3.4} MIN</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-2">
              <div className="bg-[#191C1F] p-2 rounded border border-[#3A3F42]">
                <div className="text-[9px] text-[#A9AAA5]">GLOBAL COST SCORE</div>
                <div className="font-bold text-green-400">96/100 (Optimal)</div>
              </div>
              <div className="bg-[#191C1F] p-2 rounded border border-[#3A3F42]">
                <div className="text-[9px] text-[#A9AAA5]">CAPABILITY MATCH</div>
                <div className="font-bold text-white">100% Structural Fire</div>
              </div>
              <div className="bg-[#191C1F] p-2 rounded border border-[#3A3F42]">
                <div className="text-[9px] text-[#A9AAA5]">TRAFFIC MULTIPLIER</div>
                <div className="font-bold text-amber-400">1.0x (Clear Corridor)</div>
              </div>
            </div>

            <div className="text-[11px] text-[#A9AAA5] leading-relaxed pt-2 border-t border-[#3A3F42]">
              "Global Optimizer selected {unit.callsign} over nearest available unit because capability matching provided a +40 point bonus for high-risk P1 fire suppression, reducing projected arrival time by 5.5 minutes."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
