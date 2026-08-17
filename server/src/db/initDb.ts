import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkDatabaseConnection } from '../config/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  console.log('===================================================');
  console.log('AI CITY GUARDIAN — POSTGRESQL SCHEMA INITIALIZER');
  console.log('===================================================\n');

  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    console.warn('⚠️ PostgreSQL connection failed. Ensure DATABASE_URL is set in .env and database is running.');
    return false;
  }

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    const client = await pool.connect();
    try {
      await client.query(sql);
      console.log('✅ PostgreSQL Schema & Indexes initialized successfully.');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Schema initialization error:', error);
    return false;
  }
}

if (process.argv[1] && process.argv[1].endsWith('initDb.ts')) {
  initializeDatabase()
    .then(() => pool.end())
    .catch(() => pool.end());
}
