import { SimulatedTrafficSector, TrafficLevel } from '../../types/simulation';

export class TrafficSimulationEngine {
  private sectors: Map<string, SimulatedTrafficSector> = new Map();

  constructor() {
    this.initSectors();
  }

  public initSectors() {
    const initial: SimulatedTrafficSector[] = [
      { sectorId: 'SEC-01', sectorName: 'Sector 1 Downtown Commercial', level: 'FREE_FLOW', speedMultiplier: 1.0, priorityCorridorActive: false },
      { sectorId: 'SEC-02', sectorName: 'Sector 2 North Highway Interchange', level: 'MODERATE', speedMultiplier: 0.80, priorityCorridorActive: false },
      { sectorId: 'SEC-03', sectorName: 'Sector 3 West Port Industrial Zone', level: 'FREE_FLOW', speedMultiplier: 1.0, priorityCorridorActive: false },
      { sectorId: 'SEC-04', sectorName: 'Sector 4 Innovation Tower Corridor', level: 'HEAVY', speedMultiplier: 0.60, priorityCorridorActive: false }
    ];

    initial.forEach(s => this.sectors.set(s.sectorId, s));
  }

  public setSectorTraffic(sectorId: string, level: TrafficLevel) {
    const sec = this.sectors.get(sectorId);
    if (!sec) return;

    let mult = 1.0;
    if (level === 'MODERATE') mult = 0.80;
    else if (level === 'HEAVY') mult = 0.60;
    else if (level === 'SEVERE') mult = 0.40;
    else if (level === 'BLOCKED') mult = 0.10;

    sec.level = level;
    sec.speedMultiplier = mult;
  }

  public activateEmergencyCorridor(sectorId: string, active: boolean = true) {
    const sec = this.sectors.get(sectorId);
    if (sec) {
      sec.priorityCorridorActive = active;
      if (active) {
        sec.speedMultiplier = Math.min(1.4, sec.speedMultiplier + 0.5);
      }
    }
  }

  public getSectorSpeedMultiplier(sectorId: string): number {
    return this.sectors.get(sectorId)?.speedMultiplier || 1.0;
  }

  public getAllSectors(): SimulatedTrafficSector[] {
    return Array.from(this.sectors.values());
  }
}

export const trafficSimulation = new TrafficSimulationEngine();
