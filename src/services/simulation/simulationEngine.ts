import { simulationClock } from './simulationClock';
import { trafficSimulation } from './trafficSimulation';
import { vehicleSimulation } from './vehicleSimulation';
import { hospitalSimulation } from './hospitalSimulation';
import { simulationLogger } from './simulationLogger';
import { createSimulationScenarios, ScenarioDefinition } from './simulationScenarios';
import { SimulationState, SimulationEventLog } from '../../types/simulation';

export class SimulationEngine {
  private scenarios: ScenarioDefinition[] = [];
  private activeScenario: ScenarioDefinition | null = null;
  private resolvedCount: number = 0;

  constructor() {
    this.scenarios = createSimulationScenarios();
  }

  public init() {
    trafficSimulation.initSectors();
    vehicleSimulation.initVehicles();
    hospitalSimulation.initHospitals();
    simulationLogger.clearLogs();
    this.resolvedCount = 0;
  }

  public startSimulation(onStateUpdate?: (state: SimulationState) => void) {
    simulationClock.start((elapsedSec) => {
      this.tickCycle(elapsedSec);
      if (onStateUpdate) onStateUpdate(this.getState());
    });

    simulationLogger.logEvent(
      simulationClock.getFormattedTime(),
      'SIMULATION_STARTED',
      'ENGINE',
      'Realistic smart city emergency simulation clock started.',
      'INFO'
    );
  }

  public pauseSimulation() {
    simulationClock.pause();
    simulationLogger.logEvent(
      simulationClock.getFormattedTime(),
      'SIMULATION_PAUSED',
      'ENGINE',
      'Simulation loop paused.',
      'WARNING'
    );
  }

  public resetSimulation() {
    simulationClock.reset();
    this.init();
    simulationLogger.logEvent(
      '20:00:00',
      'SIMULATION_RESET',
      'ENGINE',
      'Simulation state restored to initial conditions.',
      'INFO'
    );
  }

  public setSpeed(speed: number) {
    simulationClock.setSpeed(speed);
  }

  public stepOneTick() {
    simulationClock.stepTick();
    this.tickCycle(simulationClock.getElapsedSeconds());
  }

  public runScenario(scenarioId: string) {
    const sc = this.scenarios.find(s => s.id === scenarioId);
    if (!sc) return;

    this.resetSimulation();
    this.activeScenario = sc;
    this.startSimulation();

    simulationLogger.logEvent(
      simulationClock.getFormattedTime(),
      'SCENARIO_STARTED',
      sc.id,
      `Scenario started: ${sc.name} — ${sc.description}`,
      'INFO'
    );
  }

  private tickCycle(elapsedSec: number) {
    const timeStr = simulationClock.getFormattedTime();

    // 1. Traffic Update
    vehicleSimulation.tickVehicles('SEC-04');

    // 2. Scenario Timeline Step Checks
    if (this.activeScenario) {
      this.activeScenario.timelineSteps.forEach(step => {
        if (step.elapsedSec === elapsedSec) {
          step.action();
          simulationLogger.logEvent(timeStr, 'SCENARIO_STEP', this.activeScenario?.id || 'SCENARIO', `${step.title}: ${step.description}`, 'INFO');
        }
      });
    }

    // 3. Periodic Log Entry every 15 seconds
    if (elapsedSec > 0 && elapsedSec % 15 === 0) {
      simulationLogger.logEvent(
        timeStr,
        'SIMULATION_TICK',
        'CITY_GRID',
        `City grid telemetry update — 2 emergency units active, average ETA 3.6m.`,
        'INFO'
      );
    }
  }

  public getState(): SimulationState {
    return {
      isTickRunning: simulationClock.getIsRunning(),
      simSpeedMultiplier: simulationClock.getSpeed(),
      simElapsedSeconds: simulationClock.getElapsedSeconds(),
      simFormattedTime: simulationClock.getFormattedTime(),
      activeScenarioId: this.activeScenario?.id || null,
      vehicles: vehicleSimulation.getAllVehicles(),
      trafficSectors: trafficSimulation.getAllSectors(),
      hospitals: hospitalSimulation.getAllHospitals(),
      eventLogs: simulationLogger.getLogs(),
      resolvedIncidentsCount: this.resolvedCount
    };
  }

  public getScenarios(): ScenarioDefinition[] {
    return this.scenarios;
  }
}

export const simulationEngine = new SimulationEngine();
