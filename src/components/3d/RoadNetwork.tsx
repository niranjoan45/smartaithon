import React from 'react';
import * as THREE from 'three';

export function RoadNetwork() {
  return (
    <group>
      {/* Ground Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial 
          color="#1e293b" 
          roughness={0.9} 
          metalness={0.1} 
        />
      </mesh>

      {/* Grid Floor Lines */}
      <gridHelper 
        args={[160, 40, '#475569', '#334155']} 
        position={[0, 0, 0]} 
      />

      {/* Main East-West Highway (JET BLACK) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[160, 10]} />
        <meshStandardMaterial color="#0a0d14" roughness={0.4} metalness={0.2} />
      </mesh>
      
      {/* Highway Center Divider Markings (BRIGHT YELLOW) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[160, 0.4]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* Secondary East-West Roads (JET BLACK) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -25]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#0a0d14" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 25]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#0a0d14" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Main North-South Highway (JET BLACK) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.011, 0]}>
        <planeGeometry args={[160, 10]} />
        <meshStandardMaterial color="#0a0d14" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* North-South Center Divider Markings (BRIGHT YELLOW) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.021, 0]}>
        <planeGeometry args={[160, 0.4]} />
        <meshBasicMaterial color="#eab308" />
      </mesh>

      {/* Secondary North-South Roads (JET BLACK) */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[-30, 0.01, 0]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#0a0d14" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[30, 0.01, 0]}>
        <planeGeometry args={[160, 6]} />
        <meshStandardMaterial color="#0a0d14" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Elevated Highway Bridge Gantry */}
      <group position={[0, 4, 0]}>
        <mesh position={[-35, -2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 4]} />
          <meshStandardMaterial color="#334155" metalness={0.5} />
        </mesh>
        <mesh position={[35, -2, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 4]} />
          <meshStandardMaterial color="#334155" metalness={0.5} />
        </mesh>
        {/* Overhead Gantry Beam */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[72, 0.4, 0.4]} />
          <meshStandardMaterial color="#1e293b" emissive="#0284c7" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Intersection Ring Markings (WHITE) */}
      {[-30, 0, 30].map((x) =>
        [-25, 0, 25].map((z) => (
          <mesh key={`${x}-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.03, z]}>
            <ringGeometry args={[3, 3.4, 16]} />
            <meshBasicMaterial color="#f8fafc" opacity={0.6} transparent />
          </mesh>
        ))
      )}
    </group>
  );
}
