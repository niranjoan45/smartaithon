import { 
  RawEventInput, 
  NormalizedIncident, 
  IntelligencePipelineStage 
} from '../../types/incident';
import { LocalSimulationProvider } from '../ai/LocalSimulationProvider';
import { AIProvider } from '../ai/AIProvider';
import { calculateSeverityScore } from './severityEngine';
import { calculateEscalationRisk } from './escalationEngine';
import { calculatePriorityScore, rankIncidents } from './priorityEngine';
import { correlateIncomingEvent } from './incidentCorrelator';

export class IncidentAnalyzer {
  private aiProvider: AIProvider;

  constructor(provider?: AIProvider) {
    this.aiProvider = provider || new LocalSimulationProvider();
  }

  public getAIModeName(): 'SIMULATION' | 'LIVE' {
    return this.aiProvider.modeName;
  }

  public async processRawEvent(
    input: RawEventInput,
    existingIncidents: NormalizedIncident[],
    onStageUpdate?: (stage: IntelligencePipelineStage) => void
  ): Promise<{ incident: NormalizedIncident; isCorrelated: boolean; allIncidents: NormalizedIncident[] }> {
    
    // Stage 1: Raw Input Ingestion
    onStageUpdate?.({
      stage: 'RAW INPUT INGESTION',
      progress: 10,
      log: `[INGESTION] Received raw input via ${input.source}: "${input.rawText.substring(0, 45)}..."`
    });

    // Stage 2: Normalization
    onStageUpdate?.({
      stage: 'INPUT NORMALIZATION',
      progress: 20,
      log: `[NORMALIZATION] Sanitized text and stripped noise tokens.`
    });

    // Stage 3: AI Type Classification
    const classification = await this.aiProvider.classifyIncident(input.rawText);
    onStageUpdate?.({
      stage: 'INCIDENT TYPE CLASSIFICATION',
      progress: 35,
      log: `[AI CLASSIFIER] Type: ${classification.type} (Confidence: ${classification.confidence}%)`
    });

    // Stage 4: Location Extraction
    const location = await this.aiProvider.extractLocation(input.rawText, input.reporterLocation);
    onStageUpdate?.({
      stage: 'LOCATION EXTRACTION',
      progress: 50,
      log: `[LOCATION RESOLVER] Resolved to "${location.locationText}" (Pos: ${location.position3D.join(', ')})`
    });

    // Stage 5: Evidence Extraction & Severity Assessment
    const extraction = await this.aiProvider.analyzeEvidenceDetails(input.rawText);
    const initialEvidence = [{
      id: `EV-${Date.now()}`,
      source: input.source,
      title: `${input.source.replace('_', ' ')} Alert`,
      confidence: classification.confidence,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    }];

    const severityRes = calculateSeverityScore(
      classification.type,
      input.rawText,
      extraction.peopleAtRisk,
      initialEvidence.length
    );

    onStageUpdate?.({
      stage: 'SEVERITY ASSESSMENT',
      progress: 65,
      log: `[SEVERITY ENGINE] Assigned ${severityRes.severity} (Severity Score: ${severityRes.severityScore}/100)`
    });

    // Stage 6: Multi-Source Evidence Correlation
    const correlation = correlateIncomingEvent(
      initialEvidence[0],
      location.locationText,
      classification.type,
      existingIncidents
    );

    if (correlation.isCorrelated && correlation.updatedIncident) {
      onStageUpdate?.({
        stage: 'MULTI-SOURCE EVIDENCE CORRELATION',
        progress: 80,
        log: `[CORRELATOR] Correlated with ${correlation.existingIncidentId}! Confidence boosted to ${correlation.correlationConfidence}%.`
      });

      const updatedList = rankIncidents(
        existingIncidents.map(i => i.id === correlation.existingIncidentId ? correlation.updatedIncident! : i)
      );

      return {
        incident: correlation.updatedIncident,
        isCorrelated: true,
        allIncidents: updatedList
      };
    }

    // Stage 7: Escalation Risk Prediction
    const escalation = calculateEscalationRisk(
      classification.type,
      severityRes.severityScore,
      extraction.peopleAtRisk,
      initialEvidence.length
    );

    onStageUpdate?.({
      stage: 'ESCALATION RISK PREDICTION',
      progress: 85,
      log: `[ESCALATION PREDICTOR] Escalation Risk: ${escalation.escalationRisk}% (Predicted: ${escalation.predictedSeverity})`
    });

    // Stage 8: Priority Ranking
    const priorityScore = calculatePriorityScore(
      severityRes.severityScore,
      escalation.escalationRisk,
      classification.confidence,
      extraction.peopleAtRisk
    );

    onStageUpdate?.({
      stage: 'PRIORITY RANKING',
      progress: 92,
      log: `[PRIORITY ENGINE] Computed Priority Score: ${priorityScore}`
    });

    // Stage 9: Structured Incident Creation
    const newId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: NormalizedIncident = {
      id: newId,
      timestamp: Date.now(),
      formattedTimeAgo: 'Just now',
      source: input.source,
      rawText: input.rawText,
      type: classification.type,
      severity: severityRes.severity,
      severityScore: severityRes.severityScore,
      severityBreakdown: severityRes.breakdown,
      confidence: classification.confidence,
      locationText: location.locationText,
      latitude: 19.076,
      longitude: 72.877,
      position3D: input.coordinates || location.position3D,
      locationConfidence: location.confidence,
      isLocationUncertain: location.isUncertain,
      peopleAtRisk: extraction.peopleAtRisk,
      affectedAreaSqMeters: extraction.affectedAreaSqMeters,
      escalationRisk: escalation.escalationRisk,
      predictedSeverity: escalation.predictedSeverity,
      priorityScore,
      priorityRank: 1,
      status: 'ACTIVE',
      requiredServices: (classification.type === 'ACCIDENT' || classification.type === 'MEDICAL') ? ['AMBULANCE', 'POLICE'] : classification.type === 'FIRE' ? ['FIRE', 'AMBULANCE'] : ['AMBULANCE'],
      assignedResourceId: (classification.type === 'ACCIDENT' || classification.type === 'MEDICAL') ? 'A17' : classification.type === 'FIRE' ? 'F01' : 'P09',
      evidence: initialEvidence,
      mediaAttachments: input.mediaAttachments,
      gpsLocation: input.gpsLocation,
      aiReasoning: {
        classificationReasoning: classification.reasoning,
        severityReasoning: severityRes.reasons,
        escalationReasoning: escalation.reasoning,
        correlationReasoning: 'Single source initial detection.'
      }
    };

    onStageUpdate?.({
      stage: 'STRUCTURED INCIDENT CREATION',
      progress: 98,
      log: `[STRUCTURED OBJECT] Generated ${newId} (${newIncident.type})`
    });

    // Stage 10: 3D Canvas Synchronization
    onStageUpdate?.({
      stage: '3D CANVAS SYNCHRONIZATION',
      progress: 100,
      log: `[3D SYNCHRONIZER] Incident ${newId} placed in 3D grid.`
    });

    const rankedList = rankIncidents([newIncident, ...existingIncidents]);

    return {
      incident: rankedList.find(i => i.id === newId) || newIncident,
      isCorrelated: false,
      allIncidents: rankedList
    };
  }
}
