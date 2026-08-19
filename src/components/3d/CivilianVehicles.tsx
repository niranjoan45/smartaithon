import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CivilianVehicles() {
  const count = 24;
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = new THREE.Object3D();
  const tempColor = new THREE.Color();

  // Vibrant RED and YELLOW car colors
  const carColors = [
    '#ef4444', // Red
    '#eab308', // Yellow
    '#dc2626', // Deep Red
    '#facc15', // Bright Yellow
    '#b91c1c', // Dark Crimson Red
    '#fbbf24'  // Amber Yellow
  ];

  // Initial random positions along major black roads
  const cars = useRef(
    Array.from({ length: count }, (_, i) => ({
      axis: i % 2 === 0 ? ('X' as const) : ('Z' as const),
      coord: (i % 2 === 0 ? (i - 12) * 8 : (i - 12) * 8),
      offset: (i % 2 === 0 ? ((i % 4) - 1.5) * 2.5 : ((i % 4) - 1.5) * 2.5),
      speed: 0.14 + Math.random() * 0.1,
      pos: (Math.random() - 0.5) * 120,
      colorHex: carColors[i % carColors.length]
    }))
  );

  useEffect(() => {
    if (!instancedMeshRef.current) return;
    cars.current.forEach((car, i) => {
      tempColor.set(car.colorHex);
      instancedMeshRef.current?.setColorAt(i, tempColor);
    });
    if (instancedMeshRef.current.instanceColor) {
      instancedMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, []);

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

      tempObject.scale.set(1.6, 0.7, 0.9);
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
      <meshStandardMaterial roughness={0.2} metalness={0.7} />
    </instancedMesh>
  );
}
