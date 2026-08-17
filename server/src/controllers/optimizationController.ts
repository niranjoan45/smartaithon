import { Request, Response } from 'express';
import { pool, checkDatabaseConnection } from '../config/db';

export async function getOptimizationHistory(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const result = await pool.query(`
      SELECT 
        id, run_code as "runCode", total_eta as "totalETA", average_eta as "averageETA", 
        critical_incident_eta as "criticalIncidentETA", resources_used as "resourcesUsed", 
        resource_utilization_percent as "resourceUtilizationPercent", 
        conflicts_resolved as "conflictsResolved", optimization_score as "optimizationScore", 
        baseline_eta as "baselineETA", optimized_eta as "optimizedETA", 
        time_saved_minutes as "timeSavedMinutes", improvement_percent as "improvementPercent", 
        reasoning, created_at as "createdAt"
      FROM optimization_runs
      ORDER BY created_at DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function saveOptimizationRun(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const b = req.body;
    const result = await pool.query(`
      INSERT INTO optimization_runs (
        run_code, total_eta, average_eta, critical_incident_eta, resources_used, 
        resource_utilization_percent, conflicts_resolved, optimization_score, 
        baseline_eta, optimized_eta, time_saved_minutes, improvement_percent, reasoning
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id, run_code as "runCode", baseline_eta as "baselineETA", optimized_eta as "optimizedETA", improvement_percent as "improvementPercent", created_at as "createdAt"
    `, [
      b.runCode || `OPT-#${Math.floor(Math.random() * 900) + 100}`, b.totalETA || 17.4, b.averageETA || 8.7,
      b.criticalIncidentETA || 3.4, b.resourcesUsed || 2, b.resourceUtilizationPercent || 85,
      b.conflictsResolved || 1, b.optimizationScore || 94, b.baselineETA || 14.2,
      b.optimizedETA || 8.7, b.timeSavedMinutes || 5.5, b.improvementPercent || 38.7,
      b.reasoning || 'Global minimum weighted cost optimization executed.'
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
