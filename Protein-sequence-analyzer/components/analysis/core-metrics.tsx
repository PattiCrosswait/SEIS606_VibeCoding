import type { SequenceAnalysis } from "@/lib/sequence/types";
import { Card } from "@/components/ui/card";

export function CoreMetrics({ analysis }: { analysis: SequenceAnalysis }) {
  const invalid = analysis.status === "invalid";
  const metrics = [
    ["Length", `${analysis.length} aa`, "Normalized sequence"],
    ["Mass", invalid ? "—" : `${(analysis.molecularWeight / 1000).toFixed(2)} kDa`, "Estimated molecular weight"],
    ["Theoretical pI", invalid ? "—" : analysis.theoreticalPI.toFixed(2), "Calculated estimate"],
    ["Hydrophobicity", invalid ? "—" : analysis.hydrophobicity.toFixed(2), "Hydrophobic residue share"],
  ];
  return <div className="metrics-grid" aria-label="Core analysis metrics">{metrics.map(([label, value, note]) => <Card className="metric" key={label}><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></Card>)}</div>;
}
