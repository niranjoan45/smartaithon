import React from 'react';
import { useCityStore } from '../stores/useCityStore';
import { Radio, ShieldAlert, CheckCircle2, Play, Pause, RotateCcw } from 'lucide-react';
import { SourceEvent } from '../types/sourceEvent';

export function IntelligencePage() {
  const { 
    normalizedIncidents, 
    latestSourceEvent, 
    lastCorrelationBreakdown, 
    sourceMetrics,
    streamStatus,
    setStreamStatus,
    ingestSourceEvent
  } = useCityStore();

  const handleToggleStream = () => {
    if (streamStatus === 'PLAYING') {
      setStreamStatus('PAUSED');
    } else {
      setStreamStatus('PLAYING');
      const mockEvent: SourceEvent = {
        id: `SRC-${Date.now()}`,
        sourceType: 'IOT',
        timestamp: Date.now(),
        formattedTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        latitude: 19.082,
        longitude: 72.888,
        position3D: [24, 0.5, 16],
        locationText: 'Sector 4 Innovation Tower',
        rawText: 'Thermal detector node #04: Rapid heat spike detected (+48°C/min gradient).',
        confidence: 0.96,
        metadata: { sensorId: 'IOT-04', temperatureCelsius: 94 }
      };
      ingestSourceEvent(mockEvent);
    }
  };

  const handleResetStream = () => {
    setStreamStatus('IDLE');
  };

  return (
    <div className="w-full h-full flex flex-col bg-black p-6 gap-5 font-mono text-xs overflow-y-auto select-none text-white">
      {/* Header & Controls */}
      <div className="flex items-center justify-between border-b border-orange-500/50 pb-4">
        <div>
          <h1 className="font-orbitron font-bold text-lg text-white">
            MULTI-SOURCE INCIDENT FUSION ENGINE
          </h1>
          <p className="text-[11px] text-orange-300">Real-Time Corroboration Across Citizen, CCTV AI, IoT Sensors & Social Media</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStream}
            className={`flex items-center gap-1.5 px-4 py-2 rounded font-bold text-xs transition-all shadow-lg ${
              streamStatus === 'PLAYING'
                ? 'bg-amber-500 text-black hover:bg-amber-400'
                : 'bg-orange-500 text-black font-bold hover:bg-orange-400'
            }`}
          >
            {streamStatus === 'PLAYING' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{streamStatus === 'PLAYING' ? 'PAUSE STREAM' : 'START LIVE STREAM'}</span>
          </button>
          <button
            onClick={handleResetStream}
            className="p-2 rounded bg-white/10 border border-white/30 text-white hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="glass-orange-card p-4 rounded-xl border border-orange-500/60">
          <div className="text-[10px] text-orange-200">RAW SIGNALS INGESTED</div>
          <div className="text-xl font-bold text-white">{sourceMetrics.totalSourceEvents} Feeds</div>
        </div>
        <div className="glass-orange-card p-4 rounded-xl border border-orange-500/60">
          <div className="text-[10px] text-orange-200">CORRELATED SIGNALS</div>
          <div className="text-xl font-bold text-green-400">{sourceMetrics.correlatedEventsCount} Signals</div>
        </div>
        <div className="glass-orange-card p-4 rounded-xl border border-orange-500/60">
          <div className="text-[10px] text-orange-200">DUPLICATES MERGED</div>
          <div className="text-xl font-bold text-amber-400">{sourceMetrics.duplicateReportsMergedCount} Merged</div>
        </div>
        <div className="glass-orange-card p-4 rounded-xl border border-orange-500/60">
          <div className="text-[10px] text-orange-200">AVG FUSION CONFIDENCE</div>
          <div className="text-xl font-bold text-white">{(sourceMetrics.averageFusionConfidence * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* Correlation Diagram & Feeds Grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* Multi-Dimensional Correlation Diagram */}
        <div className="col-span-2 glass-white-panel p-5 rounded-2xl border border-white/30 space-y-4">
          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <span className="font-bold text-white">CORRELATION BREAKDOWN (SPATIAL • TEMPORAL • SEMANTIC)</span>
            <span className="text-orange-400 text-[10px] font-bold">Bounded Confidence Model</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-black/60 p-3 rounded-lg border border-orange-500/40">
              <div className="text-[9px] text-orange-200">SPATIAL DISTANCE MATCH</div>
              <div className="text-lg font-bold text-white">
                {((lastCorrelationBreakdown?.spatialScore || 0.94) * 100).toFixed(0)}% Match
              </div>
              <div className="text-[9px] text-white/80 mt-0.5">&lt; 250m Proximity</div>
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-orange-500/40">
              <div className="text-[9px] text-orange-200">TEMPORAL SIMILARITY</div>
              <div className="text-lg font-bold text-green-400">
                {((lastCorrelationBreakdown?.temporalScore || 0.97) * 100).toFixed(0)}% Match
              </div>
              <div className="text-[9px] text-white/80 mt-0.5">&lt; 2 min Window</div>
            </div>

            <div className="bg-black/60 p-3 rounded-lg border border-orange-500/40">
              <div className="text-[9px] text-orange-200">LOCAL SEMANTIC OVERLAP</div>
              <div className="text-lg font-bold text-amber-400">
                {((lastCorrelationBreakdown?.semanticScore || 0.89) * 100).toFixed(0)}% Overlap
              </div>
              <div className="text-[9px] text-white/80 mt-0.5">Fire / Smoke Overlap</div>
            </div>
          </div>
        </div>

        {/* Latest Signal Report STUNNING ORANGE GLASSMORPHISM */}
        {latestSourceEvent && (
          <div className="glass-orange-panel p-5 rounded-2xl border border-orange-500/70 space-y-3">
            <div className="font-bold text-white border-b border-orange-500/50 pb-2">
              LATEST INGESTED SIGNAL ({latestSourceEvent.sourceType})
            </div>
            <div className="bg-black/60 p-3.5 rounded-xl border border-orange-500/40 space-y-2 text-white">
              <div className="text-[10px] text-orange-200 flex justify-between">
                <span>{latestSourceEvent.formattedTime}</span>
                <span className="text-amber-400 font-bold">{(latestSourceEvent.confidence * 100).toFixed(0)}% Signal Confidence</span>
              </div>
              <div className="text-[11px] leading-relaxed">"{latestSourceEvent.rawText}"</div>
              <div className="text-[10px] text-orange-300 pt-1 border-t border-orange-500/30">
                Location: {latestSourceEvent.locationText}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
