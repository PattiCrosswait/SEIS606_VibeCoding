import { createHash } from "node:crypto";
import { ensurePostgresSchema, getPostgresPool } from "./postgres";
import type { ExperimentalObservation } from "@/lib/predictions/experimental";

export async function saveExperimentalObservations(
  sequence: string,
  observations: ExperimentalObservation[],
): Promise<void> {
  await ensurePostgresSchema();
  const sequenceHash = createHash("sha256").update(sequence).digest("hex");
  const client = await getPostgresPool().connect();
  try {
    await client.query("BEGIN");
    for (const observation of observations) {
      await client.query(
        `INSERT INTO experimental_observations
          (sequence_hash, feature_type, observed, positions, notes)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          sequenceHash,
          observation.featureType,
          observation.observed,
          observation.positions ?? null,
          observation.notes ?? null,
        ],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
