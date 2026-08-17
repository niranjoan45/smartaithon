import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Cpu } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';
import { useIncidentIntelligence } from '../../hooks/useIncidentIntelligence';
import { EventSourceType } from '../../types/incident';

export function CitizenReportModal() {
  const { isReportModalOpen, setReportModalOpen } = useCityStore();
  const { isProcessing, currentStage, processIncomingEvent } = useIncidentIntelligence();

  const [title, setTitle] = useState('');
  const [source, setSource] = useState<EventSourceType>('CITIZEN_REPORT');
  const [locationName, setLocationName] = useState('North Highway Interchange, Km 14');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<any>(null);

  if (!isReportModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() && !title.trim()) return;

    const fullRawText = `${title}: ${description}`;

    await processIncomingEvent(
      {
        source,
        rawText: fullRawText,
        reporterLocation: locationName
      },
      (createdIncident, isCorrelated) => {
        setResult({
          incident: createdIncident,
          isCorrelated,
          message: isCorrelated 
            ? `Correlated with existing incident ${createdIncident.id}! Multi-source confidence boosted to ${createdIncident.confidence}%.`
            : `Structured incident ${createdIncident.id} generated and prioritized in 3D Smart City canvas.`
        });
      }
    );
  };

  const handleClose = () => {
    setResult(null);
    setTitle('');
    setDescription('');
    setReportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md pointer-events-auto p-4">
      <div className="glass-white-panel w-full max-w-lg p-6 rounded-2xl border border-orange-500/50 shadow-2xl relative text-slate-900 font-mono text-xs">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-4">
          <ShieldAlert className="w-6 h-6 text-orange-600 animate-pulse" />
          <div>
            <h2 className="font-orbitron font-bold text-base text-slate-900">
              INCIDENT INTELLIGENCE INGESTION
            </h2>
            <p className="text-xs font-mono text-slate-600">Multi-Source AI Pipeline Verification</p>
          </div>
        </div>

        {/* Animated Intelligence Pipeline Execution Banner */}
        {isProcessing && currentStage && (
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-300 text-center space-y-3 font-mono my-4">
            <div className="flex items-center justify-between text-xs text-orange-800">
              <span className="font-orbitron font-bold">{currentStage.stage}</span>
              <span className="font-bold">{currentStage.progress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
              <div 
                className="h-full bg-orange-500 transition-all duration-300" 
                style={{ width: `${currentStage.progress}%` }} 
              />
            </div>
            <div className="text-[11px] text-slate-700 italic truncate">{currentStage.log}</div>
          </div>
        )}

        {!isProcessing && !result && (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-orange-700 mb-1 font-bold">EVENT TITLE & SUMMARY</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Major multi-vehicle collision on highway"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-orange-700 mb-1 font-bold">SOURCE TYPE</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as EventSourceType)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="CITIZEN_REPORT">CITIZEN REPORT (911 SOS)</option>
                  <option value="CCTV_STREAM">CCTV OPTICAL STREAM</option>
                  <option value="IOT_SENSOR">IOT SENSOR ARRAY</option>
                  <option value="SOCIAL_MEDIA">SOCIAL MEDIA SIGNAL</option>
                </select>
              </div>

              <div>
                <label className="block text-orange-700 mb-1 font-bold">LOCATION / LANDMARK</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-orange-700 mb-1 font-bold">RAW REPORT TEXT</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible flames, victims trapped, smoke..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-600 text-white font-orbitron font-bold text-sm hover:bg-orange-500 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              RUN AI INTELLIGENCE PIPELINE
            </button>
          </form>
        )}

        {result && (
          <div className="text-center py-6 space-y-4 font-mono">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto animate-bounce" />
            <h3 className="font-orbitron font-bold text-lg text-green-700">
              {result.isCorrelated ? 'MULTI-SOURCE CORRELATION CONFIRMED' : 'STRUCTURED INCIDENT CREATED'}
            </h3>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
              <div>Incident ID: <strong className="text-slate-900">{result.incident.id}</strong></div>
              <div>Type: <strong className="text-orange-600">{result.incident.type}</strong></div>
              <div>Severity: <strong className="text-red-600">{result.incident.severity} (Score: {result.incident.severityScore})</strong></div>
              <div>Priority Rank: <strong className="text-amber-600 font-bold">#{result.incident.priorityRank}</strong></div>
              <div className="mt-1 text-slate-500 text-[10px] italic">{result.message}</div>
            </div>
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-xl bg-orange-600 text-white font-bold font-orbitron text-xs"
            >
              INSPECT IN COMMAND CENTER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
