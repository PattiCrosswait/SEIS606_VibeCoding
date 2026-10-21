import type { AlignmentDifference, AlignmentResult } from "./types";

export function alignPairwise(
  left: { id: string; name: string; sequence: string },
  right: { id: string; name: string; sequence: string },
): AlignmentResult {
  const matchScore = 2;
  const mismatchScore = -1;
  const gapScore = -2;
  const rows = left.sequence.length + 1;
  const columns = right.sequence.length + 1;
  const scores = Array.from({ length: rows }, () => Array(columns).fill(0));
  for (let row = 1; row < rows; row += 1) scores[row][0] = row * gapScore;
  for (let column = 1; column < columns; column += 1) scores[0][column] = column * gapScore;
  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      scores[row][column] = Math.max(
        scores[row - 1][column - 1] + (left.sequence[row - 1] === right.sequence[column - 1] ? matchScore : mismatchScore),
        scores[row - 1][column] + gapScore,
        scores[row][column - 1] + gapScore,
      );
    }
  }
  let row = left.sequence.length;
  let column = right.sequence.length;
  let leftAligned = "";
  let rightAligned = "";
  while (row > 0 || column > 0) {
    if (row > 0 && column > 0 && scores[row][column] === scores[row - 1][column - 1] + (left.sequence[row - 1] === right.sequence[column - 1] ? matchScore : mismatchScore)) {
      leftAligned = left.sequence[row - 1] + leftAligned;
      rightAligned = right.sequence[column - 1] + rightAligned;
      row -= 1;
      column -= 1;
    } else if (row > 0 && scores[row][column] === scores[row - 1][column] + gapScore) {
      leftAligned = left.sequence[row - 1] + leftAligned;
      rightAligned = "-" + rightAligned;
      row -= 1;
    } else {
      leftAligned = "-" + leftAligned;
      rightAligned = right.sequence[column - 1] + rightAligned;
      column -= 1;
    }
  }
  const width = leftAligned.length;
  const differences: AlignmentDifference[] = [];
  for (let index = 0; index < width; index += 1) {
    const a = leftAligned[index];
    const b = rightAligned[index];
    const kind = a === b ? "match" : a === "-" ? "insertion" : b === "-" ? "deletion" : "mismatch";
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
    score: scores[left.sequence.length][right.sequence.length],
    scoringAssumptions: "Needleman-Wunsch global alignment; match +2, mismatch -1, linear gap -2.",
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
