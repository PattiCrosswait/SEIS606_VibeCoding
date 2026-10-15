<!--
Sync Impact Report
- Version change: template → 1.0.0
- Modified principles: template placeholders → Code Quality, Testable Behavior,
  Consistent User Experience, Performance by Default, Trustworthy Results
- Added sections: Product Constraints; Development Workflow
- Removed sections: none
- Follow-up TODOs: none
-->

# WhatsInMyProtein Constitution

## Core Principles

### I. Code Quality Is Non-Negotiable

Application code MUST be readable, cohesive, and scoped to a clear responsibility. Public
interfaces, parsing rules, calculations, and user-facing states MUST have explicit names and
predictable error handling. Changes MUST avoid unrelated refactors, duplicated business logic,
and hidden global state. A reviewer MUST be able to identify the owning module and verify the
behavior from the code and its tests.

### II. Behavior Must Be Testable

Every user-visible behavior and sequence-analysis rule MUST be covered by an automated check at
the narrowest practical level. Tests MUST include valid input, empty input, malformed FASTA or
residue input, boundary-sized sequences, and failure or loading states. Changes to shared
contracts MUST add integration or end-to-end coverage. A feature is incomplete when its happy
path works but its error and recovery states are unverified.

### III. The User Experience Must Feel Consistent

The interface MUST use shared patterns for navigation, controls, typography, spacing, status
messages, validation, and responsive behavior. Every asynchronous or computational action MUST
communicate its state, and every invalid input MUST receive a clear corrective message without
losing the user’s sequence. The application MUST remain keyboard accessible, preserve readable
contrast, expose meaningful labels to assistive technology, and avoid relying on color alone to
explain residue categories or result states.

### IV. Performance Is a Product Requirement

The application MUST remain responsive while users paste, edit, analyze, filter, or compare
sequences. Expensive analysis MUST be bounded, incremental, or moved off the main interaction
path when needed. New dependencies MUST have a clear value and an assessed bundle/runtime cost.
Performance-sensitive changes MUST be measured on representative short, medium, and long
sequences, with regressions fixed or explicitly accepted before release.

### V. Results Must Be Trustworthy and Understandable

The application MUST distinguish computed facts, estimates, and interpretation. Sequence input
MUST be normalized and validated before analysis; unsupported residues, malformed records, and
empty sequences MUST never produce plausible-looking results. Results MUST expose units, labels,
assumptions, and uncertainty or limitations where relevant. Scientific terminology MUST be
explained in plain language, while raw sequence data and reproducible analysis inputs remain
available to the user.

## Product Constraints

The product is a web application in which a user supplies a protein sequence and receives
sequence-level information. The application MUST:

- Treat user-provided sequences as untrusted input and render them safely.
- Preserve the original input separately from normalized analysis input when both are shown.
- Support responsive layouts for desktop and mobile widths without hiding core results.
- Provide an accessible non-color representation for residue classes and validation states.
- Keep analysis deterministic for identical inputs and expose the analysis version when results
  may change across releases.

## Development Workflow

Each change MUST pass formatting or lint checks, automated tests, and a production build or
equivalent runtime check before review. User-facing changes MUST include a responsive and
accessibility review. Changes to sequence parsing or computed properties MUST include regression
fixtures with expected outputs. Reviewers MUST verify that the change satisfies the relevant
principles and does not introduce unbounded work on the browser main thread. A failed quality
gate blocks release unless the exception, risk, owner, and follow-up date are recorded.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution is the highest-level project guidance for product and engineering decisions.
Amendments MUST describe the reason, affected principles, compatibility impact, and required
migration or follow-up work. New principles or materially expanded requirements increment the
minor version; incompatible removals or redefinitions increment the major version; clarifications
and editorial fixes increment the patch version. The last amended date MUST be updated for every
approved change. Reviews MUST check constitution compliance at planning, implementation, and
release gates, with any exception documented alongside the change.

**Version**: 1.0.0 | **Ratified**: 2026-10-14 | **Last Amended**: 2026-10-14
