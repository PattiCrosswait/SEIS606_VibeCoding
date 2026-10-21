"use client";

import { useMemo, useState } from "react";
import { Activity, BookOpen, ChartNoAxesCombined, FileText, Settings2 } from "lucide-react";
import { analyzeSequence } from "@/lib/sequence/analyze";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_SEQUENCE = "MKWVTFISLLLLFSSAYSRGVFRRDTHKSEIAHRFKDLGE";
const SAMPLES = [
  { name: "Secreted peptide", description: "Signal peptide example", sequence: "MKWVTFISLLLLFSSAYSRGVFRRDTHKSEIAHRFKDLGE" },
  { name: "Compact enzyme", description: "Balanced composition example", sequence: "MKTIIALSYIFCLVFADYKDDDDK" },
];
const NAV = [
  { label: "Analyze", icon: Activity },
  { label: "Saved", icon: BookOpen },
  { label: "Compare", icon: ChartNoAxesCombined },
  { label: "Reports", icon: FileText },
  { label: "Preferences", icon: Settings2 },
];

export function AnalysisWorkspace() {
  const [input, setInput] = useState(DEFAULT_SEQUENCE);
  const [submittedInput, setSubmittedInput] = useState(DEFAULT_SEQUENCE);
  const [activeNav, setActiveNav] = useState("Analyze");
  const analysis = useMemo(() => analyzeSequence(submittedInput), [submittedInput]);
  const isInvalid = analysis.status === "invalid";

  function submit() {
    setSubmittedInput(input);
  }

  function downloadReport() {
    const report = [
      "What's In My Protein report",
      `Analysis version: ${analysis.analysisVersion}`,
      `Normalized sequence: ${analysis.normalizedSequence}`,
      `Length: ${analysis.length} aa`,
      `Molecular weight: ${(analysis.molecularWeight / 1000).toFixed(2)} kDa`,
      `Theoretical pI: ${analysis.theoreticalPI.toFixed(2)}`,
      `Hydrophobicity: ${analysis.hydrophobicity.toFixed(2)}`,
      "Limitations: Sequence-level calculations are estimates and do not replace experimental confirmation.",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "protein-analysis-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <aside className="rail" aria-label="Primary navigation">
        <div className="logo"><span className="logo-mark">⌁</span>What&apos;s In My Protein</div>
        <nav className="nav-list">
          {NAV.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className={`nav-button ${activeNav === label ? "active" : ""}`} onClick={() => setActiveNav(label)} aria-current={activeNav === label ? "page" : undefined}>
              <Icon size={17} aria-hidden="true" /><span className="nav-label">{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="eyebrow">Sequence intelligence</div>
            <h1 className="title">Understand what&apos;s in your <em>protein</em>.</h1>
            <p className="subtitle">Paste a sequence, inspect deterministic properties, and keep predictions clearly labeled as evidence—not certainty.</p>
          </div>
          <div className="button-row">
            <Button type="button" onClick={downloadReport}>Download report</Button>
            <Button type="button" variant="primary" onClick={submit}>Analyze sequence</Button>
          </div>
        </header>

        <div className="workspace-grid">
          <Card>
            <div className="panel-header"><div><h2>Sequence input</h2><p className="muted">Raw amino acids or FASTA records accepted</p></div><span className="muted">{input.length} characters</span></div>
            <div className="input-body">
              <Textarea value={input} onChange={(event) => setInput(event.target.value)} aria-label="Protein sequence input" spellCheck={false} />
              <div id="analysis-status" className={`status ${isInvalid ? "error" : ""}`} role="status" aria-live="polite">
                {isInvalid ? "Error: enter a valid amino-acid sequence." : `Ready: ${analysis.length} residues analyzed locally.`}
              </div>
            </div>
          </Card>
          <Card>
            <div className="panel-header"><div><h2>Try a sample</h2><p className="muted">Start with a known pattern</p></div></div>
            <div className="sample-list">
              {SAMPLES.map((sample) => <button key={sample.name} type="button" className="sample-button" onClick={() => { setInput(sample.sequence); setSubmittedInput(sample.sequence); }}><span><strong>{sample.name}</strong><small>{sample.description}</small></span><span aria-hidden="true">→</span></button>)}
            </div>
          </Card>
        </div>

        <div className="metrics-grid" aria-label="Core analysis metrics">
          <Card className="metric"><div className="metric-label">Length</div><div className="metric-value">{analysis.length} aa</div><div className="metric-note">Normalized sequence</div></Card>
          <Card className="metric"><div className="metric-label">Mass</div><div className="metric-value">{isInvalid ? "—" : `${(analysis.molecularWeight / 1000).toFixed(2)} kDa`}</div><div className="metric-note">Estimated molecular weight</div></Card>
          <Card className="metric"><div className="metric-label">Theoretical pI</div><div className="metric-value">{isInvalid ? "—" : analysis.theoreticalPI.toFixed(2)}</div><div className="metric-note">Calculated estimate</div></Card>
          <Card className="metric"><div className="metric-label">Hydrophobicity</div><div className="metric-value">{isInvalid ? "—" : analysis.hydrophobicity.toFixed(2)}</div><div className="metric-note">Hydrophobic residue share</div></Card>
        </div>

        <div className="lower-grid">
          <Card className="sequence-map">
            <div className="panel-header"><div><h2>Residue map</h2><p className="muted">Hover or focus a residue to inspect its position</p></div></div>
            <div className="sequence-view" aria-label="Position-aware residue map">
              {analysis.normalizedSequence.split("").map((residue, index) => <span key={`${index}-${residue}`} className={`residue ${analysis.residueGroups[index]}`} title={`Position ${index + 1}: ${residue}`}>{residue}</span>)}
            </div>
            <div className="legend" aria-label="Residue group legend"><span>Hydrophobic</span><span className="polar">Polar</span><span className="charged">Charged</span><span className="special">Special</span></div>
          </Card>
          <Card className="insights">
            <div className="panel-header"><div><h2>Interpretation</h2><p className="muted">Plain-language context</p></div></div>
            <div className="insight"><span className="insight-icon">i</span><div><strong>{analysis.composition.charged > analysis.composition.hydrophobic ? "Charge-forward profile" : "Hydrophobic-forward profile"}</strong><p>These are sequence-level observations, not experimental findings.</p></div></div>
            <div className="insight"><span className="insight-icon">✓</span><div><strong>Deterministic local analysis</strong><p>Version {analysis.analysisVersion}; identical input produces identical values.</p></div></div>
          </Card>
        </div>
      </main>
    </div>
  );
}
