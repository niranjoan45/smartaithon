import { TrafficLevel, TrafficSegment } from '../../types/traffic';

export function getTrafficFactor(level: TrafficLevel): number {
  switch (level) {
    case 'LOW': return 1.0;
    case 'MODERATE': return 0.80;
    case 'HIGH': return 0.55;
    case 'SEVERE': return 0.35;
    default: return 0.80;
  }
}

export function getSectorTraffic(pos: [number, number, number]): TrafficSegment {
  const [x, z] = [pos[0], pos[2]];

  if (x < -10 && z < 0) {
    return {
      sectorId: 'SEC-NW',
      sectorName: 'North Interchange Highway Corridor',
      level: 'MODERATE',
      speedMultiplier: 0.80,
      priorityCorridorActive: true
    };
  }

  if (x > 10 && z > 10) {
    return {
      sectorId: 'SEC-SE',
      sectorName: 'Sector 4 Commercial District',
      level: 'HIGH',
      speedMultiplier: 0.55,
      priorityCorridorActive: false
    };
  }

  return {
    sectorId: 'SEC-CENTRAL',
    sectorName: 'Central Smart City Sector',
    level: 'LOW',
    speedMultiplier: 1.0,
    priorityCorridorActive: true
  };
}
