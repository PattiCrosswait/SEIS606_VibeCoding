import type { DatabaseMatch } from "./types";

const UNIPROT_SEARCH_URL = "https://rest.uniprot.org/uniprotkb/search";
const REQUEST_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { expiresAt: number; matches: DatabaseMatch[] }>();

interface UniProtRecord {
  primaryAccession?: string;
  proteinDescription?: { recommendedName?: { fullName?: { value?: string } } };
  organism?: { scientificName?: string };
  sequence?: { length?: number };
}

interface UniProtResponse {
  results?: UniProtRecord[];
}

export async function searchUniProt(query: string): Promise<DatabaseMatch[]> {
  const cacheKey = query.trim().toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.matches;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const params = new URLSearchParams({
      query: query.trim(),
      format: "json",
      size: "10",
      fields: "accession,protein_name,organism_name,length",
    });
    const response = await fetch(`${UNIPROT_SEARCH_URL}?${params}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`UniProt returned HTTP ${response.status}.`);
    const body = (await response.json()) as UniProtResponse;
    const retrievedAt = new Date().toISOString();
    const matches = (body.results ?? []).flatMap((record) => {
      if (!record.primaryAccession) return [];
      return [{
        name: record.proteinDescription?.recommendedName?.fullName?.value,
        accession: record.primaryAccession,
        organism: record.organism?.scientificName,
        length: record.sequence?.length,
        source: "UniProt",
        retrievedAt,
      }];
    });
    cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, matches });
    return matches;
  } finally {
    clearTimeout(timeout);
  }
}
