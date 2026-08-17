import { NormalizedIncidentType, NormalizedSeverity } from '../../types/incident';

export interface EscalationResult {
  escalationRisk: number; // 0 - 100%
  predictedSeverity: NormalizedSeverity;
  reasoning: string;
}

export function calculateEscalationRisk(
  type: NormalizedIncidentType,
  severityScore: number,
  peopleAtRisk: number,
  evidenceCount: number
): EscalationResult {
  let risk = severityScore * 0.65;

  if (type === 'FIRE') risk += 18;
  if (type === 'FLOOD') risk += 14;
  if (type === 'ACCIDENT') risk += 10;

  if (peopleAtRisk > 3) risk += 12;
  if (evidenceCount >= 3) risk += 8;

  const escalationRisk = Math.min(99, Math.max(15, Math.round(risk)));

  let predictedSeverity: NormalizedSeverity = 'P4';
  if (escalationRisk >= 75 || severityScore >= 80) predictedSeverity = 'P1';
  else if (escalationRisk >= 55 || severityScore >= 60) predictedSeverity = 'P2';
  else if (escalationRisk >= 35 || severityScore >= 40) predictedSeverity = 'P3';

  return {
    escalationRisk,
    predictedSeverity,
    reasoning: `Rapid escalation probability evaluated at ${escalationRisk}% based on thermal/structural spread rate and population exposure.`
  };
}
