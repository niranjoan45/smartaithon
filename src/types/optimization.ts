import { NormalizedIncident } from './incident';
import { EmergencyUnit } from './resource';
import { HospitalUnit } from './hospital';

export interface ResourceAssignment {
  id: string;
  incidentId: string;
  incidentTitle: string;
  resourceId: string;
  resourceCallsign: string;
  hospitalId?: string;
  hospitalName?: string;
  etaMinutes: number;
  distanceKm: number;
  trafficLevel: string;
  capabilityMatchScore: number;
  score: number; // 0 - 100
  reasoning: string[];
  explanation: string;
  routeCoordinates: [number, number, number][];
}

export interface ResourceShortage {
  incidentId: string;
  incidentTitle: string;
  severity: string;
  requiredType: string;
  reason: string;
  recommendedAction: string;
}

export interface OptimizationResult {
  runId: string;
  timestamp: number;
  formattedTime: string;
  assignments: ResourceAssignment[];
  unassignedIncidents: NormalizedIncident[];
  shortages: ResourceShortage[];
  totalETA: number;
  averageETA: number;
  criticalIncidentETA: number;
  resourcesUsed: number;
  resourceUtilizationPercent: number;
  conflictsResolved: number;
  optimizationScore: number;
  baselineETA: number;
  optimizedETA: number;
  timeSavedMinutes: number;
  improvementPercent: number;
  reasoning: string;
}

export interface OptimizationRunHistory {
  runId: string;
  timestamp: string;
  incidentsCount: number;
  resourcesCount: number;
  assignmentsCount: number;
  avgEta: number;
  improvementPercent: number;
}
