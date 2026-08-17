import React from 'react';
import { CityScene } from '../components/3d/CityScene';
import { useCityStore } from '../stores/useCityStore';
import { Navigation, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export function DispatchPage() {
  const { activeRoutes, resources, normalizedIncidents } = useCityStore();

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-black select-none text-white">
      {/* 3D City Tactical Canvas */}
      <div className="flex-1 h-full relative">
        <CityScene />
      </div>

      {/* Floating Tactical Dispatch STUNNING ORANGE GLASSMORPHISM Panel */}
      <div className="absolute right-6 top-6 z-20 w-96 glass-orange-panel p-5 rounded-2xl shadow-2xl font-mono text-xs space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="border-b border-orange-500/50 pb-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-orange-400 animate-pulse" />
            <div>
              <h2 className="font-orbitron font-bold text-sm text-white">
                TACTICAL DISPATCH ROUTES
              </h2>
              <p className="text-[10px] text-orange-200">Live Navigation & Priority Corridors</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded text-[9px] font-bold bg-orange-500/30 text-white border border-orange-400">
            {activeRoutes.length} ROUTES ACTIVE
          </span>
        </div>

        {/* Active Response Routes List */}
        <div className="space-y-3">
          {activeRoutes.map((route, idx) => {
            const unit = resources[idx % resources.length] || resources[0];
            const inc = normalizedIncidents[idx % normalizedIncidents.length] || normalizedIncidents[0];

            return (
              <div key={route.id} className="glass-orange-card p-3.5 rounded-xl border border-orange-500/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{unit.callsign}</span>
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                  <span className="font-bold text-amber-300">{inc.id}</span>
                </div>

                <div className="text-[10px] text-white/90">{inc.locationText}</div>

                <div className="grid grid-cols-2 gap-2 text-center text-[10px] pt-1.5 border-t border-orange-500/40">
                  <div className="bg-black/60 p-2 rounded-lg border border-orange-500/40">
                    <span className="text-orange-200">DISPATCH ETA: </span>
                    <span className="font-bold text-green-400">{unit.etaMinutes || 3.4}m</span>
                  </div>
                  <div className="bg-black/60 p-2 rounded-lg border border-orange-500/40">
                    <span className="text-orange-200">CORRIDOR: </span>
                    <span className="font-bold text-white">CLEAR</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
