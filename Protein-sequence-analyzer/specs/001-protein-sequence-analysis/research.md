# Research: Protein Sequence Analysis

## Decision: Keep the initial delivery as a single-page browser application

**Rationale**: The repository contains one working HTML mockup and no package manifest, server, or test runner. The feature can deliver local parsing, validation, calculations, visualization, saved-library behavior, and report generation without adding infrastructure. Optional remote capabilities can be represented with explicit loading, unavailable, and retry states.

**Alternatives considered**:
- Introduce a backend and database immediately: rejected because the current scope does not require accounts, cross-device persistence, or server-owned computation.
- Add a framework and build pipeline before feature validation: rejected because it would add unrelated setup cost and obscure whether the user-facing scenarios work.

## Decision: Analyze only a validated normalized sequence

**Rationale**: FASTA headers and permitted whitespace should be removed before validation and calculation. Original input must remain available separately so the user can audit what was submitted. Invalid or empty normalized input must stop analysis and preserve the edited value.

**Alternatives considered**:
- Silently discard all non-residue characters: rejected because digits, punctuation, malformed headers, and unsafe text could become misleading results.
- Calculate while the user types: rejected as the default because it can trigger unbounded work and makes recovery from invalid edits harder.

## Decision: Treat prediction and discovery as optional capability states

**Rationale**: Core calculations must remain available when external prediction or database services fail. Every optional result needs a source, method, version, status, confidence or score where available, and limitation text so users can distinguish evidence from interpretation.

**Alternatives considered**:
- Block the entire analysis until all remote services succeed: rejected because it reduces reliability and hides locally computable value.
- Present a success-shaped fallback when a service fails: rejected because it violates the project requirement for trustworthy results.

## Decision: Use explicit UI state contracts for validation, analysis, predictions, search, and export

**Rationale**: The acceptance scenarios depend on observable states: idle, editing, analyzing, valid, invalid, stale, unavailable, failed, retryable, no results, and complete. A state contract makes these behaviors testable without prescribing an implementation framework.

**Alternatives considered**:
- Infer status from visual changes alone: rejected because it is inaccessible, ambiguous, and difficult to test.
- Use color as the sole state indicator: rejected by the constitution and the accessibility scenarios.

## Decision: Validate through browser acceptance scenarios and focused calculation fixtures

**Rationale**: No test runner or package manifest exists. The 38 aggregated scenarios provide the authoritative acceptance set; focused fixtures should verify normalization, composition totals, molecular weight, pI/hydrophobicity determinism, and boundary inputs. Browser checks should cover keyboard access, responsive layout, safe rendering, progress/retry, and report output.

**Alternatives considered**:
- Claim automated test coverage without a configured runner: rejected because the repository currently has no executable test harness.
- Validate only screenshots: rejected because screenshots cannot establish parsing correctness, deterministic calculations, error handling, or safe rendering.
