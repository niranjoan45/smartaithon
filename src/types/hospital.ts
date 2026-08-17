export interface HospitalUnit {
  id: string;
  name: string;
  position3D: [number, number, number];
  latitude: number;
  longitude: number;
  availableBeds: number;
  traumaCapacity: number;
  emergencyCapacity: number;
  specialties: string[];
  occupancyRatePercent: number;
}
