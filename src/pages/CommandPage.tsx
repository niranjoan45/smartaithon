import React from 'react';
import { CityScene } from '../components/3d/CityScene';
import { BottomMetricsStrip } from '../components/hud/BottomMetricsStrip';
import { useCityStore } from '../stores/useCityStore';
import { ShieldAlert, AlertTriangle, ArrowRight, Activity, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CommandPage() {
  const navigate = useNavigate();
  const { normalizedIncidents, resources, startOptimizationSequence, isOptimizing } = useCityStore();

  const activeIncidents = normalizedIncidents.slice(0, 3);

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-slate-100 select-none text-slate-900">
      {/* 3D Smart City Main Viewport */}
      <div className="flex-1 h-full relative">
        <CityScene />
        <BottomMetricsStrip />
      </div>

      {/* Right Executive Situation Room EXACT VIVID #d5e38f BOX */}
      <div 
        style={{ backgroundColor: '#d5e38f' }} 
        className="w-96 text-slate-900 p-5 flex flex-col gap-4 overflow-y-auto z-20 font-mono text-xs shadow-2xl m-3 rounded-2xl border-2 border-[#8ba136]"
      >
        <div className="border-b border-[#73852b] pb-3 flex justify-between items-center">
          <div>
            <h2 className="font-orbitron font-bold text-base text-slate-900">
              EXECUTIVE SITUATION ROOM
            </h2>
            <p className="text-[10px] text-slate-800 font-bold">Live Smart City Telemetry</p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#7a0517] text-white shadow-sm">
            SYSTEM ONLINE
          </span>
        </div>

        {/* Global Optimizer Trigger */}
        <button
          disabled={isOptimizing}
          onClick={startOptimizationSequence}
          className={`w-full py-3.5 rounded-xl font-orbitron font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
            isOptimizing
              ? 'bg-[#7a0517] text-white animate-pulse'
              : 'bg-[#7a0517] hover:bg-[#91071c] text-white font-bold shadow-lg active:scale-95'
          }`}
        >
          <Zap className="w-4 h-4 fill-current text-white" />
          <span>{isOptimizing ? 'SOLVING OPTIMIZATION...' : '⚡ RUN GLOBAL OPTIMIZER'}</span>
        </button>

        {/* Priority Incidents List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-900 uppercase tracking-wider">
            <span>TOP PRIORITY INCIDENTS</span>
            <button onClick={() => navigate('/incidents')} className="hover:underline flex items-center gap-1 font-bold text-[#7a0517]">
              <span>VIEW ALL</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {activeIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => navigate(`/incidents/${inc.id}`)}
              className="bg-white/90 p-3.5 rounded-xl border border-[#73852b] hover:border-[#7a0517] cursor-pointer transition-all space-y-1.5 shadow-md"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-900 text-sm">{inc.id}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  inc.severity === 'P1' ? 'badge-critical' : 'badge-warning'
                }`}>
                  {inc.severity} [{inc.type}]
                </span>
              </div>
              <div className="text-[10px] text-slate-800 font-medium truncate">{inc.locationText}</div>
              <div className="flex justify-between text-[10px] pt-1.5 border-t border-[#73852b]/40 text-slate-900 font-bold">
                <span>Score: <strong>{inc.severityScore}/100</strong></span>
                <span>Assigned: <strong>{inc.assignedResourceId || 'F01'}</strong></span>
              </div>
            </div>
          ))}
        </div>

        {/* Fleet Quick Status */}
        <div className="bg-white/90 p-4 rounded-xl border border-[#73852b] space-y-2 shadow-md">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-900 uppercase tracking-wider">
            <span>FLEET READINESS</span>
            <button onClick={() => navigate('/resources')} className="hover:underline flex items-center gap-1 font-bold text-[#7a0517]">
              <span>MANAGE</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
            <div className="bg-slate-100 p-2.5 rounded-lg border border-[#73852b]/50">
              <div className="text-slate-700 font-bold">DISPATCHED</div>
              <div className="text-base font-bold text-[#7a0517]">
                {resources.filter(r => r.status === 'DISPATCHED').length} Units
              </div>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg border border-[#73852b]/50">
              <div className="text-slate-700 font-bold">AVAILABLE</div>
              <div className="text-base font-bold text-green-700">
                {resources.filter(r => r.status === 'AVAILABLE').length} Units
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
