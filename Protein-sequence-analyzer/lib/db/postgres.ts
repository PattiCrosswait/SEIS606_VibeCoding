import { Pool } from "pg";

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

export function isPostgresConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPostgresPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }
  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });
  return pool;
}

export async function ensurePostgresSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPostgresPool().query(`
      CREATE TABLE IF NOT EXISTS saved_proteins (
        sequence_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        accession TEXT,
        organism TEXT,
        protein_type TEXT,
        sequence TEXT NOT NULL,
        analysis_summary JSONB NOT NULL,
        analyzed_at TIMESTAMPTZ NOT NULL
      );
      CREATE TABLE IF NOT EXISTS experimental_observations (
        id BIGSERIAL PRIMARY KEY,
        sequence_hash TEXT NOT NULL,
        feature_type TEXT NOT NULL,
        observed TEXT NOT NULL CHECK (observed IN ('present', 'absent', 'uncertain')),
        positions TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS experimental_observations_sequence_hash_idx
        ON experimental_observations (sequence_hash);
    `).then(() => undefined);
  }
  await schemaReady;
}
