import type { PredictionResult } from "./types";

export interface ExperimentalObservation {
  featureType: string;
  observed: "present" | "absent" | "uncertain";
  positions?: string;
  notes?: string;
}

export interface ExperimentalComparison {
  observation: ExperimentalObservation;
  prediction?: PredictionResult;
  interpretation: "agreement" | "difference" | "not-comparable";
}

const OBSERVED_VALUES = new Set(["present", "absent", "uncertain"]);

function normalizeObservation(value: unknown): ExperimentalObservation {
  if (!value || typeof value !== "object") {
    throw new Error("Each experimental result must be an object.");
  }
  const record = value as Record<string, unknown>;
  const featureType = typeof record.featureType === "string" ? record.featureType.trim() : "";
  const observed = typeof record.observed === "string" ? record.observed.trim().toLowerCase() : "";
  if (!featureType || !OBSERVED_VALUES.has(observed)) {
    throw new Error("Each result needs featureType and observed: present, absent, or uncertain.");
  }
  return {
    featureType,
    observed: observed as ExperimentalObservation["observed"],
    positions: typeof record.positions === "string" ? record.positions.trim() || undefined : undefined,
    notes: typeof record.notes === "string" ? record.notes.trim() || undefined : undefined,
  };
}

function parseCsv(text: string): ExperimentalObservation[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) throw new Error("CSV requires a header row and at least one result row.");
  const headers = lines[0].split(",").map((header) => header.trim().toLowerCase());
  const required = ["featuretype", "observed"];
  if (required.some((header) => !headers.includes(header))) {
    throw new Error("CSV headers must include featureType and observed.");
  }
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    return normalizeObservation({
      featureType: values[headers.indexOf("featuretype")] ?? "",
      observed: values[headers.indexOf("observed")] ?? "",
      positions: headers.includes("positions") ? values[headers.indexOf("positions")] : "",
      notes: headers.includes("notes") ? values[headers.indexOf("notes")] : "",
    });
  });
}

export function parseExperimentalResults(text: string, filename = ""): ExperimentalObservation[] {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("The experimental-results file is empty.");
  const parsed = filename.toLowerCase().endsWith(".csv") || !trimmed.startsWith("[")
    ? parseCsv(trimmed)
    : JSON.parse(trimmed);
  if (!Array.isArray(parsed) || !parsed.length) throw new Error("Provide at least one experimental result.");
  return parsed.map(normalizeObservation);
}

export function compareExperimentalResults(
  observations: ExperimentalObservation[],
  predictions: PredictionResult[],
): ExperimentalComparison[] {
  return observations.map((observation) => {
    const prediction = predictions.find((candidate) => candidate.featureType === observation.featureType);
    if (!prediction || prediction.status !== "available") {
      return { observation, prediction, interpretation: "not-comparable" };
    }
    const predictedPresent = prediction.features.length > 0;
    const agrees = observation.observed === "uncertain" || predictedPresent === (observation.observed === "present");
    return { observation, prediction, interpretation: agrees ? "agreement" : "difference" };
  });
}
