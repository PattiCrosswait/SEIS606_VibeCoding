# Research: Nutrition Photo Analysis

## Decision: Preserve the vanilla browser architecture for the first increment

**Rationale**: The repository currently contains a self-contained HTML, CSS, and
JavaScript mockup with no package manifest or service runtime. Extending the
existing files keeps the feature demonstrable, minimizes setup cost, and preserves
the current visual language. A provider-neutral adapter keeps future service work
localized.

**Alternatives considered**:

- Introduce a frontend framework: rejected because the feature does not require a
  component build system yet.
- Add a backend during this increment: rejected because provider, authentication,
  persistence, and deployment choices are not defined by the feature.

## Decision: Validate image inputs before analysis

**Rationale**: Browser file metadata and image decoding can reject missing,
unsupported, oversized, corrupted, and obviously unusable inputs before an
analysis request. The user gets faster feedback and the analysis boundary receives
only a controlled request. Visual-quality checks remain advisory unless they can
be measured reliably; uncertain images proceed to analysis and may return an
uncertain outcome.

**Alternatives considered**:

- Trust file extensions alone: rejected because extensions do not prove that a file
  is a decodable image.
- Reject every image that cannot meet a strict quality score: rejected because
  quality thresholds can incorrectly exclude valid food photos and create opaque UX.

## Decision: Represent analysis as explicit terminal outcomes

**Rationale**: A result must distinguish successful estimates from rejected,
non-food, no-food, uncertain, cancelled, and failed outcomes. An explicit outcome
kind prevents UI code from rendering partial or stale nutrition data when the
analysis is not defensible.

**Alternatives considered**:

- Return a nullable nutrition object with a generic error: rejected because it hides
  why the user cannot trust or act on the output.
- Always return a best guess: rejected because the constitution forbids invented
  nutrition information for uncertain or non-food inputs.

## Decision: Use human-readable estimates with explicit assumptions

**Rationale**: The user needs calories, available macronutrients, serving-size
assumptions, units, confidence, and data-source metadata to interpret the result.
Values remain estimates and missing nutrients are represented as unavailable rather
than silently converted or omitted.

**Alternatives considered**:

- Show only a single calorie total: rejected because it conceals item-level
  uncertainty and serving assumptions.
- Show false precision: rejected because image-based serving estimates cannot support
  unsupported decimal precision.

## Decision: Use deterministic local fixtures for validation

**Rationale**: The current repository has no provider credentials, service endpoint,
package manager, or test runner. Deterministic fixtures let reviewers exercise all
required paths, including failures and non-food content, without uploading personal
photos or depending on an external service.

**Alternatives considered**:

- Depend on a live image provider for tests: rejected because tests would be slow,
  non-deterministic, costly, and privacy-sensitive.
- Test only manually with real photos: rejected because edge cases and failure paths
  would not be repeatable.

## Decision: Keep photo retention session-scoped

**Rationale**: The feature specification limits the initial release to active-session
results and says photos must not be retained indefinitely. The browser state model
will clear the previous attempt when a new submission starts and will not add a
history feature.

**Alternatives considered**:

- Add persistent history: rejected as outside the current feature scope.
- Upload photos to an unbounded local or remote store: rejected due to privacy and
  retention risk.
