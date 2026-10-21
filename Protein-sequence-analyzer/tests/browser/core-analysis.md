# Core Analysis Browser Scenarios

The following scenarios map to the aggregated acceptance cases in `scratch/test_protein_sequence_analyzer.txt`:

1. Raw amino-acid input produces length, mass, pI, hydrophobicity, composition, and residue-map values.
2. FASTA headers and permitted whitespace are excluded from calculations.
3. Lowercase input produces the same deterministic values as uppercase input.
4. Empty input preserves the edit and shows corrective validation.
5. Unsupported residues preserve the edit and do not update current-looking results.
6. Single-residue input produces valid metrics.
7. A 1,000-residue input remains usable and composition totals equal length.
8. Markup-like input is rendered as text rather than HTML.
