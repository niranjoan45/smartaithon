import { HospitalUnit } from '../../types/hospital';
import { calculateResourceETA } from './etaEngine';

const simulatedHospitals: HospitalUnit[] = [
  {
    id: 'HOSP-01',
    name: 'City General Trauma Center',
    position3D: [-25, 0.5, -20],
    latitude: 19.095,
    longitude: 72.855,
    availableBeds: 18,
    traumaCapacity: 95,
    emergencyCapacity: 85,
    specialties: ['Level-1 Trauma', 'Cardiac Care', 'Burn Unit'],
    occupancyRatePercent: 72
  },
  {
    id: 'HOSP-02',
    name: 'Westside Medical Hub',
    position3D: [-35, 0.5, 15],
    latitude: 19.065,
    longitude: 72.835,
    availableBeds: 12,
    traumaCapacity: 80,
    emergencyCapacity: 90,
    specialties: ['General Emergency', 'Pediatrics'],
    occupancyRatePercent: 80
  },
  {
    id: 'HOSP-03',
    name: 'Metro Sector 4 Specialty Hospital',
    position3D: [30, 0.5, 20],
    latitude: 19.085,
    longitude: 72.890,
    availableBeds: 24,
    traumaCapacity: 90,
    emergencyCapacity: 95,
    specialties: ['High-Consequence Thermal Care', 'Neurotrauma'],
    occupancyRatePercent: 65
  }
];

export interface HospitalMatchResult {
  hospital: HospitalUnit;
  score: number;
  etaMinutes: number;
  reasoning: string;
}

export function matchOptimalHospital(
  incidentPosition: [number, number, number],
  incidentType: string,
  severity: string
): HospitalMatchResult {
  let bestMatch: HospitalUnit = simulatedHospitals[0];
  let bestScore = -1;
  let bestEta = 99;
  let bestReason = '';

  simulatedHospitals.forEach((hosp) => {
    const etaCalc = calculateResourceETA(incidentPosition, hosp.position3D, 60);
    let score = 100 - etaCalc.etaMinutes * 4;

    if (severity === 'P1' && hosp.traumaCapacity >= 90) {
      score += 25;
    }

    if (incidentType === 'FIRE' && hosp.specialties.some(s => s.includes('Burn') || s.includes('Thermal'))) {
      score += 20;
    }

    if (hosp.availableBeds < 5) {
      score -= 30;
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = hosp;
      bestEta = etaCalc.etaMinutes;
      bestReason = `${hosp.name} selected: ${hosp.availableBeds} beds available, ${hosp.traumaCapacity}% trauma capacity (${etaCalc.etaMinutes}m transport ETA).`;
    }
  });

  return {
    hospital: bestMatch,
    score: Math.min(100, Math.max(0, Math.round(bestScore))),
    etaMinutes: bestEta,
    reasoning: bestReason
  };
}

export function getAllHospitals(): HospitalUnit[] {
  return simulatedHospitals;
}
