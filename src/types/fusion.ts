import { SourceEvent, SourceType } from './sourceEvent';
import { NormalizedIncident } from './incident';

export interface CorrelationResult {
  isMatch: boolean;
  correlationScore: number; // 0.0 - 1.0
  spatialScore: number;
  temporalScore: number;
  semanticScore: number;
  reasoning: string[];
  isConflict: boolean;
}

export interface FusedIncident extends NormalizedIncident {
  sourceEvents: SourceEvent[];
  correlatedReportsCount: number;
  fusionConfidence: number; // Bounded 0.0 - 1.0
  correlationBreakdown: {
    spatialScore: number;
    temporalScore: number;
    semanticScore: number;
  };
  hasConflict: boolean;
  conflictDetails?: string;
  sourceTypesPresent: SourceType[];
  auditTrail: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: string;
  details: string;
  confidenceAfter: number;
}

export interface FusionMetrics {
  totalSourceEvents: number;
  citizenReportsCount: number;
  cctvEventsCount: number;
  iotEventsCount: number;
  socialSignalsCount: number;
  correlatedEventsCount: number;
  duplicateReportsMergedCount: number;
  conflictingEventsCount: number;
  averageFusionConfidence: number;
}

export interface DemoStreamStep {
  timeOffsetSeconds: number;
  timeLabel: string;
  event: SourceEvent;
  expectedAction: string;
}
