export function calculateTemporalSimilarity(
  t1: number,
  t2: number
): number {
  const diffMs = Math.abs(t1 - t2);
  const diffMinutes = diffMs / (1000 * 60);

  if (diffMinutes <= 2) {
    return 0.95; // Strong Temporal Match
  }
  if (diffMinutes <= 5) {
    return 0.70; // Moderate Temporal Match
  }
  return 0.15; // Weak Temporal Match
}
