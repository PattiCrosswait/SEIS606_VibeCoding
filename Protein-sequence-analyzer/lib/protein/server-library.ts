import "server-only";
import Database from "better-sqlite3";
import path from "node:path";
import type { SavedProtein } from "./types";
import { ensurePostgresSchema, getPostgresPool, isPostgresConfigured } from "@/lib/db/postgres";

let database: Database.Database | undefined;

function getSqliteDatabase(): Database.Database {
  if (database) return database;
  database = new Database(path.join(process.cwd(), "protein-library.sqlite"));
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
  return database;
}

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

function listSavedProteinsSqlite(): SavedProtein[] {
  return (getSqliteDatabase().prepare("SELECT * FROM saved_proteins ORDER BY analyzed_at DESC LIMIT 500").all() as Record<string, unknown>[]).map(rowToProtein);
}

function saveProteinSqlite(protein: SavedProtein): SavedProtein {
  getSqliteDatabase().prepare(`INSERT OR REPLACE INTO saved_proteins
    (sequence_id, name, accession, organism, type, sequence, analysis_summary, analyzed_at)
    VALUES (@sequenceId, @name, @accession, @organism, @type, @sequence, @analysisSummary, @analyzedAt)`).run({
    ...protein,
    analysisSummary: JSON.stringify(protein.analysisSummary),
  });
  return protein;
}

function deleteProteinSqlite(sequenceId: string): void {
  getSqliteDatabase().prepare("DELETE FROM saved_proteins WHERE sequence_id = ?").run(sequenceId);
}

export async function listSavedProteins(): Promise<SavedProtein[]> {
  if (!isPostgresConfigured()) return listSavedProteinsSqlite();
  await ensurePostgresSchema();
  const result = await getPostgresPool().query(
    "SELECT sequence_id, name, accession, organism, protein_type, sequence, analysis_summary, analyzed_at FROM saved_proteins ORDER BY analyzed_at DESC LIMIT 500",
  );
  return result.rows.map((row) => ({
    sequenceId: row.sequence_id,
    name: row.name,
    accession: row.accession ?? undefined,
    organism: row.organism ?? undefined,
    type: row.protein_type ?? undefined,
    sequence: row.sequence,
    analysisSummary: row.analysis_summary,
    analyzedAt: new Date(row.analyzed_at).toISOString(),
  }));
}

export async function saveProtein(protein: SavedProtein): Promise<SavedProtein> {
  if (!isPostgresConfigured()) return saveProteinSqlite(protein);
  await ensurePostgresSchema();
  await getPostgresPool().query(
    `INSERT INTO saved_proteins
      (sequence_id, name, accession, organism, protein_type, sequence, analysis_summary, analyzed_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
     ON CONFLICT (sequence_id) DO UPDATE SET
       name = EXCLUDED.name, accession = EXCLUDED.accession, organism = EXCLUDED.organism,
       protein_type = EXCLUDED.protein_type, sequence = EXCLUDED.sequence,
       analysis_summary = EXCLUDED.analysis_summary, analyzed_at = EXCLUDED.analyzed_at`,
    [protein.sequenceId, protein.name, protein.accession ?? null, protein.organism ?? null, protein.type ?? null, protein.sequence, JSON.stringify(protein.analysisSummary), protein.analyzedAt],
  );
  return protein;
}

export async function deleteProtein(sequenceId: string): Promise<void> {
  if (!isPostgresConfigured()) {
    deleteProteinSqlite(sequenceId);
    return;
  }
  await ensurePostgresSchema();
  await getPostgresPool().query("DELETE FROM saved_proteins WHERE sequence_id = $1", [sequenceId]);
}
