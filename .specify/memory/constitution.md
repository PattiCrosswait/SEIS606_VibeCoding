<!--
Sync Impact Report
Version change: none -> 1.0.0 (initial constitution)
Modified principles: none
Added sections: Core Principles, Product Constraints, Development Workflow
Removed sections: none
Follow-up TODOs: none
-->

# Nutrition Photo Analysis Constitution

## Core Principles

### I. Production-Quality Code
All application code MUST be cohesive, readable, and maintainable, with clear
ownership boundaries, explicit error handling, and no knowingly dead or duplicated
logic. Public interfaces and data contracts MUST be documented when they cross a
module or service boundary. Changes MUST preserve secure handling of uploaded
photos and user data. Quality is a product requirement because incorrect analysis
or fragile upload behavior directly undermines user trust.

### II. Testable Behavior Is Non-Negotiable
Every feature MUST include automated tests at the lowest practical level and at
least one integration or end-to-end test for each changed user workflow. Tests MUST
cover valid food photos, unreadable or low-quality photos, non-food images, multiple
foods, ambiguous foods, empty uploads, unsupported formats, oversized files, and
analysis failures. A change MUST NOT be considered complete when its tests only
exercise the happy path. Tests MUST be deterministic, isolated, and run in review
and continuous integration before release.

### III. Consistent, Accessible User Experience
The interface MUST use shared patterns for upload, progress, success, empty,
warning, retry, and error states. Users MUST always receive a clear next action
when a photo cannot be analyzed, including an explanation when the image is not
food or is too unclear to interpret. Nutrition results MUST distinguish estimates
from confirmed facts, avoid overstated precision, and expose relevant assumptions
or uncertainty. All primary flows MUST be keyboard accessible, readable on mobile,
and compatible with the project's supported assistive technologies. Consistency
reduces cognitive load and prevents misleading interpretation of results.

### IV. Defensible Photo and Nutrition Analysis
The system MUST validate file type, size, decodeability, and basic image quality
before analysis, and MUST reject or route unsafe inputs without crashing. Analysis
MUST explicitly handle non-food content, no detectable food, multiple food items,
occlusion, poor lighting, blur, unusual angles, and uncertain classification.
When confidence is insufficient, the product MUST ask for clarification, request a
better photo, or label the output as uncertain rather than inventing nutrition
information. Results MUST retain enough structured metadata to explain what was
analyzed, including recognized items, serving assumptions, confidence, and the
nutrition data source or version.

### V. Measurable Performance and Resilience
Upload and analysis flows MUST provide immediate acknowledgement and visible
progress, remain responsive while work is in progress, and support cancellation or
retry where technically feasible. Performance budgets MUST be defined for initial
page load, upload acknowledgement, and result rendering, then checked on supported
mobile and desktop conditions. Image processing MUST limit resource consumption and
use bounded timeouts, retries, and graceful degradation. Performance regressions
and repeated analysis failures MUST be observable through structured telemetry
without logging raw photos or sensitive user data.

## Product Constraints

The application accepts user-supplied photos and returns estimated nutritional
information; it is not a medical diagnosis or a substitute for professional
dietary advice. Upload handling MUST enforce supported formats and size limits,
protect against malicious files, and avoid retaining photos longer than the product
requires. Nutrition values MUST use a consistent unit system, identify serving-size
assumptions, and make missing or uncertain values visible. The product MUST fail
closed for unsafe or unsupported input and fail honestly for uncertain analysis.

## Development Workflow

Each change MUST identify its affected user journey, data contract, tests, and
performance impact. Pull requests MUST demonstrate compliance with this
constitution, include updated tests for changed behavior, and document intentional
tradeoffs. Reviewers MUST verify edge-case handling for upload and classification
changes, accessibility for UI changes, and telemetry plus timeout behavior for
analysis changes. Releases MUST pass automated tests, linting or static checks, and
a representative end-to-end photo-analysis check using non-sensitive test images.

## Governance

This constitution supersedes conflicting project practices. Amendments require a
documented rationale, an updated version and amendment date, and review of affected
specifications, plans, tasks, tests, and user-facing behavior. Versioning follows
semantic rules: MAJOR for incompatible governance changes or principle removals,
MINOR for new or materially expanded principles or sections, and PATCH for wording
or non-semantic clarifications. Every feature review MUST check compliance with the
principles above; any exception MUST be explicit, time-bounded, risk-assessed, and
approved by the project owner. The constitution MUST be reviewed whenever the image
analysis provider, nutrition data source, privacy behavior, or supported platforms
change.

**Version**: 1.0.0 | **Ratified**: 2026-09-30 | **Last Amended**: 2026-09-30
