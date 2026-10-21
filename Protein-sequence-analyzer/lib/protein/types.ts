import type { SequenceAnalysis } from "@/lib/sequence/types";

export interface SavedProtein {
  sequenceId: string;
  name: string;
  accession?: string;
  organism?: string;
  type?: string;
  sequence: string;
  analysisSummary: Pick<SequenceAnalysis, "length" | "molecularWeight" | "theoreticalPI" | "hydrophobicity">;
  analyzedAt: string;
}

export interface AlignmentDifference {
  position: number;
  left: string;
  right: string;
  kind: "match" | "mismatch" | "insertion" | "deletion";
}

export interface AlignmentResult {
  status: "idle" | "running" | "complete" | "failed" | "no-results";
  sequences: Array<{ id: string; name: string; aligned: string }>;
  differences: AlignmentDifference[];
  conservedPositions: number[];
  score: number;
  scoringAssumptions: string;
  message?: string;
}

export interface DatabaseMatch {
  name?: string;
  accession?: string;
  organism?: string;
  length?: number;
  source: string;
  retrievedAt: string;
}

export type DatabaseSearchState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "matches"; matches: DatabaseMatch[] }
  | { status: "no-results"; matches: [] }
  | { status: "unavailable"; matches: []; message: string }
  | { status: "failed"; matches: []; message: string };
