export type PredictionStatus =
  | "pending"
  | "available"
  | "no-strong-signal"
  | "unavailable"
  | "failed"
  | "retryable";

export type PredictionFeatureType =
  | "signal-peptide"
  | "transmembrane"
  | "motif"
  | "domain"
  | "disorder"
  | "low-complexity"
  | "secondary-structure";

export interface PredictionFeature {
  featureType: PredictionFeatureType;
  label: string;
  residueRange?: { start: number; end: number };
  description: string;
  confidenceOrScore?: number;
}

export interface PredictionResult {
  featureType: PredictionFeatureType;
  status: PredictionStatus;
  features: PredictionFeature[];
  method?: string;
  source?: string;
  version?: string;
  limitations: string;
  message?: string;
}

export interface PredictionResponse {
  status: "available" | "unavailable" | "failed" | "retryable";
  predictions: PredictionResult[];
  message?: string;
}
