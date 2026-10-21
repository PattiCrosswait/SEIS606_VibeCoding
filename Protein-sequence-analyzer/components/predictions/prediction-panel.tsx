"use client";

import { useState } from "react";
import type { PredictionResponse } from "@/lib/predictions/types";
import { requestPredictions } from "@/lib/predictions/client";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/ui/async-state";
import { PredictionDetails } from "./prediction-details";
import { PredictionVisualization } from "./prediction-visualization";

export function PredictionPanel({ sequence }: { sequence: string }) {
  const [state, setState] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true);
    try { setState(await requestPredictions(sequence)); } catch { setState({ status: "failed", predictions: [], message: "Prediction request failed. Try again." }); } finally { setLoading(false); }
  }
  return <section className="panel prediction-panel"><div className="panel-header"><div><h2>Biological predictions</h2><p className="muted">Local heuristics provide hypotheses, not experimentally confirmed findings.</p></div><Button type="button" onClick={load} disabled={!sequence || loading}>{loading ? "Loading…" : "Request predictions"}</Button></div>{loading ? <AsyncState message="Prediction service is working…" /> : state?.status === "unavailable" ? <AsyncState message={state.message ?? "Prediction service unavailable; core analysis remains usable."} onRetry={load} /> : state?.status === "failed" ? <AsyncState message={state.message ?? "Prediction failed."} onRetry={load} /> : state?.predictions.length ? <div className="prediction-list">{state.predictions.map((prediction) => <article className="prediction-card" key={prediction.featureType}><PredictionDetails prediction={prediction} /><PredictionVisualization prediction={prediction} /></article>)}</div> : <p className="empty-state">Request predictions for signal peptides, transmembrane regions, motifs, low-complexity segments, disorder, and secondary structure.</p>}</section>;
}
