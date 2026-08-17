import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { RoadNetwork } from './RoadNetwork';
import { Buildings } from './Buildings';
import { CivilianVehicles } from './CivilianVehicles';
import { EmergencyVehicles } from './EmergencyVehicles';
import { IncidentMarkers } from './IncidentMarkers';
import { RiskZones } from './RiskZones';
import { RadarScanner } from './RadarScanner';
import { CameraController } from './CameraController';
import { useCityStore } from '../../stores/useCityStore';

export function CityScene() {
  const { lowQualityMode, setLowQualityMode, selectIncident, selectResource } = useCityStore();

  return (
    <div className="w-full h-full absolute inset-0 bg-[#f8fafc]">
      <Canvas
        shadows={!lowQualityMode}
        camera={{ position: [0, 45, 55], fov: 45 }}
        gl={{ antialias: !lowQualityMode, alpha: false, powerPreference: 'high-performance' }}
        onPointerMissed={() => {
          selectIncident(null);
          selectResource(null);
        }}
      >
        {/* Dynamic Quality Performance Monitoring */}
        <PerformanceMonitor
          onDecline={() => setLowQualityMode(true)}
          onIncline={() => setLowQualityMode(false)}
        />

        {/* Light Scene Background Color & Fog */}
        <color attach="background" args={['#f8fafc']} />
        <fog attach="fog" args={['#f8fafc', 40, 130]} />

        {/* Bright Clean Daylight / Control Room Lighting System */}
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[30, 50, 20]}
          intensity={1.5}
          castShadow={!lowQualityMode}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Radar Lights STRICTLY RED */}
        <pointLight position={[0, 20, 0]} intensity={1.2} color="#dc2626" distance={60} />
        <pointLight position={[24, 15, 16]} intensity={1.2} color="#ef4444" distance={40} />

        {/* 3D Camera Manager */}
        <CameraController />

        {/* Smooth Orbit Controls */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={10}
          maxDistance={90}
        />

        {/* Scene Children */}
        <Suspense fallback={null}>
          <RoadNetwork />
          <Buildings />
          {!lowQualityMode && <CivilianVehicles />}
          <EmergencyVehicles />
          <IncidentMarkers />
          <RiskZones />
          <RadarScanner />
        </Suspense>
      </Canvas>
    </div>
  );
}
