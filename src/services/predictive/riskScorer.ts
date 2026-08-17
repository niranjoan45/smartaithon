import { SpatialGridZoneFeature } from './riskFeatureExtractor';
import { RiskLevel } from '../../types/risk';

export interface RiskScoringResult {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  contributingFactors: string[];
}

export function scoreZoneRisk(feature: SpatialGridZoneFeature): RiskScoringResult {
  let score = 20; // Base background risk
  const factors: string[] = [];

  // Historical Incident Density Component
  const histPts = Math.min(25, feature.historicalDensityCount * 4);
  score += histPts;
  if (histPts > 10) {
    factors.push(`+ High historical incident concentration (${feature.historicalDensityCount} recorded events)`);
  }

  // Recent Fused Activity Component (Phase 4 Integration)
  const recentPts = Math.min(35, feature.recentFusedIncidentsCount * 14);
  score += recentPts;
  if (recentPts > 0) {
    factors.push(`+ Active recent emergency activity (${feature.recentFusedIncidentsCount} fused incidents)`);
  }

  // Severity Weighting Component (Phase 2 Integration)
  if (feature.totalSeverityPoints > 0) {
    const avgSev = feature.totalSeverityPoints / Math.max(1, feature.recentFusedIncidentsCount);
    const sevPts = Math.min(20, Math.round(avgSev * 0.20));
    score += sevPts;
    factors.push(`+ Elevated emergency severity vector (Avg ${Math.round(avgSev)}/100 severity)`);
  }

  // Resource Coverage Gap Penalty (Phase 3 Integration)
  if (feature.hasResourceGap) {
    score += 15;
    factors.push(`+ Weak local emergency coverage gap (Nearest Fire Unit ${feature.nearestFireEtaMin}m ETA)`);
  }

  const finalScore = Math.min(100, Math.max(15, Math.round(score)));

  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 80) riskLevel = 'CRITICAL';
  else if (finalScore >= 65) riskLevel = 'HIGH';
  else if (finalScore >= 45) riskLevel = 'MODERATE';

  return {
    riskScore: finalScore,
    riskLevel,
    contributingFactors: factors
  };
}
