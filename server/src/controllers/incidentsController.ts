import { Request, Response } from 'express';
import { pool, checkDatabaseConnection } from '../config/db';

export async function getIncidents(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) {
    return res.status(503).json({ error: 'Database Offline', mode: 'DEMO SIMULATION' });
  }

  try {
    const result = await pool.query(`
      SELECT 
        id, incident_code as "incidentCode", type, severity, severity_score as "severityScore", 
        priority_score as "priorityScore", priority_rank as "priorityRank", status, raw_text as "rawText", 
        location_text as "locationText", latitude, longitude, position_x as "positionX", 
        position_y as "positionY", position_z as "positionZ", people_at_risk as "peopleAtRisk", 
        affected_area_sq_meters as "affectedAreaSqMeters", escalation_risk as "escalationRisk", 
        predicted_severity as "predictedSeverity", confidence, fusion_confidence as "fusionConfidence", 
        has_conflict as "hasConflict", conflict_details as "conflictDetails", 
        source_types_present as "sourceTypesPresent", assigned_resource_id as "assignedResourceId", 
        created_at as "createdAt", updated_at as "updatedAt"
      FROM incidents
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getIncidentById(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const result = await pool.query(`
      SELECT 
        id, incident_code as "incidentCode", type, severity, severity_score as "severityScore", 
        priority_score as "priorityScore", priority_rank as "priorityRank", status, raw_text as "rawText", 
        location_text as "locationText", latitude, longitude, position_x as "positionX", 
        position_y as "positionY", position_z as "positionZ", people_at_risk as "peopleAtRisk", 
        affected_area_sq_meters as "affectedAreaSqMeters", escalation_risk as "escalationRisk", 
        predicted_severity as "predictedSeverity", confidence, fusion_confidence as "fusionConfidence", 
        has_conflict as "hasConflict", conflict_details as "conflictDetails", 
        source_types_present as "sourceTypesPresent", assigned_resource_id as "assignedResourceId", 
        created_at as "createdAt", updated_at as "updatedAt"
      FROM incidents
      WHERE id = $1 OR incident_code = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Incident Not Found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createIncident(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const b = req.body;
    const result = await pool.query(`
      INSERT INTO incidents (
        incident_code, type, severity, severity_score, priority_score, priority_rank, status, 
        raw_text, location_text, latitude, longitude, position_x, position_y, position_z, 
        people_at_risk, affected_area_sq_meters, escalation_risk, predicted_severity, confidence, 
        fusion_confidence, has_conflict, conflict_details, source_types_present, assigned_resource_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING id, incident_code as "incidentCode", type, status, created_at as "createdAt"
    `, [
      b.incidentCode || `INC-${Date.now()}`, b.type || 'FIRE', b.severity || 'P1', b.severityScore || 90,
      b.priorityScore || 92, b.priorityRank || 1, b.status || 'ACTIVE', b.rawText || 'Emergency event',
      b.locationText || 'Sector 4', b.latitude || 19.082, b.longitude || 72.888,
      b.position3D?.[0] ?? b.positionX ?? 20.0, b.position3D?.[1] ?? b.positionY ?? 0.5, b.position3D?.[2] ?? b.positionZ ?? 15.0,
      b.peopleAtRisk || 1, b.affectedAreaSqMeters || 500, b.escalationRisk || 70, b.predictedSeverity || 'P1',
      b.confidence || 90, b.fusionConfidence || 0.90, b.hasConflict || false, b.conflictDetails || null,
      b.sourceTypesPresent || ['CITIZEN'], b.assignedResourceId || null
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateIncident(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const b = req.body;
    const result = await pool.query(`
      UPDATE incidents
      SET 
        status = COALESCE($1, status),
        severity = COALESCE($2, severity),
        assigned_resource_id = COALESCE($3, assigned_resource_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 OR incident_code = $4
      RETURNING id, incident_code as "incidentCode", status, severity, updated_at as "updatedAt"
    `, [b.status, b.severity, b.assignedResourceId, req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Incident Not Found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
