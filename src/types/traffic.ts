export type TrafficLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export interface TrafficSegment {
  sectorId: string;
  sectorName: string;
  level: TrafficLevel;
  speedMultiplier: number; // LOW: 1.0, MODERATE: 0.8, HIGH: 0.55, SEVERE: 0.35
  priorityCorridorActive: boolean;
}
