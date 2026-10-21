import type { SequenceAnalysis } from "@/lib/sequence/types";
import type { AlignmentResult } from "@/lib/protein/types";

export function createAnalysisReport(
  input: string,
  analysis: SequenceAnalysis,
  extras: string[] = [],
): string {
  return [
    "What's In My Protein report",
    `Analysis version: ${analysis.analysisVersion}`,
    `Original input: ${input}`,
    `Normalized sequence: ${analysis.normalizedSequence || "(none)"}`,
    `Length: ${analysis.length} aa`,
    `Molecular weight: ${analysis.status === "valid" ? `${(analysis.molecularWeight / 1000).toFixed(2)} kDa` : "unavailable"}`,
    `Theoretical pI: ${analysis.status === "valid" ? analysis.theoreticalPI.toFixed(2) : "unavailable"}`,
    `Hydrophobicity: ${analysis.status === "valid" ? analysis.hydrophobicity.toFixed(2) : "unavailable"}`,
    `Composition: ${JSON.stringify(analysis.composition)}`,
    "Methods: deterministic local sequence calculations.",
    "Assumptions and limitations: molecular weight, pI, and hydrophobicity are sequence-level estimates and do not replace experimental confirmation.",
    ...extras,
  ].join("\n");
}

export function createComparisonReport(alignment: AlignmentResult): string {
  return [
    "Protein comparison report",
    `Status: ${alignment.status}`,
    `Score: ${alignment.score}`,
    `Conserved positions: ${alignment.conservedPositions.join(", ") || "none"}`,
    `Scoring assumptions: ${alignment.scoringAssumptions}`,
    ...alignment.sequences.map((sequence) => `${sequence.name}: ${sequence.aligned}`),
    ...alignment.differences.map((difference) => `${difference.position}: ${difference.left} ${difference.kind} ${difference.right}`),
  ].join("\n");
}
