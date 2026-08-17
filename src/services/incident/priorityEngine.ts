import { NormalizedIncident } from '../../types/incident';

export function calculatePriorityScore(
  severityScore: number,
  escalationRisk: number,
  confidence: number,
  peopleAtRisk: number
): number {
  const score = 
    severityScore * 0.45 + 
    escalationRisk * 0.30 + 
    confidence * 0.15 + 
    Math.min(20, peopleAtRisk * 2);

  return Math.min(100, Math.max(10, Math.round(score)));
}

export function rankIncidents(incidents: NormalizedIncident[]): NormalizedIncident[] {
  // Sort descending by priority score
  const sorted = [...incidents].sort((a, b) => b.priorityScore - a.priorityScore);

  return sorted.map((inc, index) => ({
    ...inc,
    priorityRank: index + 1
  }));
}
