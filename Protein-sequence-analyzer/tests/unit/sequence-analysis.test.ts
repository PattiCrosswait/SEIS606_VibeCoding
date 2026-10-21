import assert from "node:assert/strict";
import test from "node:test";
import { analyzeSequence, normalizeSequence } from "../../lib/sequence/analyze";
import { predictLocally } from "../../lib/predictions/providers/local";

test("normalizes FASTA headers, case, and whitespace", () => {
  const result = normalizeSequence(">sample\nmkwv tfis\n");
  assert.equal(result.error, undefined);
  assert.equal(result.normalizedSequence, "MKWVTFIS");
});

test("rejects empty and unsupported input", () => {
  assert.match(normalizeSequence("").error ?? "", /Enter/);
  assert.deepEqual(normalizeSequence("MKWVZ123").invalidResidues, ["Z", "1", "2", "3"]);
});

test("calculates deterministic single-residue metrics", () => {
  const result = analyzeSequence("A");
  assert.equal(result.status, "valid");
  assert.equal(result.length, 1);
  assert.equal(result.composition.hydrophobic, 1);
  assert.equal(result.molecularWeight, 71.08);
});

test("composition groups sum to long sequence length", () => {
  const sequence = "AVILMFWYSTNQDEKRHCGP".repeat(50);
  const result = analyzeSequence(sequence);
  const groupTotal = Object.values(result.composition).reduce((sum, count) => sum + count, 0);
  assert.equal(result.length, sequence.length);
  assert.equal(groupTotal, sequence.length);
  assert.deepEqual(result, analyzeSequence(sequence));
});

test("local prediction provider returns provenance and explicit no-signal results", () => {
  const results = predictLocally("MKWVTFISLLLLFSSAYSRGVFRRDTHKSEIAHRFKDLGE");
  const signal = results.find((result) => result.featureType === "signal-peptide");
  const secondaryStructure = results.find((result) => result.featureType === "secondary-structure");
  assert.equal(signal?.status, "available");
  assert.equal(signal?.method, "Deterministic local heuristic");
  assert.ok(signal?.features[0].residueRange);
  assert.equal(secondaryStructure?.status, "no-strong-signal");
  assert.deepEqual(secondaryStructure?.features, []);
});
