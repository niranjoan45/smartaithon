import React from 'react';
import * as THREE from 'three';

export function RoadNetwork() {
  return (
    <group>
      {/* Ground Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.9} 
          metalness={0.1} 
        />
      </mesh>

      {/* Grid Floor Lines */}
      <gridHelper 
        args={[160, 40, '#64748b', '#cbd5e1']} 
        position={[0, 0, 0]} 
      />

      {/* Main East-West Highway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[160, 10]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      
      {/* Highway Lane Divider Markings (GREY) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[160, 0.5]} />
        <meshBasicMaterial color="#94a3b8" opacity={0.8} transparent />
      </mesh>

      {/* Secondary East-West Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -25]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 25]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Main North-South Highway */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.011, 0]}>
        <planeGeometry args={[160, 10]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* North-South Lane Divider Markings (GREY) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.021, 0]}>
        <planeGeometry args={[160, 0.5]} />
        <meshBasicMaterial color="#94a3b8" opacity={0.8} transparent />
      </mesh>

      {/* Secondary North-South Roads */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[-30, 0.01, 0]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[30, 0.01, 0]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Elevated Highway Bridge Gantry */}
      <group position={[0, 4, 0]}>
        <mesh position={[-35, -2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 4]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} />
        </mesh>
        <mesh position={[35, -2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 4]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} />
        </mesh>
        {/* Overhead Gantry Beam (GREY) */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[72, 0.4, 0.4]} />
          <meshStandardMaterial color="#64748b" emissive="#475569" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Intersection Ring Markings (GREY) */}
      {[-30, 0, 30].map((x) =>
        [-25, 0, 25].map((z) => (
          <mesh key={`${x}-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.03, z]}>
            <ringGeometry args={[3, 3.5, 16]} />
            <meshBasicMaterial color="#64748b" opacity={0.6} transparent />
          </mesh>
        ))
      )}
    </group>
  );
}
