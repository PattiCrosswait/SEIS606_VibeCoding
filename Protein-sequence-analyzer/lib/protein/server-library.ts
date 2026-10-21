import "server-only";
import Database from "better-sqlite3";
import path from "node:path";
import type { SavedProtein } from "./types";

const database = new Database(path.join(process.cwd(), "protein-library.sqlite"));
database.pragma("journal_mode = WAL");
database.exec(`CREATE TABLE IF NOT EXISTS saved_proteins (
  sequence_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  accession TEXT,
  organism TEXT,
  type TEXT,
  sequence TEXT NOT NULL,
  analysis_summary TEXT NOT NULL,
  analyzed_at TEXT NOT NULL
)`);

function rowToProtein(row: Record<string, unknown>): SavedProtein {
  return {
    sequenceId: String(row.sequence_id),
    name: String(row.name),
    accession: row.accession ? String(row.accession) : undefined,
    organism: row.organism ? String(row.organism) : undefined,
    type: row.type ? String(row.type) : undefined,
    sequence: String(row.sequence),
    analysisSummary: JSON.parse(String(row.analysis_summary)),
    analyzedAt: String(row.analyzed_at),
  };
}

export function listSavedProteins(): SavedProtein[] {
  return (database.prepare("SELECT * FROM saved_proteins ORDER BY analyzed_at DESC LIMIT 500").all() as Record<string, unknown>[]).map(rowToProtein);
}

export function saveProtein(protein: SavedProtein): SavedProtein {
  database.prepare(`INSERT OR REPLACE INTO saved_proteins
    (sequence_id, name, accession, organism, type, sequence, analysis_summary, analyzed_at)
    VALUES (@sequenceId, @name, @accession, @organism, @type, @sequence, @analysisSummary, @analyzedAt)`).run({
    ...protein,
    analysisSummary: JSON.stringify(protein.analysisSummary),
  });
  return protein;
}

export function deleteProtein(sequenceId: string): void {
  database.prepare("DELETE FROM saved_proteins WHERE sequence_id = ?").run(sequenceId);
}
