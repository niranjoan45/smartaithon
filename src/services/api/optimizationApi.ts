import { checkBackendHealth } from './apiClient';

export async function fetchOptimizationHistoryApi() {
  const health = await checkBackendHealth();
  if (health.database === 'OFFLINE') return null;

  try {
    const res = await fetch('http://localhost:5000/api/optimization/history');
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function saveOptimizationRunApi(data: any) {
  try {
    const res = await fetch('http://localhost:5000/api/optimization/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (error) {
    return null;
  }
}
