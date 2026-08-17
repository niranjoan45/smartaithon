import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CivilianVehicles() {
  const count = 16;
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = new THREE.Object3D();

  // Initial random positions along major roads
  const cars = useRef(
    Array.from({ length: count }, (_, i) => ({
      axis: i % 2 === 0 ? ('X' as const) : ('Z' as const),
      coord: (i % 2 === 0 ? (i - 8) * 10 : (i - 8) * 10),
      offset: (i % 2 === 0 ? (i % 4 - 2) * 2.5 : (i % 4 - 2) * 2.5),
      speed: 0.12 + Math.random() * 0.08,
      pos: (Math.random() - 0.5) * 100,
      color: ['#64748b', '#475569', '#94a3b8', '#6b7280'][i % 4]
    }))
  );

  useFrame((_, delta) => {
    if (!instancedMeshRef.current) return;

    cars.current.forEach((car, i) => {
      car.pos += car.speed * delta * 60;
      if (car.pos > 80) car.pos = -80;

      if (car.axis === 'X') {
        tempObject.position.set(car.pos, 0.4, car.offset);
        tempObject.rotation.set(0, 0, 0);
      } else {
        tempObject.position.set(car.offset, 0.4, car.pos);
        tempObject.rotation.set(0, Math.PI / 2, 0);
      }

      tempObject.scale.set(1.4, 0.6, 0.8);
      tempObject.updateMatrix();
      instancedMeshRef.current?.setMatrixAt(i, tempObject.matrix);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, count]}
      castShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.6} />
    </instancedMesh>
  );
}
