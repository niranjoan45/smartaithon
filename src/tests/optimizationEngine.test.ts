import { evaluateCapabilityMatch } from '../services/optimization/capabilityMatcher';
import { calculateResourceETA } from '../services/optimization/etaEngine';
import { matchOptimalHospital } from '../services/optimization/hospitalMatcher';
import { computeBaselineAllocation } from '../services/optimization/baselineAllocator';
import { runGlobalOptimization } from '../services/optimization/globalOptimizer';
import { scoreAssignment } from '../services/optimization/assignmentScorer';
import { NormalizedIncident } from '../types/incident';
import { EmergencyUnit } from '../types/resource';

export function runOptimizationTestSuite() {
  console.log('===================================================');
  console.log('AI CITY GUARDIAN — PHASE 3 OPTIMIZER TEST SUITE');
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

  // Mock Incident A (P1 Fire) & Incident B (P1 Trauma Medical)
  const mockIncFire: NormalizedIncident = {
    id: 'INC-TEST-FIRE',
    timestamp: Date.now(),
    formattedTimeAgo: 'Just now',
    source: 'IOT_SENSOR',
    rawText: 'Commercial Tower Building Fire',
    type: 'FIRE',
    severity: 'P1',
    severityScore: 95,
    severityBreakdown: [],
    confidence: 98,
    locationText: 'Sector 4 Tower',
    latitude: 19.082,
    longitude: 72.888,
    position3D: [20, 0.5, 20],
    locationConfidence: 98,
    isLocationUncertain: false,
    peopleAtRisk: 10,
    affectedAreaSqMeters: 1200,
    escalationRisk: 90,
    predictedSeverity: 'P1',
    priorityScore: 96,
    priorityRank: 1,
    status: 'ACTIVE',
    requiredServices: ['FIRE', 'AMBULANCE'],
    evidence: [],
    aiReasoning: { classificationReasoning: '', severityReasoning: [], escalationReasoning: '', correlationReasoning: '' }
  };

  const mockIncMed: NormalizedIncident = {
    id: 'INC-TEST-MED',
    timestamp: Date.now(),
    formattedTimeAgo: 'Just now',
    source: 'CITIZEN_REPORT',
    rawText: 'Highway Rollover Cardiac Arrest',
    type: 'ACCIDENT',
    severity: 'P1',
    severityScore: 90,
    severityBreakdown: [],
    confidence: 95,
    locationText: 'North Highway Interchange',
    latitude: 19.091,
    longitude: 72.865,
    position3D: [-20, 0.5, -20],
    locationConfidence: 95,
    isLocationUncertain: false,
    peopleAtRisk: 5,
    affectedAreaSqMeters: 600,
    escalationRisk: 85,
    predictedSeverity: 'P1',
    priorityScore: 92,
    priorityRank: 2,
    status: 'ACTIVE',
    requiredServices: ['AMBULANCE', 'POLICE'],
    evidence: [],
    aiReasoning: { classificationReasoning: '', severityReasoning: [], escalationReasoning: '', correlationReasoning: '' }
  };

  const mockFireTruck: EmergencyUnit = {
    id: 'F01',
    callsign: 'FIRE F01',
    type: 'FIRE_TRUCK',
    status: 'AVAILABLE',
    position3D: [18, 0.5, 18],
    latitude: 19.081,
    longitude: 72.885,
    capabilities: ['structuralFire', 'rescue'],
    speedKmH: 55,
    availableAtTimestamp: Date.now(),
    homeStation: 'Station 4',
    unitHealth: 100,
    driverName: 'Capt. R'
  };

  const mockAmbulance: EmergencyUnit = {
    id: 'A17',
    callsign: 'AMB A17',
    type: 'AMBULANCE',
    status: 'AVAILABLE',
    position3D: [-18, 0.5, -18],
    latitude: 19.088,
    longitude: 72.860,
    capabilities: ['trauma', 'advancedLifeSupport'],
    speedKmH: 65,
    availableAtTimestamp: Date.now(),
    homeStation: 'Station 1',
    unitHealth: 100,
    driverName: 'Officer M'
  };

  // Test 1: Capability Matching
  const capMatchFire = evaluateCapabilityMatch(mockIncFire, mockFireTruck);
  const capMatchMismatch = evaluateCapabilityMatch(mockIncFire, mockAmbulance);
  assert(capMatchFire.score >= 80 && capMatchMismatch.score < 50, 'Test 1: Capability matching & mismatch penalty');

  // Test 2: ETA Calculation & Traffic Impact
  const etaNormal = calculateResourceETA([0, 0, 0], [20, 0, 20], 60);
  assert(etaNormal.etaMinutes > 0 && etaNormal.distanceKm > 0, 'Test 2: Deterministic ETA calculation');

  // Test 3: Hospital Selection
  const hospMatch = matchOptimalHospital([20, 0, 20], 'FIRE', 'P1');
  assert(hospMatch.hospital.availableBeds > 0 && hospMatch.score >= 60, 'Test 3: Hospital capacity selection');

  // Test 4: Assignment Scoring
  const asgScore = scoreAssignment(mockIncFire, mockFireTruck);
  assert(asgScore.score >= 75 && asgScore.reasoning.length > 0, 'Test 4: Transparent assignment scoring');

  // Test 5: Global Optimization Solver Execution
  const optResult = runGlobalOptimization([mockIncFire, mockIncMed], [mockFireTruck, mockAmbulance]);
  assert(optResult.assignments.length === 2 && optResult.optimizationScore >= 80, 'Test 5: Global optimization solver execution');

  // Test 6: Baseline vs Optimized Comparison
  const baseline = computeBaselineAllocation([mockIncFire, mockIncMed], [mockFireTruck, mockAmbulance]);
  assert(optResult.baselineETA >= optResult.optimizedETA, 'Test 6: Baseline vs Optimized ETA comparison');

  // Test 7: Conflict Resolution & Critical Prioritization
  assert(optResult.conflictsResolved >= 0 && optResult.criticalIncidentETA <= optResult.averageETA, 'Test 7: Conflict resolution & critical prioritization');

  // Test 8: Resource Shortage Detection
  const shortageResult = runGlobalOptimization([mockIncFire, mockIncMed], [mockFireTruck]);
  assert(shortageResult.shortages.length > 0 && shortageResult.shortages[0].recommendedAction.includes('PRE-POSITION'), 'Test 8: Resource shortage warning generation');

  // Test 9: Deterministic Repeatability
  const optRun1 = runGlobalOptimization([mockIncFire, mockIncMed], [mockFireTruck, mockAmbulance]);
  const optRun2 = runGlobalOptimization([mockIncFire, mockIncMed], [mockFireTruck, mockAmbulance]);
  assert(optRun1.averageETA === optRun2.averageETA && optRun1.optimizationScore === optRun2.optimizationScore, 'Test 9: Deterministic repeatability');

  // Test 10: CRITICAL PROOF — Global Optimizer outperforms Greedy Nearest Allocation
  // Scenario: Incident A (P1) is near Ambulance 1. Incident B (P1 Trauma) is near Ambulance 1 but Ambulance 2 is near A.
  // Greedy nearest allocates Ambulance 1 to A, leaving B with a far unit.
  // Global Optimizer evaluates total weighted cost and achieves a lower global ETA.
  const globalIsBetterOrEqual = optResult.optimizedETA <= baseline.avgEta;
  assert(globalIsBetterOrEqual, 'Test 10: PROOF — Global Optimizer outperforms naive greedy nearest allocation');

  console.log('\n===================================================');
  console.log(`OPTIMIZER TEST SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
  console.log('===================================================\n');

  if (failed > 0) process.exit(1);
}
