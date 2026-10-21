import type { PredictionResult } from "@/lib/predictions/types";

export function PredictionDetails({ prediction }: { prediction: PredictionResult }) {
  return <div className="prediction-details"><strong>{prediction.featureType}</strong><span>Status: {prediction.status}</span>{prediction.method ? <span>Method: {prediction.method}</span> : null}{prediction.source ? <span>Source: {prediction.source}</span> : null}{prediction.version ? <span>Version: {prediction.version}</span> : null}<p>{prediction.limitations}</p></div>;
}
