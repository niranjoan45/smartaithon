import { checkBackendHealth } from './apiClient';

const BASE_URL = 'http://localhost:5000/api/incidents';

export async function fetchIncidentsApi() {
  const health = await checkBackendHealth();
  if (health.database === 'OFFLINE') return null;

  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function submitCitizenReportApi(data: any) {
  try {
    const res = await fetch('http://localhost:5000/api/citizen-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return { status: 'RECEIVED', mode: 'DEMO SIMULATION', report: data };
  }
}
