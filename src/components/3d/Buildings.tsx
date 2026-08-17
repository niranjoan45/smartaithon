import React, { useMemo } from 'react';
import * as THREE from 'three';

interface BuildingData {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  hasHelipad?: boolean;
}

export function Buildings() {
  // Generate deterministic light city building grid
  const buildings = useMemo<BuildingData[]>(() => {
    const list: BuildingData[] = [];
    let count = 0;

    const colors = ['#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'];

    // Avoid roads (x: -30, 0, 30; z: -25, 0, 25)
    for (let x = -50; x <= 50; x += 14) {
      for (let z = -50; z <= 50; z += 14) {
        if (Math.abs(x) < 7 || Math.abs(x - 30) < 5 || Math.abs(x + 30) < 5) continue;
        if (Math.abs(z) < 7 || Math.abs(z - 25) < 5 || Math.abs(z + 25) < 5) continue;

        const height = 8 + ((Math.sin(x * 12.3 + z * 4.5) + 1) / 2) * 22;
        const width = 6 + (Math.cos(x + z) > 0 ? 2 : 0);
        const depth = 6 + (Math.sin(x - z) > 0 ? 2 : 0);

        list.push({
          id: `bldg-${count++}`,
          position: [x, height / 2, z],
          size: [width, height, depth],
          color: colors[count % colors.length],
          hasHelipad: height > 20
        });
      }
    }
    return list;
  }, []);

  return (
    <group>
      {buildings.map((b) => (
        <group key={b.id} position={b.position}>
          {/* Main Building Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={b.size} />
            <meshStandardMaterial
              color={b.color}
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>

          {/* Roof Accent / Window Strip (Orange Accent) */}
          <mesh position={[0, b.size[1] / 2 - 0.2, 0]}>
            <boxGeometry args={[b.size[0] + 0.1, 0.4, b.size[2] + 0.1]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Rooftop Emergency Helipad / Light Beacon for Tall Towers */}
          {b.hasHelipad && (
            <group position={[0, b.size[1] / 2 + 0.1, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.2, 1.8, 16]} />
                <meshBasicMaterial color="#16a34a" opacity={0.8} transparent />
              </mesh>
              {/* Rooftop Aviation Beacon */}
              <mesh position={[0, 0.5, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshBasicMaterial color="#dc2626" />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
}
