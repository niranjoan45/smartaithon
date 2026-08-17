import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function RadarScanner() {
  const sweepRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Rotating radar sweep beam
    if (sweepRef.current) {
      sweepRef.current.rotation.y += delta * 0.8;
    }

    // Expanding concentric radar pulse ring
    if (ringRef.current) {
      const time = state.clock.getElapsedTime();
      const radius = (time * 15) % 80;
      ringRef.current.scale.set(radius, radius, 1);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.4 - radius / 120);
    }
  });

  return (
    <group position={[0, 0.1, 0]}>
      {/* Rotating Radar Sweep Cone Sector (STRICTLY RED) */}
      <group ref={sweepRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[0, 75, 32, 1, 0, Math.PI / 3]} />
          <meshBasicMaterial color="#dc2626" opacity={0.3} transparent side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Expanding Concentric Pulse Wave Ring (STRICTLY RED) */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[0.95, 1.0, 64]} />
        <meshBasicMaterial color="#ef4444" opacity={0.5} transparent />
      </mesh>
    </group>
  );
}
