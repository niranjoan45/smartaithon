import { SourceEvent } from '../../types/sourceEvent';
import { normalizeRawSignal } from './sourceNormalizer';

export interface DemoScenarioStep {
  timeLabel: string;
  delayMs: number;
  event: SourceEvent;
  stepDescription: string;
}

export function getMajorFireDemoScenario(): DemoScenarioStep[] {
  const basePos: [number, number, number] = [24, 0.5, 16];

  return [
    {
      timeLabel: 'T+00s',
      delayMs: 1000,
      event: normalizeRawSignal({
        sourceType: 'CITIZEN',
        rawText: 'Large commercial building fire near North Highway. Black smoke pouring out, people trapped on 4th floor!',
        locationText: 'Sector 4 Innovation Tower',
        position3D: basePos,
        confidence: 0.75,
        metadata: { peopleAtRiskCount: 8 }
      }),
      stepDescription: 'T+00s: Initial Citizen 911 report ingested. Fused Incident INC-1051 created (P2 Moderate Confidence).'
    },
    {
      timeLabel: 'T+05s',
      delayMs: 4000,
      event: normalizeRawSignal({
        sourceType: 'CCTV',
        rawText: 'CCTV Optical Stream Cam #42: Optical smoke plume and high-intensity flame pixels detected.',
        locationText: 'Sector 4 Innovation Tower',
        position3D: basePos,
        confidence: 0.94,
        metadata: { cameraId: 'CAM-042', detectedObjects: ['SMOKE', 'FLAME', 'MULTIPLE_PEOPLE'] }
      }),
      stepDescription: 'T+05s: CCTV AI Cam #42 correlated (94% spatial/semantic match). Fusion confidence boosted.'
    },
    {
      timeLabel: 'T+10s',
      delayMs: 4000,
      event: normalizeRawSignal({
        sourceType: 'IOT',
        rawText: 'IoT Thermal Telemetry Node #04: Rapid thermal gradient spike 92°C, toxic smoke concentration HIGH.',
        locationText: 'Sector 4 Innovation Tower',
        position3D: basePos,
        confidence: 0.96,
        metadata: { sensorId: 'IOT-THERMAL-04', temperatureCelsius: 92, smokeLevel: 'CRITICAL_HIGH' }
      }),
      stepDescription: 'T+10s: IoT Thermal Sensor Node correlated. Corroborated signals increase confidence to 96%.'
    },
    {
      timeLabel: 'T+15s',
      delayMs: 4000,
      event: normalizeRawSignal({
        sourceType: 'SOCIAL',
        rawText: 'Multiple social media posts referencing massive fire and trapped workers at Sector 4 Innovation Tower.',
        locationText: 'Sector 4 Innovation Tower',
        position3D: basePos,
        confidence: 0.65,
        metadata: { socialPlatform: 'SIMULATED_X_FEED', engagementCount: 420 }
      }),
      stepDescription: 'T+15s: Social media signal correlated. Incident severity escalated to P1 CRITICAL. Phase 3 Optimizer notified!'
    }
  ];
}
