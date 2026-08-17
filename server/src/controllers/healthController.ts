import { Request, Response } from 'express';
import { checkDatabaseConnection } from '../config/db';

export async function getHealthStatus(req: Request, res: Response) {
  const isDbConnected = await checkDatabaseConnection();

  res.json({
    status: isDbConnected ? 'HEALTHY' : 'DEGRADED',
    database: isDbConnected ? 'CONNECTED' : 'OFFLINE',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: isDbConnected ? 'LIVE PERSISTED' : 'DEMO SIMULATION'
  });
}
