import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getHealthStatus } from './controllers/healthController';
import { getIncidents, getIncidentById, createIncident, updateIncident } from './controllers/incidentsController';
import { getResources, getResourceById } from './controllers/resourcesController';
import { getHospitals } from './controllers/hospitalsController';
import { getRiskZones, getRiskZoneById } from './controllers/riskController';
import { getOptimizationHistory, saveOptimizationRun } from './controllers/optimizationController';
import { getAuditEvents, createAuditEvent } from './controllers/auditController';
import { submitCitizenReport } from './controllers/citizenReportController';

import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// REST API Router Definitions
app.get('/api/health', getHealthStatus);

app.get('/api/incidents', getIncidents);
app.get('/api/incidents/:id', getIncidentById);
app.post('/api/incidents', createIncident);
app.patch('/api/incidents/:id', updateIncident);

app.get('/api/resources', getResources);
app.get('/api/resources/:id', getResourceById);

app.get('/api/hospitals', getHospitals);

app.get('/api/risk-zones', getRiskZones);
app.get('/api/risk-zones/:id', getRiskZoneById);

app.get('/api/optimization/history', getOptimizationHistory);
app.post('/api/optimization/run', saveOptimizationRun);

app.get('/api/audit', getAuditEvents);
app.post('/api/audit', createAuditEvent);

app.post('/api/citizen-reports', submitCitizenReport);

// Serve Frontend Static Files in Production (Render)
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Wildcard SPA Fallback to index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log('===================================================');
  console.log('AI CITY GUARDIAN BACKEND REST SERVER STARTED');
  console.log(`Port: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log('===================================================');
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Backend server already running on http://localhost:${PORT}`);
  } else {
    console.error(err);
  }
});

export default app;
