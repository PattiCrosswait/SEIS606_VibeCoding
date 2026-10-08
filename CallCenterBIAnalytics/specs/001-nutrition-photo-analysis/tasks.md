# Tasks: Nutrition Photo Analysis

**Input**: Design documents from `/specs/001-nutrition-photo-analysis/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create the static app structure and keep the feature local to the existing `mockup/` project
- [ ] T002 [P] Add root `.gitignore` for the browser mockup and session-local artifacts
- [ ] T003 [P] Define deterministic analysis fixtures and outcome helpers for supported, uncertain, rejected, non-food, and failed inputs

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Implement browser-safe submission state management and a provider-neutral analysis adapter API in `mockup/app.js`
- [ ] T005 [P] Add accessible upload, progress, success, recovery, and error UI markup in `mockup/index.html`
- [ ] T006 [P] Add the nutrition-analysis visual system and state styling in `mockup/styles.css`
- [ ] T007 Validate the session model resets stale result data before a new submission starts

**Checkpoint**: Foundation ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Analyze a Food Photo (Priority: P1)

**Goal**: Users can upload a supported food photo and receive a defensible estimate with assumptions and visible uncertainty.

**Independent Test**: Submit a representative food photo and verify the result shows food name, serving estimate, calories, units, and a clear estimate disclaimer.

### Tests for User Story 1

- [ ] T008 [P] [US1] Add validation tests for supported and unsupported submissions in `mockup/nutrition-analysis.test.js`
- [ ] T009 [P] [US1] Add fixture-driven tests covering successful and uncertain outcomes in `mockup/nutrition-analysis.test.js`

### Implementation for User Story 1

- [ ] T010 [P] [US1] Implement file validation for presence, type, size, image decoding, and basic usability in `mockup/app.js`
- [ ] T011 [US1] Implement the success-path analysis result builder that includes item names, serving estimates, calories, and nutrient units in `mockup/app.js`
- [ ] T012 [US1] Render a success result card with confidence, assumptions, and source metadata in `mockup/index.html` and `mockup/styles.css`
- [ ] T013 [US1] Add visible estimate disclaimers and uncertainty messaging for partial or low-confidence findings in `mockup/app.js`

**Checkpoint**: User Story 1 should be fully functional and independently testable.

---

## Phase 4: User Story 2 - Understand an Unusable or Non-Food Photo (Priority: P1)

**Goal**: Rejected, low-quality, non-food, and ambiguous inputs are handled with honest messaging and a recovery path.

**Independent Test**: Submit representative invalid, blurry, and non-food photos and verify each result suppresses nutrition values and demonstrates a clear next action.

### Tests for User Story 2

- [ ] T014 [P] [US2] Add rejection and non-food outcome tests in `mockup/nutrition-analysis.test.js`
- [ ] T015 [P] [US2] Add low-quality and ambiguous outcome tests in `mockup/nutrition-analysis.test.js`

### Implementation for User Story 2

- [ ] T016 [US2] Implement rejection outcomes for no file, unsupported type, oversized file, unreadable image, and unusable visuals in `mockup/app.js`
- [ ] T017 [US2] Implement non-food and no-food result handling with clear retry/another-photo actions in `mockup/app.js`
- [ ] T018 [US2] Render error, warning, and recovery states in `mockup/index.html` and `mockup/styles.css`
- [ ] T019 [US2] Prevent stale nutrition data from being displayed for rejected or non-food outcomes

**Checkpoint**: User Story 2 should independently support all required defensive analysis cases.

---

## Phase 5: User Story 3 - Recover From Analysis Problems (Priority: P2)

**Goal**: Temporary failures and duplicate-submission issues recover cleanly without losing context.

**Independent Test**: Trigger a deterministic failure, confirm retry and another-photo actions, and verify duplicate submissions are blocked while analysis is active.

### Tests for User Story 3

- [ ] T020 [P] [US3] Add a duplicate-submission test and a temporary-failure test in `mockup/nutrition-analysis.test.js`

### Implementation for User Story 3

- [ ] T021 [US3] Implement deterministic temporary failure and retry handling in the analysis adapter in `mockup/app.js`
- [ ] T022 [US3] Prevent duplicate submits while a photo is uploading or analyzing; re-enable controls after completion or failure
- [ ] T023 [US3] Add a stable retry path that resets the current state and clears stale outputs before a new attempt starts
- [ ] T024 [US3] Confirm the browser flow remains keyboard-usable and mobile-friendly through the shared state UI in `mockup/index.html` and `mockup/styles.css`

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T025 [P] Run the quickstart validation scenarios in `specs/001-nutrition-photo-analysis/quickstart.md`
- [ ] T026 [P] Confirm no raw uploaded photo content appears in visible messages or browser logs
- [ ] T027 [P] Tune the responsive layout for mobile and desktop viewport checks
- [ ] T028 Final verification that the mockup matches the success and failure states defined in the spec and contract

---

## Dependencies & Execution Order

- Setup tasks begin immediately.
- Foundational tasks block User Story 1, 2, and 3.
- User stories can proceed once the shared state model and upload UI are in place.
- Within each user story, tests should be written first and fail before implementation.
- The final polish phase runs only after all user stories satisfy their independent tests.

## Implementation Strategy

### MVP First

1. Complete Setup + Foundational tasks
2. Implement User Story 1
3. Validate the success path end to end
4. Add User Story 2 defensive handling
5. Add User Story 3 retry and failure recovery

### Parallel Opportunities

- The fixture definitions, markup, and styling can be created in parallel during the foundational phase.
- Validation tests for a single story can run together.
- Story-level rendering tasks and state logic can proceed concurrently once the shared state contract exists.

## Phase 7: Convergence

- [ ] T029 Add decodeability and unreadable-file validation, including deterministic corrupted-image fixtures, per FR-002 and US2/AC1 (partial)
- [ ] T030 Prevent duplicate submissions during validation and analysis, expose an explicit busy/progress state, and restore controls after completion or failure per FR-003, FR-010, and US3/AC2 (partial)
- [ ] T031 Render nutrition source name and version in successful result output per plan: analysis-boundary metadata and T012 (partial)
- [ ] T032 Preserve the completed active-session result across a page refresh and restore a consistent result state when available per US3/AC3 (missing)
- [ ] T033 Expand automated coverage for empty, oversized, unreadable, ambiguous, failed, multiple-food, duplicate-submit, and no-fabrication scenarios per Constitution II, FR-002, FR-007, FR-009, and FR-010 (partial)
