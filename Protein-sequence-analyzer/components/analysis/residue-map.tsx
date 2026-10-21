import type { SequenceAnalysis } from "@/lib/sequence/types";
import { Card } from "@/components/ui/card";

export function ResidueMap({ analysis }: { analysis: SequenceAnalysis }) {
  return <Card className="sequence-map"><div className="panel-header"><div><h2>Residue map</h2><p className="muted">Each residue has a position and text label.</p></div></div><div className="sequence-view" aria-label="Position-aware residue map">{analysis.normalizedSequence.split("").map((residue, index) => <span key={`${index}-${residue}`} className={`residue ${analysis.residueGroups[index]}`} title={`Position ${index + 1}: ${residue}`} aria-label={`Position ${index + 1}: ${residue}`}>{residue}</span>)}</div><div className="legend" aria-label="Residue group legend"><span>Hydrophobic</span><span className="polar">Polar</span><span className="charged">Charged</span><span className="special">Special</span></div></Card>;
}
