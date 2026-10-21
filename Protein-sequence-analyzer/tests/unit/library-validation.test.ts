import assert from "node:assert/strict";
import test from "node:test";
import { analyzeSequence } from "../../lib/sequence/analyze";
import { createSavedProtein } from "../../lib/protein/library";

test("saved protein creation produces a valid, finite analysis summary", () => {
  const protein = createSavedProtein("Example", "ACD", analyzeSequence("ACD"));
  assert.equal(protein.analysisSummary.length, 3);
  assert.ok(Object.values(protein.analysisSummary).every(Number.isFinite));
});
