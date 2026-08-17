import { SimulatedHospitalState } from '../../types/simulation';

export class HospitalSimulationEngine {
  private hospitals: Map<string, SimulatedHospitalState> = new Map();

  constructor() {
    this.initHospitals();
  }

  public initHospitals() {
    const initial: SimulatedHospitalState[] = [
      { id: 'HOSP-01', name: 'City General Trauma Center', availableBeds: 18, traumaCapacity: 95, occupancyRatePercent: 72, reservedBeds: 2 },
      { id: 'HOSP-02', name: 'Westside Medical Hub', availableBeds: 12, traumaCapacity: 80, occupancyRatePercent: 80, reservedBeds: 1 }
    ];
    initial.forEach(h => this.hospitals.set(h.id, h));
  }

  public reserveBeds(hospitalId: string, count: number): boolean {
    const hosp = this.hospitals.get(hospitalId);
    if (!hosp) return false;

    if (hosp.availableBeds >= count) {
      hosp.availableBeds -= count;
      hosp.reservedBeds += count;
      hosp.occupancyRatePercent = Math.min(100, hosp.occupancyRatePercent + Math.round(count * 2));
      return true;
    }
    return false;
  }

  public getBestHospitalForTrauma(): SimulatedHospitalState {
    const sorted = Array.from(this.hospitals.values()).sort((a, b) => b.availableBeds - a.availableBeds);
    return sorted[0];
  }

  public getAllHospitals(): SimulatedHospitalState[] {
    return Array.from(this.hospitals.values());
  }
}

export const hospitalSimulation = new HospitalSimulationEngine();
