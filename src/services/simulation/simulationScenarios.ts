export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  timelineSteps: Array<{
    elapsedSec: number;
    title: string;
    description: string;
    action: () => void;
  }>;
}

export function createSimulationScenarios(): ScenarioDefinition[] {
  return [
    {
      id: 'SCENARIO-01',
      name: 'HIGHWAY MULTI-VEHICLE ACCIDENT',
      description: 'Vehicle collision on North Interchange causes traffic congestion and emergency dispatch escalation.',
      timelineSteps: [
        { elapsedSec: 2, title: 'Accident Signal Ingested', description: 'Citizen report received: Vehicle collision on North Highway Interchange.', action: () => {} },
        { elapsedSec: 8, title: 'CCTV Stream Corroborated', description: 'CCTV Cam #14 confirms rollover crash and lane blockage.', action: () => {} },
        { elapsedSec: 15, title: 'Traffic Congestion Rises', description: 'Traffic sector SEC-02 speed multiplier drops to 0.40 SEVERE.', action: () => {} },
        { elapsedSec: 25, title: 'Ambulance Dispatched', description: 'Ambulance A17 dispatched with trauma capabilities.', action: () => {} }
      ]
    },
    {
      id: 'SCENARIO-02',
      name: 'BUILDING FIRE ESCALATION',
      description: 'Sector 4 Innovation Tower fire escalates from P2 to P1 CRITICAL upon thermal sensor anomaly.',
      timelineSteps: [
        { elapsedSec: 2, title: 'P2 Fire Report Ingested', description: 'Initial smoke report at Sector 4 Innovation Tower.', action: () => {} },
        { elapsedSec: 6, title: 'IoT Thermal Gradient Spike', description: 'Thermal sensor node #04 reports +48°C/min temperature spike.', action: () => {} },
        { elapsedSec: 12, title: 'Escalation to P1 Critical', description: 'Incident severity escalated to P1 CRITICAL (14 victims at risk).', action: () => {} },
        { elapsedSec: 20, title: 'Fire Truck F01 Dispatched', description: 'Fire Truck F01 dispatched with structural fire capabilities.', action: () => {} }
      ]
    },
    {
      id: 'SCENARIO-03',
      name: 'FLASH FLOOD EMERGENCY',
      description: 'Severe rainfall causes drainage overflow and road blockage across Sector 3 Industrial Port.',
      timelineSteps: [
        { elapsedSec: 3, title: 'Heavy Rainfall Telemetry', description: 'Water level sensors report rapid drainage overflow.', action: () => {} },
        { elapsedSec: 10, title: 'Road Sector Blocked', description: 'Traffic sector SEC-03 marked BLOCKED (0.10 speed multiplier).', action: () => {} },
        { elapsedSec: 20, title: 'Risk Zone Expansion', description: 'Predictive risk engine expands Sector 3 high risk perimeter ring.', action: () => {} }
      ]
    },
    {
      id: 'SCENARIO-04',
      name: 'MASS CASUALTY EVENT (RESOURCE CONFLICT)',
      description: 'Multiple simultaneous emergencies create resource conflict resolved by Phase 3 global solver.',
      timelineSteps: [
        { elapsedSec: 2, title: 'Dual P1 Emergencies', description: 'Building fire and highway crash reported simultaneously.', action: () => {} },
        { elapsedSec: 10, title: 'Hospital Beds Reserved', description: 'City General Trauma beds reserved (72% -> 85% occupancy).', action: () => {} },
        { elapsedSec: 18, title: 'Global Optimizer Triggered', description: 'Phase 3 global solver resolves conflict and minimizes response cost.', action: () => {} }
      ]
    },
    {
      id: 'SCENARIO-05',
      name: 'PROACTIVE FIRE PRE-POSITIONING (KILLER DEMO)',
      description: 'Predictive risk engine pre-positions Fire Truck F01 near Sector 4, saving 4.3 minutes of arrival time.',
      timelineSteps: [
        { elapsedSec: 2, title: 'Risk Zone Identified', description: 'Zone A17 identified HIGH RISK (87/100 score).', action: () => {} },
        { elapsedSec: 8, title: 'Proactive Pre-Positioning', description: 'Fire Truck F01 pre-positioned at Sector 4 Innovation Station.', action: () => {} },
        { elapsedSec: 15, title: 'ETA Benefit Calculated', description: 'Projected response ETA reduced from 8.4m to 4.1m (-4.3m saved).', action: () => {} }
      ]
    }
  ];
}
