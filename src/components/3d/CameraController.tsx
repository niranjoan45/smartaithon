import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useCityStore } from '../../stores/useCityStore';

export function CameraController() {
  const { camera } = useThree();
  const { cameraMode, cameraTarget } = useCityStore();

  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 45, 60));

  useEffect(() => {
    const [tx, ty, tz] = cameraTarget;

    switch (cameraMode) {
      case 'CITY_OVERVIEW':
        targetCamPos.current.set(0, 45, 55);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'INCIDENT_FOCUS':
        targetCamPos.current.set(tx + 12, ty + 15, tz + 18);
        targetLookAt.current.set(tx, ty, tz);
        break;
      case 'RESOURCE_FOCUS':
        targetCamPos.current.set(tx - 8, ty + 10, tz + 12);
        targetLookAt.current.set(tx, ty, tz);
        break;
      case 'DISPATCH_VIEW':
        targetCamPos.current.set(0, 35, 40);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'RISK_VIEW':
        targetCamPos.current.set(0, 65, 10);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'COMMAND_VIEW':
      default:
        targetCamPos.current.set(0, 40, 50);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
  }, [cameraMode, cameraTarget]);

  useFrame((state, delta) => {
    // Smooth Lerp transitions without sudden teleports
    const lerpSpeed = THREE.MathUtils.clamp(delta * 2.5, 0.01, 0.1);
    camera.position.lerp(targetCamPos.current, lerpSpeed);

    // Current camera lookAt lerp
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    const targetDir = new THREE.Vector3()
      .subVectors(targetLookAt.current, camera.position)
      .normalize();

    // Subtle continuous environmental camera sway for cinematic feel
    const time = state.clock.getElapsedTime();
    if (cameraMode === 'CITY_OVERVIEW' || cameraMode === 'COMMAND_VIEW') {
      targetCamPos.current.x += Math.sin(time * 0.2) * 0.02;
    }

    camera.lookAt(
      THREE.MathUtils.lerp(camera.position.x + currentLookAt.x * 20, targetLookAt.current.x, lerpSpeed),
      THREE.MathUtils.lerp(camera.position.y + currentLookAt.y * 20, targetLookAt.current.y, lerpSpeed),
      THREE.MathUtils.lerp(camera.position.z + currentLookAt.z * 20, targetLookAt.current.z, lerpSpeed)
    );
  });

  return null;
}
