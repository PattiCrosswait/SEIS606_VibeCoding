import type { AlignmentResult } from "@/lib/protein/types";

export function AlignmentView({ alignment }: { alignment: AlignmentResult | null }) {
  if (!alignment) return <p className="empty-state">Select saved sequences to compare.</p>;
  if (alignment.status !== "complete") return <p className="status error">{alignment.message ?? "Alignment unavailable."}</p>;
  return <div className="alignment-view"><p><strong>Score:</strong> {alignment.score} · <strong>Conserved positions:</strong> {alignment.conservedPositions.join(", ") || "none"}</p>{alignment.sequences.map((sequence) => <div className="alignment-row" key={sequence.id}><strong>{sequence.name}</strong><code>{sequence.aligned}</code></div>)}<p className="muted">{alignment.scoringAssumptions}</p></div>;
}
