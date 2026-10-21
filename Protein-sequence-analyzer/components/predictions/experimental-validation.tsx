"use client";

import { useMemo, useState } from "react";
import type { PredictionResult } from "@/lib/predictions/types";
import {
  compareExperimentalResults,
  parseExperimentalResults,
  type ExperimentalObservation,
} from "@/lib/predictions/experimental";
import { Button } from "@/components/ui/button";

export function ExperimentalValidation({ sequence, predictions }: { sequence: string; predictions: PredictionResult[] }) {
  const [observations, setObservations] = useState<ExperimentalObservation[]>([]);
  const [error, setError] = useState("");
  const comparisons = useMemo(
    () => compareExperimentalResults(observations, predictions),
    [observations, predictions],
  );

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = parseExperimentalResults(await file.text(), file.name);
      setObservations(parsed);
      setError("");
      const response = await fetch("/api/experimental-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence, observations: parsed }),
      });
      if (!response.ok && response.status !== 503) {
        throw new Error("Experimental results could not be validated.");
      }
    } catch (caught) {
      setObservations([]);
      setError(caught instanceof Error ? caught.message : "The experimental-results file could not be read.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="experimental-validation">
      <div className="experimental-header">
        <div>
          <h3>Experimental validation</h3>
          <p className="muted">Upload observed results to compare evidence with predictions.</p>
        </div>
        <label className="button">
          Upload CSV or JSON
          <input
            type="file"
            accept=".csv,.json,text/csv,application/json"
            onChange={handleFile}
            aria-label="Upload experimental results as CSV or JSON"
            hidden
          />
        </label>
      </div>
      <p className="muted experimental-format">
        CSV columns: <code>featureType,observed,positions,notes</code>. Observed values are
        <code> present</code>, <code>absent</code>, or <code>uncertain</code>.
      </p>
      {error ? <p className="status error" role="alert">{error}</p> : null}
      {comparisons.length ? (
        <div className="experimental-results" aria-live="polite">
          {comparisons.map(({ observation, interpretation }) => (
            <div className="experimental-row" key={`${observation.featureType}-${observation.observed}`}>
              <strong>{observation.featureType}</strong>
              <span>Observed: {observation.observed}</span>
              {observation.positions ? <span>Positions: {observation.positions}</span> : null}
              <span className={`validation-badge ${interpretation}`}>
                {interpretation === "not-comparable" ? "No comparable prediction" : interpretation}
              </span>
              {observation.notes ? <small>{observation.notes}</small> : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">No experimental results uploaded yet.</p>
      )}
      {observations.length ? (
        <Button type="button" onClick={() => setObservations([])}>Clear experimental results</Button>
      ) : null}
    </div>
  );
}
