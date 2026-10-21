---

description: "Executable Next.js task list for Protein Sequence Analysis"
---

# Tasks: Protein Sequence Analysis

**Input**: Design documents from `specs/001-protein-sequence-analysis/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

## Phase 1: Setup

- [X] T001 Initialize the Next.js TypeScript application scripts and dependencies in `package.json`.
- [X] T002 [P] Configure TypeScript path aliases in `tsconfig.json` and Next.js settings in `next.config.ts`.
- [X] T003 [P] Configure ESLint in `eslint.config.mjs` and repository ignores in `.gitignore`.
- [X] T004 [P] Add the root app shell and metadata in `app/layout.tsx`, `app/globals.css`, and `app/page.tsx`.
- [X] T005 [P] Add reusable shadcn/ui-style primitives in `components/ui/button.tsx`, `components/ui/card.tsx`, and `components/ui/textarea.tsx`.

## Phase 2: Foundational

- [X] T006 Create typed sequence entities and lifecycle states in `lib/sequence/types.ts`.
- [X] T007 Implement normalization, validation, residue grouping, deterministic calculations, and analysis versioning in `lib/sequence/analyze.ts`.
- [X] T008 [P] Add shared class-name utilities in `lib/utils.ts`.
- [X] T009 [P] Add a worker-ready sequence analysis entry point in `workers/sequence-analysis.worker.ts`.
- [X] T010 [P] Add explicit unavailable response contracts for optional integrations in `app/api/predictions/route.ts` and `app/api/protein-search/route.ts`.

## Phase 3: User Story 1 - Analyze and Validate a Protein Sequence (Priority: P1) MVP

**Goal**: Provide trustworthy local analysis for raw and FASTA sequence input.

**Independent Test**: Run the app, analyze valid raw, FASTA, lowercase/whitespace, single-residue, repeated, and long inputs, then submit empty and unsupported input and verify explicit results and error states.

- [X] T011 [US1] Create the client analysis workspace state and explicit Analyze action in `components/analysis/analysis-workspace.tsx`.
- [X] T012 [US1] Render length, molecular weight, theoretical pI, hydrophobicity, composition-derived interpretation, analysis version, and residue map in `components/analysis/analysis-workspace.tsx`.
- [X] T013 [US1] Preserve original input, display corrective invalid-input status, and avoid success-shaped metrics for invalid sequences in `components/analysis/analysis-workspace.tsx`.
- [X] T014 [US1] Add focused regression fixtures and executable checks for normalization, unsupported residues, single-residue calculations, long sequences, composition totals, and deterministic repeatability in `tests/unit/sequence-analysis.test.ts`.

## Phase 4: User Story 4 - Use the Analyzer Accessibly and Reliably (Priority: P1)

**Goal**: Provide reusable navigation, keyboard access, responsive behavior, progress/recovery states, and complete reports.

**Independent Test**: Navigate with keyboard, load samples, resize the page, inspect status announcements, and download a report without losing the current sequence.

- [X] T015 [US4] Add accessible navigation controls and active-state semantics in `components/analysis/analysis-workspace.tsx`.
- [X] T016 [US4] Add visible focus, live status, responsive layout, and intentional overflow behavior in `app/globals.css`.
- [X] T017 [US4] Implement sample loading and report download with normalized sequence, metrics, assumptions, limitations, and analysis version in `components/analysis/analysis-workspace.tsx`.
- [X] T018 [US4] Add browser acceptance scenarios for keyboard-only operation, mobile/desktop layouts, safe report download, and preserved state in `tests/browser/usability.md`.

## Phase 5: User Story 2 - Interpret Biological Features (Priority: P2)

**Goal**: Add prediction surfaces with provenance, uncertainty, and explicit service failure states.

**Independent Test**: Request prediction data through the route boundary, inspect available/no-signal/unavailable states, and verify core metrics remain usable.

- [ ] T019 [US2] Define typed prediction entities and lifecycle states in `lib/predictions/types.ts`.
- [ ] T020 [US2] Implement prediction loading, provenance, confidence, limitations, no-signal, failure, unavailable, and retry UI in `components/predictions/prediction-panel.tsx`.
- [ ] T021 [US2] Connect `components/predictions/prediction-panel.tsx` to `app/api/predictions/route.ts` without exposing provider credentials to the browser.
- [ ] T022 [US2] Add biological-prediction acceptance scenarios in `tests/browser/biological-predictions.md`.

## Phase 6: User Story 3 - Compare, Discover, and Report on Proteins (Priority: P2)

**Goal**: Add saved sequences, comparisons, alignments, discovery, filtering, and reproducible reports.

**Independent Test**: Save valid sequences, compare two, align two and three sequences, query the search route, filter saved items, handle missing metadata, and export matching results.

- [ ] T023 [US3] Define saved-protein, comparison, alignment, database-match, and report types in `lib/protein/types.ts`.
- [ ] T024 [US3] Implement client-side saved-library state and search/filter controls in `components/library/protein-library.tsx`.
- [ ] T025 [US3] Implement side-by-side metric comparison and missing-metadata states in `components/comparison/protein-comparison.tsx`.
- [ ] T026 [US3] Implement pairwise/multiple alignment display with differences, conserved positions, scoring assumptions, and gap assumptions in `components/comparison/alignment-view.tsx`.
- [ ] T027 [US3] Connect database discovery UI to `app/api/protein-search/route.ts` with match, no-results, unavailable, and retryable states in `components/discovery/protein-search.tsx`.
- [ ] T028 [US3] Implement reproducible comparison/alignment report export in `lib/reports/export-report.ts` and `components/reports/report-download.tsx`.
- [ ] T029 [US3] Add comparison/discovery acceptance scenarios in `tests/browser/comparison-discovery.md`.

## Phase 7: Polish and Cross-Cutting Validation

- [ ] T030 [P] Run `npm run typecheck` and fix type errors across `app/`, `components/`, `lib/`, and `workers/`.
- [ ] T031 [P] Run `npm run lint` and fix accessibility, unsafe rendering, and React/Next.js lint findings.
- [ ] T032 [P] Run `npm run build` and verify the app can be deployed as a Next.js project on Vercel.
- [ ] T033 [P] Add focused unit and browser test fixtures under `tests/fixtures/`, `tests/unit/`, and `tests/browser/` for all 38 aggregated scenarios.
- [ ] T034 Review [ui-contract.md](./contracts/ui-contract.md), [data-model.md](./data-model.md), and [quickstart.md](./quickstart.md) against the final implementation and update only intentional behavior differences.

## Dependencies and Execution Order

- Setup tasks T001-T005 establish the Next.js and UI foundation.
- Foundational tasks T006-T010 establish shared domain types, calculations, worker readiness, and server-route boundaries.
- US1 tasks T011-T014 depend on T006-T007 and are the MVP.
- US4 tasks T015-T018 depend on the app shell and can proceed in parallel with late US1 work.
- US2 tasks T019-T022 depend on US1 normalized sequence types and T010's prediction route.
- US3 tasks T023-T029 depend on US1 sequence types and T010's search route.
- T030-T034 run after the desired stories are implemented.

## Implementation Strategy

1. Ship US1 as the MVP: local, deterministic core analysis.
2. Keep US4 close behind so the MVP is accessible, responsive, and reportable.
3. Add prediction and discovery routes without coupling core analysis to remote services.
4. Add persistence only after saved-library behavior has been validated.
5. Move long-sequence/alignment workloads to the worker when measurements show main-thread impact.
