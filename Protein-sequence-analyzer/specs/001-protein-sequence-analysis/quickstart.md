# Quickstart Validation Guide: Protein Sequence Analysis

## Prerequisites

- A modern desktop or mobile browser.
- A local checkout of the repository.
- Node.js and npm.
- Run `npm install` from the repository root.
- Start the application with `npm run dev`, then open the displayed local URL.
- Use [scratch/test_protein_sequence_analyzer.txt](../../scratch/test_protein_sequence_analyzer.txt) as the acceptance checklist.
- The original [mockup/WhatsInMyProtein.html](../../mockup/WhatsInMyProtein.html) remains available as a visual reference.

## Basic Run

1. Run `npm run dev`.
2. Open the local Next.js URL.
3. Confirm the default sample produces core metrics and a residue map.
4. Enter a valid raw sequence and select **Analyze sequence**.
5. Enter the same sequence in lowercase with spaces and line breaks; confirm equivalent output.
6. Enter a FASTA record; confirm the header is excluded from calculations.
7. Try empty input and unsupported characters; confirm corrective validation and preserved input.
8. Paste a valid sequence of at least 1,000 residues; confirm the interface remains usable.
9. Analyze the same sequence twice; compare the displayed values.

## Prediction Validation

1. Use representative sequences for signal peptide, transmembrane, motif/domain, low-complexity/disorder, and secondary-structure scenarios.
2. Confirm each result shows prediction status, positions, source/method, confidence or score where available, and limitations.
3. Request `POST /api/predictions` with a local client.
4. Confirm the route returns an explicit unavailable state and core results remain visible.

## Comparison and Discovery Validation

1. Save at least two valid sequences and open the comparison surface.
2. Confirm side-by-side metrics and text-labeled differences.
3. Run pairwise alignment with different-length sequences and inspect positions and gap assumptions.
4. Run multiple alignment with at least three sequences and inspect conserved positions.
5. Request `POST /api/protein-search` with a local client.
6. Verify match metadata, no-match state, missing metadata behavior, and current-analysis preservation.
7. Search and filter the saved library, then clear filters.
8. Export a comparison or alignment report and compare its values with the screen.

## Accessibility and Responsive Validation

1. Use only Tab, Shift+Tab, Enter, and Space to complete analysis, navigation, filtering, and download.
2. Confirm every essential control has visible focus and a meaningful accessible name.
3. Inspect validation, progress, failure, and result updates with an accessibility inspector or assistive technology.
4. Confirm residue categories and result states remain understandable without color.
5. Test narrow mobile and wide desktop widths.
6. Confirm no core content is clipped, overlapped, or lost and that long sequences/tables have intentional scrolling or wrapping.

## Report Validation

1. Analyze a valid sequence.
2. Select **Download report**.
3. Open the downloaded file.
4. Confirm it includes the input or identifier, normalized sequence, metrics, visualizations or tables, methods, assumptions, limitations, and analysis version.
5. Confirm the filename is meaningful and values match the current analysis.

## Engineering Checks

```text
npm run typecheck
npm run lint
npm run build
```

## Expected Outcome

All 38 scenarios in the aggregated test file have a corresponding observable result. Any failure must identify the scenario, preserve user input where applicable, expose a clear status or corrective action, and avoid presenting unavailable or invalid results as successful.
