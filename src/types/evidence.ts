import { SourceType } from './sourceEvent';

export interface SourceReliability {
  sourceType: SourceType;
  baseReliability: number; // Citizen: 0.70, CCTV: 0.90, IoT: 0.88, Social: 0.55
  label: string;
}

export const SIMULATED_SOURCE_RELIABILITIES: Record<SourceType, SourceReliability> = {
  CITIZEN: { sourceType: 'CITIZEN', baseReliability: 0.70, label: 'SIMULATED CITIZEN FEED' },
  CCTV: { sourceType: 'CCTV', baseReliability: 0.90, label: 'SIMULATED CCTV AI' },
  IOT: { sourceType: 'IOT', baseReliability: 0.88, label: 'SIMULATED IoT SENSOR' },
  SOCIAL: { sourceType: 'SOCIAL', baseReliability: 0.55, label: 'SIMULATED SOCIAL SIGNAL' }
};
