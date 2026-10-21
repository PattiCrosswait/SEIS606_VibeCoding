import type { PredictionFeature, PredictionFeatureType, PredictionResult } from "../types";

const HYDROPHOBIC = new Set("AVILMFWY");
function feature(
  featureType: PredictionFeatureType,
  label: string,
  description: string,
  limitations: string,
  residueRange?: { start: number; end: number },
  confidenceOrScore?: number,
): PredictionResult {
  return {
    featureType,
    status: residueRange ? "available" : "no-strong-signal",
    features: residueRange
      ? [{ featureType, label, description, residueRange, confidenceOrScore }]
      : [],
    method: "Deterministic local heuristic",
    source: "What's In My Protein",
    version: "local-1",
    limitations,
  };
}

function longestRun(sequence: string, predicate: (residue: string) => boolean) {
  let bestStart = -1;
  let bestEnd = -1;
  let start = -1;
  for (let index = 0; index <= sequence.length; index += 1) {
    if (index < sequence.length && predicate(sequence[index])) {
      if (start < 0) start = index;
    } else if (start >= 0) {
      if (index - start > bestEnd - bestStart) {
        bestStart = start;
        bestEnd = index - 1;
      }
      start = -1;
    }
  }
  return bestStart >= 0 ? { start: bestStart + 1, end: bestEnd + 1 } : undefined;
}

function motif(sequence: string, pattern: RegExp, label: string, description: string): PredictionFeature | undefined {
  const match = pattern.exec(sequence);
  if (!match || match.index < 0) return undefined;
  return {
    featureType: "motif",
    label,
    residueRange: { start: match.index + 1, end: match.index + match[0].length },
    description,
    confidenceOrScore: 0.7,
  };
}

export function predictLocally(sequence: string): PredictionResult[] {
  const normalized = sequence.trim().toUpperCase();
  const limitations = "Heuristic sequence screening only; experimental validation and specialist databases are required.";
  const signalRange = normalized.length >= 15
    ? longestRun(normalized.slice(0, 35), (residue) => HYDROPHOBIC.has(residue))
    : undefined;
  const transmembraneRange = longestRun(normalized, (residue) => HYDROPHOBIC.has(residue));
  const lowComplexityRange = longestRun(normalized, (residue) => residue === "A" || residue === "G" || residue === "S" || residue === "P" || residue === "Q");
  const disorderRange = longestRun(normalized, (residue) => residue === "P" || residue === "S" || residue === "Q" || residue === "E" || residue === "D" || residue === "K");
  const motifFeatures = [
    motif(normalized, /C.{2,4}C/, "Cys pair", "Cysteine spacing may indicate a disulfide or metal-binding motif."),
    motif(normalized, /[ST]P/, "Proline-directed site", "Serine/threonine followed by proline is a common regulatory motif."),
  ].filter((value): value is PredictionFeature => Boolean(value));
  const results: PredictionResult[] = [
    feature("signal-peptide", "Likely hydrophobic N-terminus", "The N-terminal region is enriched in hydrophobic residues and may support signal-peptide targeting.", limitations, signalRange && signalRange.end <= 35 ? signalRange : undefined, signalRange ? 0.65 : undefined),
    feature("transmembrane", "Hydrophobic segment", "A long hydrophobic run may be compatible with a membrane-spanning segment.", limitations, transmembraneRange && transmembraneRange.end - transmembraneRange.start + 1 >= 15 ? transmembraneRange : undefined, transmembraneRange ? 0.6 : undefined),
    { featureType: "motif", status: motifFeatures.length ? "available" : "no-strong-signal", features: motifFeatures, method: "Deterministic local motif scan", source: "What's In My Protein", version: "local-1", limitations },
    feature("low-complexity", "Low-complexity segment", "A compositionally biased segment may have reduced sequence complexity.", limitations, lowComplexityRange && lowComplexityRange.end - lowComplexityRange.start + 1 >= 8 ? lowComplexityRange : undefined, lowComplexityRange ? 0.55 : undefined),
    feature("disorder", "Disorder-prone segment", "A charged and polar segment may be compatible with intrinsic disorder.", limitations, disorderRange && disorderRange.end - disorderRange.start + 1 >= 10 ? disorderRange : undefined, disorderRange ? 0.5 : undefined),
    {
      featureType: "secondary-structure",
      status: "no-strong-signal",
      features: [],
      method: "Deterministic local composition heuristic",
      source: "What's In My Protein",
      version: "local-1",
      limitations: `${limitations} This provider does not infer a definitive secondary structure.`,
    },
  ];
  return results;
}

export function localPredictionResponse(sequence: string) {
  return { status: "available" as const, predictions: predictLocally(sequence) };
}
