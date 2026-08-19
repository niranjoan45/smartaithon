import { EmergencyUnit, ResourceType } from '../../types/resource';
import { NormalizedIncident } from '../../types/incident';

export interface CapabilityMatchResult {
  score: number; // 0 - 100
  isCompatible: boolean;
  matchReasons: string[];
  mismatchPenalties: string[];
}

export function evaluateCapabilityMatch(
  incident: NormalizedIncident,
  resource: EmergencyUnit
): CapabilityMatchResult {
  let score = 50;
  const matchReasons: string[] = [];
  const mismatchPenalties: string[] = [];

  // Required primary service type matching
  const requiredType: ResourceType = 
    incident.type === 'FIRE' ? 'FIRE_TRUCK' :
    (incident.type === 'ACCIDENT' || incident.type === 'MEDICAL') ? 'AMBULANCE' :
    incident.type === 'CRIME' ? 'POLICE' : 'AMBULANCE';

  if (resource.type === requiredType) {
    score += 45;
    matchReasons.push(`Primary required service match (${resource.type} for ${incident.type})`);
  } else {
    score -= 60;
    mismatchPenalties.push(`Service mismatch: ${resource.type} requested for ${incident.type}`);
  }

  // Capability Verification
  if ((incident.type === 'ACCIDENT' || incident.type === 'MEDICAL') && resource.type === 'AMBULANCE') {
    score += 20;
    matchReasons.push('Trauma & Emergency Life Support capability verified');
  }

  if (incident.type === 'FIRE' && resource.type === 'FIRE_TRUCK') {
    score += 20;
    matchReasons.push('Structural fire suppression capability verified');
  }

  if (incident.type === 'CRIME' && resource.type === 'POLICE') {
    score += 20;
    matchReasons.push('Tactical crime response capability verified');
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const isCompatible = finalScore >= 40;

  return {
    score: finalScore,
    isCompatible,
    matchReasons,
    mismatchPenalties
  };
}
