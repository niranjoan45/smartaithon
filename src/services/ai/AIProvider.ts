import { 
  NormalizedIncidentType, 
  NormalizedSeverity, 
  ScoreBreakdownItem 
} from '../../types/incident';

export interface AIClassificationResult {
  type: NormalizedIncidentType;
  confidence: number;
  reasoning: string;
}

export interface AILocationResult {
  locationText: string;
  position3D: [number, number, number];
  confidence: number;
  isUncertain: boolean;
}

export interface AISeverityResult {
  severity: NormalizedSeverity;
  severityScore: number;
  breakdown: ScoreBreakdownItem[];
  reasons: string[];
}

export interface AIExtractionResult {
  peopleAtRisk: number;
  affectedAreaSqMeters: number;
}

export interface AIProvider {
  modeName: 'SIMULATION' | 'LIVE';
  classifyIncident(rawText: string): Promise<AIClassificationResult>;
  extractLocation(rawText: string, reporterLocation?: string): Promise<AILocationResult>;
  assessSeverity(type: NormalizedIncidentType, rawText: string, evidenceCount: number, peopleAtRisk: number): Promise<AISeverityResult>;
  analyzeEvidenceDetails(rawText: string): Promise<AIExtractionResult>;
}
