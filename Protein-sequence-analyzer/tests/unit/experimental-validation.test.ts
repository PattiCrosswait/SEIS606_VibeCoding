import assert from "node:assert/strict";
import test from "node:test";
import { compareExperimentalResults, parseExperimentalResults } from "../../lib/predictions/experimental";

test("parses experimental validation CSV records", () => {
  const results = parseExperimentalResults(
    "featureType,observed,positions,notes\nsignal-peptide,present,1-20,Mass spectrometry",
    "results.csv",
  );
  assert.deepEqual(results[0], {
    featureType: "signal-peptide",
    observed: "present",
    positions: "1-20",
    notes: "Mass spectrometry",
  });
});

test("compares uploaded observations with available predictions", () => {
  const observations = parseExperimentalResults('[{"featureType":"motif","observed":"present"}]', "results.json");
  const comparisons = compareExperimentalResults(observations, [{
    featureType: "motif",
    status: "available",
    features: [{ featureType: "motif", label: "Catalytic motif", description: "Observed computationally" }],
    limitations: "Prediction only.",
  }]);
  assert.equal(comparisons[0].interpretation, "agreement");
});

test("rejects invalid experimental result values", () => {
  assert.throws(() => parseExperimentalResults('[{"featureType":"motif","observed":"confirmed"}]', "results.json"), /present, absent, or uncertain/);
});
