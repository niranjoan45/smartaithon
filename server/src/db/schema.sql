-- PostgreSQL Database Schema for AI City Guardian
-- Target Database: ai_city_guardian

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'OPERATOR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_code VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(10) NOT NULL,
  severity_score INT NOT NULL,
  priority_score INT NOT NULL,
  priority_rank INT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  raw_text TEXT NOT NULL,
  location_text VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  position_x DOUBLE PRECISION NOT NULL,
  position_y DOUBLE PRECISION NOT NULL,
  position_z DOUBLE PRECISION NOT NULL,
  people_at_risk INT NOT NULL DEFAULT 0,
  affected_area_sq_meters INT NOT NULL DEFAULT 0,
  escalation_risk INT NOT NULL DEFAULT 0,
  predicted_severity VARCHAR(10) NOT NULL,
  confidence INT NOT NULL DEFAULT 90,
  fusion_confidence DOUBLE PRECISION NOT NULL DEFAULT 0.90,
  has_conflict BOOLEAN NOT NULL DEFAULT FALSE,
  conflict_details TEXT,
  source_types_present TEXT[] DEFAULT '{}',
  assigned_resource_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incident_source_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  position_x DOUBLE PRECISION NOT NULL,
  position_y DOUBLE PRECISION NOT NULL,
  position_z DOUBLE PRECISION NOT NULL,
  location_text VARCHAR(255) NOT NULL,
  raw_text TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  media_type VARCHAR(50),
  metadata_json JSONB,
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  confidence INT NOT NULL,
  timestamp VARCHAR(100) NOT NULL,
  details TEXT,
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_code VARCHAR(100) UNIQUE NOT NULL,
  callsign VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  position_x DOUBLE PRECISION NOT NULL,
  position_y DOUBLE PRECISION NOT NULL,
  position_z DOUBLE PRECISION NOT NULL,
  target_x DOUBLE PRECISION,
  target_y DOUBLE PRECISION,
  target_z DOUBLE PRECISION,
  capabilities TEXT[] DEFAULT '{}',
  current_incident_id VARCHAR(100),
  speed_kmh DOUBLE PRECISION NOT NULL DEFAULT 60.0,
  eta_minutes DOUBLE PRECISION,
  home_station VARCHAR(255) NOT NULL,
  unit_health INT NOT NULL DEFAULT 100,
  driver_name VARCHAR(255) NOT NULL,
  assigned_hospital_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  position_x DOUBLE PRECISION NOT NULL,
  position_y DOUBLE PRECISION NOT NULL,
  position_z DOUBLE PRECISION NOT NULL,
  available_beds INT NOT NULL,
  trauma_capacity INT NOT NULL,
  emergency_capacity INT NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  occupancy_rate_percent INT NOT NULL DEFAULT 75,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS traffic_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id VARCHAR(100) UNIQUE NOT NULL,
  sector_name VARCHAR(255) NOT NULL,
  level VARCHAR(50) NOT NULL,
  speed_multiplier DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  priority_corridor_active BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resource_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  hospital_id VARCHAR(100),
  eta_minutes DOUBLE PRECISION NOT NULL,
  distance_km DOUBLE PRECISION NOT NULL,
  traffic_level VARCHAR(50) NOT NULL,
  capability_match_score INT NOT NULL,
  score INT NOT NULL,
  reasoning_json JSONB,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS optimization_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_code VARCHAR(100) UNIQUE NOT NULL,
  total_eta DOUBLE PRECISION NOT NULL,
  average_eta DOUBLE PRECISION NOT NULL,
  critical_incident_eta DOUBLE PRECISION NOT NULL,
  resources_used INT NOT NULL,
  resource_utilization_percent INT NOT NULL,
  conflicts_resolved INT NOT NULL,
  optimization_score INT NOT NULL,
  baseline_eta DOUBLE PRECISION NOT NULL,
  optimized_eta DOUBLE PRECISION NOT NULL,
  time_saved_minutes DOUBLE PRECISION NOT NULL,
  improvement_percent DOUBLE PRECISION NOT NULL,
  reasoning TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS optimization_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  optimization_run_id UUID REFERENCES optimization_runs(id) ON DELETE CASCADE,
  incident_code VARCHAR(100) NOT NULL,
  resource_callsign VARCHAR(255) NOT NULL,
  eta_minutes DOUBLE PRECISION NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  center_latitude DOUBLE PRECISION NOT NULL,
  center_longitude DOUBLE PRECISION NOT NULL,
  position_x DOUBLE PRECISION NOT NULL,
  position_y DOUBLE PRECISION NOT NULL,
  position_z DOUBLE PRECISION NOT NULL,
  radius DOUBLE PRECISION NOT NULL,
  risk_score INT NOT NULL,
  risk_level VARCHAR(50) NOT NULL,
  predicted_types_json JSONB NOT NULL,
  prediction_confidence INT NOT NULL,
  time_window VARCHAR(255) NOT NULL,
  contributing_factors TEXT[] DEFAULT '{}',
  recommended_resources TEXT[] DEFAULT '{}',
  current_resources TEXT[] DEFAULT '{}',
  current_response_time_min DOUBLE PRECISION NOT NULL,
  projected_response_time_min DOUBLE PRECISION NOT NULL,
  estimated_time_saved_min DOUBLE PRECISION NOT NULL,
  historical_count INT NOT NULL DEFAULT 0,
  recent_fused_count INT NOT NULL DEFAULT 0,
  is_prepositioned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS risk_prediction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE CASCADE,
  risk_score INT NOT NULL,
  risk_level VARCHAR(50) NOT NULL,
  top_predicted_type VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  event_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255),
  description TEXT NOT NULL,
  confidence_after DOUBLE PRECISION,
  metadata_json JSONB,
  incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS dispatch_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_code VARCHAR(100) UNIQUE NOT NULL,
  from_x DOUBLE PRECISION NOT NULL,
  from_y DOUBLE PRECISION NOT NULL,
  from_z DOUBLE PRECISION NOT NULL,
  to_x DOUBLE PRECISION NOT NULL,
  to_y DOUBLE PRECISION NOT NULL,
  to_z DOUBLE PRECISION NOT NULL,
  color VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citizen_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  location_text VARCHAR(255) NOT NULL,
  people_at_risk INT DEFAULT 1,
  type VARCHAR(100) DEFAULT 'FIRE',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(type);
CREATE INDEX IF NOT EXISTS idx_incidents_location_text ON incidents(location_text);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_risk_zones_score ON risk_zones(risk_score);
CREATE INDEX IF NOT EXISTS idx_risk_zones_code ON risk_zones(zone_code);
CREATE INDEX IF NOT EXISTS idx_audit_events_timestamp ON audit_events(timestamp);
