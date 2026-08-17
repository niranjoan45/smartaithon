import { FusedIncident } from '../../types/fusion';
import { EmergencyUnit } from '../../types/resource';

export interface SpatialGridZoneFeature {
  zoneId: string;
  zoneName: string;
  position3D: [number, number, number];
  latitude: number;
  longitude: number;
  historicalDensityCount: number;
  recentFusedIncidentsCount: number;
  totalSeverityPoints: number;
  nearestFireEtaMin: number;
  nearestAmbulanceEtaMin: number;
  nearestPoliceEtaMin: number;
  hasResourceGap: boolean;
}

export function extractZoneFeatures(
  zoneId: string,
  zoneName: string,
  pos: [number, number, number],
  lat: number,
  lng: number,
  incidents: FusedIncident[],
  resources: EmergencyUnit[]
): SpatialGridZoneFeature {
  // Count incidents within 3D radius (15 units)
  const nearbyIncidents = incidents.filter(inc => {
    const dx = inc.position3D[0] - pos[0];
    const dz = inc.position3D[2] - pos[2];
    return Math.sqrt(dx * dx + dz * dz) <= 18;
  });

  const recentFusedIncidentsCount = nearbyIncidents.length;
  const historicalDensityCount = recentFusedIncidentsCount + Math.floor(Math.abs(pos[0] + pos[2]) % 5) + 2;

  const totalSeverityPoints = nearbyIncidents.reduce((acc, i) => acc + (i.severityScore || 70), 0);

  // Calculate nearest resource ETAs across types
  let nearestFireEtaMin = 9.5;
  let nearestAmbulanceEtaMin = 7.2;
  let nearestPoliceEtaMin = 5.8;

  resources.forEach(r => {
    const dx = r.position3D[0] - pos[0];
    const dz = r.position3D[2] - pos[2];
    const distKm = Math.sqrt(dx * dx + dz * dz) * 0.15;
    const eta = Number((distKm / 0.8).toFixed(1));

    if (r.type === 'FIRE_TRUCK' && eta < nearestFireEtaMin) nearestFireEtaMin = eta;
    if (r.type === 'AMBULANCE' && eta < nearestAmbulanceEtaMin) nearestAmbulanceEtaMin = eta;
    if (r.type === 'POLICE' && eta < nearestPoliceEtaMin) nearestPoliceEtaMin = eta;
  });

  const hasResourceGap = nearestFireEtaMin > 6.0 || nearestAmbulanceEtaMin > 6.0;

  return {
    zoneId,
    zoneName,
    position3D: pos,
    latitude: lat,
    longitude: lng,
    historicalDensityCount,
    recentFusedIncidentsCount,
    totalSeverityPoints,
    nearestFireEtaMin,
    nearestAmbulanceEtaMin,
    nearestPoliceEtaMin,
    hasResourceGap
  };
}
