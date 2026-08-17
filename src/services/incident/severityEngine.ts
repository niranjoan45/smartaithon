import { 
  NormalizedIncidentType, 
  NormalizedSeverity, 
  ScoreBreakdownItem 
} from '../../types/incident';

export interface SeverityCalculationResult {
  severity: NormalizedSeverity;
  severityScore: number;
  breakdown: ScoreBreakdownItem[];
  reasons: string[];
}

export function calculateSeverityScore(
  type: NormalizedIncidentType,
  rawText: string,
  peopleAtRisk: number,
  evidenceCount: number
): SeverityCalculationResult {
  const text = rawText.toLowerCase();
  let score = 25; // base score
  const breakdown: ScoreBreakdownItem[] = [{ factor: 'Base Incident Evaluation', points: 25 }];
  const reasons: string[] = [];

  // Incident Type Base Factors
  switch (type) {
    case 'FIRE':
      score += 30;
      breakdown.push({ factor: 'Thermal Fire Threat', points: 30 });
      reasons.push('+ Active thermal combustion indicators');
      break;
    case 'ACCIDENT':
      score += 25;
      breakdown.push({ factor: 'High-Velocity Vehicle Crash', points: 25 });
      reasons.push('+ High-speed collision vector');
      break;
    case 'FLOOD':
      score += 20;
      breakdown.push({ factor: 'Submersion Inundation', points: 20 });
      reasons.push('+ Rapid hydrological flood surge');
      break;
    case 'MEDICAL':
      score += 22;
      breakdown.push({ factor: 'Acute Human Trauma', points: 22 });
      reasons.push('+ Acute life-threatening distress');
      break;
    case 'INFRASTRUCTURE':
    case 'CRIME':
      score += 15;
      breakdown.push({ factor: 'Public Safety Breach', points: 15 });
      reasons.push('+ Utility grid / security breach');
      break;
    default:
      score += 10;
      breakdown.push({ factor: 'General Alert Factor', points: 10 });
      break;
  }

  // Casualties & People at Risk
  if (peopleAtRisk >= 5) {
    score += 25;
    breakdown.push({ factor: 'Mass Population Exposure (≥5 victims)', points: 25 });
    reasons.push(`+ Mass population threat (${peopleAtRisk} individuals at risk)`);
  } else if (peopleAtRisk > 0) {
    score += 12;
    breakdown.push({ factor: 'Human Casualty Threat', points: 12 });
    reasons.push(`+ Direct human risk (${peopleAtRisk} individual)`);
  }

  // Multi-source Corroboration Boost
  if (evidenceCount >= 3) {
    score += 15;
    breakdown.push({ factor: '3+ Corroborating Evidence Sources', points: 15 });
    reasons.push('+ Corroborated across 3 independent feeds');
  } else if (evidenceCount >= 2) {
    score += 8;
    breakdown.push({ factor: 'Dual Source Corroboration', points: 8 });
    reasons.push('+ Dual sensor feed verification');
  }

  // Keyword Intensifier Indicators
  if (text.includes('trapped') || text.includes('explosion') || text.includes('severe') || text.includes('critical')) {
    score += 10;
    breakdown.push({ factor: 'Critical Entrapment / Explosion Keywords', points: 10 });
    reasons.push('+ Critical structural entrapment keywords matched');
  }

  const finalScore = Math.min(100, Math.max(10, score));

  let severity: NormalizedSeverity = 'P4';
  if (finalScore >= 80) severity = 'P1';
  else if (finalScore >= 60) severity = 'P2';
  else if (finalScore >= 40) severity = 'P3';

  return {
    severity,
    severityScore: finalScore,
    breakdown,
    reasons
  };
}
