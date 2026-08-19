import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useCityStore } from '../../stores/useCityStore';
import { EmergencyUnit } from '../../types/resource';

export function EmergencyVehicles() {
  const { resources, activeRoutes, selectResource, selectedResourceId } = useCityStore();

  return (
    <group>
      {/* 3D Dispatch Route Lines (RED) */}
      {activeRoutes.map((route) => (
        <line key={route.id}>
          <bufferGeometry
            attach="geometry"
            onUpdate={(self) => {
              const points = [
                new THREE.Vector3(...route.from),
                new THREE.Vector3((route.from[0] + route.to[0]) / 2, 4, (route.from[2] + route.to[2]) / 2),
                new THREE.Vector3(...route.to)
              ];
              const curve = new THREE.CatmullRomCurve3(points);
              const curvePoints = curve.getPoints(50);
              self.setFromPoints(curvePoints);
            }}
          />
          <lineBasicMaterial attach="material" color="#dc2626" linewidth={4} />
        </line>
      ))}

      {/* Emergency Vehicle Mesh Units */}
      {resources.map((res) => (
        <SingleEmergencyVehicle
          key={res.id}
          resource={res}
          isSelected={selectedResourceId === res.id}
          onSelect={() => selectResource(res.id)}
        />
      ))}
    </group>
  );
}

interface SingleProps {
  resource: EmergencyUnit;
  isSelected: boolean;
  onSelect: () => void;
}

function SingleEmergencyVehicle({ resource, isSelected, onSelect }: SingleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const sirenRef = useRef<THREE.Mesh>(null);

  const initialPos = resource.position3D || resource.position || [0, 0.5, 0];
  const currentPos = useRef(new THREE.Vector3(...initialPos));

  useFrame((state, delta) => {
    // Siren Beacon Flashing Animation
    if (sirenRef.current) {
      const time = state.clock.getElapsedTime();
      (sirenRef.current.material as THREE.MeshBasicMaterial).opacity = (Math.sin(time * 12) + 1) / 2;
    }

    // Smooth real-world movement towards target location when dispatched
    if (resource.status === 'DISPATCHED' && resource.targetPosition3D && groupRef.current) {
      const targetVec = new THREE.Vector3(
        resource.targetPosition3D[0],
        0.5,
        resource.targetPosition3D[2]
      );

      if (currentPos.current.distanceTo(targetVec) > 0.5) {
        currentPos.current.lerp(targetVec, THREE.MathUtils.clamp(delta * 1.5, 0.01, 0.1));
        groupRef.current.position.copy(currentPos.current);
        groupRef.current.lookAt(targetVec.x, 0.5, targetVec.z);
      }
    }
  });

  return (
    <group 
      ref={groupRef}
      position={initialPos} 
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Dynamic Status Floor Halo Ring (RED) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.5, 2.2, 16]} />
        <meshBasicMaterial color="#dc2626" opacity={isSelected ? 0.9 : 0.6} transparent />
      </mesh>

      {/* Vehicle Geometry Body (STRICTLY RED) */}
      <group>
        {/* Chassis */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <boxGeometry args={resource.type === 'FIRE_TRUCK' ? [2.5, 1.2, 4.5] : [2.0, 1.0, 3.5]} />
          <meshStandardMaterial color="#dc2626" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Cabin Roof */}
        <mesh position={[0, 1.2, -0.3]}>
          <boxGeometry args={resource.type === 'FIRE_TRUCK' ? [2.2, 0.6, 2.2] : [1.8, 0.5, 1.8]} />
          <meshStandardMaterial color="#991b1b" roughness={0.2} />
        </mesh>

        {/* Flashing Emergency Siren Light (RED) */}
        <mesh ref={sirenRef} position={[0, 1.6, 0]}>
          <boxGeometry args={[1.0, 0.25, 0.5]} />
          <meshBasicMaterial color="#ef4444" transparent />
        </mesh>
      </group>

      {/* Floating 3D Callsign & Status Badge (RED) */}
      <Html position={[0, 2.6, 0]} center distanceFactor={25} zIndexRange={[10, 0]}>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider whitespace-nowrap cursor-pointer transition-all duration-200 bg-red-600 text-white font-bold border border-red-400 shadow-lg ${
            isSelected ? 'ring-2 ring-white scale-110' : ''
          }`}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 bg-white animate-ping" />
          {resource.callsign} ({resource.etaMinutes}m)
        </div>
      </Html>
    </group>
  );
}
