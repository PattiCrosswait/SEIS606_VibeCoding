---

description: "Executable Next.js task list for Protein Sequence Analysis"
---

# Tasks: Protein Sequence Analysis

**Input**: Design documents from `specs/001-protein-sequence-analysis/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Test tasks are included because the constitution requires coverage for valid, empty, malformed, boundary, loading, failure, recovery, accessibility, and performance behavior.

## Phase 1: Setup

- [ ] T001 Initialize the Next.js TypeScript project scripts and dependencies in `package.json`.
- [ ] T002 [P] Configure TypeScript aliases and compiler settings in `tsconfig.json`.
- [ ] T003 [P] Configure Next.js and Vercel-compatible project settings in `next.config.ts`.
- [ ] T004 [P] Configure ESLint and repository ignores in `eslint.config.mjs` and `.gitignore`.
- [ ] T005 [P] Create the root App Router shell, metadata, and global styles in `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`.
- [ ] T006 [P] Add reusable shadcn/ui-style primitives for buttons, cards, inputs, status messages, dialogs, and tables in `components/ui/`.

---

## Phase 2: Foundational

- [ ] T007 Define typed sequence, analysis, prediction, saved-protein, comparison, database-match, and report entities in `lib/sequence/types.ts`, `lib/predictions/types.ts`, and `lib/protein/types.ts`.
- [ ] T008 Implement class-name composition utilities in `lib/utils.ts`.
- [ ] T009 Implement normalized-sequence validation in `lib/sequence/validate.ts`, preserving `originalInput`, removing FASTA headers and permitted whitespace, uppercasing residues, and reporting unsupported characters.
- [ ] T010 Implement deterministic core calculations in `lib/sequence/analyze.ts` for length, molecular weight, theoretical pI, hydrophobicity, composition, residue groups, and `analysisVersion`.
- [ ] T011 [P] Add a worker entry point for long-sequence and alignment work in `workers/sequence-analysis.worker.ts`.
- [ ] T012 [P] Add server-route response types and explicit unavailable/error contracts in `lib/integrations/contracts.ts`.
- [ ] T013 [P] Add route handlers for unavailable prediction and protein-search providers in `app/api/predictions/route.ts` and `app/api/protein-search/route.ts`.
- [ ] T014 Create representative input and expected-output fixtures in `tests/fixtures/protein-sequences.json` and `tests/fixtures/sequence-analysis-cases.json`.
- [ ] T015 Create focused sequence regression tests in `tests/unit/sequence-analysis.test.ts` covering empty input, malformed FASTA, unsupported residues, case/whitespace normalization, single-residue input, 1,000-residue input, composition totals, safe input, and deterministic repeatability.
- [ ] T016 Create shared UI-state and accessibility contracts in `tests/browser/test-cases.md` and `tests/browser/accessibility-checklist.md`.

**Checkpoint**: Shared domain logic, contracts, fixtures, route boundaries, and accessibility conventions exist before story work begins.

---

## Phase 3: User Story 1 - Analyze and Validate a Protein Sequence (Priority: P1) MVP

**Goal**: Let users submit raw or FASTA protein sequences and receive trustworthy, deterministic core analysis.

**Independent Test**: Run the Next.js app, analyze valid raw, FASTA, lowercase/whitespace, single-residue, repeated, and 1,000-residue inputs, then submit empty, malformed, unsupported, and markup-like input and verify explicit safe states.

- [ ] T017 [P] [US1] Create the analysis workspace layout and client state in `components/analysis/analysis-workspace.tsx`.
- [ ] T018 [US1] Add an explicitly submitted sequence input and Analyze action in `components/analysis/sequence-input.tsx`.
- [ ] T019 [US1] Render length, molecular weight, theoretical pI, hydrophobicity, composition totals, analysis version, and assumptions in `components/analysis/core-metrics.tsx`.
- [ ] T020 [US1] Render position-aware residues with text labels and non-color group cues in `components/analysis/residue-map.tsx`.
- [ ] T021 [US1] Implement current, editing, analyzing, valid, invalid, and stale result states in `components/analysis/analysis-workspace.tsx`.
- [ ] T022 [US1] Ensure original input and normalized sequence remain distinguishable in `components/analysis/analysis-workspace.tsx`.
- [ ] T023 [US1] Add core analysis browser scenarios in `tests/browser/core-analysis.md` for all seven US1 acceptance scenarios.

**Checkpoint**: US1 is independently usable as the MVP without prediction or external database services.

---

## Phase 4: User Story 4 - Use the Analyzer Accessibly and Reliably (Priority: P1)

**Goal**: Make the MVP keyboard-accessible, responsive, recoverable, and reportable.

**Independent Test**: Use only keyboard controls to load a sample, analyze a sequence, navigate sections, inspect status announcements, resize the viewport, and download a report without losing current state.

- [ ] T024 [P] [US4] Implement active navigation for Analyze, Saved, Compare, Reports, and Preferences in `components/layout/sidebar-nav.tsx`.
- [ ] T025 [P] [US4] Add sample sequence cards and loading feedback in `components/analysis/sample-sequences.tsx`.
- [ ] T026 [US4] Add keyboard focus order, accessible names, live regions, and non-color status cues in `components/analysis/analysis-workspace.tsx` and `app/globals.css`.
- [ ] T027 [US4] Add mobile and desktop responsive layout rules, intentional long-sequence scrolling, and table overflow handling in `app/globals.css`.
- [ ] T028 [US4] Add loading, failure, retry, duplicate-submission, and recovery UI primitives in `components/ui/status-message.tsx` and `components/ui/async-state.tsx`.
- [ ] T029 [US4] Implement complete analysis report generation in `lib/reports/export-report.ts`, including input/reference, normalized sequence, results, methods, assumptions, limitations, and `analysisVersion`.
- [ ] T030 [US4] Implement report download with a meaningful filename in `components/reports/report-download.tsx`.
- [ ] T031 [US4] Add usability and accessibility browser scenarios in `tests/browser/usability.md` for keyboard operation, status updates, responsive layouts, state preservation, and report download.

**Checkpoint**: US1 and US4 together form an accessible, responsive MVP.

---

## Phase 5: User Story 2 - Interpret Biological Features (Priority: P2)

**Goal**: Present biological predictions with positions, provenance, uncertainty, and safe provider failure states.

**Independent Test**: Analyze representative signal-peptide, transmembrane, motif/domain, disorder, and secondary-structure inputs; inspect available/no-signal states; simulate provider failure and verify core metrics remain usable.

- [ ] T032 [P] [US2] Define prediction feature types, residue ranges, lifecycle states, confidence fields, provenance, and limitations in `lib/predictions/types.ts`.
- [ ] T033 [P] [US2] Add prediction fixtures with available, no-strong-signal, unavailable, failed, and retryable examples in `tests/fixtures/prediction-results.json`.
- [ ] T034 [US2] Implement prediction request and response normalization in `lib/predictions/client.ts`, keeping provider credentials out of browser code.
- [ ] T035 [US2] Implement prediction loading, available, no-signal, unavailable, failed, and retryable states in `components/predictions/prediction-panel.tsx`.
- [ ] T036 [US2] Render signal-peptide, transmembrane, motif/domain, low-complexity/disorder, and secondary-structure ranges in `components/predictions/prediction-visualization.tsx`.
- [ ] T037 [US2] Render method, source/model, version, confidence/score, and limitations in `components/predictions/prediction-details.tsx`.
- [ ] T038 [US2] Connect prediction UI to `app/api/predictions/route.ts` while preserving core analysis results on provider failure in `components/predictions/prediction-panel.tsx`.
- [ ] T039 [US2] Add biological-prediction browser scenarios in `tests/browser/biological-predictions.md` for all seven US2 acceptance scenarios.

**Checkpoint**: US2 distinguishes computed facts, predictions, and experimental confirmation.

---

## Phase 6: User Story 3 - Compare, Discover, and Report on Proteins (Priority: P2)

**Goal**: Support saved proteins, comparisons, alignments, database discovery, filtering, and reproducible exports.

**Independent Test**: Save valid sequences, compare two, align two and three sequences, search for matches and no matches, filter the library, handle missing metadata, and export matching results.

- [ ] T040 [P] [US3] Define saved-protein, alignment, comparison, database-match, and report types in `lib/protein/types.ts`.
- [ ] T041 [P] [US3] Add saved-library fixtures with different names, accessions, types, and missing metadata in `tests/fixtures/saved-proteins.json`.
- [ ] T042 [US3] Implement client-side saved-library state, unique sequence identifiers, analyzed timestamps, and optional metadata in `lib/protein/library.ts`.
- [ ] T043 [US3] Implement searchable and filterable saved-library UI with empty-state handling in `components/library/protein-library.tsx`.
- [ ] T044 [US3] Implement side-by-side metric comparison and unavailable metadata states in `components/comparison/protein-comparison.tsx`.
- [ ] T045 [US3] Implement pairwise alignment with matches, mismatches, insertions, deletions, positions, scoring assumptions, and gap assumptions in `lib/protein/align.ts` and `components/comparison/alignment-view.tsx`.
- [ ] T046 [US3] Implement multiple-sequence alignment for at least three selected sequences and conserved-position display in `components/comparison/alignment-view.tsx`.
- [ ] T047 [US3] Implement database-search request normalization and match/no-results/unavailable/failed states in `lib/protein/search.ts` and `components/discovery/protein-search.tsx`.
- [ ] T048 [US3] Connect discovery UI to `app/api/protein-search/route.ts` with source, retrieval time, name, accession, organism, and length fields in `components/discovery/protein-search.tsx`.
- [ ] T049 [US3] Implement comparison and alignment report export in `lib/reports/export-report.ts` and `components/reports/report-download.tsx`.
- [ ] T050 [US3] Add comparison and discovery browser scenarios in `tests/browser/comparison-discovery.md` for all eight US3 acceptance scenarios.

**Checkpoint**: US3 supports independent saved-library, comparison, alignment, discovery, and report workflows.

---

## Phase 7: Polish and Cross-Cutting Validation

- [ ] T051 [P] Add all 38 aggregated scenarios to `tests/browser/test-cases.md` with links to the story-specific checks.
- [ ] T052 [P] Add route-handler tests for explicit unavailable, no-results, failed, and retryable contracts in `tests/unit/integration-routes.test.ts`.
- [ ] T053 [P] Run `npm run typecheck` and fix type errors across `app/`, `components/`, `lib/`, `tests/`, and `workers/`.
- [ ] T054 [P] Run `npm run lint` and fix accessibility, unsafe-rendering, and Next.js lint findings.
- [ ] T055 [P] Run `npm test` and fix sequence, integration, and report regression failures.
- [ ] T056 [P] Run `npm run build` and verify the application is deployable to Vercel.
- [ ] T057 Review `specs/001-protein-sequence-analysis/contracts/ui-contract.md`, `specs/001-protein-sequence-analysis/data-model.md`, and `specs/001-protein-sequence-analysis/quickstart.md` against the final behavior and document intentional deviations.
- [ ] T058 Measure short, medium, and 1,000-residue interaction performance and move expensive analysis to `workers/sequence-analysis.worker.ts` if the browser interaction path is blocked.

---

## Dependencies and Execution Order

- **Setup (Phase 1)**: T001-T006 are the project foundation; T002-T006 can run in parallel after T001.
- **Foundational (Phase 2)**: T007-T016 depend on the setup; T011-T016 can be parallelized where they touch different files.
- **US1 (Phase 3)**: T017-T023 depend on the foundational sequence contracts and fixtures; US1 is the recommended MVP.
- **US4 (Phase 4)**: T024-T031 depends on the app shell and can proceed alongside late US1 work.
- **US2 (Phase 5)**: T032-T039 depends on normalized sequence types and the prediction route boundary; it can begin after US1.
- **US3 (Phase 6)**: T040-T050 depends on normalized sequence types and the search route boundary; it can begin after US1.
- **Polish (Phase 7)**: T051-T058 depends on the stories being validated and can be parallelized by concern.

## Parallel Execution Examples

### Setup and Foundation

```text
After T001: T002, T003, T004, T005, and T006 can run in parallel.
After T007-T010: T011, T012, T013, T014, and T016 can run in parallel.
```

### P1 Stories

```text
After foundational work: US1 and US4 can be assigned to separate implementers.
Within US1: T018, T019, and T020 can proceed in parallel after T017 defines the workspace state.
Within US4: T024, T025, and T027 can proceed in parallel; T029 and T030 remain sequential.
```

### P2 Stories

```text
After US1: US2 and US3 can proceed in parallel.
Within US2: T032 and T033 can proceed in parallel; T035-T038 follow the prediction types.
Within US3: T040 and T041 can proceed in parallel; T043-T049 follow the library and comparison types.
```

## Implementation Strategy

1. Establish the Next.js, TypeScript, UI, route, and testing foundation.
2. Deliver US1 as the MVP with local, deterministic, safe sequence analysis.
3. Deliver US4 immediately after or alongside US1 for accessibility, responsive behavior, recovery, and reports.
4. Add US2 predictions behind explicit optional-service states.
5. Add US3 saved-library, comparison, alignment, discovery, and reproducible reports.
6. Complete all 38 acceptance scenarios and the Next.js/Vercel quality gates before release.
