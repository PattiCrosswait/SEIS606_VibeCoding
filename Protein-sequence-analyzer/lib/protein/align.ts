import type { AlignmentDifference, AlignmentResult } from "./types";

export function alignPairwise(
  left: { id: string; name: string; sequence: string },
  right: { id: string; name: string; sequence: string },
): AlignmentResult {
  const width = Math.max(left.sequence.length, right.sequence.length);
  const leftAligned = left.sequence.padEnd(width, "-");
  const rightAligned = right.sequence.padEnd(width, "-");
  const differences: AlignmentDifference[] = [];
  let score = 0;
  for (let index = 0; index < width; index += 1) {
    const a = leftAligned[index];
    const b = rightAligned[index];
    const kind = a === b ? "match" : a === "-" ? "insertion" : b === "-" ? "deletion" : "mismatch";
    if (kind === "match") score += 1;
    differences.push({ position: index + 1, left: a, right: b, kind });
  }
  return {
    status: "complete",
    sequences: [
      { id: left.id, name: left.name, aligned: leftAligned },
      { id: right.id, name: right.name, aligned: rightAligned },
    ],
    differences,
    conservedPositions: differences.filter((difference) => difference.kind === "match").map((difference) => difference.position),
    score,
    scoringAssumptions: "Direct position comparison; match +1, mismatch 0, gap 0. Gaps are padded for display.",
  };
}

export function alignMultiple(sequences: Array<{ id: string; name: string; sequence: string }>): AlignmentResult {
  if (sequences.length < 3) {
    return { status: "no-results", sequences: [], differences: [], conservedPositions: [], score: 0, scoringAssumptions: "", message: "Select at least three sequences for multiple alignment." };
  }
  const width = Math.max(...sequences.map((sequence) => sequence.sequence.length));
  const aligned = sequences.map((sequence) => ({ ...sequence, aligned: sequence.sequence.padEnd(width, "-") }));
  const conservedPositions = Array.from({ length: width }, (_, index) => index + 1).filter((position) => {
    const residues = new Set(aligned.map((sequence) => sequence.aligned[position - 1]));
    return residues.size === 1 && !residues.has("-");
  });
  return {
    status: "complete",
    sequences: aligned,
    differences: [],
    conservedPositions,
    score: conservedPositions.length,
    scoringAssumptions: "Direct position comparison across selected sequences; gaps are padded for display.",
  };
}
