---

description: "Executable task list for Protein Sequence Analysis"
---

# Tasks: Protein Sequence Analysis

**Input**: Design documents from `specs/001-protein-sequence-analysis/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Validation tasks are included because the project constitution requires automated or repeatable checks for every user-visible behavior, including invalid, boundary, loading, and recovery states.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated as an independent increment after the shared foundation.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the validation and source structure without adding an unnecessary build system.

- [ ] T001 Create `tests/` with `tests/fixtures/`, `tests/browser/`, and `tests/unit/` directories for focused fixtures and repeatable browser checks.
- [ ] T002 [P] Create `tests/fixtures/protein-sequences.json` with valid raw, FASTA, lowercase/whitespace, empty, unsupported, single-residue, 1,000-residue, signal-peptide, transmembrane, motif/domain, disorder, and secondary-structure inputs.
- [ ] T003 [P] Create `tests/browser/test-cases.md` mapping the 38 scenarios in `scratch/test_protein_sequence_analyzer.txt` to browser steps and expected outcomes.
- [ ] T004 [P] Create `tests/unit/sequence-analysis-cases.json` with expected normalization, length, composition-total, molecular-weight, hydrophobicity, and repeatability outcomes for representative fixtures.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared parsing, calculation, state, safe-rendering, and UI contracts before story-specific work.

**⚠️ CRITICAL**: No user story implementation should be considered complete until these shared contracts are represented in `mockup/WhatsInMyProtein.html`.

- [ ] T005 Refactor the inline sequence parsing and analysis logic in `mockup/WhatsInMyProtein.html` into named validation, normalization, calculation, and rendering functions with explicit status values from `specs/001-protein-sequence-analysis/data-model.md`.
- [ ] T006 Implement shared analysis state in `mockup/WhatsInMyProtein.html` for `idle`, `editing`, `analyzing`, `valid`, `invalid`, and `stale`, preserving `originalInput` separately from `normalizedSequence`.
- [ ] T007 Implement safe text rendering in `mockup/WhatsInMyProtein.html` so user sequence input and identifiers are never inserted as executable markup.
- [ ] T008 [P] Add accessible names, live/status regions, visible focus styling, and text-based state cues in `mockup/WhatsInMyProtein.html` without relying on color alone.
- [ ] T009 [P] Add responsive overflow rules in `mockup/WhatsInMyProtein.html` for residue maps, long sequences, tables, charts, and comparison content at mobile and desktop widths.
- [ ] T010 Create `tests/unit/validate-sequence.mjs` as a repeatable check for empty input, malformed FASTA, unsupported residues, permitted whitespace/case normalization, safe-input handling, and preservation of invalid input.
- [ ] T011 Create `tests/unit/calculate-sequence.mjs` as a repeatable check for single-residue and 1,000-residue inputs, metric determinism, and composition groups summing exactly to sequence length.

**Checkpoint**: Shared parsing, state, safe rendering, accessibility, responsive behavior, and calculation checks are available; user-story work can proceed.

---

## Phase 3: User Story 1 - Analyze and Validate a Protein Sequence (Priority: P1) 🎯 MVP

**Goal**: Provide trustworthy, deterministic core sequence analysis for raw and FASTA inputs.

**Independent Test**: Open `mockup/WhatsInMyProtein.html`, analyze valid raw, FASTA, lowercase/whitespace, single-residue, repeated, and 1,000-residue fixtures, then submit empty and unsupported inputs and verify the expected metrics, messages, and stale-state behavior.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add core analysis acceptance checks for the raw, FASTA, lowercase/whitespace, empty, unsupported, single-residue, long-sequence, deterministic, and safe-rendering scenarios in `tests/browser/core-analysis.md`.
- [ ] T013 [P] [US1] Add expected-output fixtures for length, molecular weight, theoretical pI, hydrophobicity, residue groups, and residue-map positions in `tests/unit/sequence-analysis-cases.json`.

### Implementation for User Story 1

- [ ] T014 [US1] Implement FASTA-header removal, permitted-whitespace normalization, uppercase normalization, and invalid-character reporting in `mockup/WhatsInMyProtein.html`, preserving the exact `originalInput`.
- [ ] T015 [US1] Implement deterministic core calculations in `mockup/WhatsInMyProtein.html` for length, molecular weight, theoretical pI, hydrophobicity, composition, and residue-map data with units, definitions, and analysis version.
- [ ] T016 [US1] Render valid core results in `mockup/WhatsInMyProtein.html` with readable metric labels, composition totals, position-aware residue text, and non-color residue-category cues.
- [ ] T017 [US1] Implement invalid-submission behavior in `mockup/WhatsInMyProtein.html` so empty, malformed, unsupported, and markup-like input shows corrective status, preserves edited text, and does not replace current results with misleading values.
- [ ] T018 [US1] Implement explicit analysis progress and completion status in `mockup/WhatsInMyProtein.html` while preventing unnecessary repeated analysis during typing or paste events.

**Checkpoint**: User Story 1 is independently usable and satisfies the core-analysis acceptance scenarios.

---

## Phase 4: User Story 4 - Use the Analyzer Accessibly and Reliably (Priority: P1)

**Goal**: Make the analyzer keyboard-accessible, responsive, recoverable, and safe to use across supported viewports.

**Independent Test**: Use only keyboard controls to load a sample, analyze a sequence, navigate sections, filter the library, and request a report; repeat at narrow mobile and wide desktop widths while observing status messages and focus.

### Tests for User Story 4

- [ ] T019 [P] [US4] Create `tests/browser/usability.md` with keyboard-only, accessible-name, status-announcement, non-color, mobile-layout, desktop-layout, progress/retry, navigation-state, and report-download checks.
- [ ] T020 [P] [US4] Create `tests/browser/accessibility-checklist.md` with repeatable checks for focus order, visible focus, semantic labels, live status updates, contrast, and text alternatives.

### Implementation for User Story 4

- [ ] T021 [US4] Implement sample-sequence loading and status feedback in `mockup/WhatsInMyProtein.html` without discarding the current input unexpectedly.
- [ ] T022 [US4] Implement functional navigation states for Analyze, Saved sequences, Compare, Reports, and Preferences in `mockup/WhatsInMyProtein.html`, preserving or explaining retained analysis state.
- [ ] T023 [US4] Complete keyboard interaction and assistive-technology behavior in `mockup/WhatsInMyProtein.html` for inputs, buttons, menus, tables, validation messages, result regions, and charts.
- [ ] T024 [US4] Implement explicit loading, failure, retry, duplicate-submission, and recovery states in `mockup/WhatsInMyProtein.html` for delayed analysis, prediction, search, and export operations.
- [ ] T025 [US4] Implement responsive layout behavior in `mockup/WhatsInMyProtein.html` for narrow mobile and wide desktop widths, including intentional scrolling for long sequences and tables.
- [ ] T026 [US4] Implement complete report download behavior in `mockup/WhatsInMyProtein.html` with a meaningful filename and input, normalized sequence, metrics, methods, assumptions, limitations, and analysis-version content.

**Checkpoint**: User Story 4 is independently testable with keyboard, assistive-technology, responsive, recovery, and report scenarios.

---

## Phase 5: User Story 2 - Interpret Biological Features (Priority: P2)

**Goal**: Present biological predictions with positions, provenance, uncertainty, and reliable failure states while preserving core analysis.

**Independent Test**: Analyze representative prediction fixtures, inspect available and no-signal outputs, then make the optional prediction provider unavailable and verify retry/unavailable behavior with core metrics intact.

### Tests for User Story 2

- [ ] T027 [P] [US2] Create `tests/browser/biological-predictions.md` covering signal peptide, transmembrane, motif/domain, low-complexity/disorder, secondary-structure, no-strong-signal, and prediction-service-failure scenarios.
- [ ] T028 [P] [US2] Create `tests/fixtures/prediction-results.json` with representative feature ranges, confidence/score fields, method/source/version values, and limitation text.

### Implementation for User Story 2

- [ ] T029 [US2] Add prediction state handling in `mockup/WhatsInMyProtein.html` for `pending`, `available`, `no-strong-signal`, `unavailable`, `failed`, and `retryable`, ensuring failed results cannot render as available.
- [ ] T030 [US2] Implement signal-peptide and transmembrane prediction result views in `mockup/WhatsInMyProtein.html` with normalized-sequence residue ranges and clear prediction labels.
- [ ] T031 [US2] Implement motif/domain, low-complexity/disorder, and secondary-structure result views in `mockup/WhatsInMyProtein.html` with legends and text alternatives that do not rely on color.
- [ ] T032 [US2] Implement prediction provenance details in `mockup/WhatsInMyProtein.html` for method, source/model, version, confidence or score, and plain-language limitations.
- [ ] T033 [US2] Implement optional prediction-provider loading, failure, unavailable, and retry behavior in `mockup/WhatsInMyProtein.html` so local core results remain visible when prediction services fail.

**Checkpoint**: User Story 2 is independently testable and clearly distinguishes computed facts, predictions, and experimental confirmation.

---

## Phase 6: User Story 3 - Compare, Discover, and Report on Proteins (Priority: P2)

**Goal**: Enable saved-sequence comparison, alignment, database discovery, filtering, and reproducible export.

**Independent Test**: Save valid sequences, compare two, align two and three sequences, search for a match and no match, filter the library, handle missing metadata, and export a report whose values match the interface.

### Tests for User Story 3

- [ ] T034 [P] [US3] Create `tests/browser/comparison-discovery.md` covering side-by-side comparison, pairwise alignment, multiple alignment, database matches, no-match state, library filtering, missing metadata, and report export.
- [ ] T035 [P] [US3] Create `tests/fixtures/comparison-sequences.json` with two different-length sequences, three alignment sequences, saved-library metadata variations, and expected difference/conservation cases.

### Implementation for User Story 3

- [ ] T036 [US3] Implement saved-protein entities and library state in `mockup/WhatsInMyProtein.html` with unique sequence identifiers, searchable name/accession fields, optional type metadata, normalized sequences, summaries, and analyzed timestamps.
- [ ] T037 [US3] Implement side-by-side sequence comparison in `mockup/WhatsInMyProtein.html` for supported metrics, missing optional values, and text-labeled differences without color-only meaning.
- [ ] T038 [US3] Implement pairwise and multiple-sequence alignment views in `mockup/WhatsInMyProtein.html` with matches, mismatches, insertions, deletions, positions, conserved positions, scoring assumptions, and gap assumptions.
- [ ] T039 [US3] Implement external protein search states in `mockup/WhatsInMyProtein.html` for pending, matches, no-results, unavailable, and failed outcomes, including source, retrieval time, name, accession, organism, and length.
- [ ] T040 [US3] Implement saved-library search, protein-type filtering, empty results, filter clearing, and missing-metadata display in `mockup/WhatsInMyProtein.html`.
- [ ] T041 [US3] Implement comparison and alignment report export in `mockup/WhatsInMyProtein.html` with selected identifiers/sequences, methods, settings, results, assumptions, limitations, and analysis version.

**Checkpoint**: User Story 3 is independently testable with saved sequences, comparison, alignment, discovery, filtering, and reproducible reports.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validate the integrated feature against the constitution, design contracts, and all aggregated scenarios.

- [ ] T042 [P] Update `specs/001-protein-sequence-analysis/quickstart.md` with any final browser setup, provider-simulation, or report-opening steps discovered during implementation.
- [ ] T043 [P] Run `tests/unit/validate-sequence.mjs` and `tests/unit/calculate-sequence.mjs` against `tests/fixtures/protein-sequences.json`; record and fix any normalization, boundary, composition, or determinism regressions.
- [ ] T044 [P] Run the browser checks in `tests/browser/core-analysis.md`, `tests/browser/usability.md`, `tests/browser/biological-predictions.md`, and `tests/browser/comparison-discovery.md` against `mockup/WhatsInMyProtein.html`.
- [ ] T045 Review `mockup/WhatsInMyProtein.html` for unsafe dynamic rendering, stale-result leakage, silent failures, unnecessary work during typing, clipped responsive content, and color-only status communication.
- [ ] T046 Verify every scenario in `scratch/test_protein_sequence_analyzer.txt` has a passing result or an explicitly documented blocked dependency in `tests/browser/test-cases.md`.
- [ ] T047 Update `specs/001-protein-sequence-analysis/contracts/ui-contract.md` and `specs/001-protein-sequence-analysis/data-model.md` when implementation behavior intentionally changes an observable state or field rule.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001 can begin immediately and T002-T004 can run in parallel.
- **Foundational (Phase 2)**: Depends on T001; T005-T009 establish shared behavior, while T010-T011 can be prepared in parallel once fixtures exist.
- **User Story 1 (Phase 3)**: Depends on Phase 2; it is the recommended MVP and establishes validated analysis data for later stories.
- **User Story 4 (Phase 4)**: Depends on Phase 2; it can proceed in parallel with US1, but report behavior benefits from the core result model.
- **User Story 2 (Phase 5)**: Depends on US1 and the shared state contract; prediction displays consume normalized sequences and core analysis state.
- **User Story 3 (Phase 6)**: Depends on US1 and the shared state contract; saved sequences, comparison, and alignment consume validated sequence entities.
- **Polish (Phase 7)**: Depends on all desired user stories; T042-T047 can run in parallel after the corresponding implementation work is complete.

### User Story Dependencies

- **US1 (P1)**: Depends only on Foundational; no dependency on another user story.
- **US4 (P1)**: Depends only on Foundational; can be implemented alongside US1, with report validation using US1 output.
- **US2 (P2)**: Depends on US1's normalized sequence and analysis state; prediction failures must preserve US1 results.
- **US3 (P2)**: Depends on US1's validated sequence and saved-protein model; comparison and reports may reuse US2 prediction metadata when available.

### Within Each User Story

- Story-specific fixtures and browser checks precede implementation where practical.
- Shared data/state rules precede views and integrations.
- Core rendering precedes integration with optional providers.
- Each story reaches its checkpoint before dependent story work is treated as complete.

## Parallel Execution Examples

### MVP: User Story 1

```text
T002, T003, and T004 can run in parallel after T001.
T010 and T011 can run in parallel after T002 and T004.
T012 and T013 can run in parallel after the shared fixtures exist.
T014 and T015 can be developed in parallel only if they use the agreed normalization/calculation contract.
```

### User Story 4

```text
T019 and T020 can run in parallel.
T021, T022, and T025 can run in parallel after foundational state exists.
T023 and T024 can run in parallel after navigation and status semantics are agreed.
```

### P2 Stories

```text
After US1 is complete, US2 and US3 can be assigned to separate implementers.
Within US2, T027 and T028 can run in parallel.
Within US3, T034 and T035 can run in parallel, followed by T036-T041 in dependency order.
```

## Implementation Strategy

1. Complete Setup and Foundational work without introducing a framework or backend.
2. Deliver US1 as the MVP: validated deterministic core analysis with safe error states.
3. Deliver US4 alongside or immediately after US1 so the MVP is accessible, responsive, and recoverable.
4. Add US2 prediction surfaces with explicit optional-service states.
5. Add US3 comparison, discovery, filtering, and reproducible reports.
6. Run the full quickstart and all 38 aggregated scenarios before review.
