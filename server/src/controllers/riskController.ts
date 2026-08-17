import { Request, Response } from 'express';
import { pool, checkDatabaseConnection } from '../config/db';

export async function getRiskZones(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const result = await pool.query(`
      SELECT 
        id, zone_code as "zoneCode", name, center_latitude as "centerLatitude", 
        center_longitude as "centerLongitude", position_x as "positionX", 
        position_y as "positionY", position_z as "positionZ", radius, 
        risk_score as "riskScore", risk_level as "riskLevel", 
        predicted_types_json as "predictedTypesJson", 
        prediction_confidence as "predictionConfidence", time_window as "timeWindow", 
        contributing_factors as "contributingFactors", 
        recommended_resources as "recommendedResources", 
        current_resources as "currentResources", 
        current_response_time_min as "currentResponseTimeMin", 
        projected_response_time_min as "projectedResponseTimeMin", 
        estimated_time_saved_min as "estimatedTimeSavedMin", 
        historical_count as "historicalCount", recent_fused_count as "recentFusedCount", 
        is_prepositioned as "isPrepositioned", created_at as "createdAt"
      FROM risk_zones
      ORDER BY risk_score DESC
    `);
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRiskZoneById(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();
  if (!isDbConnected) return res.status(503).json({ error: 'Database Offline' });

  try {
    const result = await pool.query(`
      SELECT 
        id, zone_code as "zoneCode", name, risk_score as "riskScore", 
        risk_level as "riskLevel", contributing_factors as "contributingFactors", 
        current_response_time_min as "currentResponseTimeMin", 
        projected_response_time_min as "projectedResponseTimeMin", 
        estimated_time_saved_min as "estimatedTimeSavedMin"
      FROM risk_zones
      WHERE id = $1 OR zone_code = $1
    `, [req.params.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Risk Zone Not Found' });
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
