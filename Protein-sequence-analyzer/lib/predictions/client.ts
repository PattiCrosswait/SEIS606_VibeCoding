import type { PredictionResponse } from "./types";

export async function requestPredictions(sequence: string): Promise<PredictionResponse> {
  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sequence }),
  });
  const body = (await response.json()) as Partial<PredictionResponse> & { message?: string };
  if (body.status === "unavailable") return { status: "unavailable", predictions: [], message: body.message };
  if (!response.ok) return { status: "failed", predictions: [], message: body.message ?? "Prediction request failed." };
  return {
    status: body.status ?? "failed",
    predictions: Array.isArray(body.predictions) ? body.predictions : [],
    message: body.message,
  };
}
