"use client";

import { useState } from "react";
import { searchProteinDatabase } from "@/lib/protein/search";
import type { DatabaseSearchState } from "@/lib/protein/types";
import { Button } from "@/components/ui/button";

export function ProteinSearch() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<DatabaseSearchState>({ status: "idle" });
  async function submit() { setState({ status: "pending" }); setState(await searchProteinDatabase(query)); }
  return <section className="panel search-panel"><div className="panel-header"><div><h2>Protein database discovery</h2><p className="muted">Search the public UniProt database by accession or text.</p></div></div><div className="search-row"><input aria-label="Protein database query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Accession or protein name" /><Button type="button" onClick={submit} disabled={state.status === "pending"}>{state.status === "pending" ? "Searching…" : "Search"}</Button></div>{state.status === "unavailable" || state.status === "failed" ? <p className="status error">{state.message}</p> : state.status === "no-results" ? <p className="empty-state">No matching protein records were found.</p> : state.status === "matches" ? <ul className="search-results">{state.matches.map((match, index) => <li key={`${match.accession ?? "match"}-${index}`}><strong>{match.name ?? "Name unavailable"}</strong><span>{match.accession ?? "Accession unavailable"} · {match.organism ?? "Organism unavailable"} · {match.length ?? "Length unavailable"} aa · {match.source} · Retrieved {new Date(match.retrievedAt).toLocaleString()}</span></li>)}</ul> : null}</section>;
}
