export type ResourceType = 'AMBULANCE' | 'FIRE_TRUCK' | 'POLICE';

export type ResourceStatus = 'AVAILABLE' | 'DISPATCHED' | 'BUSY' | 'UNAVAILABLE';

export type ResourceCapability = 
  | 'trauma' 
  | 'basicLifeSupport' 
  | 'advancedLifeSupport'
  | 'structuralFire' 
  | 'hazmat' 
  | 'rescue'
  | 'trafficControl' 
  | 'crowdControl' 
  | 'crimeResponse';

export interface EmergencyUnit {
  id: string;
  callsign: string;
  type: ResourceType;
  status: ResourceStatus;
  position3D: [number, number, number];
  position?: [number, number, number]; // Alias for 3D components
  targetPosition3D?: [number, number, number];
  targetPosition?: [number, number, number]; // Alias for 3D components
  latitude: number;
  longitude: number;
  capabilities: ResourceCapability[];
  currentIncidentId?: string;
  speedKmH: number;
  speed?: number;
  etaMinutes?: number;
  availableAtTimestamp: number;
  homeStation: string;
  unitHealth: number;
  driverName: string;
  assignedHospitalId?: string;
  aiReasoning?: {
    severityMatch: string;
    escalationFactor: string;
    traumaCapability: boolean;
    etaAdvantage: string;
    trafficCongestion: string;
  };
}
