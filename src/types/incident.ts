export type NormalizedIncidentType = 
  | 'ACCIDENT' 
  | 'FIRE' 
  | 'FLOOD' 
  | 'MEDICAL' 
  | 'CRIME' 
  | 'INFRASTRUCTURE' 
  | 'OTHER';

export type NormalizedSeverity = 'P1' | 'P2' | 'P3' | 'P4';

export type EventSourceType = 'CITIZEN_REPORT' | 'CCTV_STREAM' | 'IOT_SENSOR' | 'SOCIAL_MEDIA';

export interface EvidenceItem {
  id: string;
  source: EventSourceType;
  title: string;
  confidence: number;
  timestamp: string;
  details?: string;
}

export interface ScoreBreakdownItem {
  factor: string;
  points: number;
}

export interface AIReasoningDetails {
  classificationReasoning: string;
  severityReasoning: string[];
  escalationReasoning: string;
  correlationReasoning: string;
}

export interface NormalizedIncident {
  id: string;
  timestamp: number;
  formattedTimeAgo: string;
  source: EventSourceType;
  rawText: string;
  type: NormalizedIncidentType;
  severity: NormalizedSeverity;
  severityScore: number; // 0 - 100
  severityBreakdown: ScoreBreakdownItem[];
  confidence: number; // 0 - 100%
  locationText: string;
  latitude: number;
  longitude: number;
  position3D: [number, number, number];
  locationConfidence: number;
  isLocationUncertain: boolean;
  peopleAtRisk: number;
  affectedAreaSqMeters: number;
  escalationRisk: number; // 0 - 100%
  predictedSeverity: NormalizedSeverity;
  priorityScore: number; // 0 - 100
  priorityRank: number; // #1, #2, ...
  status: 'ACTIVE' | 'DISPATCHED' | 'CONTAINED' | 'RESOLVED';
  requiredServices: ('AMBULANCE' | 'POLICE' | 'FIRE')[];
  assignedResourceId?: string;
  evidence: EvidenceItem[];
  aiReasoning: AIReasoningDetails;
}

export interface RawEventInput {
  source: EventSourceType;
  rawText: string;
  reporterLocation?: string;
  timestamp?: number;
  coordinates?: [number, number, number];
}

export interface IntelligencePipelineStage {
  stage: 
    | 'RAW INPUT INGESTION'
    | 'INPUT NORMALIZATION'
    | 'INCIDENT TYPE CLASSIFICATION'
    | 'LOCATION EXTRACTION'
    | 'SEVERITY ASSESSMENT'
    | 'MULTI-SOURCE EVIDENCE CORRELATION'
    | 'ESCALATION RISK PREDICTION'
    | 'PRIORITY RANKING'
    | 'STRUCTURED INCIDENT CREATION'
    | '3D CANVAS SYNCHRONIZATION';
  progress: number;
  log: string;
}
