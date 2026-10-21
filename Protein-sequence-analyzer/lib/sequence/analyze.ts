import type { ResidueGroup, SequenceAnalysis, ValidationResult } from "./types";

export const ANALYSIS_VERSION = "local-1";

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
  const positive = [...sequence].filter((residue) => "KRH".includes(residue)).length;
  const negative = [...sequence].filter((residue) => "DE".includes(residue)).length;
  const hydrophobicity = composition.hydrophobic / sequence.length;
  const molecularWeight = [...sequence].reduce((sum, residue) => sum + MASS[residue], 18.02 * Math.max(0, sequence.length - 1));

  return {
    originalInput,
    normalizedSequence: sequence,
    status: "valid",
    length: sequence.length,
    molecularWeight,
    theoreticalPI: Math.min(12, Math.max(3, 7 + (positive - negative) * 0.28)),
    hydrophobicity,
    composition,
    residueGroups,
    analysisVersion: ANALYSIS_VERSION,
  };
}
