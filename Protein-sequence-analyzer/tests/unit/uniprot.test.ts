import assert from "node:assert/strict";
import test from "node:test";
import { searchUniProt } from "../../lib/protein/uniprot";

test("UniProt adapter maps provider records into application matches", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({
    results: [{
      primaryAccession: "P12345",
      proteinDescription: { recommendedName: { fullName: { value: "Example protein" } } },
      organism: { scientificName: "Example species" },
      sequence: { length: 42 },
    }],
  }), { status: 200 });
  try {
    const matches = await searchUniProt("P12345");
    assert.deepEqual(matches[0], {
      name: "Example protein",
      accession: "P12345",
      organism: "Example species",
      length: 42,
      source: "UniProt",
      retrievedAt: matches[0].retrievedAt,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
