# Project 1 Test Log

Date prepared: 2026-10-21

Each entry records what was tested, how it was tested, the result, and the
disposition. Human-participant results are intentionally not fabricated; the
participant section must be completed after another person uses the application.
Machine-readable execution evidence uses UTC ISO 8601 timestamps in
[tests/logging/test-events.jsonl](tests/logging/test-events.jsonl). Manual
browser procedures are in
[tests/browser/manual-test-procedure.md](tests/browser/manual-test-procedure.md),
and the release checklist is in [PRE-FLIGHT.md](PRE-FLIGHT.md).

## Functional, edge-case, and negative testing

| ID | What was tested | How | Result | Disposition | Severity |
|---|---|---|---|---|---|
| F-01 | Valid raw sequence analysis | Ran `npm test`; verified the sequence-analysis fixtures and the application implementation | Length, mass, pI, hydrophobicity, composition, and deterministic results are covered and pass | Fixed/verified | — |
| F-02 | FASTA, lowercase, and whitespace normalization | Unit test for normalization and validation | FASTA headers and permitted whitespace are removed and lowercase input is normalized | Fixed/verified | — |
| F-03 | Empty and unsupported input | Unit tests with empty input and unsupported characters | Invalid input is rejected and does not produce a valid analysis object | Fixed/verified | — |
| F-04 | Single-residue input | Unit test using a one-residue sequence | Metrics and composition are calculated without an exception | Fixed/verified | — |
| F-05 | Long sequence | Unit test using a 1,000-residue fixture | Analysis completes and composition totals equal sequence length | Fixed/verified | — |
| F-06 | Markup-like input | Unit test using markup-like text | Input is rejected as a sequence and is treated as text rather than executable markup | Fixed/verified | — |
| F-07 | Repeatability | Unit test analyzes identical input more than once | Results are deterministic and the analysis version is exposed | Fixed/verified | — |
| F-08 | Local prediction provider | Unit test and live POST to `/api/predictions` with a representative sequence | The route returns heuristic predictions with method, source, version, ranges, and limitations; unsupported features remain explicitly no-strong-signal | Fixed/verified | — |
| F-09 | Protein-search provider unavailable | Unit test posts to `/api/protein-search` without a provider | The route returns an explicit unavailable response | Deferred provider integration | Medium |
| F-10 | Pairwise and multiple alignment | Unit tests for two and three saved sequences | Matches, mismatches, gaps, and conserved positions are represented | Fixed/verified | — |
| F-11 | Report contents | Unit test generates a comparison report | Report includes scoring assumptions and aligned sequences | Fixed/verified | — |

Automated validation run from the repository root:

```text
npm run typecheck  # passed
npm run lint       # passed
npm test           # 10 tests passed
npm run build      # passed
```

## Security probing

These probes were limited to this project.

| ID | Probe | How | Result | Disposition | Severity |
|---|---|---|---|---|---|
| S-01 | Markup/script injection | Submitted markup-like input through the sequence validation tests and inspected React rendering paths | Unsupported text is rejected by validation and user input is rendered through React text/props rather than injected HTML | Verified safe for this path | Low |
| S-02 | Exposed credentials or API keys | Searched tracked source and configuration for common key names and credential literals; inspected prediction/search route boundaries | No provider credentials are present in browser code or tracked configuration; provider routes return unavailable without configuration | Verified; provider setup remains deferred | Medium |
| S-03 | Saved-state tampering | Inspected the local-library serialization and parsing path in `lib/protein/library.ts`; considered malformed JSON and structurally invalid JSON in local storage | Malformed JSON is discarded by the error path. Structurally invalid JSON is currently cast without schema validation and should be hardened before treating local storage as trusted | Deferred: add runtime schema validation and browser tampering coverage | Medium |
| S-04 | Untrusted request body | Inspected both POST route handlers and route tests for missing/invalid sequence input | Missing sequence requests are rejected and unavailable responses are explicit | Verified | Low |

## Browser acceptance checks

Date executed: 2026-10-21
Environment: local Next.js development server at `http://localhost:3000`

| ID | What was tested | How | Result | Disposition |
|---|---|---|---|---|
| B-01 | Core analysis flow | Entered a FASTA/lowercase/whitespace sequence and selected **Analyze sequence** | Normalized sequence was analyzed and metrics updated to 3 residues | Verified |
| B-02 | Invalid input recovery | Entered `ACD!` and selected **Analyze sequence** | Error status was displayed, input was preserved, and saving was disabled | Verified |
| B-03 | Saved-library flow | Saved valid sequences, opened **Saved**, selected two records, and selected **Compare selected** | Saved records appeared and the comparison view displayed an alignment | Verified |
| B-04 | Navigation accessibility | Inspected the navigation accessibility tree and activated Analyze, Saved, and Compare | Navigation buttons now expose accessible names and the active item exposes `aria-current="page"` | Fixed in `components/layout/sidebar-nav.tsx` |
| B-05 | Responsive/long-content behavior | Inspected the responsive CSS and rendered residue map/alignment with scroll containers | Mobile layout rules and intentional horizontal/vertical scrolling are present | Verified by code and browser render |
| B-06 | Report download control | Activated the comparison report download control | The control activated without an application error; the integrated browser did not expose a download event for independent file-content inspection | Manual file-content check remains recommended |

## Usability testing with another person

This entry must be completed with a classmate or another participant who has
permission to test the application. Do not identify the participant by name
unless they consent.

- Participant identifier or role:
- Date and duration:
- Device/browser:
- Task instructions given without help:
  1. Analyze the default sequence.
  2. Load a sample sequence and analyze it.
  3. Enter invalid input and recover.
  4. Save a valid sequence and find it in the library.
  5. Download a report.
- Where the participant struggled:
- What they expected:
- What actually happened:
- Action taken: fixed, deferred, or won't fix:
- Severity:

## AI-assisted review

The assignment requires an AI security or QA review performed with a tool
different from the primary development tool. Complete the following record
after running that review.

- Review tool and version:
- Primary development tool:
- Prompt used:
- Files or scope reviewed:

| Finding | Verified or rejected | Evidence | Action | Severity |
|---|---|---|---|---|
| Add the reviewer's finding here | | | | |

## Overall test status

Automated functional, negative, and route coverage passes. Browser acceptance
checks were executed locally; one accessibility issue was fixed during the
check. Provider-dependent features are explicitly unavailable rather than
falsely successful. Human usability testing and the independent AI-assisted
review remain submission-time actions because they require a real participant
and a separately selected review tool, respectively.
