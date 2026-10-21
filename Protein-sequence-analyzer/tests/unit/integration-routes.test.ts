import assert from "node:assert/strict";
import test from "node:test";
import { POST as predictions } from "../../app/api/predictions/route";
import { POST as proteinSearch } from "../../app/api/protein-search/route";
import { POST as experimentalResults } from "../../app/api/experimental-results/route";

test("prediction route rejects missing sequence and returns sourced predictions", async () => {
  const invalid = await predictions(new Request("http://localhost/api/predictions", { method: "POST", body: "{}" }));
  assert.equal(invalid.status, 400);
  const available = await predictions(new Request("http://localhost/api/predictions", { method: "POST", body: JSON.stringify({ sequence: "MKWVTFISLLLLFSSAYSRGVFRRDTHKSEIAHRFKDLGE" }) }));
  assert.equal(available.status, 200);
  const body = await available.json();
  assert.equal(body.status, "available");
  assert.ok(body.predictions.some((prediction: { featureType: string }) => prediction.featureType === "signal-peptide"));
});

test("protein search route validates empty and oversized queries", async () => {
  const empty = await proteinSearch(new Request("http://localhost/api/protein-search", { method: "POST", body: "{}" }));
  assert.equal((await empty.json()).status, "no-results");
  const oversized = await proteinSearch(new Request("http://localhost/api/protein-search", { method: "POST", body: JSON.stringify({ query: "x".repeat(201) }) }));
  assert.equal(oversized.status, 400);
});

test("experimental-results route validates sequence and observations", async () => {
  const response = await experimentalResults(new Request("http://localhost/api/experimental-results", {
    method: "POST",
    body: JSON.stringify({ sequence: "MZ", observations: [{ featureType: "motif", observed: "present" }] }),
  }));
  assert.equal(response.status, 400);
});
