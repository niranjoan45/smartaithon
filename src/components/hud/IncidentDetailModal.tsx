import React from 'react';
import { X, Flame, ShieldAlert, Cpu, Radio, Camera, UserCheck, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function IncidentDetailModal() {
  const { selectedIncidentId, normalizedIncidents, selectIncident } = useCityStore();

  if (!selectedIncidentId) return null;

  const incident = normalizedIncidents.find((i) => i.id === selectedIncidentId);
  if (!incident) return null;

  const getSourceBadgeIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'CITIZEN': return <UserCheck className="w-3.5 h-3.5 text-cyan-400" />;
      case 'CCTV': return <Camera className="w-3.5 h-3.5 text-amber-400" />;
      case 'IOT': return <Cpu className="w-3.5 h-3.5 text-red-400" />;
      case 'SOCIAL': return <Share2 className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Radio className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getSourceLabel = (sourceType: string) => {
    switch (sourceType) {
      case 'CITIZEN': return 'CITIZEN REPORT';
      case 'CCTV': return 'CCTV AI CAM #42';
      case 'IOT': return 'IoT SENSOR NODE #04';
      case 'SOCIAL': return 'SOCIAL MEDIA FEED';
      default: return sourceType;
    }
  };

  return (
    <div className="fixed right-6 top-24 z-50 w-96 pointer-events-auto animate-fade-in max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
      <div className="glass-panel-glow p-5 rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-xs text-red-400 hud-text-glow">
                  {incident.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                  {incident.severity} CRITICAL
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                {incident.locationText} ({incident.formattedTimeAgo})
              </div>
            </div>
          </div>
          <button
            onClick={() => selectIncident(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conflicting Evidence Alert */}
        {incident.hasConflict && (
          <div className="glass-panel-red p-2.5 rounded-xl border border-red-500/50 flex items-center gap-2 text-xs font-mono text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <div>
              <div className="font-bold text-red-400">EVIDENCE CONFLICT DETECTED</div>
              <div className="text-[10px] text-red-300/90">{incident.conflictDetails || 'Signal telemetry exhibits contradictory optical/thermal properties.'}</div>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[8px] text-slate-400">CONFIDENCE</div>
            <div className="text-xs font-bold text-cyan-300 hud-text-glow">{incident.confidence}%</div>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[8px] text-slate-400">SOURCES</div>
            <div className="text-xs font-bold text-green-400">{incident.sourceEvents?.length || incident.evidence.length}</div>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[8px] text-slate-400">CORRELATED</div>
            <div className="text-xs font-bold text-amber-400">{incident.correlatedReportsCount || 1}</div>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
            <div className="text-[8px] text-slate-400">PRIORITY</div>
            <div className="text-xs font-bold text-red-400">#{incident.priorityRank}</div>
          </div>
        </div>

        {/* Multi-Source Corroborating Evidence Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1">
            <span>FUSED SOURCE EVIDENCE</span>
            <span className="text-cyan-400">BOUNDED CONFIDENCE: {incident.confidence}%</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {['CITIZEN', 'CCTV', 'IOT', 'SOCIAL'].map((sType, idx) => {
              const hasSource = incident.sourceTypesPresent?.includes(sType as any) || idx < incident.evidence.length;
              return (
                <div 
                  key={idx} 
                  className={`p-2 rounded-xl border flex flex-col gap-1 transition-all ${
                    hasSource 
                      ? 'bg-slate-900/90 border-cyan-500/40 text-slate-200' 
                      : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold">
                      {getSourceBadgeIcon(sType)}
                      <span>{getSourceLabel(sType)}</span>
                    </div>
                    {hasSource && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    {hasSource ? '✓ CORRELATED & VERIFIED' : 'Awaiting signal'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raw Text Summary */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono text-xs">
          <div className="text-[9px] text-slate-400 mb-1">UNIFIED INCIDENT SUMMARY</div>
          <div className="text-slate-200">{incident.rawText}</div>
        </div>

        {/* Inspectable Severity Score Breakdown */}
        {incident.severityBreakdown && incident.severityBreakdown.length > 0 && (
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
            <div className="text-[9px] text-slate-400 mb-1">INSPECTABLE SEVERITY BREAKDOWN</div>
            {incident.severityBreakdown.map((sb, idx) => (
              <div key={idx} className="flex justify-between text-slate-300">
                <span>• {sb.factor}</span>
                <span className="font-bold text-amber-400">+{sb.points} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
