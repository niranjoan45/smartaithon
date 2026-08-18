import { useEffect } from 'react';
import { useCityStore } from '../stores/useCityStore';

export function useSimulation() {
  const { isOptimizing } = useCityStore();

  useEffect(() => {
    // 60Hz tick for smooth vehicle navigation and simulation updates
    const interval = setInterval(() => {
      if (isOptimizing) return;

      useCityStore.setState((state) => {
        const updatedResources = state.resources.map((resource) => {
          // If resource is BUSY, tick on-scene completion timer and transition to AVAILABLE when done
          if (resource.status === 'BUSY') {
            const onSceneTicks = (resource as any)._onSceneTicks || 0;
            if (onSceneTicks >= 20) {
              return {
                ...resource,
                status: 'AVAILABLE' as const,
                targetPosition3D: undefined,
                targetPosition: undefined,
                currentIncidentId: undefined,
                etaMinutes: 0,
                _onSceneTicks: 0
              };
            }
            return {
              ...resource,
              _onSceneTicks: onSceneTicks + 1
            };
          }

          const target = resource.targetPosition3D || resource.targetPosition;
          const currentPos = resource.position3D || resource.position;

          if (!target || resource.status !== 'DISPATCHED' || !currentPos) return resource;

          const [currX, currY, currZ] = currentPos;
          const [targetX, targetY, targetZ] = target;

          const dx = targetX - currX;
          const dz = targetZ - currZ;
          const distance = Math.sqrt(dx * dx + dz * dz);

          if (distance < 0.5) {
            return {
              ...resource,
              position3D: target,
              position: target,
              etaMinutes: 0,
              status: 'BUSY' as const,
              _onSceneTicks: 1
            };
          }

          const speedFactor = 0.08;
          const newX = currX + (dx / distance) * speedFactor;
          const newZ = currZ + (dz / distance) * speedFactor;
          const newEta = Math.max(0.5, Number((distance * 0.15).toFixed(1)));
          const newPos: [number, number, number] = [newX, currY, newZ];

          return {
            ...resource,
            position3D: newPos,
            position: newPos,
            etaMinutes: newEta
          };
        });

        return { resources: updatedResources };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOptimizing]);
}
