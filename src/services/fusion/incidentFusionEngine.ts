import { SourceEvent, SourceType } from '../../types/sourceEvent';
import { FusedIncident, AuditEvent, FusionMetrics } from '../../types/fusion';
import { evaluateEventCorrelation } from './evidenceCorrelator';
import { SIMULATED_SOURCE_RELIABILITIES } from '../../types/evidence';
import { calculateSeverityScore } from '../incident/severityEngine';
import { calculateEscalationRisk } from '../incident/escalationEngine';
import { calculatePriorityScore } from '../incident/priorityEngine';
import { extractLocationFromText } from '../incident/locationExtractor';
import { LocalSimulationProvider } from '../ai/LocalSimulationProvider';
import { optimizationService } from '../optimization/optimizationService';
import { EmergencyUnit } from '../../types/resource';

export class IncidentFusionEngine {
  private aiProvider = new LocalSimulationProvider();

  /**
   * Calculates bounded confidence across multiple corroborating source events:
   * Confidence = 1 - Product(1 - EventConfidence * SourceReliability)
   */
  public calculateBoundedConfidence(
    events: SourceEvent[],
    hasConflict: boolean = false
  ): number {
    if (events.length === 0) return 0.50;

    let unreliabilityProduct = 1.0;
    events.forEach(evt => {
      const rel = SIMULATED_SOURCE_RELIABILITIES[evt.sourceType]?.baseReliability || 0.70;
      const effectiveConf = evt.confidence * rel;
      unreliabilityProduct *= (1.0 - effectiveConf);
    });

    let rawConf = 1.0 - unreliabilityProduct;

    // Apply conflict penalty if contradictory signals exist
    if (hasConflict) {
      rawConf -= 0.15;
    }

    // Clamp strictly to 0.00 - 0.98 (avoid 100% false claim)
    return Number(Math.min(0.98, Math.max(0.20, rawConf)).toFixed(2));
  }

  /**
   * Process incoming Source Event and fuse into single incident object
   */
  public async fuseSourceEvent(
    event: SourceEvent,
    existingIncidents: FusedIncident[],
    resources: EmergencyUnit[] = []
  ): Promise<{ 
    fusedIncidents: FusedIncident[]; 
    targetIncidentId: string; 
    isNewIncident: boolean;
    reoptimizationRecommended: boolean;
  }> {
    let matchedIncident: FusedIncident | null = null;
    let highestCorrScore = 0;
    let bestCorrelationBreakdown = { spatialScore: 0, temporalScore: 0, semanticScore: 0 };
    let eventConflictDetected = false;

    // Evaluate correlation against existing active incidents (keep Citizen reports as distinct incidents)
    if (event.sourceType !== 'CITIZEN') {
      for (const inc of existingIncidents) {
        const corr = evaluateEventCorrelation(event, inc);
        if (corr.isMatch && corr.correlationScore > highestCorrScore) {
          highestCorrScore = corr.correlationScore;
          matchedIncident = inc;
          bestCorrelationBreakdown = {
            spatialScore: corr.spatialScore,
            temporalScore: corr.temporalScore,
            semanticScore: corr.semanticScore
          };
          if (corr.isConflict) {
            eventConflictDetected = true;
          }
        }
      }
    }

    const timestampStr = new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false });
    let reoptimizationRecommended = false;

    if (matchedIncident) {
      // CORRELATE & FUSE INTO EXISTING INCIDENT
      const updatedEvents = [...matchedIncident.sourceEvents, event];
      const correlatedReportsCount = matchedIncident.correlatedReportsCount + 1;
      const hasConflict = matchedIncident.hasConflict || eventConflictDetected;

      const newConfidence = this.calculateBoundedConfidence(updatedEvents, hasConflict);
      const confidencePercent = Math.round(newConfidence * 100);

      // Recalculate Phase 2 Severity, Escalation & Priority
      const peopleAtRisk = Math.max(matchedIncident.peopleAtRisk, event.metadata.peopleAtRiskCount || 1);
      const fusedText = `${matchedIncident.rawText}. Corroborated ${event.sourceType} signal: ${event.rawText}`;

      const sevResult = calculateSeverityScore(matchedIncident.type, fusedText, peopleAtRisk, updatedEvents.length);
      const escResult = calculateEscalationRisk(matchedIncident.type, sevResult.severityScore, peopleAtRisk, updatedEvents.length);
      const priorityScore = calculatePriorityScore(sevResult.severityScore, escResult.escalationRisk, confidencePercent, peopleAtRisk);

      const oldSeverity = matchedIncident.severity;
      const newSeverity = sevResult.severity;

      if (oldSeverity !== 'P1' && newSeverity === 'P1') {
        reoptimizationRecommended = true;
      }

      const newAudit: AuditEvent = {
        id: `AUD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        timestamp: timestampStr,
        eventType: `${event.sourceType}_CORROBORATION`,
        details: `Correlated ${event.sourceType} event (${Math.round(highestCorrScore * 100)}% match). Confidence updated to ${confidencePercent}%.`,
        confidenceAfter: newConfidence
      };

      const sourceTypesPresent = Array.from(new Set([...matchedIncident.sourceTypesPresent, event.sourceType]));

      const fusedTarget: FusedIncident = {
        ...matchedIncident,
        rawText: fusedText,
        sourceEvents: updatedEvents,
        mediaAttachments: event.mediaAttachments || matchedIncident.mediaAttachments,
        gpsLocation: event.gpsLocation || matchedIncident.gpsLocation,
        correlatedReportsCount,
        confidence: confidencePercent,
        fusionConfidence: newConfidence,
        severity: newSeverity,
        severityScore: sevResult.severityScore,
        severityBreakdown: sevResult.breakdown,
        peopleAtRisk,
        escalationRisk: escResult.escalationRisk,
        priorityScore,
        correlationBreakdown: bestCorrelationBreakdown,
        hasConflict,
        conflictDetails: hasConflict ? 'Contradictory optical vs thermal telemetry signals.' : undefined,
        sourceTypesPresent,
        auditTrail: [newAudit, ...matchedIncident.auditTrail]
      };

      const updatedList = existingIncidents.map(i => i.id === fusedTarget.id ? fusedTarget : i);

      if (reoptimizationRecommended && resources.length > 0) {
        optimizationService.executeOptimization(updatedList, resources);
      }

      return {
        fusedIncidents: updatedList,
        targetIncidentId: fusedTarget.id,
        isNewIncident: false,
        reoptimizationRecommended
      };
    } else {
      // CREATE NEW FUSED INCIDENT
      const cls = await this.aiProvider.classifyIncident(event.rawText);
      const loc = extractLocationFromText(event.rawText);
      const peopleAtRisk = event.metadata.peopleAtRiskCount || 1;

      const sevResult = calculateSeverityScore(cls.type, event.rawText, peopleAtRisk, 1);
      const escResult = calculateEscalationRisk(cls.type, sevResult.severityScore, peopleAtRisk, 1);
      const initialConfidence = this.calculateBoundedConfidence([event], event.metadata.isConflict || false);
      const confidencePercent = Math.round(initialConfidence * 100);
      const priorityScore = calculatePriorityScore(sevResult.severityScore, escResult.escalationRisk, confidencePercent, peopleAtRisk);

      const audit: AuditEvent = {
        id: `AUD-${Date.now()}`,
        timestamp: timestampStr,
        eventType: 'INCIDENT_CREATED',
        details: `Fused incident created from initial ${event.sourceType} signal. Initial confidence ${confidencePercent}%.`,
        confidenceAfter: initialConfidence
      };

      const newId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;

      const newFused: FusedIncident = {
        id: newId,
        timestamp: event.timestamp,
        formattedTimeAgo: 'Just now',
        source: (event.sourceType === 'CITIZEN' ? 'CITIZEN_REPORT' : event.sourceType === 'CCTV' ? 'CCTV_STREAM' : event.sourceType === 'IOT' ? 'IOT_SENSOR' : 'SOCIAL_SIGNAL') as any,
        rawText: event.rawText,
        type: cls.type,
        severity: sevResult.severity,
        severityScore: sevResult.severityScore,
        severityBreakdown: sevResult.breakdown,
        confidence: confidencePercent,
        fusionConfidence: initialConfidence,
        locationText: loc.locationText,
        latitude: event.latitude,
        longitude: event.longitude,
        position3D: event.position3D,
        locationConfidence: loc.confidence,
        isLocationUncertain: loc.isUncertain,
        peopleAtRisk,
        affectedAreaSqMeters: peopleAtRisk * 120,
        escalationRisk: escResult.escalationRisk,
        predictedSeverity: escResult.predictedSeverity,
        priorityScore,
        priorityRank: existingIncidents.length + 1,
        status: 'ACTIVE',
        requiredServices: (cls.type === 'ACCIDENT' || cls.type === 'MEDICAL') ? ['AMBULANCE', 'POLICE'] : cls.type === 'FIRE' ? ['FIRE', 'AMBULANCE'] : ['AMBULANCE'],
        assignedResourceId: (cls.type === 'ACCIDENT' || cls.type === 'MEDICAL') ? 'A17' : cls.type === 'FIRE' ? 'F01' : 'P09',
        evidence: [{ id: `E-${Date.now()}`, source: (event.sourceType === 'CITIZEN' ? 'CITIZEN_REPORT' : event.sourceType === 'CCTV' ? 'CCTV_STREAM' : event.sourceType === 'IOT' ? 'IOT_SENSOR' : 'SOCIAL_SIGNAL') as any, title: `${event.sourceType} Signal`, confidence: confidencePercent, timestamp: timestampStr }],
        mediaAttachments: event.mediaAttachments,
        gpsLocation: event.gpsLocation,
        sourceEvents: [event],
        correlatedReportsCount: 1,
        correlationBreakdown: { spatialScore: 1.0, temporalScore: 1.0, semanticScore: 1.0 },
        hasConflict: event.metadata.isConflict || false,
        sourceTypesPresent: [event.sourceType],
        auditTrail: [audit],
        aiReasoning: {
          classificationReasoning: `Classified as ${cls.type} from ${event.sourceType} signal.`,
          severityReasoning: sevResult.reasons,
          escalationReasoning: `Predicted escalation risk ${escResult.escalationRisk}%.`,
          correlationReasoning: `Initial single-source ${event.sourceType} signal ingestion.`
        }
      };

      const updatedList = [newFused, ...existingIncidents];

      if (newFused.severity === 'P1') {
        reoptimizationRecommended = true;
        if (resources.length > 0) {
          optimizationService.executeOptimization(updatedList, resources);
        }
      }

      return {
        fusedIncidents: updatedList,
        targetIncidentId: newFused.id,
        isNewIncident: true,
        reoptimizationRecommended
      };
    }
  }

  /**
   * Calculate live source metrics across active state
   */
  public computeSourceMetrics(incidents: FusedIncident[]): FusionMetrics {
    let totalEvents = 0;
    let citizenCount = 0;
    let cctvCount = 0;
    let iotCount = 0;
    let socialCount = 0;
    let duplicateMergedCount = 0;
    let conflictingCount = 0;
    let totalConfidenceSum = 0;

    incidents.forEach(inc => {
      totalConfidenceSum += inc.fusionConfidence || (inc.confidence / 100);
      if (inc.hasConflict) conflictingCount++;
      if (inc.correlatedReportsCount > 1) {
        duplicateMergedCount += (inc.correlatedReportsCount - 1);
      }

      inc.sourceEvents?.forEach(evt => {
        totalEvents++;
        if (evt.sourceType === 'CITIZEN') citizenCount++;
        if (evt.sourceType === 'CCTV') cctvCount++;
        if (evt.sourceType === 'IOT') iotCount++;
        if (evt.sourceType === 'SOCIAL') socialCount++;
      });
    });

    const avgConf = incidents.length > 0 
      ? Number((totalConfidenceSum / incidents.length).toFixed(2)) 
      : 0.92;

    return {
      totalSourceEvents: totalEvents || 7,
      citizenReportsCount: citizenCount || 3,
      cctvEventsCount: cctvCount || 2,
      iotEventsCount: iotCount || 1,
      socialSignalsCount: socialCount || 1,
      correlatedEventsCount: totalEvents || 7,
      duplicateReportsMergedCount: duplicateMergedCount || 4,
      conflictingEventsCount: conflictingCount,
      averageFusionConfidence: avgConf
    };
  }
}

export const incidentFusionEngine = new IncidentFusionEngine();
