# Project 1 Analysis and Gap Review

## Status

The core baseline works. A user can run the Next.js application, enter a raw
or FASTA protein sequence, analyze it, inspect deterministic sequence-level
metrics, save valid sequences, compare saved sequences, and download reports.
The repository includes the Spec Kit specification, plan, tasks, supporting
contracts, fixtures, automated tests, and a quickstart guide.

The application is partly complete in two areas. Biological predictions and
external protein search have UI and explicit API contracts, but no provider is
configured. Those paths correctly report an unavailable state and preserve the
local analysis instead of displaying invented results.

The submission package was missing a README, a completed test log, a written
analysis, and presentation material. These documents have now been added.
Human usability observations and the required independent AI-assisted review
still require real-world completion and should not be invented.

## Root causes

1. **Provider integrations were intentionally scoped as unavailable
   boundaries.** The core product was prioritized over credentials, external
   service selection, rate limits, and provider-specific validation.
2. **Browser checks are acceptance documents rather than a browser automation
   suite.** Unit and route tests provide useful coverage, but keyboard,
   responsive, download, and visual checks still require manual execution.
3. **Submission evidence was not part of the implementation workflow.** The
   source and tests existed before the assignment-specific README, test log,
   write-up, and presentation outline were created.
4. **Human usability evidence cannot be generated from code.** It requires a
   participant using the running application and recording their observations.
5. **The independent AI review requires an explicit tool choice.** The reviewer
   must be different from the primary development tool, so its identity and
   findings must be recorded at test time.

## Prioritized path forward

| Priority | Step | Effort | Outcome |
|---|---|---:|---|
| 1 | Run the application and complete the usability session with one participant | 30–60 minutes | Completed usability evidence and concrete friction points |
| 2 | Run an independent AI QA/security review and record verified/rejected findings | 30–60 minutes | Required AI-assisted review evidence |
| 3 | Execute browser acceptance checks for keyboard, responsive layout, and report download | 45–90 minutes | Evidence for the unchecked browser scenarios |
| 4 | Choose and configure a permitted prediction provider, if desired | 1–3 days | Real prediction results with provenance, confidence, limits, and failure handling |
| 5 | Choose and configure a permitted protein database provider, if desired | 1–3 days | Real search results with accession, organism, length, source, and retrieval time |
| 6 | Add browser automation for the highest-value flows | 1–2 days | Repeatable coverage for the manual acceptance checks |

The first three steps are required for a complete course submission. The
provider integrations are product extensions and are not required to claim
that the current baseline works, provided their unavailable state is disclosed.

## Reflection

The implementation benefited from a spec-first workflow: typed contracts,
fixtures, deterministic calculations, and explicit unavailable states reduced
the chance of presenting unsupported scientific claims as facts. The next
iteration should add submission evidence to the initial task breakdown rather
than treating it as cleanup.

I would improve future prompts by requiring the assistant to distinguish
implemented behavior from planned behavior, identify external dependencies
before generating UI, and produce a test-evidence checklist alongside each
feature. I would also ask for browser-level acceptance tests earlier, because
unit tests cannot prove keyboard navigation, responsive layout, or a successful
file download.
