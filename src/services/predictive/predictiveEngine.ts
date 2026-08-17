import { RiskZone, PredictiveMetrics, RiskHistoryEntry } from '../../types/risk';
import { FusedIncident } from '../../types/fusion';
import { EmergencyUnit } from '../../types/resource';
import { extractZoneFeatures } from './riskFeatureExtractor';
import { scoreZoneRisk } from './riskScorer';
import { predictZoneIncidentTypes } from './incidentTypePredictor';
import { calculateProactivePositioning } from './proactivePositioner';

export class PredictiveEngine {
  private riskHistory: RiskHistoryEntry[] = [];

  public analyzeCityRisk(
    incidents: FusedIncident[],
    resources: EmergencyUnit[]
  ): { zones: RiskZone[]; metrics: PredictiveMetrics } {
    const rawZonesDef = [
      { id: 'ZONE-A17', name: 'Sector 4 Innovation Highway Corridor', pos: [20, 0, 15] as [number, number, number], lat: 19.082, lng: 72.888, radius: 14 },
      { id: 'ZONE-A02', name: 'North Interchange Logistics Hub', pos: [-20, 0, -15] as [number, number, number], lat: 19.091, lng: 72.865, radius: 12 },
      { id: 'ZONE-A03', name: 'West Commercial Port Area', pos: [-30, 0, 25] as [number, number, number], lat: 19.060, lng: 72.840, radius: 10 }
    ];

    const timestampStr = new Date().toLocaleTimeString('en-US', { hour12: false });

    const zones: RiskZone[] = rawZonesDef.map(def => {
      const feat = extractZoneFeatures(def.id, def.name, def.pos, def.lat, def.lng, incidents, resources);
      const scoring = scoreZoneRisk(feat);
      const predictedTypes = predictZoneIncidentTypes(def.pos, incidents);
      const positionCalc = calculateProactivePositioning(def.pos, predictedTypes[0]?.type || 'FIRE', resources);

      return {
        id: def.id,
        name: def.name,
        position3D: def.pos,
        centerLatitude: def.lat,
        centerLongitude: def.lng,
        radius: def.radius,
        riskScore: scoring.riskScore,
        riskLevel: scoring.riskLevel,
        predictedIncidentTypes: predictedTypes,
        predictionConfidence: Math.min(96, Math.max(70, scoring.riskScore + 8)),
        timeWindow: 'NEXT 60 MIN (20:00–21:00)',
        contributingFactors: scoring.contributingFactors,
        recommendedResources: [`PRE-POSITION 1 ${positionCalc.recommendedType}`],
        currentResources: [`1 ${positionCalc.recommendedType} (Stationary)`],
        currentResponseTimeMin: positionCalc.currentResponseTimeMin,
        projectedResponseTimeMin: positionCalc.projectedResponseTimeMin,
        estimatedTimeSavedMin: positionCalc.estimatedTimeSavedMin,
        lastUpdated: timestampStr,
        historicalDensityCount: feat.historicalDensityCount,
        recentFusedIncidentsCount: feat.recentFusedIncidentsCount
      };
    });

    zones.sort((a, b) => b.riskScore - a.riskScore);

    // Record Risk History
    const top = zones[0];
    if (top) {
      this.riskHistory.unshift({
        timestamp: timestampStr,
        zoneId: top.id,
        riskScore: top.riskScore,
        riskLevel: top.riskLevel,
        topPredictedType: top.predictedIncidentTypes[0]?.type || 'FIRE'
      });
      if (this.riskHistory.length > 10) this.riskHistory.pop();
    }

    const highCount = zones.filter(z => z.riskLevel === 'HIGH').length;
    const critCount = zones.filter(z => z.riskLevel === 'CRITICAL').length;
    const avgTimeSaved = Number((zones.reduce((acc, z) => acc + z.estimatedTimeSavedMin, 0) / zones.length).toFixed(1));

    const metrics: PredictiveMetrics = {
      totalHighRiskZones: highCount,
      totalCriticalZones: critCount,
      topRiskZoneId: top?.id || 'ZONE-A17',
      topRiskScore: top?.riskScore || 87,
      topPredictedType: top?.predictedIncidentTypes[0]?.type || 'FIRE',
      fireCoveragePercent: 72,
      ambulanceCoveragePercent: 91,
      policeCoveragePercent: 84,
      avgTimeSavedMin: avgTimeSaved
    };

    return { zones, metrics };
  }

  public getHistory(): RiskHistoryEntry[] {
    return this.riskHistory;
  }
}

export const predictiveEngine = new PredictiveEngine();
