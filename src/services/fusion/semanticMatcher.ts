export function calculateSemanticSimilarity(
  text1: string,
  text2: string,
  detectedObjects1: string[] = [],
  detectedObjects2: string[] = []
): number {
  const t1 = text1.toLowerCase();
  const t2 = text2.toLowerCase();

  const fireKeywords = ['fire', 'smoke', 'thermal', 'flame', 'blaze', 'explosion', 'heat', 'burning', 'temperature', 'hot'];
  const crashKeywords = ['crash', 'collision', 'rollover', 'accident', 'freeway', 'highway', 'vehicle', 'entrapment'];
  const hazmatKeywords = ['hazmat', 'chemical', 'leak', 'vapor', 'gas', 'spill', 'containment'];

  const countMatches = (keywords: string[]) => {
    const k1 = keywords.some(k => t1.includes(k) || detectedObjects1.some(o => o.toLowerCase().includes(k)));
    const k2 = keywords.some(k => t2.includes(k) || detectedObjects2.some(o => o.toLowerCase().includes(k)));
    return k1 && k2;
  };

  if (countMatches(fireKeywords)) return 0.90;
  if (countMatches(crashKeywords)) return 0.88;
  if (countMatches(hazmatKeywords)) return 0.85;

  // General Jaccard word similarity fallback
  const words1 = new Set(t1.split(/\W+/).filter(w => w.length > 3));
  const words2 = new Set(t2.split(/\W+/).filter(w => w.length > 3));
  
  if (words1.size === 0 || words2.size === 0) return 0.40;

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  const jaccard = intersection.size / union.size;
  return Math.min(1.0, Math.max(0.20, Number((0.30 + jaccard * 0.70).toFixed(2))));
}
