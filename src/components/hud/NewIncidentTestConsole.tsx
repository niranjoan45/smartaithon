import React from 'react';
import { Play, Sparkles, AlertTriangle, Flame, Waves, HeartPulse, ShieldAlert } from 'lucide-react';
import { useIncidentIntelligence } from '../../hooks/useIncidentIntelligence';
import { EventSourceType } from '../../types/incident';

export function NewIncidentTestConsole() {
  const { isProcessing, processIncomingEvent } = useIncidentIntelligence();

  const presets = [
    {
      label: 'HIGHWAY ACCIDENT',
      icon: AlertTriangle,
      source: 'CITIZEN_REPORT' as EventSourceType,
      text: 'Major multi-vehicle collision on North Highway Interchange. Multiple casualties reported.',
      location: 'North Highway Interchange, Km 14'
    },
    {
      label: 'BUILDING FIRE',
      icon: Flame,
      source: 'IOT_SENSOR' as EventSourceType,
      text: 'Thermal detector alarm: Commercial complex fire at Sector 4 Innovation Tower.',
      location: 'Sector 4 Innovation Tower'
    },
    {
      label: 'FLASH FLOOD',
      icon: Waves,
      source: 'IOT_SENSOR' as EventSourceType,
      text: 'Rapid water level rise detected near Industrial Zone Port.',
      location: 'Industrial Zone Logistics Port'
    },
    {
      label: 'CARDIAC EMERGENCY',
      icon: HeartPulse,
      source: 'CITIZEN_REPORT' as EventSourceType,
      text: 'Unconscious person in Central Railway Station concourse needing resuscitation.',
      location: 'Central Railway Concourse'
    }
  ];

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none hidden md:block">
      <div className="pointer-events-auto glass-panel px-3 py-1.5 rounded-xl border border-cyan-500/20 shadow-xl flex items-center gap-2">
        <span className="text-[9px] font-mono font-bold text-cyan-400 tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          TEST INJECTION:
        </span>

        {presets.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              disabled={isProcessing}
              onClick={() => processIncomingEvent({ source: p.source, rawText: p.text, reporterLocation: p.location })}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-400 text-[10px] font-mono text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Icon className="w-3 h-3 text-cyan-400" />
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
