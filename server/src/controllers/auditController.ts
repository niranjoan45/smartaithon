import { Request, Response } from 'express';
import { pool, checkDatabaseConnection } from '../config/db';

export async function getAuditEvents(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const result = await pool.query(`
      SELECT 
        id, timestamp, event_type as "eventType", entity_id as "entityId", 
        description, confidence_after as "confidenceAfter", metadata_json as "metadataJson"
      FROM audit_events
      ORDER BY timestamp DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function createAuditEvent(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const b = req.body;
    const result = await pool.query(`
      INSERT INTO audit_events (event_type, entity_id, description, confidence_after, metadata_json)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, timestamp, event_type as "eventType", description
    `, [
      b.eventType || 'SYSTEM_EVENT', b.entityId || null, b.description || 'System log event',
      b.confidenceAfter || null, b.metadataJson ? JSON.stringify(b.metadataJson) : null
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
