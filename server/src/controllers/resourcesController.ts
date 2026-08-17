import { Request, Response } from 'express';
import { pool, checkDatabaseConnection } from '../config/db';

export async function getResources(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const result = await pool.query(`
      SELECT 
        id, unit_code as "unitCode", callsign, type, status, latitude, longitude, 
        position_x as "positionX", position_y as "positionY", position_z as "positionZ", 
        target_x as "targetX", target_y as "targetY", target_z as "targetZ", 
        capabilities, current_incident_id as "currentIncidentId", speed_kmh as "speedKmH", 
        eta_minutes as "etaMinutes", home_station as "homeStation", unit_health as "unitHealth", 
        driver_name as "driverName", created_at as "createdAt", updated_at as "updatedAt"
      FROM resources
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getResourceById(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const result = await pool.query(`
      SELECT 
        id, unit_code as "unitCode", callsign, type, status, latitude, longitude, 
        position_x as "positionX", position_y as "positionY", position_z as "positionZ", 
        capabilities, current_incident_id as "currentIncidentId", speed_kmh as "speedKmH", 
        eta_minutes as "etaMinutes", home_station as "homeStation", unit_health as "unitHealth", 
        driver_name as "driverName"
      FROM resources
      WHERE id = $1 OR unit_code = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Resource Not Found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
