import { NormalizedIncident } from '../../types/incident';
import { EmergencyUnit } from '../../types/resource';
import { scoreAssignment } from './assignmentScorer';
import { ResourceAssignment } from '../../types/optimization';
import { calculateResourceETA } from './etaEngine';

export function computeBaselineAllocation(
  incidents: NormalizedIncident[],
  resources: EmergencyUnit[]
): { assignments: ResourceAssignment[]; avgEta: number; totalEta: number } {
  const availableResources = resources.filter(r => r.status !== 'UNAVAILABLE');
  const assignedResourceIds = new Set<string>();
  const assignments: ResourceAssignment[] = [];

  // Naive greedy allocation: Process incidents in arbitrary order and pick nearest resource
  incidents.forEach((inc) => {
    let nearestRes: EmergencyUnit | null = null;
    let minDistance = 999;

    availableResources.forEach((res) => {
      if (assignedResourceIds.has(res.id)) return;

      const eta = calculateResourceETA(res.position3D, inc.position3D, res.speedKmH || 60);
      if (eta.distanceKm < minDistance) {
        minDistance = eta.distanceKm;
        nearestRes = res;
      }
    });

    if (nearestRes) {
      assignedResourceIds.add((nearestRes as EmergencyUnit).id);
      assignments.push(scoreAssignment(inc, nearestRes));
    }
  });

  const totalEta = assignments.reduce((acc, a) => acc + a.etaMinutes, 0);
  const avgEta = assignments.length > 0 ? Number((totalEta / assignments.length).toFixed(1)) : 14.2;

  return {
    assignments,
    avgEta,
    totalEta
  };
}
