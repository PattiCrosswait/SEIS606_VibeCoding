export type ResidueGroup = "hydrophobic" | "polar" | "charged" | "special";

export type SequenceStatus = "idle" | "editing" | "analyzing" | "valid" | "invalid" | "stale";

export interface SequenceAnalysis {
  originalInput: string;
  normalizedSequence: string;
  status: SequenceStatus;
  length: number;
  molecularWeight: number;
  theoreticalPI: number;
  hydrophobicity: number;
  composition: Record<ResidueGroup, number>;
  residueGroups: ResidueGroup[];
  analysisVersion: string;
}

export interface ValidationResult {
  normalizedSequence: string;
  invalidResidues: string[];
  error?: string;
}
