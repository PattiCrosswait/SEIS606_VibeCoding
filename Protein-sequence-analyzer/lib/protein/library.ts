import type { SavedProtein } from "./types";
import type { SequenceAnalysis } from "@/lib/sequence/types";
import { analyzeSequence } from "@/lib/sequence/analyze";

const STORAGE_KEY = "protein-sequence-analyzer.library";
const MAX_LIBRARY_ITEMS = 500;
const MAX_SEQUENCE_LENGTH = 500_000;

function isSavedProtein(value: unknown): value is SavedProtein {
  if (!value || typeof value !== "object") return false;
  const protein = value as Partial<SavedProtein>;
  const summary = protein.analysisSummary;
  return typeof protein.sequenceId === "string" &&
    protein.sequenceId.length <= 200 &&
    typeof protein.name === "string" &&
    protein.name.length <= 200 &&
    typeof protein.sequence === "string" &&
    protein.sequence.length <= MAX_SEQUENCE_LENGTH &&
    typeof protein.analyzedAt === "string" &&
    Boolean(summary) &&
    typeof summary?.length === "number" &&
    typeof summary?.molecularWeight === "number" &&
    typeof summary?.theoreticalPI === "number" &&
    typeof summary?.hydrophobicity === "number" &&
    [summary.length, summary.molecularWeight, summary.theoreticalPI, summary.hydrophobicity].every(Number.isFinite) &&
    analyzeSequence(protein.sequence).status === "valid";
}

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
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedProtein).slice(0, MAX_LIBRARY_ITEMS);
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
