import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  SlidersHorizontal,
  Bot,
  PlusCircle,
  Play,
  TrendingUp
} from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';
import { CameraViewMode } from '../../types/city';

export function TopHeader() {
  const { 
    cameraMode, 
    setCameraMode, 
    lowQualityMode, 
    setLowQualityMode,
    isCopilotOpen,
    setCopilotOpen,
    setReportModalOpen,
    isFusionPanelOpen,
    setFusionPanelOpen,
    isPredictivePanelOpen,
    setPredictivePanelOpen,
    isDbModalOpen,
    setDbModalOpen,
    dbConnectionStatus,
    triggerDemoScenario
  } = useCityStore();

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const cameraPresets: { id: CameraViewMode; label: string }[] = [
    { id: 'CITY_OVERVIEW', label: 'CITY OVERVIEW' },
    { id: 'INCIDENT_FOCUS', label: 'INCIDENT FOCUS' },
    { id: 'RESOURCE_FOCUS', label: 'RESOURCE FOCUS' },
    { id: 'DISPATCH_VIEW', label: 'DISPATCH VIEW' },
    { id: 'RISK_VIEW', label: 'RISK VIEW' },
    { id: 'COMMAND_VIEW', label: 'COMMAND VIEW' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-between items-start">
      {/* Left Title & Identity Branding */}
      <div className="pointer-events-auto flex items-center gap-3 glass-panel px-4 py-2.5 rounded-xl border border-cyan-500/30">
        <div className="relative flex items-center justify-center">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500 flex items-center justify-center text-cyan-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-bold text-base tracking-widest text-slate-100 hud-text-glow">
              AI CITY GUARDIAN
            </h1>
            {/* MANDATORY AI MODE BADGE */}
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              AI MODE: SIMULATION
            </span>
            {/* DATABASE STATUS BADGE */}
            <button
              onClick={() => setDbModalOpen(!isDbModalOpen)}
              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border transition-all flex items-center gap-1 ${
                dbConnectionStatus === 'CONNECTED'
                  ? 'bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${dbConnectionStatus === 'CONNECTED' ? 'bg-green-400' : 'bg-amber-400'}`} />
              <span>{dbConnectionStatus === 'CONNECTED' ? 'DATABASE CONNECTED' : 'DEMO SIMULATION'}</span>
            </button>
          </div>
          <p className="text-[10px] font-mono text-cyan-400/80 tracking-wider">
            INTELLIGENT EMERGENCY RESPONSE COMMAND CENTER
          </p>
        </div>
      </div>

      {/* Center Camera View Mode Preset Switcher */}
      <div className="pointer-events-auto hidden lg:flex items-center gap-1 glass-panel px-2 py-1.5 rounded-xl border border-slate-700/50 backdrop-blur-xl">
        {cameraPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setCameraMode(preset.id)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-all duration-200 ${
              cameraMode === preset.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Right Telemetry Controls & Clock */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Predictive Risk Panel Toggle */}
        <button
          onClick={() => setPredictivePanelOpen(!isPredictivePanelOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg border ${
            isPredictivePanelOpen
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-900/90 text-amber-300 border-amber-500/40 hover:bg-amber-950/60'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">PREDICTIVE RISK</span>
        </button>

        {/* Live Multi-Source Fusion Stream Toggle */}
        <button
          onClick={() => setFusionPanelOpen(!isFusionPanelOpen)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg border ${
            isFusionPanelOpen
              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
              : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:bg-cyan-950/60'
          }`}
        >
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">FUSION STREAM</span>
        </button>

        {/* Demo Scenario Trigger Button */}
        <button
          onClick={triggerDemoScenario}
          className="flex items-center gap-1.5 glass-panel px-3 py-2 rounded-xl text-xs font-mono font-bold text-amber-300 border border-amber-500/40 hover:bg-amber-950/40 hover:border-amber-400 transition-all shadow-lg active:scale-95"
        >
          <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="hidden xl:inline">RUN DEMO SCENARIO</span>
        </button>

        {/* Citizen Report Button */}
        <button
          onClick={() => setReportModalOpen(true)}
          className="flex items-center gap-1.5 glass-panel px-3 py-2 rounded-xl text-xs font-mono font-bold text-cyan-400 border border-cyan-500/40 hover:bg-cyan-950/40 hover:border-cyan-400 transition-all shadow-lg"
        >
          <PlusCircle className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">REPORT EMERGENCY</span>
        </button>

        {/* Guardian AI Copilot Toggle */}
        <button
          onClick={() => setCopilotOpen(!isCopilotOpen)}
          className={`flex items-center gap-1.5 glass-panel px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg ${
            isCopilotOpen
              ? 'bg-cyan-500 text-slate-950 border border-cyan-400 shadow-cyan-500/50'
              : 'text-cyan-300 border border-cyan-500/30 hover:border-cyan-400'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">GUARDIAN AI</span>
        </button>

        {/* Adaptive Quality / Performance Switcher */}
        <button
          onClick={() => setLowQualityMode(!lowQualityMode)}
          title="Toggle Adaptive Performance Mode"
          className={`p-2 rounded-xl glass-panel text-xs border transition-all ${
            lowQualityMode 
              ? 'border-amber-500 text-amber-400 bg-amber-950/40' 
              : 'border-slate-700 text-slate-400 hover:text-cyan-300'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Live System Clock */}
        <div className="glass-panel px-3 py-2 rounded-xl border border-slate-700/60 text-right font-mono">
          <div className="text-xs font-bold text-cyan-400">{timeStr}</div>
          <div className="text-[9px] text-slate-400 flex items-center gap-1 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE LINK
          </div>
        </div>
      </div>
    </header>
  );
}
