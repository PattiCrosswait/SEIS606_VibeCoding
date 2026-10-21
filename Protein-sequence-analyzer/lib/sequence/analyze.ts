import type { ResidueGroup, SequenceAnalysis, ValidationResult } from "./types";

export const ANALYSIS_VERSION = "local-2";

const GROUPS: Record<ResidueGroup, Set<string>> = {
  hydrophobic: new Set("AVILMFWY"),
  polar: new Set("STNQ"),
  charged: new Set("DEKRH"),
  special: new Set("CGP"),
};

const MASS: Record<string, number> = {
  A: 71.08, R: 156.19, N: 114.11, D: 115.09, C: 103.15, E: 129.12,
  Q: 128.13, G: 57.05, H: 137.14, I: 113.16, L: 113.16, K: 128.17,
  M: 131.2, F: 147.17, P: 97.12, S: 87.08, T: 101.11, W: 186.21,
  Y: 163.17, V: 99.13,
};

const HYDROPATHY: Record<string, number> = { A: 1.8, R: -4.5, N: -3.5, D: -3.5, C: 2.5, Q: -3.5, E: -3.5, G: -0.4, H: -3.2, I: 4.5, L: 3.8, K: -3.9, M: 1.9, F: 2.8, P: -1.6, S: -0.8, T: -0.7, W: -0.9, Y: -1.3, V: 4.2 };
const PK_A: Record<string, number> = { N: 9.69, C: 8.18, D: 3.65, E: 4.25, H: 6.00, K: 10.53, R: 12.48, Y: 10.07 };
const PK_C: Record<string, number> = { D: 3.65, E: 4.25, C: 8.18, Y: 10.07, H: 6.00, K: 10.53, R: 12.48 };

function netCharge(sequence: string, pH: number): number {
  const positive = 1 / (1 + 10 ** (pH - 8.0)) + [...sequence].filter((r) => r === "K").length / (1 + 10 ** (pH - PK_A.K))
    + [...sequence].filter((r) => r === "R").length / (1 + 10 ** (pH - PK_A.R))
    + [...sequence].filter((r) => r === "H").length / (1 + 10 ** (pH - PK_A.H));
  const negative = 1 / (1 + 10 ** (PK_C.C - pH)) + [...sequence].filter((r) => r === "D").length / (1 + 10 ** (PK_C.D - pH))
    + [...sequence].filter((r) => r === "E").length / (1 + 10 ** (PK_C.E - pH))
    + [...sequence].filter((r) => r === "C").length / (1 + 10 ** (PK_C.C - pH))
    + [...sequence].filter((r) => r === "Y").length / (1 + 10 ** (PK_C.Y - pH));
  return positive - negative;
}

function calculatePI(sequence: string): number {
  let low = 0;
  let high = 14;
  for (let iteration = 0; iteration < 40; iteration += 1) {
    const midpoint = (low + high) / 2;
    if (netCharge(sequence, midpoint) > 0) low = midpoint;
    else high = midpoint;
  }
  return (low + high) / 2;
}

export function normalizeSequence(raw: string): ValidationResult {
  const withoutHeaders = raw.replace(/^>.*$/gm, "");
  const normalizedSequence = withoutHeaders.toUpperCase().replace(/\s/g, "");
  const invalidResidues = [...new Set([...normalizedSequence].filter((residue) => !MASS[residue]))];
  return {
    normalizedSequence,
    invalidResidues,
    error: !normalizedSequence
      ? "Enter a protein sequence to analyze."
      : invalidResidues.length
        ? `Unsupported residue(s): ${invalidResidues.join(", ")}.`
        : undefined,
  };
}

export function residueGroup(residue: string): ResidueGroup {
  for (const [group, residues] of Object.entries(GROUPS) as [ResidueGroup, Set<string>][]) {
    if (residues.has(residue)) return group;
  }
  return "special";
}

export function analyzeSequence(originalInput: string): SequenceAnalysis {
  const validation = normalizeSequence(originalInput);
  if (validation.error) {
    return {
      originalInput,
      normalizedSequence: validation.normalizedSequence,
      status: "invalid",
      length: validation.normalizedSequence.length,
      molecularWeight: 0,
      theoreticalPI: 0,
      hydrophobicity: 0,
      composition: { hydrophobic: 0, polar: 0, charged: 0, special: 0 },
      residueGroups: [],
      analysisVersion: ANALYSIS_VERSION,
    };
  }

  const sequence = validation.normalizedSequence;
  const residueGroups = [...sequence].map(residueGroup);
  const composition = residueGroups.reduce<Record<ResidueGroup, number>>(
    (counts, group) => ({ ...counts, [group]: counts[group] + 1 }),
    { hydrophobic: 0, polar: 0, charged: 0, special: 0 },
  );
  const hydrophobicity = [...sequence].reduce((sum, residue) => sum + HYDROPATHY[residue], 0) / sequence.length;
  const molecularWeight = [...sequence].reduce((sum, residue) => sum + MASS[residue], 18.02 * Math.max(0, sequence.length - 1));

  return {
    originalInput,
    normalizedSequence: sequence,
    status: "valid",
    length: sequence.length,
    molecularWeight,
    theoreticalPI: calculatePI(sequence),
    hydrophobicity,
    composition,
    residueGroups,
    analysisVersion: ANALYSIS_VERSION,
  };
}
