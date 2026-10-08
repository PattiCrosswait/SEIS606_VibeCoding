# Implementation Plan: Nutrition Photo Analysis

**Branch**: `001-nutrition-photo-analysis` | **Date**: 2026-09-30 | **Spec**:
[spec.md](spec.md)

**Input**: Feature specification from `/specs/001-nutrition-photo-analysis/spec.md`

## Summary

Extend the existing static nutrition-photo experience so a user can select one
photo, receive immediate validation and progress feedback, and view a structured
nutrition estimate or an honest recovery outcome. The first implementation will
preserve the repository's vanilla browser architecture, isolate analysis behind a
small provider-neutral adapter, and use deterministic local responses until a real
analysis service is selected.

## Technical Context

**Language/Version**: HTML5, CSS3, and browser JavaScript (ES2022-compatible)

**Primary Dependencies**: Browser File and Image APIs; no new runtime dependency

**Storage**: Active-session state only; no persistent storage in the initial release

**Testing**: Browser smoke and accessibility checks with deterministic fixtures;
automated browser test tooling is a planning decision for implementation

**Target Platform**: Modern desktop and mobile browsers; local static-file or simple
local HTTP serving for validation

**Project Type**: Static single-page web application mockup with a replaceable
analysis boundary

**Performance Goals**: Acknowledge a selected file within 1 second; display an
analysis result or actionable failure within 30 seconds; keep the interface
responsive during processing

**Constraints**: One photo per attempt; supported image types and size limits must
be visible; raw photos must not be logged; no nutrition value may be fabricated for
non-food or low-confidence input

**Scale/Scope**: One primary upload-and-result journey, four analysis outcomes,
multiple-food and uncertain-result handling, responsive desktop/mobile layouts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Production-quality code**: PASS. Keep validation, state transitions, rendering,
  and analysis adapter responsibilities separate within the existing mockup files.
- **Testable behavior**: PASS. Use deterministic fixtures for valid, low-quality,
  non-food, ambiguous, unsupported, and failed submissions.
- **Consistent accessible UX**: PASS. Define shared upload, progress, result, warning,
  and error states; preserve keyboard and mobile behavior.
- **Defensible analysis**: PASS. Validate before analysis, model confidence and
  uncertainty explicitly, and never render nutrition values for rejected outcomes.
- **Performance and resilience**: PASS. Bound local processing, prevent duplicate
  submissions, expose progress, and avoid logging image contents.
- **Product constraints**: PASS. The initial plan does not add persistence or medical
  claims and keeps estimates visibly informational.

## Project Structure

### Documentation (this feature)

```text
specs/001-nutrition-photo-analysis/
├── plan.md              # This implementation plan
├── research.md          # Phase 0 decisions and rationale
├── data-model.md        # Analysis entities and state transitions
├── quickstart.md        # Runnable browser validation scenarios
├── contracts/
│   └── analysis-boundary.md  # UI-to-analysis adapter contract
└── tasks.md             # Generated later by /speckit-tasks
```

### Source Code (repository root)

```text
mockup/
├── index.html           # Upload, progress, result, and recovery markup
├── styles.css           # Existing visual system plus feature states
└── app.js               # File validation, state machine, adapter, and rendering
```

**Structure Decision**: Retain the existing single-page `mockup/` structure. The
feature is a focused extension of the current browser mockup, so introducing a
framework, backend directory, or build system would add complexity without a
current requirement. The analysis boundary remains replaceable so a later service
integration does not require rewriting the user-facing state model.

## Phase 0: Research Plan

Research will resolve image validation behavior, nutrition estimate representation,
uncertainty messaging, and browser-only testability. Decisions are recorded in
`research.md` before design artifacts are finalized.

## Phase 1: Design Outputs

The data model will define photo validation and analysis lifecycle states, food
identification confidence, and nutrition estimate fields. The contract will define
the adapter request and response shapes, including non-food and uncertain outcomes.
The quickstart will use local fixture scenarios to validate the primary flow and
all required edge cases without real user photos or provider credentials.

## Post-Design Constitution Check

- **Test coverage**: PASS if quickstart scenarios cover every constitution-mandated
  photo and analysis edge case.
- **UX consistency**: PASS if every terminal state has an explanation and next action.
- **Privacy**: PASS if fixtures are local, raw image data is not logged, and active
  session state is cleared when a new attempt starts.
- **Performance**: PASS if acknowledgement, progress, timeout, and duplicate-submit
  behavior are observable in the browser validation guide.

## Complexity Tracking

No constitution violations identified. No complexity exception is required.
