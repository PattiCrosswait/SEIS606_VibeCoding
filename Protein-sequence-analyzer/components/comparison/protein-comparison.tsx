import type { AlignmentResult, SavedProtein } from "@/lib/protein/types";
import { AlignmentView } from "./alignment-view";

export function ProteinComparison({ proteins, alignment }: { proteins: SavedProtein[]; alignment: AlignmentResult | null }) {
  return <section className="panel comparison-panel"><div className="panel-header"><div><h2>Comparison and alignment</h2><p className="muted">Matches, mismatches, gaps, and conserved positions are labeled in text.</p></div></div>{proteins.length ? <div className="comparison-table"><table><caption className="sr-only">Selected protein metrics</caption><thead><tr><th>Name</th><th>Length</th><th>Mass</th><th>pI</th><th>Type</th></tr></thead><tbody>{proteins.map((protein) => <tr key={protein.sequenceId}><th scope="row">{protein.name}</th><td>{protein.analysisSummary.length} aa</td><td>{(protein.analysisSummary.molecularWeight / 1000).toFixed(2)} kDa</td><td>{protein.analysisSummary.theoreticalPI.toFixed(2)}</td><td>{protein.type ?? "Unavailable"}</td></tr>)}</tbody></table></div> : null}<AlignmentView alignment={alignment} /></section>;
}
