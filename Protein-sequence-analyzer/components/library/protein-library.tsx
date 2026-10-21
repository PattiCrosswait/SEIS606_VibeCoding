"use client";

import { useMemo, useState } from "react";
import type { SavedProtein } from "@/lib/protein/types";
import { filterLibrary } from "@/lib/protein/library";
import { Button } from "@/components/ui/button";

export function ProteinLibrary({ proteins, onCompare, onDelete }: { proteins: SavedProtein[]; onCompare: (proteins: SavedProtein[]) => void; onDelete: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const types = [...new Set(proteins.map((protein) => protein.type).filter(Boolean))] as string[];
  const filtered = useMemo(() => filterLibrary(proteins, query, type), [proteins, query, type]);
  function toggle(id: string) { setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]); }
  return <section className="panel library-panel"><div className="panel-header"><div><h2>Saved protein library</h2><p className="muted">Search and select valid sequences for comparison.</p></div><Button type="button" disabled={selected.length < 2} onClick={() => onCompare(proteins.filter((protein) => selected.includes(protein.sequenceId)))}>Compare selected</Button></div><div className="library-filters"><input aria-label="Search saved proteins" placeholder="Search name, accession, or organism" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Filter saved proteins by type" value={type} onChange={(event) => setType(event.target.value)}><option value="all">All types</option>{types.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>{filtered.length ? <div className="library-list">{filtered.map((protein) => <div className="library-row" key={protein.sequenceId}><input type="checkbox" aria-label={`Select ${protein.name}`} checked={selected.includes(protein.sequenceId)} onChange={() => toggle(protein.sequenceId)} /><div><strong>{protein.name}</strong><small>{protein.accession ?? "Accession unavailable"} · {protein.type ?? "Type unavailable"} · {protein.analysisSummary.length} aa</small></div><Button type="button" onClick={() => onDelete(protein.sequenceId)}>Remove</Button></div>)}</div> : <p className="empty-state">No saved proteins match this filter. Save a valid analysis to begin.</p>}</section>;
}
