import { FusedIncident } from '../../types/fusion';
import { PredictedIncidentType } from '../../types/risk';

export function predictZoneIncidentTypes(
  zonePos: [number, number, number],
  incidents: FusedIncident[]
): PredictedIncidentType[] {
  const nearby = incidents.filter(inc => {
    const dx = inc.position3D[0] - zonePos[0];
    const dz = inc.position3D[2] - zonePos[2];
    return Math.sqrt(dx * dx + dz * dz) <= 22;
  });

  let fireCount = 2;
  let accidentCount = 1;
  let medicalCount = 1;

  nearby.forEach(inc => {
    if (inc.type === 'FIRE') fireCount += 3;
    else if (inc.type === 'ACCIDENT') accidentCount += 2;
    else medicalCount += 1;
  });

  const total = fireCount + accidentCount + medicalCount;
  const firePct = Math.round((fireCount / total) * 100);
  const accPct = Math.round((accidentCount / total) * 100);
  const medPct = Math.max(0, 100 - (firePct + accPct));

  return [
    { type: 'FIRE', percentage: firePct },
    { type: 'ACCIDENT', percentage: accPct },
    { type: 'MEDICAL', percentage: medPct }
  ].sort((a, b) => b.percentage - a.percentage);
}
