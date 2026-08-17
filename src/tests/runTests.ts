process.env.TEST_SUITE_RUNNING = 'true';

import { LocalSimulationProvider } from '../services/ai/LocalSimulationProvider';
import { extractLocationFromText } from '../services/incident/locationExtractor';
import { calculateSeverityScore } from '../services/incident/severityEngine';
import { calculateEscalationRisk } from '../services/incident/escalationEngine';
import { calculatePriorityScore } from '../services/incident/priorityEngine';
import { correlateIncomingEvent } from '../services/incident/incidentCorrelator';
import { IncidentAnalyzer } from '../services/incident/incidentAnalyzer';
import { NormalizedIncident, EvidenceItem } from '../types/incident';
import { runOptimizationTestSuite } from './optimizationEngine.test';
import { runFusionTestSuite } from './fusionEngine.test';
import { runPredictiveTestSuite } from './predictiveEngine.test';
import { runBackendPersistenceTestSuite } from './backendPersistence.test';
import { runSimulationTestSuite } from './simulationEngine.test';

async function runAllTestSuites() {
  console.log('===================================================');
  console.log('AI CITY GUARDIAN — PHASES 2, 3, 4, 5, 6 & 8 TEST SUITE');
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

  const ai = new LocalSimulationProvider();

  // Phase 2 Tests
  const fireClass = await ai.classifyIncident('Heavy smoke and chemical flames coming from factory tower');
  assert(fireClass.type === 'FIRE' && fireClass.confidence >= 90, 'Test 1: Fire classification & confidence');

  const crashClass = await ai.classifyIncident('Vehicle crash rollover on freeway');
  assert(crashClass.type === 'ACCIDENT' && crashClass.confidence >= 90, 'Test 2: Accident classification');

  const sevP1 = calculateSeverityScore('FIRE', 'Massive fire with 6 trapped victims', 6, 3);
  assert(sevP1.severity === 'P1' && sevP1.severityScore >= 80, 'Test 3: Severity P1 score calculation (Score >= 80)');

  const score1 = calculatePriorityScore(90, 85, 95, 6);
  const score2 = calculatePriorityScore(40, 30, 80, 0);
  assert(score1 > score2, 'Test 4: Priority score ranking comparison');

  const locKnown = extractLocationFromText('Accident near North Highway Interchange Km 14');
  assert(locKnown.confidence === 97 && !locKnown.isUncertain, 'Test 5: Known location extraction');

  const mockExisting: NormalizedIncident = {
    id: 'INC-1001',
    timestamp: Date.now(),
    formattedTimeAgo: 'Just now',
    source: 'CITIZEN_REPORT',
    rawText: 'Crash on North Highway Interchange',
    type: 'ACCIDENT',
    severity: 'P2',
    severityScore: 65,
    severityBreakdown: [],
    confidence: 88,
    locationText: 'North Highway Interchange, Km 14',
    latitude: 19.091,
    longitude: 72.865,
    position3D: [-18, 0.5, -12],
    locationConfidence: 95,
    isLocationUncertain: false,
    peopleAtRisk: 3,
    affectedAreaSqMeters: 300,
    escalationRisk: 60,
    predictedSeverity: 'P2',
    priorityScore: 70,
    priorityRank: 1,
    status: 'ACTIVE',
    requiredServices: ['AMBULANCE'],
    evidence: [{ id: 'E1', source: 'CITIZEN_REPORT', title: 'SOS', confidence: 88, timestamp: '19:00' }],
    aiReasoning: { classificationReasoning: '', severityReasoning: [], escalationReasoning: '', correlationReasoning: '' }
  };

  const incomingCCTV: EvidenceItem = { id: 'E2', source: 'CCTV_STREAM', title: 'CCTV Feed', confidence: 96, timestamp: '19:01' };
  const corrResult = correlateIncomingEvent(incomingCCTV, 'North Highway Interchange, Km 14', 'ACCIDENT', [mockExisting]);
  assert(corrResult.isCorrelated && corrResult.updatedIncident?.confidence === 94, 'Test 6: Multi-source evidence correlation & confidence boost');

  const escResult = calculateEscalationRisk('FIRE', 85, 6, 3);
  assert(escResult.escalationRisk >= 75 && escResult.predictedSeverity === 'P1', 'Test 7: Escalation risk prediction');

  const analyzer = new IncidentAnalyzer();
  const emptyResult = await analyzer.processRawEvent({ source: 'CITIZEN_REPORT', rawText: '' }, []);
  assert(emptyResult.incident.id.startsWith('INC-'), 'Test 8: Malformed input safe fallback handling');

  console.log('\n---------------------------------------------------');
  console.log(`PHASE 2 SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
  console.log('---------------------------------------------------\n');

  // Run Phase 3 Optimization Engine Test Suite
  runOptimizationTestSuite();

  // Run Phase 4 Fusion Engine Test Suite
  await runFusionTestSuite();

  // Run Phase 5 Predictive Engine Test Suite
  runPredictiveTestSuite();

  // Run Phase 6 Backend Persistence Test Suite
  await runBackendPersistenceTestSuite();

  // Run Phase 8 Simulation Engine Test Suite
  runSimulationTestSuite();
}

runAllTestSuites();
