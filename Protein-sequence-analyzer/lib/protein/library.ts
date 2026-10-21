import type { SavedProtein } from "./types";
import type { SequenceAnalysis } from "@/lib/sequence/types";

const STORAGE_KEY = "protein-sequence-analyzer.library";

export function createSavedProtein(
  name: string,
  sequence: string,
  analysis: SequenceAnalysis,
  metadata: Pick<SavedProtein, "accession" | "organism" | "type"> = {},
): SavedProtein {
  return {
    sequenceId: `protein-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim() || "Untitled protein",
    sequence,
    analysisSummary: {
      length: analysis.length,
      molecularWeight: analysis.molecularWeight,
      theoreticalPI: analysis.theoreticalPI,
      hydrophobicity: analysis.hydrophobicity,
    },
    analyzedAt: new Date().toISOString(),
    ...metadata,
  };
}

export function readLibrary(): SavedProtein[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SavedProtein[]) : [];
  } catch {
    return [];
  }
}

export function writeLibrary(proteins: SavedProtein[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proteins));
  }
}

export function filterLibrary(proteins: SavedProtein[], query: string, type = "all"): SavedProtein[] {
  const normalized = query.trim().toLowerCase();
  return proteins.filter((protein) => {
    const matchesQuery =
      !normalized ||
      [protein.name, protein.accession, protein.organism, protein.type]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalized));
    return matchesQuery && (type === "all" || protein.type === type);
  });
}
