export type TrafficLevel = 'FREE_FLOW' | 'MODERATE' | 'HEAVY' | 'SEVERE' | 'BLOCKED';

export type IncidentSimulationStatus = 
  | 'DETECTED'
  | 'VERIFIED'
  | 'ACTIVE'
  | 'ESCALATING'
  | 'DISPATCHED'
  | 'RESPONDING'
  | 'ON_SCENE'
  | 'RESOLVED';

export interface SimulatedVehicle {
  id: string;
  callsign: string;
  type: 'AMBULANCE' | 'FIRE_TRUCK' | 'POLICE';
  status: 'AVAILABLE' | 'DISPATCHED' | 'ON_SCENE' | 'RETURNING';
  position: [number, number, number];
  destination?: [number, number, number];
  routeNodes: [number, number, number][];
  currentSpeedKmH: number;
  maxSpeedKmH: number;
  trafficMultiplier: number;
  etaMinutes: number;
  assignedIncidentId?: string;
  assignedHospitalId?: string;
  capabilities: string[];
  driverName: string;
  homeStation: string;
  timeOnSceneSeconds?: number;
}

export interface SimulatedTrafficSector {
  sectorId: string;
  sectorName: string;
  level: TrafficLevel;
  speedMultiplier: number; // 1.0 (FREE_FLOW) to 0.10 (BLOCKED)
  priorityCorridorActive: boolean;
}

export interface SimulatedHospitalState {
  id: string;
  name: string;
  availableBeds: number;
  traumaCapacity: number;
  occupancyRatePercent: number;
  reservedBeds: number;
}

export interface SimulationEventLog {
  id: string;
  simTimestamp: string;
  realTimestamp: string;
  eventType: string;
  entityId: string;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface SimulationState {
  isTickRunning: boolean;
  simSpeedMultiplier: number; // 0.5, 1, 2, 5, 10
  simElapsedSeconds: number;
  simFormattedTime: string;
  activeScenarioId: string | null;
  vehicles: SimulatedVehicle[];
  trafficSectors: SimulatedTrafficSector[];
  hospitals: SimulatedHospitalState[];
  eventLogs: SimulationEventLog[];
  resolvedIncidentsCount: number;
}
