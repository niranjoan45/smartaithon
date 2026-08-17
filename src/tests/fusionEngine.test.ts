import { normalizeRawSignal } from '../services/fusion/sourceNormalizer';
import { calculateSpatialSimilarity } from '../services/fusion/spatialMatcher';
import { calculateTemporalSimilarity } from '../services/fusion/temporalMatcher';
import { calculateSemanticSimilarity } from '../services/fusion/semanticMatcher';
import { evaluateEventCorrelation } from '../services/fusion/evidenceCorrelator';
import { IncidentFusionEngine } from '../services/fusion/incidentFusionEngine';
import { FusedIncident } from '../types/fusion';

export async function runFusionTestSuite() {
  console.log('===================================================');
  console.log('AI CITY GUARDIAN — PHASE 4 FUSION TEST SUITE');
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

  // Test 1-4: Source Event Normalization across 4 sources
  const citizenEvt = normalizeRawSignal({ sourceType: 'CITIZEN', rawText: 'Fire near highway' });
  const cctvEvt = normalizeRawSignal({ sourceType: 'CCTV', rawText: 'Smoke detected', confidence: 0.94 });
  const iotEvt = normalizeRawSignal({ sourceType: 'IOT', rawText: 'Critical thermal fire escalation 95C with trapped victims', confidence: 0.96 });
  const socialEvt = normalizeRawSignal({ sourceType: 'SOCIAL', rawText: 'Massive fire posts', confidence: 0.65 });

  assert(citizenEvt.sourceType === 'CITIZEN' && citizenEvt.id.startsWith('SRC-CITIZEN'), 'Test 1: Citizen event normalization');
  assert(cctvEvt.sourceType === 'CCTV' && cctvEvt.mediaType === 'IMAGE_STREAM', 'Test 2: CCTV event normalization');
  assert(iotEvt.sourceType === 'IOT' && iotEvt.mediaType === 'SENSOR_TELEMETRY', 'Test 3: IoT event normalization');
  assert(socialEvt.sourceType === 'SOCIAL' && socialEvt.confidence === 0.65, 'Test 4: Social event normalization');

  // Test 5: Spatial Distance Matching (<250m vs >500m)
  const spatialNear = calculateSpatialSimilarity([20, 0.5, 20], [22, 0.5, 21]);
  const spatialFar = calculateSpatialSimilarity([20, 0.5, 20], [80, 0.5, 80]);
  assert(spatialNear >= 0.90 && spatialFar <= 0.20, 'Test 5: Spatial distance matching thresholds');

  // Test 6: Temporal Window Matching (<2 min vs >5 min)
  const now = Date.now();
  const tempNear = calculateTemporalSimilarity(now, now - 60000);
  const tempFar = calculateTemporalSimilarity(now, now - 600000);
  assert(tempNear >= 0.90 && tempFar <= 0.20, 'Test 6: Temporal similarity window matching');

  // Test 7: Semantic Overlap Matching
  const semMatch = calculateSemanticSimilarity('Building fire trapped people', 'Structure fire smoke plume');
  assert(semMatch >= 0.85, 'Test 7: Local semantic keyword matching');

  // Test 8: Correlation Scoring
  const baseInc: FusedIncident = {
    id: 'INC-FUSE-01',
    timestamp: now,
    formattedTimeAgo: 'Just now',
    source: 'CITIZEN_REPORT',
    rawText: 'Building fire on Sector 4',
    type: 'FIRE',
    severity: 'P2',
    severityScore: 70,
    severityBreakdown: [],
    confidence: 75,
    fusionConfidence: 0.75,
    locationText: 'Sector 4',
    latitude: 19.082,
    longitude: 72.888,
    position3D: [24, 0.5, 16],
    locationConfidence: 90,
    isLocationUncertain: false,
    peopleAtRisk: 5,
    affectedAreaSqMeters: 500,
    escalationRisk: 70,
    predictedSeverity: 'P2',
    priorityScore: 75,
    priorityRank: 1,
    status: 'ACTIVE',
    requiredServices: ['FIRE'],
    evidence: [],
    sourceEvents: [citizenEvt],
    correlatedReportsCount: 1,
    correlationBreakdown: { spatialScore: 1.0, temporalScore: 1.0, semanticScore: 1.0 },
    hasConflict: false,
    sourceTypesPresent: ['CITIZEN'],
    auditTrail: [],
    aiReasoning: { classificationReasoning: 'Fire keyword match', severityReasoning: [], escalationReasoning: '', correlationReasoning: '' }
  };

  const corrRes = evaluateEventCorrelation(cctvEvt, baseInc);
  assert(corrRes.isMatch && corrRes.correlationScore >= 0.70, 'Test 8: Multi-dimensional correlation scoring');

  // Test 9: Bounded Confidence Calculation
  const engine = new IncidentFusionEngine();
  const boundedConf = engine.calculateBoundedConfidence([citizenEvt, cctvEvt, iotEvt]);
  assert(boundedConf > 0.85 && boundedConf <= 0.98, 'Test 9: Bounded confidence calculation (0.00 - 0.98)');

  // Test 10: Conflicting Evidence Handling
  const conflictEvt = normalizeRawSignal({ sourceType: 'CCTV', rawText: 'No fire detected optical clarity fine', metadata: { isConflict: true } });
  const confConflict = engine.calculateBoundedConfidence([citizenEvt, conflictEvt], true);
  assert(confConflict < boundedConf, 'Test 10: Conflicting evidence handling & confidence penalty');

  // Test 11: Unrelated Events Remain Separate
  const unrelatedEvt = normalizeRawSignal({
    sourceType: 'CITIZEN',
    rawText: 'Traffic signal failure at Far South Sector',
    position3D: [-80, 0.5, -80]
  });

  const fuseUnrelated = await engine.fuseSourceEvent(unrelatedEvt, [baseInc]);
  assert(fuseUnrelated.isNewIncident && fuseUnrelated.fusedIncidents.length === 2, 'Test 11: Unrelated events remain separate incidents');

  // Test 12: Phase 2 Integration (Severity Escalation Recalculation)
  const fuseP1 = await engine.fuseSourceEvent(iotEvt, [baseInc]);
  const targetInc = fuseP1.fusedIncidents.find(i => i.id === baseInc.id);
  assert(targetInc?.severity === 'P1' || fuseP1.reoptimizationRecommended, 'Test 12: Phase 2 integration & severity escalation');

  // Test 13: Deterministic Repeatability
  const repeat1 = await engine.fuseSourceEvent(cctvEvt, [baseInc]);
  const repeat2 = await engine.fuseSourceEvent(cctvEvt, [baseInc]);
  assert(repeat1.targetIncidentId === repeat2.targetIncidentId, 'Test 13: Deterministic repeatability');

  // Test 14: EXPLICIT MANDATORY TEST CASE
  // 10 citizen reports + 1 CCTV + 1 IoT MUST produce ONE unified incident, NOT 12 incidents!
  let testIncidentsList: FusedIncident[] = [];
  const targetPos: [number, number, number] = [24, 0.5, 16];

  for (let i = 1; i <= 10; i++) {
    const r = normalizeRawSignal({
      sourceType: 'CITIZEN',
      rawText: `Report #${i}: Heavy smoke pouring out of Innovation Tower highway corridor`,
      position3D: targetPos
    });
    const res = await engine.fuseSourceEvent(r, testIncidentsList);
    testIncidentsList = res.fusedIncidents;
  }

  // Add 1 CCTV and 1 IoT at the exact same location
  const testCCTV = normalizeRawSignal({
    sourceType: 'CCTV',
    rawText: 'CCTV Cam #42: Optical smoke plume detected at Innovation Tower',
    position3D: targetPos,
    confidence: 0.94
  });

  const testIoT = normalizeRawSignal({
    sourceType: 'IOT',
    rawText: 'IoT Thermal Node #04: Rapid thermal gradient spike detected',
    position3D: targetPos,
    confidence: 0.96
  });

  const resCCTV = await engine.fuseSourceEvent(testCCTV, testIncidentsList);
  testIncidentsList = resCCTV.fusedIncidents;

  const resIoT = await engine.fuseSourceEvent(testIoT, testIncidentsList);
  testIncidentsList = resIoT.fusedIncidents;

  assert(
    testIncidentsList.length === 1 && testIncidentsList[0].correlatedReportsCount >= 10,
    'Test 14: EXPLICIT PROOF — 10 citizen reports + 1 CCTV + 1 IoT produced ONE unified incident'
  );

  console.log('\n===================================================');
  console.log(`FUSION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED.`);
  console.log('===================================================\n');

  if (failed > 0) process.exit(1);
}
