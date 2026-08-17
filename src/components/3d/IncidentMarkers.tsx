import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCityStore } from '../../stores/useCityStore';

export function IncidentMarkers() {
  const { normalizedIncidents, selectedIncidentId, selectIncident } = useCityStore();

  return (
    <group>
      {normalizedIncidents.map((incident) => (
        <SingleIncidentMarker
          key={incident.id}
          incident={incident}
          isSelected={incident.id === selectedIncidentId}
          onSelect={() => selectIncident(incident.id)}
        />
      ))}
    </group>
  );
}

interface MarkerProps {
  incident: any;
  isSelected: boolean;
  onSelect: () => void;
}

function SingleIncidentMarker({ incident, isSelected, onSelect }: MarkerProps) {
  const beaconRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  const isP1 = incident.severity === 'P1';
  const primaryColor = isP1 ? '#dc2626' : '#d97706';

  useFrame((state) => {
    const clock = state.clock.getElapsedTime();

    if (beaconRef.current) {
      beaconRef.current.position.y = 1.2 + Math.sin(clock * 3) * 0.2;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = clock * 0.8;
      const scale = 1 + Math.sin(clock * 2) * 0.15;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  const [x, y, z] = incident.position3D;

  // 3D Evidence Convergence Line Coordinates
  const evidenceNodes: [number, number, number][] = [
    [x + 4, y + 2, z - 3], // CCTV Cam Node
    [x - 3, y + 1.5, z + 4], // IoT Sensor Node
    [x + 3, y + 1, z + 3], // Citizen Signal Node
    [x - 4, y + 2.5, z - 2]  // Social Signal Node
  ];

  return (
    <group position={[x, y, z]}>
      {/* Vertical Light Pillar */}
      <mesh ref={beamRef} position={[0, 7.5, 0]}>
        <cylinderGeometry args={[0.2, 0.6, 15, 16]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={isSelected ? 0.6 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Beacon Sphere */}
      <mesh
        ref={beaconRef}
        position={[0, 1.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color={primaryColor}
          emissive={primaryColor}
          emissiveIntensity={isSelected ? 2.5 : 1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Pulsing Floor Perimeter Ring */}
      <mesh ref={ringRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.0, 32]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3D Converging Evidence Lines */}
      {isSelected && (
        <group>
          {evidenceNodes.map((nodePos, idx) => (
            <mesh key={idx}>
              <tubeGeometry
                args={[
                  new THREE.CatmullRomCurve3([
                    new THREE.Vector3(...nodePos),
                    new THREE.Vector3(0, 1.2, 0)
                  ]),
                  8,
                  0.05,
                  8,
                  false
                ]}
              />
              <meshBasicMaterial color="#ea580c" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* HTML Floating Label */}
      <Html
        position={[0, 3.2, 0]}
        center
        distanceFactor={28}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`cursor-pointer px-2.5 py-1 rounded-lg border font-mono text-[10px] whitespace-nowrap transition-all shadow-md ${
            isSelected
              ? 'bg-orange-500 text-white font-bold ring-2 ring-orange-400 border-orange-500'
              : isP1
              ? 'bg-red-50 text-red-700 border-red-300 font-bold hover:bg-red-100'
              : 'bg-amber-50 text-amber-800 border-amber-300 font-bold hover:bg-amber-100'
          }`}
        >
          <div className="flex items-center gap-1 font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${isP1 ? 'bg-red-600 animate-ping' : 'bg-amber-600'}`} />
            <span>{incident.id}</span>
            <span className="text-[9px] opacity-90">({incident.confidence}%)</span>
          </div>
          <div className="text-[8px] opacity-80">{incident.sourceEvents?.length || 4} Signals Fused</div>
        </div>
      </Html>
    </group>
  );
}
