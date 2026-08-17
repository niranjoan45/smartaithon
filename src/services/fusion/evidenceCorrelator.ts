import { SourceEvent } from '../../types/sourceEvent';
import { NormalizedIncident } from '../../types/incident';
import { calculateSpatialSimilarity } from './spatialMatcher';
import { calculateTemporalSimilarity } from './temporalMatcher';
import { calculateSemanticSimilarity } from './semanticMatcher';
import { CorrelationResult } from '../../types/fusion';

export function evaluateEventCorrelation(
  event: SourceEvent,
  incident: NormalizedIncident
): CorrelationResult {
  const spatialScore = calculateSpatialSimilarity(event.position3D, incident.position3D);
  const temporalScore = calculateTemporalSimilarity(event.timestamp, incident.timestamp);
  const semanticScore = calculateSemanticSimilarity(
    event.rawText,
    incident.rawText,
    event.metadata.detectedObjects || [],
    []
  );

  const correlationScore = Number((
    0.40 * spatialScore +
    0.30 * temporalScore +
    0.30 * semanticScore
  ).toFixed(2));

  const reasoning: string[] = [
    `Spatial Match: ${Math.round(spatialScore * 100)}%`,
    `Temporal Match: ${Math.round(temporalScore * 100)}%`,
    `Semantic Match: ${Math.round(semanticScore * 100)}%`
  ];

  // Conflict Detection: CCTV reports NO FIRE while IoT/Citizen reports FIRE
  let isConflict = false;
  if (event.metadata.isConflict || (event.rawText.toLowerCase().includes('no fire') && incident.type === 'FIRE')) {
    isConflict = true;
    reasoning.push('⚠️ EVIDENCE CONFLICT: Signal contradicts active incident classification');
  }

  const isMatch = correlationScore >= 0.65;

  return {
    isMatch,
    correlationScore,
    spatialScore,
    temporalScore,
    semanticScore,
    reasoning,
    isConflict
  };
}
