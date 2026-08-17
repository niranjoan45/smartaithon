import { Request, Response } from 'express';
import { pool, checkDatabaseConnection } from '../config/db';

export async function getHospitals(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const result = await pool.query(`
      SELECT 
        id, hospital_code as "hospitalCode", name, latitude, longitude, 
        position_x as "positionX", position_y as "positionY", position_z as "positionZ", 
        available_beds as "availableBeds", trauma_capacity as "traumaCapacity", 
        emergency_capacity as "emergencyCapacity", specialties, 
        occupancy_rate_percent as "occupancyRatePercent"
      FROM hospitals
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
