export type SourceType = 'CITIZEN' | 'CCTV' | 'IOT' | 'SOCIAL';

export interface SourceEvent {
  id: string;
  sourceType: SourceType;
  timestamp: number;
  formattedTime: string;
  latitude: number;
  longitude: number;
  position3D: [number, number, number];
  locationText: string;
  rawText: string;
  confidence: number; // 0.0 - 1.0
  mediaType?: 'TEXT' | 'IMAGE_STREAM' | 'SENSOR_TELEMETRY' | 'SOCIAL_FEED';
  relatedIncidentId?: string;
  mediaAttachments?: {
    pictures?: string[];
    videoUrl?: string;
    audioUrl?: string;
  };
  gpsLocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  metadata: {
    cameraId?: string;
    sensorId?: string;
    socialPlatform?: string;
    detectedObjects?: string[];
    temperatureCelsius?: number;
    smokeLevel?: string;
    trafficSpeedKmH?: number;
    peopleAtRiskCount?: number;
    engagementCount?: number;
    isConflict?: boolean;
  };
}
