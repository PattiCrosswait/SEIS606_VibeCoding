import assert from "node:assert/strict";
import test from "node:test";
import { searchEbiAnnotations } from "../../lib/predictions/providers/ebi-search";

test("EMBL-EBI adapter maps curated records to domain predictions", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    entries: [{ id: "P12345", fields: { protein_name: ["Example domain protein"] } }],
  }), { status: 200 });
  try {
    const result = await searchEbiAnnotations("ACDEFG");
    assert.equal(result.status, "available");
    assert.equal(result.source, "EMBL-EBI UniProt domain");
    assert.equal(result.features[0].label, "Example domain protein");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
