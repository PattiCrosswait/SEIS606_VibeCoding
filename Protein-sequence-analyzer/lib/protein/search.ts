import type { DatabaseSearchState } from "./types";

export async function searchProteinDatabase(query: string): Promise<DatabaseSearchState> {
  if (!query.trim()) return { status: "no-results", matches: [] };
  const response = await fetch("/api/protein-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query.trim() }),
  });
  const body = (await response.json()) as { status: DatabaseSearchState["status"]; matches?: DatabaseSearchState extends { matches: infer T } ? T : never; message?: string };
  if (body.status === "unavailable") return { status: "unavailable", matches: [], message: body.message ?? "Search is unavailable." };
  if (!response.ok) return { status: "failed", matches: [], message: body.message ?? "Search failed. Try again." };
  const matches = Array.isArray(body.matches) ? body.matches : [];
  return matches.length ? { status: "matches", matches } : { status: "no-results", matches: [] };
}
