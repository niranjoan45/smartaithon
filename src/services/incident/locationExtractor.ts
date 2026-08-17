export interface ExtractedLocation {
  locationText: string;
  position3D: [number, number, number];
  confidence: number;
  isUncertain: boolean;
}

export function extractLocationFromText(rawText: string, locationHint?: string): ExtractedLocation {
  const text = (rawText + ' ' + (locationHint || '')).toLowerCase();

  if (text.includes('highway') || text.includes('interchange') || text.includes('km 14')) {
    return {
      locationText: 'North Highway Interchange, Km 14',
      position3D: [-18, 0.5, -12],
      confidence: 97,
      isUncertain: false
    };
  }

  if (text.includes('sector 4') || text.includes('innovation tower') || text.includes('commercial')) {
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

  if (text.includes('metro') || text.includes('railway') || text.includes('concourse')) {
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

  if (locationHint && locationHint.trim().length > 0) {
    return {
      locationText: locationHint,
      position3D: [(Math.random() - 0.5) * 40, 0.5, (Math.random() - 0.5) * 40],
      confidence: 85,
      isUncertain: false
    };
  }

  // Fallback for missing/unclear location
  return {
    locationText: 'LOCATION UNCERTAIN — Sector 2 Grid',
    position3D: [0, 0.5, 0],
    confidence: 50,
    isUncertain: true
  };
}
