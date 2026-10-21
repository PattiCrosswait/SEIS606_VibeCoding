import type { PredictionResult } from "../types";

const EBI_SEARCH_URL = "https://www.ebi.ac.uk/ebisearch/ws/rest/uniprot";
const REQUEST_TIMEOUT_MS = 10_000;

interface EbiEntry {
  id?: string;
  fields?: Record<string, string[] | undefined>;
}

interface EbiResponse {
  entries?: EbiEntry[];
}

export async function searchEbiAnnotations(sequence: string): Promise<PredictionResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const params = new URLSearchParams({
      query: `sequence:${sequence}`,
      format: "json",
      size: "10",
    });
    const response = await fetch(`${EBI_SEARCH_URL}?${params}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`EMBL-EBI returned HTTP ${response.status}.`);
    const body = (await response.json()) as EbiResponse;
    const features = (body.entries ?? []).flatMap((entry) => {
      const label = entry.fields?.protein_name?.[0] ?? entry.fields?.name?.[0] ?? entry.id;
      if (!label) return [];
      return [{
        featureType: "domain" as const,
        label,
        description: `Curated UniProt record returned by EMBL-EBI Search (${entry.id ?? "accession unavailable"}).`,
        confidenceOrScore: 1,
      }];
    });
    return {
      featureType: "domain",
      status: features.length ? "available" : "no-strong-signal",
      features,
      method: "EMBL-EBI Search",
      source: "EMBL-EBI UniProt domain",
      version: "public REST API",
      limitations: "This search identifies matching curated records; it does not replace domain-specific profile analysis or experimental validation.",
    };
  } finally {
    clearTimeout(timeout);
  }
}
