import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCityStore } from '../stores/useCityStore';
import { ArrowLeft, ShieldAlert, AlertTriangle, CheckCircle2, Clock, Truck, Activity } from 'lucide-react';

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { normalizedIncidents, resources } = useCityStore();

  const incident = normalizedIncidents.find(i => i.id === id) || normalizedIncidents[0];
  const assignedUnit = resources.find(r => r.id === incident?.assignedResourceId) || resources[1];

  if (!incident) return null;

  return (
    <div className="w-full h-full flex flex-col bg-[#111315] p-6 gap-5 font-mono text-xs overflow-y-auto select-none text-[#E7E5DF]">
      {/* Top Navigation Back Header */}
      <div className="flex items-center justify-between border-b border-[#3A3F42] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/incidents')}
            className="p-2 rounded bg-[#191C1F] border border-[#3A3F42] text-[#E7E5DF] hover:text-white hover:border-amber-500 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO INCIDENTS</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-orbitron font-bold text-lg text-white">{incident.id}</h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                incident.severity === 'P1' ? 'badge-critical' : 'badge-warning'
              }`}>
                {incident.severity} [{incident.type}]
              </span>
            </div>
            <p className="text-[11px] text-[#A9AAA5] mt-0.5">{incident.locationText}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded badge-success font-bold">
            STATUS: {incident.status}
          </span>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-3 gap-5">
        {/* Card 1: Overview & Raw Signal */}
        <div className="bg-[#191C1F] p-5 rounded-xl border border-[#3A3F42] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold border-b border-[#3A3F42] pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>INCIDENT OVERVIEW</span>
          </div>
          <div className="space-y-2 text-[#E7E5DF]">
            <div>
              <div className="text-[10px] text-[#A9AAA5]">RAW SIGNAL REPORT</div>
              <div className="bg-[#111315] p-3 rounded border border-[#3A3F42] text-[11px] leading-relaxed">
                "{incident.rawText}"
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="bg-[#111315] p-2.5 rounded border border-[#3A3F42]">
                <div className="text-[9px] text-[#A9AAA5]">PEOPLE AT RISK</div>
                <div className="text-sm font-bold text-amber-400">{incident.peopleAtRisk} victims</div>
              </div>
              <div className="bg-[#111315] p-2.5 rounded border border-[#3A3F42]">
                <div className="text-[9px] text-[#A9AAA5]">AFFECTED AREA</div>
                <div className="text-sm font-bold text-white">{incident.affectedAreaSqMeters} m²</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Severity & Priority Score Breakdown */}
        <div className="bg-[#191C1F] p-5 rounded-xl border border-[#3A3F42] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold border-b border-[#3A3F42] pb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>SEVERITY EVALUATION</span>
          </div>

          <div className="flex items-center justify-between bg-[#111315] p-3 rounded border border-[#3A3F42] text-center">
            <div>
              <div className="text-[9px] text-[#A9AAA5]">SEVERITY SCORE</div>
              <div className="text-xl font-bold text-red-400">{incident.severityScore}/100</div>
            </div>
            <div>
              <div className="text-[9px] text-[#A9AAA5]">PRIORITY SCORE</div>
              <div className="text-xl font-bold text-amber-400">{incident.priorityScore}/100</div>
            </div>
            <div>
              <div className="text-[9px] text-[#A9AAA5]">ESCALATION RISK</div>
              <div className="text-xl font-bold text-orange-400">{incident.escalationRisk}%</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] text-[#A9AAA5] font-bold">FACTOR BREAKDOWN</div>
            {(incident.severityBreakdown || [
              { factor: 'Base Threat Evaluation', points: 25 },
              { factor: 'Mass Population Threat', points: 30 },
              { factor: 'Escalation Potential', points: 25 },
              { factor: 'Corroborated Evidence Feeds', points: 14 }
            ]).map((sb, idx) => (
              <div key={idx} className="flex justify-between items-center text-[11px] bg-[#111315] p-2 rounded border border-[#3A3F42]">
                <span className="text-[#E7E5DF]">{sb.factor}</span>
                <span className="font-bold text-amber-400">+{sb.points} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Assigned Emergency Response */}
        <div className="bg-[#191C1F] p-5 rounded-xl border border-[#3A3F42] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold border-b border-[#3A3F42] pb-2">
            <Truck className="w-4 h-4 text-green-400" />
            <span>RESPONSE ASSIGNMENT</span>
          </div>

          {assignedUnit && (
            <div className="bg-[#111315] p-4 rounded border border-[#3A3F42] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{assignedUnit.callsign}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold badge-success">
                  {assignedUnit.status}
                </span>
              </div>
              <div className="text-[10px] text-[#A9AAA5]">Driver: {assignedUnit.driverName}</div>
              <div className="flex justify-between text-[11px] pt-2 border-t border-[#3A3F42] text-[#E7E5DF]">
                <span>ESTIMATED ETA</span>
                <span className="font-bold text-amber-400">{assignedUnit.etaMinutes || 3.4} min</span>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate('/dispatch')}
            className="w-full py-2.5 rounded bg-[#202427] hover:bg-[#282C2F] text-amber-400 border border-[#3A3F42] font-bold text-xs transition-all"
          >
            VIEW TACTICAL ROUTE ON MAP
          </button>
        </div>
      </div>
    </div>
  );
}
