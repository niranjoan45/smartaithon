const BASE_URL = 'http://localhost:5000/api';

export interface HealthCheckResponse {
  status: 'HEALTHY' | 'DEGRADED';
  database: 'CONNECTED' | 'OFFLINE';
  timestamp: string;
  version: string;
  mode: 'LIVE PERSISTED' | 'DEMO SIMULATION';
}

export async function checkBackendHealth(): Promise<HealthCheckResponse> {
  try {
    const res = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('Backend HTTP degraded');
    return await res.json();
  } catch (error) {
    return {
      status: 'DEGRADED',
      database: 'OFFLINE',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: 'DEMO SIMULATION'
    };
  }
}
