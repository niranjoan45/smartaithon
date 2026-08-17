import { NormalizedIncident } from '../../types/incident';
import { EmergencyUnit } from '../../types/resource';
import { evaluateCapabilityMatch } from './capabilityMatcher';
import { calculateResourceETA } from './etaEngine';
import { matchOptimalHospital } from './hospitalMatcher';
import { ResourceAssignment } from '../../types/optimization';

export function scoreAssignment(
  incident: NormalizedIncident,
  resource: EmergencyUnit
): ResourceAssignment {
  const capability = evaluateCapabilityMatch(incident, resource);
  const etaCalc = calculateResourceETA(resource.position3D, incident.position3D, resource.speedKmH || 65);

  let score = capability.score * 0.45;
  const reasoning: string[] = [];

  // Severity Weighting
  if (incident.severity === 'P1') {
    score += 35;
    reasoning.push('+ P1 Critical emergency priority weighting (+35pts)');
  } else if (incident.severity === 'P2') {
    score += 20;
    reasoning.push('+ P2 High emergency priority weighting (+20pts)');
  }

  // Capability match reasoning
  if (capability.matchReasons.length > 0) {
    reasoning.push(`+ ${capability.matchReasons[0]}`);
  }

  // ETA score component
  const etaScore = Math.max(0, 30 - etaCalc.etaMinutes * 3);
  score += etaScore;
  reasoning.push(`+ ${etaCalc.etaMinutes} min response ETA (${etaCalc.distanceKm} km)`);

  // Traffic factor
  reasoning.push(`+ Traffic corridor level: ${etaCalc.trafficLevel}`);

  // Hospital matching for medical/accident incidents
  let hospitalMatch;
  if (incident.type === 'ACCIDENT' || incident.type === 'MEDICAL') {
    hospitalMatch = matchOptimalHospital(incident.position3D, incident.type, incident.severity);
    score += hospitalMatch.score * 0.1;
    reasoning.push(`+ Hospital capacity: ${hospitalMatch.hospital.name}`);
  }

  const finalScore = Math.min(100, Math.max(10, Math.round(score)));

  // Generate 3D route coordinates
  const routePoints: [number, number, number][] = [
    resource.position3D,
    [(resource.position3D[0] + incident.position3D[0]) / 2, 3, (resource.position3D[2] + incident.position3D[2]) / 2],
    incident.position3D
  ];

  return {
    id: `ASG-${incident.id}-${resource.id}`,
    incidentId: incident.id,
    incidentTitle: incident.rawText,
    resourceId: resource.id,
    resourceCallsign: resource.callsign,
    hospitalId: hospitalMatch?.hospital.id,
    hospitalName: hospitalMatch?.hospital.name,
    etaMinutes: etaCalc.etaMinutes,
    distanceKm: etaCalc.distanceKm,
    trafficLevel: etaCalc.trafficLevel,
    capabilityMatchScore: capability.score,
    score: finalScore,
    reasoning,
    explanation: `${resource.callsign} assigned to ${incident.id}: ${etaCalc.etaMinutes}m ETA, ${capability.score}% capability match, global score ${finalScore}/100.`,
    routeCoordinates: routePoints
  };
}
