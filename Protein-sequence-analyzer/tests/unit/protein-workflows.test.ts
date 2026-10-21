import assert from "node:assert/strict";
import test from "node:test";
import { alignMultiple, alignPairwise } from "../../lib/protein/align";
import { filterLibrary } from "../../lib/protein/library";
import { createComparisonReport } from "../../lib/reports/export-report";

test("pairwise alignment labels matches, mismatches, and gaps", () => {
  const result = alignPairwise(
    { id: "a", name: "A", sequence: "ACD" },
    { id: "b", name: "B", sequence: "AC" },
  );
  assert.equal(result.status, "complete");
  assert.equal(result.differences[0].kind, "match");
  assert.equal(result.differences[2].kind, "deletion");
  assert.equal(result.conservedPositions.length, 2);
});

test("multiple alignment requires three sequences and finds conserved positions", () => {
  const result = alignMultiple([
    { id: "a", name: "A", sequence: "ACD" },
    { id: "b", name: "B", sequence: "ACD" },
    { id: "c", name: "C", sequence: "ACN" },
  ]);
  assert.deepEqual(result.conservedPositions, [1, 2]);
  assert.equal(alignMultiple([]).status, "no-results");
});

test("library filtering searches optional metadata", () => {
  const proteins = [
    { sequenceId: "1", name: "Alpha", accession: "P1", type: "enzyme" },
    { sequenceId: "2", name: "Beta", organism: "Yeast", type: "receptor" },
  ] as never[];
  assert.equal(filterLibrary(proteins, "yeast")[0].sequenceId, "2");
  assert.equal(filterLibrary(proteins, "", "enzyme")[0].sequenceId, "1");
});

test("comparison report contains scoring assumptions and aligned sequences", () => {
  const alignment = alignPairwise({ id: "a", name: "A", sequence: "AC" }, { id: "b", name: "B", sequence: "AT" });
  const report = createComparisonReport(alignment);
  assert.match(report, /Scoring assumptions/);
  assert.match(report, /A: AC/);
});
