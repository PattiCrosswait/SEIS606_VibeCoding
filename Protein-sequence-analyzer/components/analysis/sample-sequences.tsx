const SAMPLES = [
  { name: "Secreted peptide", description: "Signal peptide example", sequence: "MKWVTFISLLLLFSSAYSRGVFRRDTHKSEIAHRFKDLGE" },
  { name: "Compact enzyme", description: "Balanced composition example", sequence: "MKTIIALSYIFCLVFADYKDDDDK" },
];

export function SampleSequences({ onSelect }: { onSelect: (sequence: string) => void }) {
  return <div className="sample-list">{SAMPLES.map((sample) => <button key={sample.name} type="button" className="sample-button" onClick={() => onSelect(sample.sequence)}><span><strong>{sample.name}</strong><small>{sample.description}</small></span><span aria-hidden="true">→</span></button>)}</div>;
}
