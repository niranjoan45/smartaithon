export function calculateSpatialSimilarity(
  pos1: [number, number, number],
  pos2: [number, number, number]
): number {
  const dx = pos1[0] - pos2[0];
  const dz = pos1[2] - pos2[2];
  const distance3DUnits = Math.sqrt(dx * dx + dz * dz);
  const distanceMeters = distance3DUnits * 25; // 1 unit = 25m

  if (distanceMeters <= 250) {
    return 0.95; // Strong Spatial Match
  }
  if (distanceMeters <= 500) {
    return 0.65; // Moderate Spatial Match
  }
  return 0.10; // Weak/No Spatial Match
}
