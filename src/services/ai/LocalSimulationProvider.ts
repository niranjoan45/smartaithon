import { 
  AIProvider, 
  AIClassificationResult, 
  AILocationResult, 
  AISeverityResult, 
  AIExtractionResult 
} from './AIProvider';
import { NormalizedIncidentType, NormalizedSeverity } from '../../types/incident';

export class LocalSimulationProvider implements AIProvider {
  public modeName: 'SIMULATION' | 'LIVE' = 'SIMULATION';

  async classifyIncident(rawText: string): Promise<AIClassificationResult> {
    const text = rawText.toLowerCase();

    if (text.includes('fire') || text.includes('smoke') || text.includes('explosion') || text.includes('flame') || text.includes('burn')) {
      return {
        type: 'FIRE',
        confidence: 96,
        reasoning: 'High-thermal indicators and smoke keywords detected in report text.'
      };
    }

    if (text.includes('accident') || text.includes('crash') || text.includes('collision') || text.includes('vehicle') || text.includes('rollover')) {
      return {
        type: 'ACCIDENT',
        confidence: 94,
        reasoning: 'Impact keywords and traffic collision pattern recognized.'
      };
    }

    if (text.includes('flood') || text.includes('water') || text.includes('drain') || text.includes('submerged') || text.includes('rain')) {
      return {
        type: 'FLOOD',
        confidence: 91,
        reasoning: 'Acoustic & hydrological flood keywords matched.'
      };
    }

    if (text.includes('cardiac') || text.includes('collapse') || text.includes('unconscious') || text.includes('heart') || text.includes('stroke')) {
      return {
        type: 'MEDICAL',
        confidence: 95,
        reasoning: 'Acute medical distress symptoms identified in alert.'
      };
    }

    if (text.includes('robbery') || text.includes('crime') || text.includes('gun') || text.includes('assault') || text.includes('shooter')) {
      return {
        type: 'CRIME',
        confidence: 89,
        reasoning: 'Public safety breach indicators detected.'
      };
    }

    if (text.includes('power') || text.includes('transformer') || text.includes('grid') || text.includes('outage') || text.includes('bridge')) {
      return {
        type: 'INFRASTRUCTURE',
        confidence: 90,
        reasoning: 'Utility grid failure anomalies identified.'
      };
    }

    return {
      type: 'OTHER',
      confidence: 75,
      reasoning: 'General alert classified under fallback smart city monitoring.'
    };
  }

  async extractLocation(rawText: string, reporterLocation?: string): Promise<AILocationResult> {
    const text = (rawText + ' ' + (reporterLocation || '')).toLowerCase();

    if (text.includes('highway') || text.includes('interchange') || text.includes('km 14')) {
      return {
        locationText: 'North Highway Interchange, Km 14',
        position3D: [-18, 0.5, -12],
        confidence: 97,
        isUncertain: false
      };
    }

    if (text.includes('sector 4') || text.includes('tower') || text.includes('commercial')) {
      return {
        locationText: 'Sector 4 Innovation Tower',
        position3D: [24, 0.5, 16],
        confidence: 98,
        isUncertain: false
      };
    }

    if (text.includes('industrial') || text.includes('port') || text.includes('logistics')) {
      return {
        locationText: 'Industrial Zone Logistics Port',
        position3D: [-30, 0.5, 28],
        confidence: 92,
        isUncertain: false
      };
    }

    if (text.includes('metro') || text.includes('station') || text.includes('concourse')) {
      return {
        locationText: 'Central Railway Concourse',
        position3D: [5, 0.5, -8],
        confidence: 95,
        isUncertain: false
      };
    }

    if (text.includes('substation') || text.includes('east grid')) {
      return {
        locationText: 'East Grid Substation 09',
        position3D: [32, 0.5, -25],
        confidence: 94,
        isUncertain: false
      };
    }

    // Default procedural fallback for unknown/custom reports
    const randomX = Number(((Math.random() - 0.5) * 45).toFixed(1));
    const randomZ = Number(((Math.random() - 0.5) * 45).toFixed(1));

    return {
      locationText: reporterLocation || 'Sector 2 Smart City Sector',
      position3D: [randomX, 0.5, randomZ],
      confidence: 82,
      isUncertain: false
    };
  }

  async assessSeverity(
    type: NormalizedIncidentType, 
    rawText: string, 
    evidenceCount: number, 
    peopleAtRisk: number
  ): Promise<AISeverityResult> {
    const text = rawText.toLowerCase();
    let score = 30; // base score
    const breakdown = [{ factor: 'Base Incident Assessment', points: 30 }];
    const reasons: string[] = [];

    // Type Severity Factor
    if (type === 'FIRE') {
      score += 25;
      breakdown.push({ factor: 'Thermal Fire Threat', points: 25 });
      reasons.push('Active thermal fire combustion indicators');
    } else if (type === 'ACCIDENT') {
      score += 20;
      breakdown.push({ factor: 'Traffic Crash Collision', points: 20 });
      reasons.push('High-speed vehicle impact vector');
    } else if (type === 'FLOOD') {
      score += 18;
      breakdown.push({ factor: 'Submersion Hazard', points: 18 });
      reasons.push('Rising flood level telemetry');
    }

    // Casualties / People at risk
    if (peopleAtRisk >= 5) {
      score += 25;
      breakdown.push({ factor: 'Multiple Persons at Risk (≥5)', points: 25 });
      reasons.push(`High density population threat (${peopleAtRisk} victims)`);
    } else if (peopleAtRisk > 0) {
      score += 12;
      breakdown.push({ factor: 'Direct Human Risk', points: 12 });
      reasons.push('Human casualties identified');
    }

    // Corroboration Count
    if (evidenceCount >= 3) {
      score += 15;
      breakdown.push({ factor: '3+ Corroborating Sources', points: 15 });
      reasons.push('Cross-validated across 3+ sensor feeds');
    } else if (evidenceCount >= 2) {
      score += 8;
      breakdown.push({ factor: '2 Corroborating Feeds', points: 8 });
      reasons.push('Dual source verification');
    }

    // Keyword Intensifiers
    if (text.includes('critical') || text.includes('trapped') || text.includes('explosion') || text.includes('severe')) {
      score += 10;
      breakdown.push({ factor: 'Severe Keyword Indicators', points: 10 });
      reasons.push('Critical entrapment or explosion signals');
    }

    const finalScore = Math.min(100, Math.max(10, score));
    let severity: NormalizedSeverity = 'P4';
    if (finalScore >= 80) severity = 'P1';
    else if (finalScore >= 60) severity = 'P2';
    else if (finalScore >= 40) severity = 'P3';

    return {
      severity,
      severityScore: finalScore,
      breakdown,
      reasons
    };
  }

  async analyzeEvidenceDetails(rawText: string): Promise<AIExtractionResult> {
    const text = rawText.toLowerCase();

    let people = 2;
    if (text.includes('several') || text.includes('multiple') || text.includes('crowd') || text.includes('many')) {
      people = 6;
    }
    if (text.includes('building') || text.includes('tower') || text.includes('complex')) {
      people = 14;
    }

    const area = people * 120; // 120 sq m per person estimated affected zone

    return {
      peopleAtRisk: people,
      affectedAreaSqMeters: area
    };
  }
}
