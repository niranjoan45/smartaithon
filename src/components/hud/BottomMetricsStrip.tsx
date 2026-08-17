import React from 'react';
import { 
  AlertOctagon, 
  Siren, 
  Clock, 
  MapPin, 
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function BottomMetricsStrip() {
  const getMetrics = useCityStore((state) => state.getMetrics);
  const metrics = getMetrics();

  return (
    <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-5xl pointer-events-none">
      <div className="pointer-events-auto glass-white-panel px-6 py-2.5 rounded-2xl border border-slate-200 shadow-xl backdrop-blur-2xl flex items-center justify-between gap-4 overflow-x-auto text-slate-900 font-mono text-xs">
        {/* INCIDENTS */}
        <div className="flex items-center gap-2.5 min-w-max">
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-500 font-bold tracking-wider">INCIDENTS</div>
            <div className="font-orbitron font-bold text-sm text-slate-900">
              {metrics.totalIncidents}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* CRITICAL */}
        <div className="flex items-center gap-2.5 min-w-max">
          <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Siren className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-500 font-bold tracking-wider">CRITICAL</div>
            <div className="font-orbitron font-bold text-sm text-red-600">
              {metrics.criticalIncidents}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* RESOURCES */}
        <div className="flex items-center gap-2.5 min-w-max">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-500 font-bold tracking-wider">RESOURCES</div>
            <div className="font-orbitron font-bold text-sm text-slate-900">
              {metrics.totalResources}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* ACTIVE DISPATCH */}
        <div className="flex items-center gap-2.5 min-w-max">
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-500 font-bold tracking-wider">ACTIVE DISPATCH</div>
            <div className="font-orbitron font-bold text-sm text-orange-600 font-bold">
              {metrics.activeDispatches}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* AVG ETA */}
        <div className="flex items-center gap-2.5 min-w-max">
          <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-500 font-bold tracking-wider">AVG ETA</div>
            <div className="font-orbitron font-bold text-sm text-green-600 font-bold">
              {metrics.avgEtaMinutes}m
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* RISK ZONES */}
        <div className="flex items-center gap-2.5 min-w-max">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[9px] font-mono text-slate-500 font-bold tracking-wider">RISK ZONES</div>
            <div className="font-orbitron font-bold text-sm text-amber-600">
              {metrics.riskZonesCount}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
