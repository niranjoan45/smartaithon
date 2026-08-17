import React, { useState, useEffect } from 'react';
import { useCityStore } from '../stores/useCityStore';
import { Sliders, Play, Pause, RotateCcw, Zap, FastForward, Activity, ShieldAlert } from 'lucide-react';
import { simulationEngine } from '../services/simulation/simulationEngine';
import { SimulationState } from '../types/simulation';

export function SimulationPage() {
  const { normalizedIncidents, resources } = useCityStore();
  const [simState, setSimState] = useState<SimulationState>(simulationEngine.getState());

  useEffect(() => {
    simulationEngine.init();
    setSimState(simulationEngine.getState());
  }, []);

  const handleToggleStartPause = () => {
    if (simState.isTickRunning) {
      simulationEngine.pauseSimulation();
    } else {
      simulationEngine.startSimulation((newState) => {
        setSimState(newState);
      });
    }
    setSimState(simulationEngine.getState());
  };

  const handleReset = () => {
    simulationEngine.resetSimulation();
    setSimState(simulationEngine.getState());
  };

  const handleStepTick = () => {
    simulationEngine.stepOneTick();
    setSimState(simulationEngine.getState());
  };

  const handleSetSpeed = (speed: number) => {
    simulationEngine.setSpeed(speed);
    setSimState(simulationEngine.getState());
  };

  const handleRunScenario = (scenarioId: string) => {
    simulationEngine.runScenario(scenarioId);
    setSimState(simulationEngine.getState());
  };

  const scenarios = simulationEngine.getScenarios();

  return (
    <div className="w-full h-full flex flex-col bg-black p-6 gap-5 font-mono text-xs overflow-y-auto select-none text-white">
      {/* Header Banner */}
      <div className="border-b border-orange-500/50 pb-4 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-orbitron font-bold text-lg text-white">
              SIMULATION LABORATORY
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold badge-warning">
              SIMULATION / SYNTHETIC DATA — NOT A REAL-WORLD FORECAST
            </span>
          </div>
          <p className="text-[11px] text-orange-300 mt-0.5">Deterministic Emergency Traffic & Resource Computation Loop</p>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5 glass-orange-card p-1.5 rounded-lg border border-orange-500/50">
          <span className="text-[10px] text-orange-200 font-bold px-2">SPEED:</span>
          {[0.5, 1, 2, 5, 10].map(speed => (
            <button
              key={speed}
              onClick={() => handleSetSpeed(speed)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                simState.simSpeedMultiplier === speed
                  ? 'bg-orange-500 text-black font-bold shadow-md'
                  : 'text-white hover:text-amber-300'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Primary Simulation Clock & Controls */}
      <div className="glass-orange-panel p-5 rounded-2xl border border-orange-500/70 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 bg-black/60 rounded-xl border border-orange-500/40">
            <div className="text-[9px] text-orange-200 font-bold">SIMULATION CLOCK</div>
            <div className="text-xl font-bold text-amber-400">{simState.simFormattedTime}</div>
          </div>
          <div className="text-center px-4 py-2 bg-black/60 rounded-xl border border-orange-500/40">
            <div className="text-[9px] text-orange-200 font-bold">ELAPSED SECONDS</div>
            <div className="text-xl font-bold text-white">{simState.simElapsedSeconds}s</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStartPause}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${
              simState.isTickRunning
                ? 'bg-red-600 text-white hover:bg-red-500'
                : 'bg-green-600 text-white hover:bg-green-500'
            }`}
          >
            {simState.isTickRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{simState.isTickRunning ? 'PAUSE SIMULATION' : 'START SIMULATION'}</span>
          </button>

          <button
            onClick={handleStepTick}
            className="px-3 py-2.5 rounded-xl bg-orange-500 text-black hover:bg-orange-400 font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <FastForward className="w-4 h-4 text-black" />
            <span>STEP +1 TICK</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/30"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector Grid */}
      <div className="space-y-2">
        <div className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">
          DETERMINISTIC PRESENTATION SCENARIOS
        </div>
        <div className="grid grid-cols-3 gap-3">
          {scenarios.map(sc => (
            <div key={sc.id} className="glass-orange-card p-4 rounded-xl border border-orange-500/60 hover:border-orange-400 transition-all space-y-2">
              <div className="font-bold text-amber-400 text-xs">{sc.name}</div>
              <p className="text-[10px] text-white/90 leading-relaxed min-h-[32px]">{sc.description}</p>
              <button
                onClick={() => handleRunScenario(sc.id)}
                className="w-full py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>LOAD & RUN SCENARIO</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Real Simulation Event Timeline Log */}
      <div className="glass-white-panel p-5 rounded-2xl border border-white/30 space-y-3">
        <div className="font-bold text-white border-b border-white/20 pb-2 flex justify-between items-center">
          <span>SIMULATION EVENT LOG TIMELINE</span>
          <span className="text-[10px] text-orange-300">Real Time-Step Event Generator</span>
        </div>

        <div className="overflow-x-auto max-h-64 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/20 text-[10px] text-orange-300 font-bold uppercase">
                <th className="py-2 px-3">SIM TIME</th>
                <th className="py-2 px-3">EVENT TYPE</th>
                <th className="py-2 px-3">ENTITY</th>
                <th className="py-2 px-3">DESCRIPTION</th>
                <th className="py-2 px-3">SEVERITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white">
              {(simState.eventLogs.length > 0 ? simState.eventLogs : [
                { id: '1', simTimestamp: '20:00:00', eventType: 'SIMULATION_INIT', entityId: 'SYSTEM', description: 'Deterministic city simulation engine initialized.', severity: 'INFO' as const }
              ]).map((log) => (
                <tr key={log.id} className="hover:bg-white/10">
                  <td className="py-2 px-3 font-bold text-amber-400">{log.simTimestamp}</td>
                  <td className="py-2 px-3 text-white/80">{log.eventType}</td>
                  <td className="py-2 px-3 font-bold">{log.entityId}</td>
                  <td className="py-2 px-3 text-white">{log.description}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      log.severity === 'CRITICAL' ? 'badge-critical' : log.severity === 'WARNING' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
