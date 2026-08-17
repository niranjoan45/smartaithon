import { checkBackendHealth } from './apiClient';

export async function fetchResourcesApi() {
  const health = await checkBackendHealth();
  if (health.database === 'OFFLINE') return null;

  try {
    const res = await fetch('http://localhost:5000/api/resources');
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}
