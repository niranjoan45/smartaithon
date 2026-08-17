import { getSectorTraffic } from './trafficEngine';

export interface ETACalculation {
  distanceKm: number;
  etaMinutes: number;
  trafficLevel: string;
  speedKmH: number;
  effectiveSpeedKmH: number;
}

export function calculateResourceETA(
  fromPos: [number, number, number],
  toPos: [number, number, number],
  baseSpeedKmH: number = 60
): ETACalculation {
  const dx = toPos[0] - fromPos[0];
  const dz = toPos[2] - fromPos[2];
  const distanceUnits = Math.sqrt(dx * dx + dz * dz);
  
  // Scale 3D units to km (e.g. 10 3D units = 1.5 km)
  const distanceKm = Number((distanceUnits * 0.15).toFixed(2));

  const traffic = getSectorTraffic(toPos);
  const effectiveSpeedKmH = Math.max(20, baseSpeedKmH * traffic.speedMultiplier);

  // ETA in minutes
  const rawEta = (distanceKm / effectiveSpeedKmH) * 60;
  const etaMinutes = Math.max(1.2, Number(rawEta.toFixed(1)));

  return {
    distanceKm,
    etaMinutes,
    trafficLevel: traffic.level,
    speedKmH: baseSpeedKmH,
    effectiveSpeedKmH
  };
}
