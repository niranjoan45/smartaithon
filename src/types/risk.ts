export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface PredictedIncidentType {
  type: string;
  percentage: number; // 0 - 100
}

export interface RiskZone {
  id: string;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  position3D: [number, number, number];
  radius: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  predictedIncidentTypes: PredictedIncidentType[];
  predictionConfidence: number; // 0 - 100
  timeWindow: string; // e.g. "NEXT 60 MIN (20:00–21:00)"
  contributingFactors: string[];
  recommendedResources: string[];
  currentResources: string[];
  currentResponseTimeMin: number;
  projectedResponseTimeMin: number;
  estimatedTimeSavedMin: number;
  lastUpdated: string;
  historicalDensityCount: number;
  recentFusedIncidentsCount: number;
  isPrepositioned?: boolean;
}

export interface PredictiveMetrics {
  totalHighRiskZones: number;
  totalCriticalZones: number;
  topRiskZoneId: string;
  topRiskScore: number;
  topPredictedType: string;
  fireCoveragePercent: number;
  ambulanceCoveragePercent: number;
  policeCoveragePercent: number;
  avgTimeSavedMin: number;
}

export interface RiskHistoryEntry {
  timestamp: string;
  zoneId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  topPredictedType: string;
}
