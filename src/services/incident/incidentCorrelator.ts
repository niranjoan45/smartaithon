import { NormalizedIncident, EvidenceItem, EventSourceType } from '../../types/incident';

export interface CorrelationResult {
  isCorrelated: boolean;
  existingIncidentId?: string;
  updatedIncident?: NormalizedIncident;
  correlationConfidence?: number;
  correlationReasoning?: string;
}

export function correlateIncomingEvent(
  newEvidence: EvidenceItem,
  locationText: string,
  type: string,
  existingIncidents: NormalizedIncident[]
): CorrelationResult {
  const normLocation = locationText.toLowerCase();

  // Search existing active incidents for location or type match
  const matched = existingIncidents.find((inc) => {
    const incLoc = inc.locationText.toLowerCase();
    const isLocMatch = 
      incLoc.includes(normLocation) || 
      normLocation.includes(incLoc) ||
      (inc.locationText.includes('Highway') && normLocation.includes('highway')) ||
      (inc.locationText.includes('Sector 4') && normLocation.includes('sector 4'));
    
    return isLocMatch && (inc.status === 'ACTIVE' || inc.status === 'DISPATCHED');
  });

  if (!matched) {
    return { isCorrelated: false };
  }

  // Check if source already exists
  const hasSource = matched.evidence.some((e) => e.source === newEvidence.source);
  if (hasSource) {
    return { isCorrelated: false };
  }

  // Merge evidence & boost confidence
  const updatedEvidence = [...matched.evidence, newEvidence];
  const newConfidence = Math.min(99, Math.max(matched.confidence, matched.confidence + 6));
  const newSeverityScore = Math.min(100, matched.severityScore + 8);

  const updatedIncident: NormalizedIncident = {
    ...matched,
    confidence: newConfidence,
    severityScore: newSeverityScore,
    severity: newSeverityScore >= 80 ? 'P1' : matched.severity,
    evidence: updatedEvidence,
    aiReasoning: {
      ...matched.aiReasoning,
      correlationReasoning: `Correlated across ${updatedEvidence.length} independent sources (${updatedEvidence.map(e => e.source.replace('_', ' ')).join(', ')}). Confidence increased to ${newConfidence}%.`
    }
  };

  return {
    isCorrelated: true,
    existingIncidentId: matched.id,
    updatedIncident,
    correlationConfidence: newConfidence,
    correlationReasoning: `Multi-source match: Correlated ${newEvidence.source} with ${matched.id} (${matched.locationText}). Confidence elevated to ${newConfidence}%.`
  };
}
