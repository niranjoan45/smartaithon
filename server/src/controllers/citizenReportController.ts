import { Request, Response } from 'express';
import { pool, checkDatabaseConnection } from '../config/db';

export async function submitCitizenReport(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();

  try {
    let reportRecord = null;
    if (isDbConnected) {
      const b = req.body;
      const result = await pool.query(`
        INSERT INTO citizen_reports (description, location_text, people_at_risk, type, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, description, location_text as "locationText", created_at as "createdAt"
      `, [
        b.description || b.rawText || 'Citizen emergency report',
        b.locationText || 'Sector 4 Innovation Tower',
        b.peopleAtRisk || 1,
        b.type || 'FIRE',
        b.latitude || 19.082,
        b.longitude || 72.888
      ]);
      reportRecord = result.rows[0];
    }

    res.status(201).json({
      status: 'RECEIVED',
      mode: isDbConnected ? 'LIVE PERSISTED' : 'DEMO SIMULATION',
      report: reportRecord || req.body
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
