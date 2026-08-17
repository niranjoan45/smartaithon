import { extractZoneFeatures } from '../services/predictive/riskFeatureExtractor';
import { scoreZoneRisk } from '../services/predictive/riskScorer';
import { predictZoneIncidentTypes } from '../services/predictive/incidentTypePredictor';
import { calculateProactivePositioning } from '../services/predictive/proactivePositioner';
import { predictiveEngine, PredictiveEngine } from '../services/predictive/predictiveEngine';
import { FusedIncident } from '../types/fusion';
import { EmergencyUnit } from '../types/resource';

export function runPredictiveTestSuite() {
  console.log('===================================================');
  console.log('AI CITY GUARDIAN — PHASE 5 PREDICTIVE TEST SUITE');
  console.log('===================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  const mockIncidents: FusedIncident[] = [
    {
      id: 'INC-FUSE-01',
      timestamp: Date.now(),
      formattedTimeAgo: 'Just now',
      source: 'IOT_SENSOR',
      rawText: 'Building fire on Sector 4',
      type: 'FIRE',
      severity: 'P1',
      severityScore: 90,
      severityBreakdown: [],
      confidence: 95,
      fusionConfidence: 0.95,
      locationText: 'Sector 4',
      latitude: 19.082,
      longitude: 72.888,
      position3D: [20, 0.5, 15],
      locationConfidence: 95,
      isLocationUncertain: false,
      peopleAtRisk: 8,
      affectedAreaSqMeters: 800,
      escalationRisk: 85,
      predictedSeverity: 'P1',
      priorityScore: 92,
      priorityRank: 1,
      status: 'ACTIVE',
      requiredServices: ['FIRE'],
      evidence: [],
      sourceEvents: [],
      correlatedReportsCount: 3,
      correlationBreakdown: { spatialScore: 0.95, temporalScore: 0.95, semanticScore: 0.90 },
      hasConflict: false,
      sourceTypesPresent: ['CITIZEN', 'CCTV', 'IOT'],
      auditTrail: [],
      aiReasoning: { classificationReasoning: '', severityReasoning: [], escalationReasoning: '', correlationReasoning: '' }
    }
  ];

  const mockResources: EmergencyUnit[] = [
    {
      id: 'F01',
      callsign: 'FIRE F01',
      type: 'FIRE_TRUCK',
      status: 'AVAILABLE',
      position3D: [-15, 0.5, -15], // Far from Sector 4 (Coverage gap)
      latitude: 19.081,
      longitude: 72.885,
      capabilities: ['structuralFire'],
      speedKmH: 55,
      availableAtTimestamp: Date.now(),
      homeStation: 'Station 1',
      unitHealth: 100,
      driverName: 'Capt. R'
    }
  ];

  // Test 1: Feature Extraction
  const feat = extractZoneFeatures('ZONE-A17', 'Sector 4', [20, 0, 15], 19.082, 72.888, mockIncidents, mockResources);
  assert(feat.recentFusedIncidentsCount === 1 && feat.hasResourceGap, 'Test 1: Spatial zone feature extraction & coverage gap detection');

  // Test 2: Risk Scoring & Classification
  const scoring = scoreZoneRisk(feat);
  assert(scoring.riskScore >= 65 && (scoring.riskLevel === 'HIGH' || scoring.riskLevel === 'CRITICAL'), 'Test 2: Transparent risk scoring & level classification (0-100)');

  // Test 3: Incident Type Distribution
  const types = predictZoneIncidentTypes([20, 0, 15], mockIncidents);
  assert(types.length === 3 && types[0].type === 'FIRE' && types[0].percentage > 50, 'Test 3: Simulated incident category distribution');

  // Test 4: Proactive Positioner (Before vs After ETA Savings)
  const posCalc = calculateProactivePositioning([20, 0, 15], 'FIRE', mockResources);
  assert(posCalc.currentResponseTimeMin > posCalc.projectedResponseTimeMin && posCalc.estimatedTimeSavedMin > 0, 'Test 4: Proactive pre-positioning before/after ETA savings');

  // Test 5: Full Predictive Engine City Risk Execution
  const engine = new PredictiveEngine();
  const cityAnalysis = engine.analyzeCityRisk(mockIncidents, mockResources);
  assert(cityAnalysis.zones.length === 3 && cityAnalysis.metrics.topRiskScore >= 65, 'Test 5: Full predictive engine spatial grid execution');

  // Test 6: Edge Case — Empty Incidents List
  const emptyAnalysis = engine.analyzeCityRisk([], mockResources);
  assert(emptyAnalysis.zones.length === 3 && emptyAnalysis.zones[0].riskScore < 60, 'Test 6: Safe edge case handling with zero historical incidents');

  // Test 7: Edge Case — Zero Available Resources
  const noResourceAnalysis = engine.analyzeCityRisk(mockIncidents, []);
  assert(noResourceAnalysis.zones.length === 3 && noResourceAnalysis.zones[0].currentResponseTimeMin > 0, 'Test 7: Safe edge case handling with zero available resources');

  // Test 8: Deterministic Repeatability
  const run1 = engine.analyzeCityRisk(mockIncidents, mockResources);
  const run2 = engine.analyzeCityRisk(mockIncidents, mockResources);
  assert(run1.metrics.topRiskScore === run2.metrics.topRiskScore, 'Test 8: Deterministic repeatability');

  console.log('\n===================================================');
  console.log(`PREDICTIVE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
  console.log('===================================================\n');

  if (failed > 0) process.exit(1);
}
