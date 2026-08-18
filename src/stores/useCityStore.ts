import { create } from 'zustand';
import { 
  CameraViewMode, 
  SimulationMetrics 
} from '../types/city';
import { EmergencyUnit } from '../types/resource';
import { OptimizationResult, OptimizationRunHistory, ResourceShortage } from '../types/optimization';
import { optimizationService } from '../services/optimization/optimizationService';
import { SourceEvent } from '../types/sourceEvent';
import { FusedIncident, FusionMetrics } from '../types/fusion';
import { incidentFusionEngine } from '../services/fusion/incidentFusionEngine';
import { RiskZone, PredictiveMetrics } from '../types/risk';
import { predictiveEngine } from '../services/predictive/predictiveEngine';
import { checkBackendHealth } from '../services/api/apiClient';

export type OptimizationStage = 
  | 'IDLE'
  | 'CITY SCAN'
  | 'INCIDENT ANALYSIS'
  | 'RESOURCE ANALYSIS'
  | 'CAPABILITY MATCHING'
  | 'ETA CALCULATION'
  | 'CONFLICT DETECTION'
  | 'GLOBAL OPTIMIZATION'
  | 'ROUTE GENERATION'
  | 'DISPATCH PLAN'
  | 'CITY SYNCHRONIZED';

interface CityState {
  activeView: 'COMMAND_CENTER' | 'INCIDENTS' | 'RESOURCES' | 'RISK_MAP' | 'ANALYTICS' | 'SIMULATION';
  cameraMode: CameraViewMode;
  cameraTarget: [number, number, number];
  
  aiModeName: 'SIMULATION' | 'LIVE';
  lowQualityMode: boolean;
  setLowQualityMode: (low: boolean) => void;

  selectedIncidentId: string | null;
  selectedResourceId: string | null;
  selectedRiskZoneId: string | null;

  isCopilotOpen: boolean;
  isReportModalOpen: boolean;
  isHistoryModalOpen: boolean;
  isFusionPanelOpen: boolean;
  isPredictivePanelOpen: boolean;
  isDbModalOpen: boolean;
  setHistoryModalOpen: (open: boolean) => void;
  setFusionPanelOpen: (open: boolean) => void;
  setPredictivePanelOpen: (open: boolean) => void;
  setDbModalOpen: (open: boolean) => void;
  selectRiskZone: (id: string | null) => void;

  // Phase 6 Database Persistence & Offline Fallback State
  dbConnectionStatus: 'CONNECTED' | 'OFFLINE';
  dbModeName: 'LIVE PERSISTED' | 'DEMO SIMULATION';
  checkDatabaseHealthAction: () => Promise<void>;

  // Stream & Fusion
  streamStatus: 'IDLE' | 'PLAYING' | 'PAUSED';
  setStreamStatus: (status: 'IDLE' | 'PLAYING' | 'PAUSED') => void;
  latestSourceEvent: SourceEvent | null;
  lastCorrelationBreakdown: { spatialScore: number; temporalScore: number; semanticScore: number } | null;
  sourceMetrics: FusionMetrics;
  ingestSourceEvent: (event: SourceEvent) => Promise<void>;

  // Phase 5 Predictive Risk & Proactive Positioning
  riskZones: RiskZone[];
  predictiveMetrics: PredictiveMetrics;
  simulatePrepositioningAction: (zoneId: string) => void;
  reanalyzePredictiveRisk: () => void;

  aiActivityLogs: string[];

  // Entities
  normalizedIncidents: FusedIncident[];
  resources: EmergencyUnit[];
  activeRoutes: Array<{ id: string; from: [number, number, number]; to: [number, number, number]; color: string }>;

  // Optimization
  isOptimizing: boolean;
  optimizationStage: OptimizationStage;
  optimizationProgress: number;
  lastOptimizationResult: OptimizationResult | null;
  optimizationHistory: OptimizationRunHistory[];
  activeShortages: ResourceShortage[];

  setActiveView: (view: CityState['activeView']) => void;
  setCameraMode: (mode: CameraViewMode, target?: [number, number, number]) => void;
  selectIncident: (id: string | null) => void;
  selectResource: (id: string | null) => void;
  setCopilotOpen: (open: boolean) => void;
  setReportModalOpen: (open: boolean) => void;
  
  startOptimizationSequence: () => void;
  triggerReoptimizationEvent: () => void;
  triggerDemoScenario: () => void;
  
  getMetrics: () => SimulationMetrics;
}

const initialSourceEvent: SourceEvent = {
  id: 'SRC-CITIZEN-01',
  sourceType: 'CITIZEN',
  timestamp: Date.now() - 120000,
  formattedTime: '19:12:00',
  latitude: 19.082,
  longitude: 72.888,
  position3D: [24, 0.5, 16],
  locationText: 'Sector 4 Innovation Tower',
  rawText: 'Rapid fire escalation at Sector 4 Innovation Tower commercial building.',
  confidence: 0.75,
  mediaType: 'TEXT',
  metadata: { peopleAtRiskCount: 14 }
};

const initialFusedIncidents: FusedIncident[] = [
  {
    id: 'INC-1051',
    timestamp: Date.now() - 120000,
    formattedTimeAgo: '2 min ago',
    source: 'IOT_SENSOR',
    rawText: 'Thermal detector array anomaly & Citizen 911 report: Rapid fire escalation at Sector 4 Innovation Tower.',
    type: 'FIRE',
    severity: 'P1',
    severityScore: 94,
    severityBreakdown: [
      { factor: 'Base Incident Evaluation', points: 25 },
      { factor: 'Thermal Fire Threat', points: 30 },
      { factor: 'Mass Population Threat (14 victims)', points: 25 },
      { factor: 'Multi-Source Feeds Corroboration', points: 14 }
    ],
    confidence: 98,
    fusionConfidence: 0.98,
    locationText: 'Sector 4 Innovation Tower',
    latitude: 19.082,
    longitude: 72.888,
    position3D: [24, 0.5, 16],
    locationConfidence: 98,
    isLocationUncertain: false,
    peopleAtRisk: 14,
    affectedAreaSqMeters: 1680,
    escalationRisk: 89,
    predictedSeverity: 'P1',
    priorityScore: 96,
    priorityRank: 1,
    status: 'ACTIVE',
    requiredServices: ['FIRE', 'AMBULANCE'],
    assignedResourceId: 'F01',
    evidence: [
      { id: 'E4', source: 'IOT_SENSOR', title: 'Thermal Detector Array Node #04', confidence: 99, timestamp: '19:12:01', details: 'Thermal gradient delta +48°C/min' }
    ],
    sourceEvents: [initialSourceEvent],
    correlatedReportsCount: 4,
    correlationBreakdown: { spatialScore: 0.94, temporalScore: 0.97, semanticScore: 0.89 },
    hasConflict: false,
    sourceTypesPresent: ['CITIZEN', 'CCTV', 'IOT', 'SOCIAL'],
    auditTrail: [],
    aiReasoning: {
      classificationReasoning: 'Thermal fire keywords matched.',
      severityReasoning: ['+ Active commercial fire'],
      escalationReasoning: 'Vertical convection 89%.',
      correlationReasoning: 'Correlated IoT thermal node.'
    }
  }
];

const initialResources: EmergencyUnit[] = [
  {
    id: 'A17',
    callsign: 'AMBULANCE A17',
    type: 'AMBULANCE',
    status: 'DISPATCHED',
    position3D: [-5, 0.5, -2],
    targetPosition3D: [-18, 0.5, -12],
    latitude: 19.088,
    longitude: 72.860,
    capabilities: ['trauma', 'advancedLifeSupport'],
    currentIncidentId: 'INC-1042',
    speedKmH: 68,
    availableAtTimestamp: Date.now(),
    homeStation: 'North Central Station',
    unitHealth: 98,
    driverName: 'Officer Miller'
  },
  {
    id: 'F01',
    callsign: 'FIRE TRUCK F01',
    type: 'FIRE_TRUCK',
    status: 'DISPATCHED',
    position3D: [10, 0.5, 25],
    targetPosition3D: [24, 0.5, 16],
    latitude: 19.081,
    longitude: 72.885,
    capabilities: ['structuralFire', 'rescue'],
    currentIncidentId: 'INC-1051',
    speedKmH: 55,
    availableAtTimestamp: Date.now(),
    homeStation: 'Sector 4 Station',
    unitHealth: 100,
    driverName: 'Capt. Rodriguez'
  },
  {
    id: 'P09',
    callsign: 'POLICE P09',
    type: 'POLICE',
    status: 'AVAILABLE',
    position3D: [-12, 0.5, 15],
    latitude: 19.075,
    longitude: 72.870,
    capabilities: ['trafficControl', 'crowdControl', 'crimeResponse'],
    speedKmH: 75,
    availableAtTimestamp: Date.now(),
    homeStation: 'Central Precinct',
    unitHealth: 96,
    driverName: 'Sgt. Davis'
  },
  {
    id: 'A04',
    callsign: 'AMBULANCE A04',
    type: 'AMBULANCE',
    status: 'AVAILABLE',
    position3D: [18, 0.5, -10],
    latitude: 19.090,
    longitude: 72.890,
    capabilities: ['basicLifeSupport', 'trauma'],
    speedKmH: 70,
    availableAtTimestamp: Date.now(),
    homeStation: 'Eastside Station',
    unitHealth: 99,
    driverName: 'Paramedic Vance'
  },
  {
    id: 'F02',
    callsign: 'FIRE TRUCK F02',
    type: 'FIRE_TRUCK',
    status: 'AVAILABLE',
    position3D: [-20, 0.5, 20],
    latitude: 19.070,
    longitude: 72.850,
    capabilities: ['hazmat', 'structuralFire'],
    speedKmH: 60,
    availableAtTimestamp: Date.now(),
    homeStation: 'Westside Firehouse',
    unitHealth: 97,
    driverName: 'Lieutenant Chang'
  }
];

const initialAnalysis = predictiveEngine.analyzeCityRisk(initialFusedIncidents, initialResources);

export const useCityStore = create<CityState>((set, get) => ({
  activeView: 'COMMAND_CENTER',
  cameraMode: 'CITY_OVERVIEW',
  cameraTarget: [0, 0, 0],
  
  aiModeName: 'SIMULATION',
  lowQualityMode: false,
  setLowQualityMode: (low) => set({ lowQualityMode: low }),

  selectedIncidentId: 'INC-1051',
  selectedResourceId: null,
  selectedRiskZoneId: 'ZONE-A17',

  isCopilotOpen: false,
  isReportModalOpen: false,
  isHistoryModalOpen: false,
  isFusionPanelOpen: false,
  isPredictivePanelOpen: true,
  isDbModalOpen: false,

  dbConnectionStatus: 'OFFLINE',
  dbModeName: 'DEMO SIMULATION',

  setHistoryModalOpen: (open) => set({ isHistoryModalOpen: open }),
  setFusionPanelOpen: (open) => set({ isFusionPanelOpen: open }),
  setPredictivePanelOpen: (open) => set({ isPredictivePanelOpen: open }),
  setDbModalOpen: (open) => set({ isDbModalOpen: open }),

  checkDatabaseHealthAction: async () => {
    try {
      const health = await checkBackendHealth();
      set({
        dbConnectionStatus: health.database,
        dbModeName: health.mode
      });
    } catch (e) {
      set({
        dbConnectionStatus: 'OFFLINE',
        dbModeName: 'DEMO SIMULATION'
      });
    }
  },

  selectRiskZone: (id) => {
    const zone = get().riskZones.find(z => z.id === id);
    if (zone) {
      set({ 
        selectedRiskZoneId: id, 
        selectedIncidentId: null,
        selectedResourceId: null,
        cameraMode: 'RISK_VIEW',
        cameraTarget: zone.position3D
      });
    } else {
      set({ selectedRiskZoneId: null });
    }
  },

  streamStatus: 'IDLE',
  setStreamStatus: (status) => set({ streamStatus: status }),
  latestSourceEvent: initialSourceEvent,
  lastCorrelationBreakdown: { spatialScore: 0.94, temporalScore: 0.97, semanticScore: 0.89 },
  sourceMetrics: incidentFusionEngine.computeSourceMetrics(initialFusedIncidents),

  riskZones: initialAnalysis.zones,
  predictiveMetrics: initialAnalysis.metrics,

  reanalyzePredictiveRisk: () => {
    const { normalizedIncidents, resources } = get();
    const updated = predictiveEngine.analyzeCityRisk(normalizedIncidents, resources);
    set({ riskZones: updated.zones, predictiveMetrics: updated.metrics });
  },

  // Proactive Resource Pre-Positioning Simulation Action
  simulatePrepositioningAction: (zoneId: string) => {
    const state = get();
    const zone = state.riskZones.find(z => z.id === zoneId);
    if (!zone) return;

    // Move available or candidate Fire Truck/Ambulance closer to risk zone
    const updatedResources = state.resources.map(r => {
      if (r.type === 'FIRE_TRUCK' || r.id === 'F01') {
        return {
          ...r,
          status: 'AVAILABLE' as const,
          position3D: [zone.position3D[0] - 3, 0.5, zone.position3D[2] - 3] as [number, number, number],
          position: [zone.position3D[0] - 3, 0.5, zone.position3D[2] - 3] as [number, number, number],
          homeStation: `${zone.name} Pre-position Base`
        };
      }
      return r;
    });

    const updatedZones = state.riskZones.map(z => {
      if (z.id === zoneId) {
        return {
          ...z,
          currentResponseTimeMin: z.projectedResponseTimeMin,
          isPrepositioned: true,
          currentResources: [`1 ${z.predictedIncidentTypes[0]?.type || 'FIRE'} TRUCK (PRE-POSITIONED)`]
        };
      }
      return z;
    });

    set({
      resources: updatedResources,
      riskZones: updatedZones,
      cameraMode: 'RISK_VIEW',
      cameraTarget: zone.position3D,
      aiActivityLogs: [
        ...state.aiActivityLogs,
        `⚡ PROACTIVE PRE-POSITIONING COMMITTED: Pre-positioned FIRE TRUCK F01 at ${zone.name}. Projected ETA reduced from 8.4m to 4.1m (-4.3m saved).`
      ].slice(-10)
    });
  },

  aiActivityLogs: [
    '19:14:02 — Phase 5 Predictive Risk Engine Active [PREDICTIVE MODE: SIMULATION].',
    '19:14:15 — Spatial Grid Risk Analysis complete: ZONE-A17 identified HIGH RISK (87/100).',
    '19:14:28 — Proactive positioning recommendation: Pre-position 1 Fire Truck (-4.3m response saved).'
  ],

  normalizedIncidents: initialFusedIncidents,
  resources: initialResources,
  activeRoutes: [
    { id: 'R1', from: [-5, 0.5, -2], to: [-18, 0.5, -12], color: '#00f0ff' },
    { id: 'R2', from: [10, 0.5, 25], to: [24, 0.5, 16], color: '#ff2a5f' }
  ],

  isOptimizing: false,
  optimizationStage: 'IDLE',
  optimizationProgress: 0,
  lastOptimizationResult: null,
  optimizationHistory: [],
  activeShortages: [],

  setActiveView: (view) => set({ activeView: view }),
  setCameraMode: (mode, target = [0, 0, 0]) => set({ cameraMode: mode, cameraTarget: target }),

  selectIncident: (id) => {
    const inc = get().normalizedIncidents.find(i => i.id === id);
    if (inc) {
      set({ 
        selectedIncidentId: id, 
        selectedResourceId: null,
        selectedRiskZoneId: null,
        cameraMode: 'INCIDENT_FOCUS',
        cameraTarget: inc.position3D
      });
    } else {
      set({ selectedIncidentId: null });
    }
  },

  selectResource: (id) => {
    const res = get().resources.find(r => r.id === id);
    if (res) {
      set({ 
        selectedResourceId: id, 
        selectedIncidentId: null,
        selectedRiskZoneId: null,
        cameraMode: 'RESOURCE_FOCUS',
        cameraTarget: res.position3D
      });
    } else {
      set({ selectedResourceId: null });
    }
  },

  setCopilotOpen: (open) => set({ isCopilotOpen: open }),
  setReportModalOpen: (open) => set({ isReportModalOpen: open }),

  ingestSourceEvent: async (event: SourceEvent) => {
    const state = get();
    const result = await incidentFusionEngine.fuseSourceEvent(
      event,
      state.normalizedIncidents,
      state.resources
    );

    const updatedMetrics = incidentFusionEngine.computeSourceMetrics(result.fusedIncidents);
    const targetInc = result.fusedIncidents.find(i => i.id === result.targetIncidentId);

    set({
      normalizedIncidents: result.fusedIncidents,
      latestSourceEvent: event,
      lastCorrelationBreakdown: targetInc?.correlationBreakdown || { spatialScore: 0.94, temporalScore: 0.97, semanticScore: 0.89 },
      sourceMetrics: updatedMetrics,
      selectedIncidentId: result.targetIncidentId,
      cameraMode: 'INCIDENT_FOCUS',
      cameraTarget: targetInc?.position3D || [24, 0.5, 16]
    });

    // Re-run risk analysis upon new fused incident activity
    get().reanalyzePredictiveRisk();

    if (result.reoptimizationRecommended) {
      get().triggerReoptimizationEvent();
    }
  },

  getMetrics: () => {
    const { normalizedIncidents, resources, riskZones, lastOptimizationResult } = get();
    const criticalIncidents = normalizedIncidents.filter(i => i.severity === 'P1').length;
    const activeDispatches = resources.filter(r => r.status === 'DISPATCHED' || r.status === 'BUSY').length;
    
    return {
      totalIncidents: normalizedIncidents.length,
      criticalIncidents,
      totalResources: resources.length,
      activeDispatches,
      avgEtaMinutes: lastOptimizationResult ? lastOptimizationResult.averageETA : 8.7,
      riskZonesCount: riskZones.length,
      optimizationImprovementMin: lastOptimizationResult ? lastOptimizationResult.timeSavedMinutes : 5.5,
      beforeEtaMinutes: lastOptimizationResult ? lastOptimizationResult.baselineETA : 14.2
    };
  },

  startOptimizationSequence: () => {
    if (get().isOptimizing) return;
    set({ isOptimizing: true, optimizationProgress: 0, optimizationStage: 'CITY SCAN' });

    const stages: { stage: OptimizationStage; delay: number; progress: number }[] = [
      { stage: 'INCIDENT ANALYSIS', delay: 350, progress: 12 },
      { stage: 'RESOURCE ANALYSIS', delay: 700, progress: 25 },
      { stage: 'CAPABILITY MATCHING', delay: 1050, progress: 40 },
      { stage: 'ETA CALCULATION', delay: 1400, progress: 55 },
      { stage: 'CONFLICT DETECTION', delay: 1750, progress: 70 },
      { stage: 'GLOBAL OPTIMIZATION', delay: 2100, progress: 82 },
      { stage: 'ROUTE GENERATION', delay: 2450, progress: 90 },
      { stage: 'DISPATCH PLAN', delay: 2800, progress: 96 },
      { stage: 'CITY SYNCHRONIZED', delay: 3200, progress: 100 },
    ];

    stages.forEach(({ stage, delay, progress }) => {
      setTimeout(() => {
        set((state) => ({
          optimizationStage: stage,
          optimizationProgress: progress
        }));
      }, delay);
    });

    setTimeout(() => {
      set((state) => {
        const result = optimizationService.executeOptimization(
          state.normalizedIncidents,
          state.resources
        );

        const new3DRoutes = result.assignments.map((asg, idx) => ({
          id: `ROUTE-${asg.id}`,
          from: asg.routeCoordinates[0],
          to: asg.routeCoordinates[asg.routeCoordinates.length - 1],
          color: idx % 2 === 0 ? '#00f0ff' : '#ff2a5f'
        }));

        return {
          isOptimizing: false,
          activeRoutes: new3DRoutes,
          lastOptimizationResult: result,
          activeShortages: result.shortages,
          optimizationHistory: optimizationService.getHistorySummary(),
          cameraMode: 'DISPATCH_VIEW',
          cameraTarget: [0, 0, 0]
        };
      });
    }, 3500);
  },

  triggerReoptimizationEvent: () => {
    set((state) => {
      const updatedResources = state.resources.map((res) => {
        if (res.id === 'A17') {
          return {
            ...res,
            currentIncidentId: 'INC-1051',
            targetPosition3D: [24, 0.5, 16] as [number, number, number],
            etaMinutes: 3.4
          };
        }
        return res;
      });

      const newResult = optimizationService.executeOptimization(
        state.normalizedIncidents,
        updatedResources
      );

      return {
        resources: updatedResources,
        lastOptimizationResult: newResult,
        cameraMode: 'INCIDENT_FOCUS',
        cameraTarget: [24, 0.5, 16],
        selectedIncidentId: 'INC-1051'
      };
    });
  },

  triggerDemoScenario: () => {
    set({ isPredictivePanelOpen: true, selectedRiskZoneId: 'ZONE-A17' });
    get().simulatePrepositioningAction('ZONE-A17');
  }
}));
