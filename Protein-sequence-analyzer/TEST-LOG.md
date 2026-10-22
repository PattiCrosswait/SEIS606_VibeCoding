# Project 1 Test Log

Date prepared: 2026-10-21

Each entry records what was tested, how it was tested, the result, and the
disposition. Human-participant results are intentionally not fabricated; the
participant section must be completed after another person uses the application.
Machine-readable execution evidence uses UTC ISO 8601 timestamps in
[tests/logging/test-events.jsonl](tests/logging/test-events.jsonl). Manual
browser procedures are in
[tests/browser/manual-test-procedure.md](tests/browser/manual-test-procedure.md),
and the release checklist is in [PRE-FLIGHT.md](PRE-FLIGHT.md).

## Functional, edge-case, and negative testing

| ID | What was tested | How | Result | Disposition | Severity |
|---|---|---|---|---|---|
| F-01 | Valid raw sequence analysis | Ran `npm test`; verified the sequence-analysis fixtures and the application implementation | Length, mass, pI, hydrophobicity, composition, and deterministic results are covered and pass | Fixed/verified | — |
| F-02 | FASTA, lowercase, and whitespace normalization | Unit test for normalization and validation | FASTA headers and permitted whitespace are removed and lowercase input is normalized | Fixed/verified | — |
| F-03 | Empty and unsupported input | Unit tests with empty input and unsupported characters | Invalid input is rejected and does not produce a valid analysis object | Fixed/verified | — |
| F-04 | Single-residue input | Unit test using a one-residue sequence | Metrics and composition are calculated without an exception | Fixed/verified | — |
| F-05 | Long sequence | Unit test using a 1,000-residue fixture | Analysis completes and composition totals equal sequence length | Fixed/verified | — |
| F-06 | Markup-like input | Unit test using markup-like text | Input is rejected as a sequence and is treated as text rather than executable markup | Fixed/verified | — |
| F-07 | Repeatability | Unit test analyzes identical input more than once | Results are deterministic and the analysis version is exposed | Fixed/verified | — |
| F-08 | Local and specialist prediction providers | Unit test and live POST to `/api/predictions` with a representative sequence | The route returns heuristic predictions and attempts EMBL-EBI Search supplementation with method, source, version, ranges, and limitations; provider no-match/failure remains explicit while local results remain available | Fixed/verified | — |
| F-09 | Protein-search provider unavailable | Unit test posts to `/api/protein-search` without a provider | The route returns an explicit unavailable response | Deferred provider integration | Medium |
| F-10 | Pairwise and multiple alignment | Unit tests for two and three saved sequences | Matches, mismatches, gaps, and conserved positions are represented | Fixed/verified | — |
| F-11 | Report contents | Unit test generates a comparison report | Report includes scoring assumptions and aligned sequences | Fixed/verified | — |
| F-12 | Durable library persistence | Playwright flow saved proteins through the application and opened the comparison view | Saved proteins were available to the comparison workflow; server persistence is implemented through `/api/library` and SQLite | Fixed/verified | — |
| F-13 | Rigorous pairwise alignment | Unit and Playwright tests compare different-length sequences | Needleman-Wunsch alignment reports matches, mismatches, gaps, and scoring assumptions | Fixed/verified | — |

Automated validation run from the repository root:

```text
npm run typecheck  # passed
npm run lint       # passed
npm test           # 10 tests passed
npm run build      # passed
npm run test:e2e   # 2 browser flows passed
```

## Security probing

These probes were limited to this project.

| ID | Probe | How | Result | Disposition | Severity |
|---|---|---|---|---|---|
| S-01 | Markup/script injection | Submitted markup-like input through the sequence validation tests and inspected React rendering paths | Unsupported text is rejected by validation and user input is rendered through React text/props rather than injected HTML | Verified safe for this path | Low |
| S-02 | Exposed credentials or API keys | Searched tracked source and configuration for common key names and credential literals; inspected prediction/search route boundaries | No provider credentials are present in browser code or tracked configuration; provider routes return unavailable without configuration | Verified; provider setup remains deferred | Medium |
| S-03 | Saved-state tampering | Inspected the local-library serialization and parsing path in `lib/protein/library.ts`; considered malformed JSON and structurally invalid JSON in local storage | Malformed JSON is discarded by the error path. Structurally invalid JSON is currently cast without schema validation and should be hardened before treating local storage as trusted | Deferred: add runtime schema validation and browser tampering coverage | Medium |
| S-04 | Untrusted request body | Inspected both POST route handlers and route tests for missing/invalid sequence input | Missing sequence requests are rejected and unavailable responses are explicit | Verified | Low |

## Browser acceptance checks

Date executed: 2026-10-21
Environment: local Next.js development server at `http://localhost:3000`

| ID | What was tested | How | Result | Disposition |
|---|---|---|---|---|
| B-01 | Core analysis flow | Entered a FASTA/lowercase/whitespace sequence and selected **Analyze sequence** | Normalized sequence was analyzed and metrics updated to 3 residues | Verified |
| B-02 | Invalid input recovery | Entered `ACD!` and selected **Analyze sequence** | Error status was displayed, input was preserved, and saving was disabled | Verified |
| B-03 | Saved-library flow | Saved valid sequences, opened **Saved**, selected two records, and selected **Compare selected** | Saved records appeared and the comparison view displayed an alignment | Verified |
| B-04 | Navigation accessibility | Inspected the navigation accessibility tree and activated Analyze, Saved, and Compare | Navigation buttons now expose accessible names and the active item exposes `aria-current="page"` | Fixed in `components/layout/sidebar-nav.tsx` |
| B-05 | Responsive/long-content behavior | Inspected the responsive CSS and rendered residue map/alignment with scroll containers | Mobile layout rules and intentional horizontal/vertical scrolling are present | Verified by code and browser render |
| B-06 | Report download control | Activated the comparison report download control | The control activated without an application error; the integrated browser did not expose a download event for independent file-content inspection | Manual file-content check remains recommended |

## Usability testing with another person

This entry must be completed with a classmate or another participant who has
permission to test the application. Do not identify the participant by name
unless they consent.

- Participant identifier or role:
- Date and duration:
- Device/browser:
- Task instructions given without help:
  1. Analyze the default sequence.
  2. Load a sample sequence and analyze it.
  3. Enter invalid input and recover.
  4. Save a valid sequence and find it in the library.
  5. Download a report.
- Where the participant struggled:
- What they expected:
- What actually happened:
- Action taken: fixed, deferred, or won't fix:
- Severity:

## AI-assisted review

- Review tool and version: Claude Sonnet 5.5 (Anthropic)
- Primary development tool: <fill in>
- Prompt used: "Review this protein-sequence analyzer as an authorized security and QA tester. List the top five ways a user could break or misuse it, ranked by severity and confidence. For every finding provide the file, approximate line, steps to reproduce, expected behavior, actual behavior, and a minimal fix. Check client-side tampering, direct API calls, local-storage tampering, unsafe input rendering, exposed secrets, rapid repeated actions, refresh recovery, and unavailable-provider states. Do not invent vulnerabilities: distinguish verified findings from hypotheses and state what evidence would verify each hypothesis."
- Files or scope reviewed: full source of `Protein-sequence-analyzer` (app/api routes, lib/, components/, config, tests, docs) from the uploaded repo zip. Pure-logic files were executed in Node. The running app was not exercised, because the review sandbox had no network access.

| Finding | Verified or rejected | Evidence | Action | Severity |
|---|---|---|---|---|
| 1. Library API has no auth or ownership; anyone can overwrite or delete any saved protein | Verified (code) | `app/api/library/route.ts` L6-35; `lib/protein/server-library.ts` L43-51, L78-87, L91-97; no middleware or auth code anywhere | Fix recommended: owner cookie plus `owner_id` column, server-generated IDs | High (Low if single-user local only) |
| 2. No sequence-length cap: 1 MB blocks the server about 5 s, 2 MB about 13 s; client alignment memory is quadratic | Verified (executed CPU and memory scaling; the roughly 9 GB titin-size figure is extrapolated) | Real `analyzeSequence` timed in Node: 1M residues = 5,035 ms, 2M = 13,412 ms. `alignPairwise` measured at about 8 bytes per cell. Patched `netCharge` gave identical results in 471 ms at 1M | Fix recommended: cap in `normalizeSequence`, precompute residue counts, cap alignment size | High |
| 3. Malformed saved records crash or freeze the UI (localStorage and server to client paths) | Verified (executed for localStorage paths, code for server path) | `readLibrary` accepted tampered `type`/`accession`/`organism`; `filterLibrary` threw `TypeError`; 2.4 MB of valid entries froze `readLibrary` for 11.7 s; server list bypasses validation at `analysis-workspace.tsx` L42-45; no `error.tsx` | Fix recommended: type-check optional fields, validate the server response, cap before validating, add `app/error.tsx` | Medium-High |
| 4. Silent sync failures, then "server wins" overwrites local data on refresh | Verified (code) | `analysis-workspace.tsx` L60, L66 swallow errors; L42-45 replace local state and storage with the server list | Fix recommended: surface "not synced", merge by `sequenceId` | Medium |
| 4a. SQLite saves fail for every UI save (missing named parameters) | Unverified hypothesis (H1) | Predicted `RangeError: Missing named parameter "accession"`; `server-library.ts` L46-48 vs `createSavedProtein`. Confirm: `select count(*) from saved_proteins` after saving 2 proteins (predicted 0) | Test, then bind `?? null` | High if confirmed |
| 5. Predictions and experimental observations persist after the sequence changes | Verified (code) | `analysis-workspace.tsx` L89 (no `key`); `prediction-panel.tsx` L13-17; `experimental-validation.tsx` L13-18 | Fix recommended: add `key={analysis.normalizedSequence}` | Medium |
| 6. Failed Postgres schema init is cached forever (permanent 503 until restart) | Verified (executed with stubbed `pg`) | Real `postgres.ts`: 1 query across 3 calls after the first failure | Fix recommended: reset `schemaReady` on failure | Medium |
| 7. Production DB TLS verification disabled | Verified (code) | `lib/db/postgres.ts` L16 `rejectUnauthorized: false` | Fix recommended: enable verification or supply the CA | Medium |
| 8. Validation errors reported as "Database connection failed"; client ignores 503 | Verified (code) | `experimental-results/route.ts` L15-17; `experimental-validation.tsx` L32 | Fix recommended | Low-Medium |
| 9. Unicode case-mapping passes validation (`ß` to `SS`, `ﬁ` to `FI`) | Verified (executed) | Real `analyzeSequence` returned `valid` for both | Fix recommended: reject non-ASCII before `toUpperCase()` | Low |
| 10. Experimental parsing: quoted commas truncated, feature-type case mismatch, unbounded field length | Verified (executed) | Real `parseExperimentalResults` / `compareExperimentalResults` outputs | Fix recommended | Low |
| 11. Search button stuck on "Searching…" when offline | Verified (code) | `protein-search.tsx` L11, `lib/protein/search.ts` L5-9 (no try/catch) | Fix recommended | Low |
| 12. Duplicate saves on rapid clicks; UniProt cache never evicts; no rate limiting | Verified (code); impact unmeasured | `analysis-workspace.tsx` L54-61; `uniprot.ts` L6, L50 | Deferred | Low |
| H2. No request-body size limit on API routes | Unverified hypothesis | Confirm: 50 MB POST returns something other than 413 | Test | Medium |
| H3. `analyzedAt: "infinity"` breaks `GET /api/library` for all users (Postgres) | Unverified hypothesis | Confirm with Postgres: POST the record, then GET returns 5xx | Test | Medium |
| H4. Concurrent large uploads exhaust the 5-connection pool and hang DB routes | Unverified hypothesis | Confirm with Postgres: 6 parallel 100k-observation uploads, then time `GET /api/library` | Test | Medium |
| H5. EBI hits scored 1.0 as "domain" regardless of match quality; query-syntax injection in `sequence:` | Unverified hypothesis | Compare the EBI response for a real sequence against `POST /api/predictions {"sequence":"*"}` | Test | Low-Medium |
| H6. `better-sqlite3` is a devDependency but imported at runtime | Unverified hypothesis | Confirm: `npm ci --omit=dev && next build && next start`, then hit `/api/library` | Test | Low-Medium |
| Unsafe input rendering (XSS) | Rejected (no finding) | No `dangerouslySetInnerHTML`, `innerHTML` or `eval`; all user text rendered via JSX; reports are `text/plain` Blobs | None | — |
| Exposed secrets | Rejected (no finding) | No secrets in source, docs, docx/pptx text; only `.env.example` with placeholders; `.env*` gitignored; no `NEXT_PUBLIC_` | None | — |

## Overall test status

Automated functional, negative, and route coverage passes. Browser acceptance
checks were executed locally; one accessibility issue was fixed during the
check. Provider-dependent features are explicitly unavailable rather than
falsely successful. Human usability testing and the independent AI-assisted
review remain submission-time actions because they require a real participant
and a separately selected review tool, respectively.
