export type SeverityLevel = 'P1' | 'P2' | 'P3' | 'P4';

export type IncidentType = 
  | 'ROAD_ACCIDENT' 
  | 'FIRE_ESCALATION' 
  | 'MEDICAL_EMERGENCY' 
  | 'HAZMAT_LEAK' 
  | 'STRUCTURAL_COLLAPSE' 
  | 'POWER_GRID_FAILURE';

export type EvidenceSourceType = 'CITIZEN_REPORT' | 'CCTV_STREAM' | 'IOT_SENSOR' | 'SATELLITE' | 'DRONE_SCAN';

export interface EvidenceNode {
  id: string;
  type: EvidenceSourceType;
  label: string;
  confidence: number;
  timestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  severity: SeverityLevel;
  position: [number, number, number]; // [x, y, z] in 3D world
  locationName: string;
  confidence: number;
  peopleAtRisk: number;
  escalationRisk: number; // 0 - 100%
  requiredServices: ('AMBULANCE' | 'POLICE' | 'FIRE')[];
  assignedResourceId?: string;
  evidenceSources: EvidenceNode[];
  status: 'ACTIVE' | 'DISPATCHED' | 'CONTAINED' | 'RESOLVED';
  createdAt: number;
  timeAgo: string;
}

export type ResourceType = 'AMBULANCE' | 'POLICE' | 'FIRE';

export type ResourceStatus = 'AVAILABLE' | 'DISPATCHED' | 'BUSY' | 'CRITICAL';

export interface EmergencyResource {
  id: string;
  callsign: string; // e.g. "A17", "P04", "F09"
  type: ResourceType;
  status: ResourceStatus;
  position: [number, number, number];
  targetPosition?: [number, number, number];
  assignedIncidentId?: string;
  etaMinutes: number;
  speed: number;
  unitHealth: number; // 0 - 100
  driverName: string;
  hospitalDestination?: string;
  aiReasoning?: {
    severityMatch: string;
    escalationFactor: string;
    traumaCapability: boolean;
    etaAdvantage: string;
    trafficCongestion: string;
  };
}

export interface RiskZone {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  riskFactor: number; // 0 - 100%
  riskType: string;
  expectedIncidentsIncrease: number; // e.g. +34%
  recommendedAction: string;
}

export type CameraViewMode = 
  | 'CITY_OVERVIEW' 
  | 'INCIDENT_FOCUS' 
  | 'RESOURCE_FOCUS' 
  | 'DISPATCH_VIEW' 
  | 'RISK_VIEW' 
  | 'COMMAND_VIEW';

export interface SimulationMetrics {
  totalIncidents: number;
  criticalIncidents: number;
  totalResources: number;
  activeDispatches: number;
  avgEtaMinutes: number;
  riskZonesCount: number;
  optimizationImprovementMin: number;
  beforeEtaMinutes: number;
}
