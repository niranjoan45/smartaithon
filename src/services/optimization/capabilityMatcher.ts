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

  // Service Type Match
  const requiredType = 
    incident.type === 'FIRE' ? 'FIRE_TRUCK' :
    incident.type === 'ACCIDENT' ? 'AMBULANCE' :
    incident.type === 'MEDICAL' ? 'AMBULANCE' :
    incident.type === 'CRIME' ? 'POLICE' : 'AMBULANCE';

  if (resource.type === requiredType) {
    score += 35;
    matchReasons.push(`Primary service type match (${resource.type})`);
  } else if (incident.type === 'ACCIDENT' && resource.type === 'FIRE_TRUCK') {
    score += 15;
    matchReasons.push(`Secondary rescue support unit (${resource.type})`);
  } else {
    score -= 40;
    mismatchPenalties.push(`Service type mismatch (${resource.type} assigned to ${incident.type})`);
  }

  // Capability Verification
  if (incident.severity === 'P1' && resource.capabilities.includes('advancedLifeSupport')) {
    score += 20;
    matchReasons.push('Advanced Life Support (ALS) trauma capability verified');
  }

  if (incident.type === 'FIRE' && resource.capabilities.includes('structuralFire')) {
    score += 20;
    matchReasons.push('Heavy structural fire suppression unit verified');
  }

  if (incident.type === 'CRIME' && resource.capabilities.includes('crimeResponse')) {
    score += 15;
    matchReasons.push('Tactical crime response unit verified');
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const isCompatible = finalScore >= 35;

  return {
    score: finalScore,
    isCompatible,
    matchReasons,
    mismatchPenalties
  };
}
