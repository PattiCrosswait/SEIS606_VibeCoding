# UI Contract: Protein Sequence Analysis

This contract defines observable behavior for the browser interface. It does not prescribe a framework or internal component structure.

## Analysis Input

- The sequence input is keyboard reachable and has an accessible name.
- Analyze is an explicit action; validation and calculation results correspond to the submitted input.
- The interface exposes original input and normalized sequence separately when both are displayed.
- Validation states identify empty input, unsupported characters, malformed FASTA, and valid input with corrective text.
- Invalid submission preserves the user's edited text and prevents current-looking result updates.

## Core Results

- Results display length, molecular weight, theoretical pI, hydrophobicity, composition, and residue visualization.
- Every metric has a readable label and unit or definition.
- Residue categories and charts have text, labels, patterns, or equivalent non-color cues.
- Current, stale, unavailable, and predicted results are distinguishable in text.
- Repeating analysis with identical normalized input produces identical displayed values for the same analysis version.

## Optional Prediction State

Each prediction surface exposes one of:

| State | Required user-visible behavior |
|---|---|
| `pending` | Loading or progress indication |
| `available` | Feature, positions, method/source, confidence or score, version, and limitations |
| `no-strong-signal` | Clear no-prediction explanation; no invented feature |
| `unavailable` | Service unavailable explanation; core results remain usable |
| `failed` | Failure explanation and retry action; no success-shaped prediction |
| `retryable` | Explicit action to request the prediction again |

## Comparison and Discovery

- Compare shows selected sequences side by side with text-labeled differences.
- Pairwise and multiple alignment results expose positions, gaps, differences, conserved positions, and scoring assumptions.
- Search results identify source and retrieval time.
- No-match and empty-library states provide a next action.
- Missing metadata is represented as unavailable and does not break supported comparisons.

## Navigation, Accessibility, and Responsive Behavior

- Analysis, saved sequences, comparison, reports, and preferences have a visible active state.
- All essential controls are keyboard reachable, have visible focus, and activate with Enter or Space.
- Status updates are exposed to assistive technology.
- The layout remains usable at narrow mobile and wide desktop widths.
- Long sequences and tables use intentional wrapping or scrolling rather than clipping.

## Reports

- Download actions communicate progress or completion.
- A report includes input or references, normalized sequence, results, methods/settings, assumptions, limitations, and analysis version.
- Exported values match the visible results for the same operation.
