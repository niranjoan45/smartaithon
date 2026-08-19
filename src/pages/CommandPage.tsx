import React from 'react';
import { CityScene } from '../components/3d/CityScene';
import { BottomMetricsStrip } from '../components/hud/BottomMetricsStrip';
import { useCityStore } from '../stores/useCityStore';
import { ShieldAlert, AlertTriangle, ArrowRight, Activity, Zap, Camera, Video, Mic, MapPin, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CommandPage() {
  const navigate = useNavigate();
  const { 
    normalizedIncidents, 
    resources, 
    selectIncident,
    startOptimizationSequence, 
    solveAndDispatchIncidentAction, 
    isOptimizing 
  } = useCityStore();

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
        className="w-[420px] text-slate-900 p-5 flex flex-col gap-4 overflow-y-auto z-20 font-mono text-xs shadow-2xl m-3 rounded-2xl border-2 border-[#8ba136] shrink-0"
      >
        <div className="border-b border-[#73852b] pb-3 flex justify-between items-center">
          <div>
            <h2 className="font-orbitron font-bold text-base text-slate-900">
              EXECUTIVE SITUATION ROOM
            </h2>
            <p className="text-[10px] text-slate-800 font-bold">Live Smart City Telemetry & Citizen Reports</p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#7a0517] text-white shadow-sm">
            {normalizedIncidents.length} INCIDENTS
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

        {/* Priority & Citizen Incidents List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-900 uppercase tracking-wider">
            <span>LIVE INCIDENTS & CITIZEN REPORTS</span>
            <button onClick={() => navigate('/incidents')} className="hover:underline flex items-center gap-1 font-bold text-[#7a0517]">
              <span>VIEW QUEUE ({normalizedIncidents.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {normalizedIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => navigate(`/incidents/${inc.id}`)}
                className="bg-white/95 p-3.5 rounded-xl border border-[#73852b] hover:border-[#7a0517] cursor-pointer transition-all space-y-2 shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">{inc.id}</span>
                    <span className="text-[10px] font-bold text-[#7a0517]">• {inc.type}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    inc.severity === 'P1' ? 'badge-critical' : 'badge-warning'
                  }`}>
                    {inc.severity} [{inc.status}]
                  </span>
                </div>

                <p className="text-[11px] text-slate-800 font-medium line-clamp-2">{inc.rawText}</p>

                {/* Attached Media & Location Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                  <span className="text-slate-700 font-bold flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                    <MapPin className="w-3 h-3 text-orange-600" />
                    <span className="truncate max-w-[150px]">{inc.locationText}</span>
                  </span>
                  {inc.mediaAttachments?.pictures && inc.mediaAttachments.pictures.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold border border-blue-300">
                      📷 {inc.mediaAttachments.pictures.length} Photos
                    </span>
                  )}
                  {inc.mediaAttachments?.videoUrl && (
                    <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold border border-purple-300">
                      🎥 Video
                    </span>
                  )}
                  {inc.mediaAttachments?.audioUrl && (
                    <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-300">
                      🎙 Audio
                    </span>
                  )}
                </div>

                {/* Dispatch Action & Status Footer */}
                <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#73852b]/40 text-slate-900 font-bold">
                  <div>
                    {inc.assignedResourceId ? (
                      <span className="text-emerald-800 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Unit: {inc.assignedResourceId}</span>
                      </span>
                    ) : (
                      <span className="text-red-700">Awaiting Dispatch</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectIncident(inc.id);
                      }}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
                    >
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>SEE IN MAP</span>
                    </button>

                    {inc.status !== 'RESOLVED' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          solveAndDispatchIncidentAction(inc.id);
                        }}
                        className="px-2.5 py-1 rounded bg-[#7a0517] hover:bg-[#91071c] text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
                      >
                        <Zap className="w-3 h-3 fill-current text-white" />
                        <span>SOLVE & DISPATCH</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Quick Status */}
        <div className="bg-white/90 p-4 rounded-xl border border-[#73852b] space-y-2 shadow-md mt-auto">
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
                {resources.filter(r => r.status === 'DISPATCHED' || r.status === 'BUSY').length} Units
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
