import * as THREE from 'three';

export function generateSplineRoute3D(
  fromPos: [number, number, number],
  toPos: [number, number, number]
): [number, number, number][] {
  const midX = (fromPos[0] + toPos[0]) / 2;
  const midZ = (fromPos[2] + toPos[2]) / 2;
  const arcHeight = 3.5;

  const p1 = new THREE.Vector3(...fromPos);
  const p2 = new THREE.Vector3(midX, arcHeight, midZ);
  const p3 = new THREE.Vector3(...toPos);

  const curve = new THREE.CatmullRomCurve3([p1, p2, p3]);
  const points = curve.getPoints(20);

  return points.map(pt => [Number(pt.x.toFixed(2)), Number(pt.y.toFixed(2)), Number(pt.z.toFixed(2))]);
}
