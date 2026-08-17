import { SimulatedVehicle } from '../../types/simulation';
import { trafficSimulation } from './trafficSimulation';

export class VehicleSimulationEngine {
  private vehicles: Map<string, SimulatedVehicle> = new Map();

  constructor() {
    this.initVehicles();
  }

  public initVehicles() {
    const initial: SimulatedVehicle[] = [
      {
        id: 'A17',
        callsign: 'AMBULANCE A17',
        type: 'AMBULANCE',
        status: 'DISPATCHED',
        position: [-5, 0.5, -2],
        destination: [-18, 0.5, -12],
        routeNodes: [[-10, 0.5, -6], [-14, 0.5, -9], [-18, 0.5, -12]],
        currentSpeedKmH: 68,
        maxSpeedKmH: 80,
        trafficMultiplier: 0.85,
        etaMinutes: 3.8,
        assignedIncidentId: 'INC-1042',
        capabilities: ['trauma', 'advancedLifeSupport'],
        driverName: 'Officer Miller',
        homeStation: 'North Central Station'
      },
      {
        id: 'F01',
        callsign: 'FIRE TRUCK F01',
        type: 'FIRE_TRUCK',
        status: 'DISPATCHED',
        position: [10, 0.5, 25],
        destination: [24, 0.5, 16],
        routeNodes: [[15, 0.5, 22], [20, 0.5, 18], [24, 0.5, 16]],
        currentSpeedKmH: 55,
        maxSpeedKmH: 65,
        trafficMultiplier: 0.90,
        etaMinutes: 3.4,
        assignedIncidentId: 'INC-1051',
        capabilities: ['structuralFire', 'rescue', 'hazmat'],
        driverName: 'Captain Rodriguez',
        homeStation: 'Sector 4 Station'
      }
    ];

    initial.forEach(v => this.vehicles.set(v.id, v));
  }

  public tickVehicles(sectorId: string = 'SEC-04') {
    const trafficMult = trafficSimulation.getSectorSpeedMultiplier(sectorId);

    this.vehicles.forEach(v => {
      if (v.status === 'DISPATCHED' && v.destination && v.routeNodes.length > 0) {
        // Calculate speed based on traffic
        v.trafficMultiplier = trafficMult;
        v.currentSpeedKmH = Math.round(v.maxSpeedKmH * trafficMult);

        // Move vehicle incrementally towards next route node
        const targetNode = v.routeNodes[0];
        const dx = targetNode[0] - v.position[0];
        const dz = targetNode[2] - v.position[2];
        const distSq = dx * dx + dz * dz;

        if (distSq < 0.5) {
          // Node reached, shift to next node
          v.routeNodes.shift();
          if (v.routeNodes.length === 0) {
            // Arrived on scene
            v.status = 'ON_SCENE';
            v.timeOnSceneSeconds = 0;
            v.etaMinutes = 0;
          }
        } else {
          // Move towards target node
          const dist = Math.sqrt(distSq);
          const stepSize = Math.max(0.2, (v.currentSpeedKmH / 3600) * 12);
          v.position = [
            v.position[0] + (dx / dist) * stepSize,
            v.position[1],
            v.position[2] + (dz / dist) * stepSize
          ];

          // Recalculate ETA
          const remainingDistKm = (v.routeNodes.length * 2.0);
          v.etaMinutes = Number((remainingDistKm / Math.max(10, v.currentSpeedKmH) * 60).toFixed(1));
        }
      } else if (v.status === 'ON_SCENE') {
        v.timeOnSceneSeconds = (v.timeOnSceneSeconds || 0) + 1;
        if (v.timeOnSceneSeconds > 15) {
          // Response complete, vehicle returns to available
          v.status = 'AVAILABLE';
          v.assignedIncidentId = undefined;
          v.destination = undefined;
        }
      }
    });
  }

  public getVehicle(id: string): SimulatedVehicle | undefined {
    return this.vehicles.get(id);
  }

  public getAllVehicles(): SimulatedVehicle[] {
    return Array.from(this.vehicles.values());
  }
}

export const vehicleSimulation = new VehicleSimulationEngine();
