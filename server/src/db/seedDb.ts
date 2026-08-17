import { pool, checkDatabaseConnection } from '../config/db';

export async function seedDatabase() {
  console.log('===================================================');
  console.log('AI CITY GUARDIAN — POSTGRESQL SEEDING ENGINE (pg)');
  console.log('===================================================\n');

  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    console.warn('⚠️ PostgreSQL offline. Seed skipped.');
    return false;
  }

  const client = await pool.connect();
  try {
    // Seed Hospitals
    console.log('Seeding Hospitals via pg...');
    await client.query(`
      INSERT INTO hospitals (hospital_code, name, latitude, longitude, position_x, position_y, position_z, available_beds, trauma_capacity, emergency_capacity, specialties, occupancy_rate_percent)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12),
        ($13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      ON CONFLICT (hospital_code) DO NOTHING;
    `, [
      'HOSP-01', 'City General Trauma Center', 19.095, 72.855, -25, 0.5, -20, 18, 95, 85, ['Level-1 Trauma', 'Cardiac Care', 'Burn Unit'], 72,
      'HOSP-02', 'Westside Medical Hub', 19.065, 72.835, -35, 0.5, 15, 12, 80, 90, ['General Emergency', 'Pediatrics'], 80
    ]);

    // Seed Resources
    console.log('Seeding Emergency Units (pg)...');
    await client.query(`
      INSERT INTO resources (unit_code, callsign, type, status, latitude, longitude, position_x, position_y, position_z, target_x, target_y, target_z, capabilities, current_incident_id, speed_kmh, eta_minutes, home_station, unit_health, driver_name)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19),
        ($20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38)
      ON CONFLICT (unit_code) DO NOTHING;
    `, [
      'A17', 'AMBULANCE A17', 'AMBULANCE', 'DISPATCHED', 19.088, 72.860, -5, 0.5, -2, -18, 0.5, -12, ['trauma', 'advancedLifeSupport'], 'INC-1042', 68.0, 3.8, 'North Central Station', 98, 'Officer Miller',
      'F01', 'FIRE TRUCK F01', 'FIRE_TRUCK', 'DISPATCHED', 19.081, 72.885, 10, 0.5, 25, 24, 0.5, 16, ['structuralFire', 'rescue', 'hazmat'], 'INC-1051', 55.0, 3.4, 'Sector 4 Fire Station', 100, 'Captain Rodriguez'
    ]);

    // Seed Incidents
    console.log('Seeding Smart City Emergency Incidents (pg)...');
    await client.query(`
      INSERT INTO incidents (incident_code, type, severity, severity_score, priority_score, priority_rank, status, raw_text, location_text, latitude, longitude, position_x, position_y, position_z, people_at_risk, affected_area_sq_meters, escalation_risk, predicted_severity, confidence, fusion_confidence, has_conflict, source_types_present, assigned_resource_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      ON CONFLICT (incident_code) DO NOTHING;
    `, [
      'INC-1051', 'FIRE', 'P1', 94, 96, 1, 'ACTIVE',
      'Thermal detector array anomaly & Citizen 911 report: Rapid fire escalation at Sector 4 Innovation Tower commercial building.',
      'Sector 4 Innovation Tower', 19.082, 72.888, 24, 0.5, 16, 14, 1680, 89, 'P1', 98, 0.98, false, ['CITIZEN', 'CCTV', 'IOT', 'SOCIAL'], 'F01'
    ]);

    // Seed Risk Zones
    console.log('Seeding Predictive Risk Zones (pg)...');
    await client.query(`
      INSERT INTO risk_zones (zone_code, name, center_latitude, center_longitude, position_x, position_y, position_z, radius, risk_score, risk_level, predicted_types_json, prediction_confidence, time_window, contributing_factors, recommended_resources, current_resources, current_response_time_min, projected_response_time_min, estimated_time_saved_min, historical_count, recent_fused_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (zone_code) DO NOTHING;
    `, [
      'ZONE-A17', 'Sector 4 Innovation Highway Corridor', 19.082, 72.888, 20, 0, 15, 14, 87, 'HIGH',
      JSON.stringify([{ type: 'FIRE', percentage: 64 }, { type: 'ACCIDENT', percentage: 21 }, { type: 'MEDICAL', percentage: 15 }]),
      94, 'NEXT 60 MIN (20:00–21:00)',
      ['+ High historical incident concentration', '+ 3 active fused emergency incidents', '+ Weak local Fire Truck coverage (8.4m ETA gap)'],
      ['PRE-POSITION 1 FIRE TRUCK'], ['1 FIRE TRUCK (Stationary)'],
      8.4, 4.1, 4.3, 14, 3
    ]);

    console.log('\n✅ PostgreSQL Data Seeding complete (pg).');
    return true;
  } catch (error) {
    console.error('❌ Seeding error:', error);
    return false;
  } finally {
    client.release();
  }
}

if (process.argv[1] && process.argv[1].endsWith('seedDb.ts')) {
  seedDatabase()
    .then(() => pool.end())
    .catch(() => pool.end());
}
