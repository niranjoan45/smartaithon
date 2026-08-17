import { NormalizedIncident } from '../../types/incident';
import { EmergencyUnit } from '../../types/resource';
import { OptimizationResult, OptimizationRunHistory } from '../../types/optimization';
import { runGlobalOptimization } from './globalOptimizer';

export class OptimizationService {
  private history: OptimizationResult[] = [];

  public executeOptimization(
    incidents: NormalizedIncident[],
    resources: EmergencyUnit[]
  ): OptimizationResult {
    const result = runGlobalOptimization(incidents, resources);
    this.history.unshift(result);
    if (this.history.length > 10) this.history.pop();
    return result;
  }

  public getHistory(): OptimizationResult[] {
    return this.history;
  }

  public getHistorySummary(): OptimizationRunHistory[] {
    return this.history.map(r => ({
      runId: r.runId,
      timestamp: r.formattedTime,
      incidentsCount: r.assignments.length + r.unassignedIncidents.length,
      resourcesCount: r.resourcesUsed,
      assignmentsCount: r.assignments.length,
      avgEta: r.averageETA,
      improvementPercent: r.improvementPercent
    }));
  }
}

export const optimizationService = new OptimizationService();
