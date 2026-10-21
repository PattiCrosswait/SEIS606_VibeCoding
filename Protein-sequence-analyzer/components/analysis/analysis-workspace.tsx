"use client";

import { useEffect, useMemo, useState } from "react";
import { analyzeSequence } from "@/lib/sequence/analyze";
import { createSavedProtein, deleteLibraryProtein, readLibrary, syncLibraryProtein, writeLibrary } from "@/lib/protein/library";
import { alignMultiple, alignPairwise } from "@/lib/protein/align";
import type { SavedProtein } from "@/lib/protein/types";
import { createAnalysisReport, createComparisonReport } from "@/lib/reports/export-report";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusMessage } from "@/components/ui/status-message";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { CoreMetrics } from "./core-metrics";
import { ResidueMap } from "./residue-map";
import { SequenceInput } from "./sequence-input";
import { SampleSequences } from "./sample-sequences";
import { PredictionPanel } from "@/components/predictions/prediction-panel";
import { ProteinLibrary } from "@/components/library/protein-library";
import { ProteinComparison } from "@/components/comparison/protein-comparison";
import { ProteinSearch } from "@/components/discovery/protein-search";
import { ReportDownload } from "@/components/reports/report-download";

const DEFAULT_SEQUENCE = "MKWVTFISLLLLFSSAYSRGVFRRDTHKSEIAHRFKDLGE";

export function AnalysisWorkspace() {
  const [input, setInput] = useState(DEFAULT_SEQUENCE);
  const [submittedInput, setSubmittedInput] = useState(DEFAULT_SEQUENCE);
  const [activeNav, setActiveNav] = useState("Analyze");
  const [library, setLibrary] = useState<SavedProtein[]>(() => readLibrary());
  const [selected, setSelected] = useState<SavedProtein[]>([]);
  const [alignment, setAlignment] = useState<ReturnType<typeof alignPairwise> | null>(null);
  const analysis = useMemo(() => analyzeSequence(submittedInput), [submittedInput]);
  const report = useMemo(() => createAnalysisReport(submittedInput, analysis), [submittedInput, analysis]);
  const isInvalid = analysis.status === "invalid";

  useEffect(() => {
    let active = true;
    fetch("/api/library")
      .then((response) => response.ok ? response.json() as Promise<{ proteins?: SavedProtein[] }> : Promise.reject(new Error("Library unavailable")))
      .then((body) => {
        if (!active || !Array.isArray(body.proteins) || !body.proteins.length) return;
        setLibrary(body.proteins);
        writeLibrary(body.proteins);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  function submit() { setSubmittedInput(input); }
  function saveCurrent() {
    if (analysis.status !== "valid") return;
    const protein = createSavedProtein(`Protein ${library.length + 1}`, analysis.normalizedSequence, analysis);
    const next = [...library, protein];
    setLibrary(next);
    writeLibrary(next);
    void syncLibraryProtein(protein).catch(() => undefined);
  }
  function removeProtein(id: string) {
    const next = library.filter((protein) => protein.sequenceId !== id);
    setLibrary(next);
    writeLibrary(next);
    void deleteLibraryProtein(id).catch(() => undefined);
  }
  function compare(proteins: SavedProtein[]) {
    setSelected(proteins);
    if (proteins.length === 2) setAlignment(alignPairwise({ id: proteins[0].sequenceId, name: proteins[0].name, sequence: proteins[0].sequence }, { id: proteins[1].sequenceId, name: proteins[1].name, sequence: proteins[1].sequence }));
    else if (proteins.length >= 3) setAlignment(alignMultiple(proteins.map((protein) => ({ id: protein.sequenceId, name: protein.name, sequence: protein.sequence }))));
  }
  function downloadComparison() {
    if (!alignment) return;
    const reportText = createComparisonReport(alignment);
    const url = URL.createObjectURL(new Blob([reportText], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "protein-comparison-report.txt";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return <div className="app-shell"><SidebarNav active={activeNav} onChange={setActiveNav} /><main className="main-content">
    <header className="topbar"><div><div className="eyebrow">Sequence intelligence</div><h1 className="title">Understand what&apos;s in your <em>protein</em>.</h1><p className="subtitle">Paste a sequence, inspect deterministic properties, and keep predictions clearly labeled as evidence—not certainty.</p></div><div className="button-row"><ReportDownload report={report} /><Button type="button" variant="primary" onClick={submit}>Analyze sequence</Button></div></header>
    {activeNav === "Analyze" ? <><div className="workspace-grid"><Card><div className="panel-header"><div><h2>Sequence input</h2><p className="muted">Raw amino acids or FASTA records accepted</p></div><span className="muted">{input.length} characters</span></div><SequenceInput value={input} onChange={setInput} onSubmit={submit} /><div className="input-body"><StatusMessage tone={isInvalid ? "error" : "success"}>{isInvalid ? `Error: ${analysis.originalInput ? "unsupported or empty sequence; input preserved." : "enter a valid sequence."}` : `Ready: ${analysis.length} residues analyzed locally.`}</StatusMessage>{analysis.originalInput !== analysis.normalizedSequence ? <details><summary>Show normalized sequence</summary><code className="normalized-sequence">{analysis.normalizedSequence || "(none)"}</code></details> : null}<Button type="button" onClick={saveCurrent} disabled={isInvalid}>Save valid sequence</Button></div></Card><Card><div className="panel-header"><div><h2>Try a sample</h2><p className="muted">Start with a known pattern</p></div></div><SampleSequences onSelect={(sequence) => { setInput(sequence); setSubmittedInput(sequence); }} /></Card></div><CoreMetrics analysis={analysis} /><div className="lower-grid"><ResidueMap analysis={analysis} /><Card className="insights"><div className="panel-header"><div><h2>Interpretation</h2><p className="muted">Plain-language context</p></div></div><div className="insight"><span className="insight-icon">i</span><div><strong>{analysis.composition.charged > analysis.composition.hydrophobic ? "Charge-forward profile" : "Hydrophobic-forward profile"}</strong><p>These are sequence-level observations, not experimental findings.</p></div></div><div className="insight"><span className="insight-icon">✓</span><div><strong>Deterministic local analysis</strong><p>Version {analysis.analysisVersion}; identical input produces identical values.</p></div></div></Card></div>{!isInvalid ? <PredictionPanel sequence={analysis.normalizedSequence} /> : null}</> : activeNav === "Saved" ? <ProteinLibrary proteins={library} onCompare={compare} onDelete={removeProtein} /> : activeNav === "Compare" ? <><ProteinComparison proteins={selected} alignment={alignment} /><div className="button-row"><Button type="button" onClick={downloadComparison} disabled={!alignment}>Download comparison report</Button></div></> : activeNav === "Reports" ? <section className="panel report-panel"><div className="panel-header"><div><h2>Reports</h2><p className="muted">Download an auditable report for the current analysis.</p></div><ReportDownload report={report} /></div><pre className="report-preview">{report}</pre></section> : <><section className="panel preferences-panel"><div className="panel-header"><div><h2>Preferences</h2><p className="muted">Core analysis is local and deterministic. Optional provider credentials remain server-side.</p></div></div></section><ProteinSearch /></>}
  </main></div>;
}
