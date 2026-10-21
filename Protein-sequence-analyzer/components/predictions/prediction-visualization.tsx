import type { PredictionResult } from "@/lib/predictions/types";

export function PredictionVisualization({ prediction }: { prediction: PredictionResult }) {
  if (!prediction.features.length) return <p className="muted">No feature ranges reported.</p>;
  return <ul className="prediction-ranges">{prediction.features.map((feature) => <li key={`${feature.label}-${feature.residueRange?.start ?? 0}`}><strong>{feature.label}</strong>{feature.residueRange ? `, residues ${feature.residueRange.start}-${feature.residueRange.end}` : ""}: {feature.description}</li>)}</ul>;
}
