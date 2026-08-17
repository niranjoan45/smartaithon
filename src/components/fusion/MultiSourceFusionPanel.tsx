import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, RotateCcw, ShieldCheck, Flame, Camera, Cpu, Share2, UserCheck, AlertTriangle } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';
import { getMajorFireDemoScenario } from '../../services/fusion/fusionOrchestrator';

export function MultiSourceFusionPanel() {
  const { 
    isFusionPanelOpen, 
    setFusionPanelOpen,
    streamStatus,
    setStreamStatus,
    ingestSourceEvent,
    latestSourceEvent,
    lastCorrelationBreakdown,
    sourceMetrics
  } = useCityStore();

  const [stepIndex, setStepIndex] = useState(0);
  const scenarioSteps = getMajorFireDemoScenario();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (streamStatus === 'PLAYING') {
      if (stepIndex < scenarioSteps.length) {
        const currentStep = scenarioSteps[stepIndex];
        timer = setTimeout(() => {
          ingestSourceEvent(currentStep.event);
          setStepIndex(prev => prev + 1);
        }, currentStep.delayMs);
      } else {
        setStreamStatus('PAUSED');
      }
    }
    return () => clearTimeout(timer);
  }, [streamStatus, stepIndex]);

  if (!isFusionPanelOpen) return null;

  const handleStart = () => {
    if (stepIndex >= scenarioSteps.length) {
      setStepIndex(0);
    }
    setStreamStatus('PLAYING');
  };

  const handlePause = () => {
    setStreamStatus('PAUSED');
  };

  const handleReset = () => {
    setStreamStatus('PAUSED');
    setStepIndex(0);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'CITIZEN': return <UserCheck className="w-3.5 h-3.5 text-white" />;
      case 'CCTV': return <Camera className="w-3.5 h-3.5 text-amber-400" />;
      case 'IOT': return <Cpu className="w-3.5 h-3.5 text-red-400" />;
      case 'SOCIAL': return <Share2 className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Radio className="w-3.5 h-3.5 text-white" />;
    }
  };

  return (
    <div className="fixed left-20 top-24 z-50 w-96 pointer-events-auto animate-fade-in max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
      <div className="glass-panel-glow p-5 rounded-2xl border border-amber-500/40 shadow-2xl flex flex-col gap-4">
        {/* Header & Controls */}
        <div className="flex items-center justify-between border-b border-[#3A3F42] pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h3 className="font-orbitron font-bold text-xs text-[#FFFFFF]">
                MULTI-SOURCE FUSION STREAM
              </h3>
              <div className="text-[9px] font-mono text-[#A9AAA5]">CORROBORATION ENGINE [AI MODE: SIMULATION]</div>
            </div>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs">
            {streamStatus === 'PLAYING' ? (
              <button onClick={handlePause} className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30">
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleStart} className="p-1.5 rounded-lg bg-[#282C2F] text-white border border-[#3A3F42] hover:bg-[#3A3F42]">
                <Play className="w-4 h-4" />
              </button>
            )}
            <button onClick={handleReset} className="p-1.5 rounded-lg bg-[#202427] text-[#A9AAA5] hover:bg-[#282C2F]">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Demo Scenario Timeline Banner */}
        <div className="bg-[#191C1F]/90 p-3 rounded-xl border border-[#3A3F42] font-mono text-xs space-y-1.5">
          <div className="flex justify-between text-[10px] text-amber-400 font-bold">
            <span>KILLER DEMO SCENARIO</span>
            <span>STEP {stepIndex}/{scenarioSteps.length}</span>
          </div>
          <div className="text-xs text-[#FFFFFF] font-bold">
            MAJOR FIRE — MULTI-SOURCE CORROBORATION
          </div>
          <div className="w-full h-1.5 bg-[#111315] rounded-full overflow-hidden border border-[#3A3F42]">
            <div 
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${(stepIndex / scenarioSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Latest Incoming Signal Stream */}
        {latestSourceEvent && (
          <div className="bg-[#111315]/90 p-3 rounded-xl border border-[#3A3F42] font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] border-b border-[#3A3F42] pb-1">
              <div className="flex items-center gap-1.5 font-bold text-[#FFFFFF]">
                {getSourceIcon(latestSourceEvent.sourceType)}
                <span>{latestSourceEvent.sourceType} SIGNAL</span>
              </div>
              <span className="text-[#A9AAA5]">{latestSourceEvent.formattedTime}</span>
            </div>
            <div className="text-xs text-[#E7E5DF]">{latestSourceEvent.rawText}</div>
            <div className="text-[9px] text-amber-400">
              Location: {latestSourceEvent.locationText} (Confidence {Math.round(latestSourceEvent.confidence * 100)}%)
            </div>
          </div>
        )}

        {/* Correlation Engine Scores */}
        <div className="bg-[#191C1F] p-3.5 rounded-xl border border-amber-500/30 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#3A3F42] pb-1 text-amber-400 font-bold">
            <span>REAL-TIME CORRELATION MATCH</span>
            <ShieldCheck className="w-4 h-4 text-green-400" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className="bg-[#111315] p-1.5 rounded-lg border border-[#3A3F42]">
              <div className="text-[8px] text-[#A9AAA5]">SPATIAL MATCH</div>
              <div className="text-xs font-bold text-white">
                {Math.round((lastCorrelationBreakdown?.spatialScore || 0.94) * 100)}%
              </div>
            </div>
            <div className="bg-[#111315] p-1.5 rounded-lg border border-[#3A3F42]">
              <div className="text-[8px] text-[#A9AAA5]">TEMPORAL MATCH</div>
              <div className="text-xs font-bold text-amber-300">
                {Math.round((lastCorrelationBreakdown?.temporalScore || 0.97) * 100)}%
              </div>
            </div>
            <div className="bg-[#111315] p-1.5 rounded-lg border border-[#3A3F42]">
              <div className="text-[8px] text-[#A9AAA5]">SEMANTIC MATCH</div>
              <div className="text-xs font-bold text-green-400">
                {Math.round((lastCorrelationBreakdown?.semanticScore || 0.89) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Source Level Analytics Summary */}
        <div className="grid grid-cols-2 gap-2 text-center font-mono text-[10px]">
          <div className="bg-[#191C1F] p-2 rounded-xl border border-[#3A3F42]">
            <div className="text-[8px] text-[#A9AAA5]">SOURCES INGESTED</div>
            <div className="text-xs font-bold text-white">{sourceMetrics.totalSourceEvents} Signals</div>
          </div>
          <div className="bg-[#191C1F] p-2 rounded-xl border border-[#3A3F42]">
            <div className="text-[8px] text-[#A9AAA5]">DUPLICATES MERGED</div>
            <div className="text-xs font-bold text-green-400">{sourceMetrics.duplicateReportsMergedCount} Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
}
