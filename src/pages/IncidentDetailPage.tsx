import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCityStore } from '../stores/useCityStore';
import { useAuthStore } from '../stores/useAuthStore';
import { 
  ArrowLeft, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Activity, 
  Camera, 
  Video, 
  Mic, 
  MapPin, 
  Zap, 
  Check, 
  FileCheck,
  Maximize2
} from 'lucide-react';

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    normalizedIncidents, 
    resources,
    solveAndDispatchIncidentAction,
    resolveIncidentAction
  } = useCityStore();

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const incident = normalizedIncidents.find(i => i.id === id) || normalizedIncidents[0];
  const assignedUnit = resources.find(r => r.id === incident?.assignedResourceId || r.callsign === incident?.assignedResourceId);

  if (!incident) return null;

  const handleVerify = () => {
    setIsVerified(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#111315] p-6 gap-5 font-mono text-xs overflow-y-auto select-none text-[#E7E5DF]">
      {/* Top Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#3A3F42] pb-4 gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/incidents')}
            className="p-2 rounded bg-[#191C1F] border border-[#3A3F42] text-[#E7E5DF] hover:text-white hover:border-amber-500 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO INCIDENTS QUEUE</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-orbitron font-bold text-xl text-white">{incident.id}</h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                incident.severity === 'P1' ? 'badge-critical' : 'badge-warning'
              }`}>
                {incident.severity} [{incident.type}]
              </span>
              {isVerified && (
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-950 text-blue-300 border border-blue-700 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                  EVIDENCE VERIFIED
                </span>
              )}
            </div>
            <p className="text-xs text-[#A9AAA5] mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{incident.locationText}</span>
              {incident.gpsLocation && (
                <span className="text-amber-400 font-bold">
                  (GPS: {incident.gpsLocation.latitude.toFixed(4)}° N, {incident.gpsLocation.longitude.toFixed(4)}° E)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Status Badge & Admin Action Control Bar */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded font-extrabold text-xs ${
            incident.status === 'ACTIVE' ? 'bg-red-950 text-red-300 border border-red-800' :
            incident.status === 'DISPATCHED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
            'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            STATUS: {incident.status}
          </span>

          {user?.role === 'ADMIN' && (
            <div className="flex items-center gap-2">
              {!isVerified && (
                <button
                  onClick={handleVerify}
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>VERIFY EVIDENCE</span>
                </button>
              )}

              {incident.status !== 'RESOLVED' && (
                <button
                  onClick={() => solveAndDispatchIncidentAction(incident.id)}
                  className="px-3.5 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-black font-orbitron font-extrabold text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Zap className="w-4 h-4" />
                  <span>RUN OPTIMIZATION & DISPATCH</span>
                </button>
              )}

              {incident.status !== 'RESOLVED' && (
                <button
                  onClick={() => resolveIncidentAction(incident.id)}
                  className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4" />
                  <span>RESOLVE INCIDENT</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Overview & Raw Signal */}
        <div className="bg-[#191C1F] p-5 rounded-xl border border-[#3A3F42] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold border-b border-[#3A3F42] pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>INCIDENT OVERVIEW</span>
          </div>
          <div className="space-y-3 text-[#E7E5DF]">
            <div>
              <div className="text-[10px] text-[#A9AAA5] font-bold">CITIZEN RAW DESCRIPTION</div>
              <div className="bg-[#111315] p-3.5 rounded border border-[#3A3F42] text-xs leading-relaxed font-medium">
                "{incident.rawText}"
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="bg-[#111315] p-3 rounded border border-[#3A3F42]">
                <div className="text-[9px] text-[#A9AAA5]">PEOPLE AT RISK</div>
                <div className="text-base font-bold text-amber-400">{incident.peopleAtRisk} victims</div>
              </div>
              <div className="bg-[#111315] p-3 rounded border border-[#3A3F42]">
                <div className="text-[9px] text-[#A9AAA5]">AFFECTED AREA</div>
                <div className="text-base font-bold text-white">{incident.affectedAreaSqMeters} m²</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Severity & Priority Score Breakdown */}
        <div className="bg-[#191C1F] p-5 rounded-xl border border-[#3A3F42] space-y-3">
          <div className="flex items-center gap-2 text-white font-bold border-b border-[#3A3F42] pb-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>AI SEVERITY & RISK ENGINE</span>
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
            <div className="text-[10px] text-[#A9AAA5] font-bold">AI EVALUATION FACTORS</div>
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
            <span>DISPATCH & FLEET RESPONSE</span>
          </div>

          {assignedUnit ? (
            <div className="bg-[#111315] p-4 rounded border border-[#3A3F42] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{assignedUnit.callsign}</span>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold badge-success">
                  {assignedUnit.status}
                </span>
              </div>
              <div className="text-xs text-[#A9AAA5]">Commander / Driver: <strong>{assignedUnit.driverName}</strong></div>
              <div className="flex justify-between text-xs pt-2 border-t border-[#3A3F42] text-[#E7E5DF]">
                <span>ESTIMATED ROUTE ETA</span>
                <span className="font-bold text-amber-400">{assignedUnit.etaMinutes || 3.2} minutes</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#111315] p-4 rounded border border-red-800 text-red-300 text-xs font-bold text-center space-y-2">
              <div>NO UNIT DISPATCHED YET</div>
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => solveAndDispatchIncidentAction(incident.id)}
                  className="w-full py-2.5 rounded bg-amber-400 hover:bg-amber-300 text-black font-extrabold transition-all"
                >
                  ⚡ DISPATCH NEAREST UNIT
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => navigate('/dispatch')}
            className="w-full py-3 rounded bg-[#202427] hover:bg-[#282C2F] text-amber-400 border border-[#3A3F42] font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <span>VIEW TACTICAL ROUTE ON 3D MAP</span>
          </button>
        </div>
      </div>

      {/* Media Attachments Gallery & Media Players Section */}
      <div className="bg-[#191C1F] p-6 rounded-xl border border-[#3A3F42] space-y-4">
        <div className="flex items-center justify-between border-b border-[#3A3F42] pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
            <Camera className="w-4 h-4 text-blue-400" />
            <span>ATTACHED CITIZEN MEDIA EVIDENCE (PHOTOS, VIDEO, AUDIO)</span>
          </div>
          <span className="text-xs text-orange-400 font-bold">
            {incident.mediaAttachments ? 'Media Telemetry Received' : 'No Media Attached'}
          </span>
        </div>

        {incident.mediaAttachments && (incident.mediaAttachments.pictures?.length || incident.mediaAttachments.videoUrl || incident.mediaAttachments.audioUrl) ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Photo Gallery */}
            {incident.mediaAttachments.pictures && incident.mediaAttachments.pictures.length > 0 ? (
              <div className="space-y-3 bg-[#111315] p-4 rounded-xl border border-[#3A3F42]">
                <div className="text-blue-400 font-bold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>Attached Photos ({incident.mediaAttachments.pictures.length})</span>
                  </span>
                  <span className="text-[10px] text-[#A9AAA5]">Click to enlarge</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {incident.mediaAttachments.pictures.map((pic, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedPhoto(pic)}
                      className="group relative cursor-pointer overflow-hidden rounded-lg border border-[#3A3F42]"
                    >
                      <img src={pic} alt={`Evidence photo ${i}`} className="w-full h-32 object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#111315] p-4 rounded-xl border border-[#3A3F42] text-xs text-[#A9AAA5] text-center flex flex-col justify-center items-center gap-1">
                <Camera className="w-6 h-6 text-slate-600" />
                <span>No Photos Attached</span>
              </div>
            )}

            {/* Video Player */}
            {incident.mediaAttachments.videoUrl ? (
              <div className="space-y-3 bg-[#111315] p-4 rounded-xl border border-[#3A3F42]">
                <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
                  <Video className="w-4 h-4" />
                  <span>Recorded Citizen Video Clip</span>
                </div>
                <video 
                  src={incident.mediaAttachments.videoUrl} 
                  controls 
                  className="w-full h-40 rounded-lg bg-black object-contain border border-[#3A3F42]" 
                />
              </div>
            ) : (
              <div className="bg-[#111315] p-4 rounded-xl border border-[#3A3F42] text-xs text-[#A9AAA5] text-center flex flex-col justify-center items-center gap-1">
                <Video className="w-6 h-6 text-slate-600" />
                <span>No Video Clip Attached</span>
              </div>
            )}

            {/* Audio Dispatch Player */}
            {incident.mediaAttachments.audioUrl ? (
              <div className="space-y-3 bg-[#111315] p-4 rounded-xl border border-[#3A3F42]">
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <Mic className="w-4 h-4" />
                  <span>Citizen Emergency Voice Recording</span>
                </div>
                <div className="bg-[#191C1F] p-3 rounded-lg border border-[#3A3F42] space-y-2">
                  <audio src={incident.mediaAttachments.audioUrl} controls className="w-full h-10" />
                  <div className="text-[10px] text-emerald-400 font-bold text-center">
                    🔊 Audio Player Active — Ready for Verification
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#111315] p-4 rounded-xl border border-[#3A3F42] text-xs text-[#A9AAA5] text-center flex flex-col justify-center items-center gap-1">
                <Mic className="w-6 h-6 text-slate-600" />
                <span>No Audio Voice Recording Attached</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#111315] p-6 rounded-xl border border-[#3A3F42] text-center text-[#A9AAA5] text-xs space-y-1">
            <ShieldAlert className="w-6 h-6 text-orange-400 mx-auto" />
            <div>This incident was logged via optical AI sensor stream without external citizen media files.</div>
          </div>
        )}
      </div>

      {/* Enlarge Photo Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
        >
          <img src={selectedPhoto} alt="Enlarged evidence" className="max-w-4xl max-h-[85vh] object-contain rounded-2xl border-2 border-amber-500 shadow-2xl" />
        </div>
      )}
    </div>
  );
}
