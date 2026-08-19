import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCityStore } from '../../stores/useCityStore';

export function RiskZones() {
  const { riskZones, selectedRiskZoneId, selectRiskZone } = useCityStore();

  return (
    <group>
      {riskZones.map((zone) => (
        <SingleRiskZoneMarker
          key={zone.id}
          zone={zone}
          isSelected={zone.id === selectedRiskZoneId}
          onSelect={() => selectRiskZone(zone.id)}
        />
      ))}
    </group>
  );
}

interface ZoneProps {
  zone: any;
  isSelected: boolean;
  onSelect: () => void;
}

function SingleRiskZoneMarker({ zone, isSelected, onSelect }: ZoneProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const isCritical = zone.riskLevel === 'CRITICAL';
  const isHigh = zone.riskLevel === 'HIGH';
  const color = isCritical ? '#ff2a5f' : isHigh ? '#ff8c00' : '#ffb700';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.15;
    }
  });

  const [x, y, z] = zone.position3D || [20, 0, 15];

  return (
    <group position={[x, y + 0.1, z]}>
      {/* Ground Risk Field Ring */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <ringGeometry args={[zone.radius - 1.5, zone.radius, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Holographic Risk Label */}
      <Html position={[0, 4.5, 0]} center distanceFactor={28} zIndexRange={[10, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`cursor-pointer px-3 py-1.5 rounded-xl border font-mono text-[10px] whitespace-nowrap transition-all shadow-xl ${
            isSelected
              ? 'bg-slate-950/95 border-amber-400 text-amber-300 ring-2 ring-amber-500/50'
              : 'bg-slate-900/90 border-amber-500/50 text-amber-300 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{zone.id}</span>
            <span className="text-amber-400 font-extrabold">[{zone.riskScore}/100 {zone.riskLevel}]</span>
          </div>
          <div className="text-[9px] text-slate-300 mt-0.5">
            Top Risk: {zone.predictedIncidentTypes?.[0]?.type || 'FIRE'} ({zone.predictedIncidentTypes?.[0]?.percentage || 64}%)
          </div>
        </div>
      </Html>
    </group>
  );
}
