import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCityStore } from '../../stores/useCityStore';

interface CameraControllerProps {
  controlsRef?: React.RefObject<any>;
}

export function CameraController({ controlsRef }: CameraControllerProps) {
  const { camera } = useThree();
  const { cameraMode, cameraTarget } = useCityStore();

  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 45, 55));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const [tx, ty, tz] = cameraTarget;

    switch (cameraMode) {
      case 'INCIDENT_FOCUS':
        // Angle camera to focus directly on accident site
        targetCamPos.current.set(tx + 8, ty + 15, tz + 16);
        targetLookAt.current.set(tx, ty, tz);
        isTransitioning.current = true;
        break;
      case 'RESOURCE_FOCUS':
        targetCamPos.current.set(tx - 8, ty + 12, tz + 14);
        targetLookAt.current.set(tx, ty, tz);
        isTransitioning.current = true;
        break;
      case 'DISPATCH_VIEW':
        targetCamPos.current.set(0, 35, 40);
        targetLookAt.current.set(0, 0, 0);
        isTransitioning.current = true;
        break;
      case 'RISK_VIEW':
        targetCamPos.current.set(0, 60, 15);
        targetLookAt.current.set(0, 0, 0);
        isTransitioning.current = true;
        break;
      case 'CITY_OVERVIEW':
      case 'COMMAND_VIEW':
      default:
        targetCamPos.current.set(0, 45, 55);
        targetLookAt.current.set(0, 0, 0);
        isTransitioning.current = true;
        break;
    }
  }, [cameraMode, cameraTarget]);

  useFrame((_, delta) => {
    if (!isTransitioning.current) return;

    const lerpFactor = THREE.MathUtils.clamp(delta * 3.5, 0.01, 0.2);

    // Smoothly lerp camera position to accident location
    camera.position.lerp(targetCamPos.current, lerpFactor);

    // Lock OrbitControls target to accident site so it never jumps back to center
    if (controlsRef?.current) {
      controlsRef.current.target.lerp(targetLookAt.current, lerpFactor);
      controlsRef.current.update();
    } else {
      camera.lookAt(targetLookAt.current);
    }

    // Stop lerp transition when close enough, keeping controls target fixed at accident location
    if (camera.position.distanceTo(targetCamPos.current) < 0.2) {
      camera.position.copy(targetCamPos.current);
      if (controlsRef?.current) {
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
      } else {
        camera.lookAt(targetLookAt.current);
      }
      isTransitioning.current = false;
    }
  });

  return null;
}
