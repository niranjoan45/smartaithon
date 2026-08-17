import { SourceEvent, SourceType } from '../../types/sourceEvent';

export function normalizeRawSignal(input: {
  sourceType: SourceType;
  rawText: string;
  locationText?: string;
  latitude?: number;
  longitude?: number;
  position3D?: [number, number, number];
  confidence?: number;
  metadata?: SourceEvent['metadata'];
}): SourceEvent {
  const timestamp = Date.now();
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', { hour12: false });
  const id = `SRC-${input.sourceType}-${Math.floor(1000 + Math.random() * 9000)}`;

  const defaultConfidence = 
    input.sourceType === 'CCTV' ? 0.91 :
    input.sourceType === 'IOT' ? 0.88 :
    input.sourceType === 'CITIZEN' ? 0.75 : 0.60;

  return {
    id,
    sourceType: input.sourceType,
    timestamp,
    formattedTime,
    latitude: input.latitude || 19.082,
    longitude: input.longitude || 72.888,
    position3D: input.position3D || [24, 0.5, 16],
    locationText: input.locationText || 'Sector 4 Highway Corridor',
    rawText: input.rawText,
    confidence: input.confidence || defaultConfidence,
    mediaType: input.sourceType === 'CCTV' ? 'IMAGE_STREAM' : input.sourceType === 'IOT' ? 'SENSOR_TELEMETRY' : 'TEXT',
    metadata: input.metadata || {}
  };
}
