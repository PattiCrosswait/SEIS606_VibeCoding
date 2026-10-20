# Data Model: Protein Sequence Analysis

## Protein Sequence

Represents the user's submitted protein data.

| Field | Description | Rules |
|---|---|---|
| `originalInput` | Exact text supplied by the user | Preserved separately and rendered as data |
| `normalizedSequence` | Header-free, normalized amino-acid sequence | Uppercase; permitted whitespace removed; valid residues only |
| `identifier` | Optional user or FASTA identifier | May be absent |
| `length` | Number of normalized residues | Positive integer for analyzable sequences |
| `metadata` | Optional name, accession, organism, and type | Missing values are displayed as unavailable |

## Sequence Analysis

Represents deterministic properties calculated from a valid normalized sequence.

| Field | Description | Rules |
|---|---|---|
| `status` | Analysis lifecycle state | `idle`, `editing`, `analyzing`, `valid`, `invalid`, or `stale` |
| `length` | Residue count | Equals normalized sequence length |
| `molecularWeight` | Estimated molecular mass | Displayed with units and assumptions |
| `theoreticalPI` | Estimated isoelectric point | Displayed as calculated, not experimentally measured |
| `hydrophobicity` | Hydrophobicity measure | Displayed with definition or interpretation |
| `composition` | Residue counts and supported groups | Every residue belongs to exactly one group; group totals equal length |
| `residueMap` | Position-aware residue visualization | Must include text labels or equivalent non-color cues |
| `analysisVersion` | Calculation version or release identifier | Included when results may change |

## Biological Prediction

Represents a hypothesis generated from a sequence.

| Field | Description | Rules |
|---|---|---|
| `featureType` | Signal peptide, transmembrane region, motif, domain, disorder, low complexity, or secondary structure | Clearly labeled as predicted |
| `residueRange` | Start and end positions or segments | Positions refer to normalized sequence |
| `status` | `pending`, `available`, `no-strong-signal`, `unavailable`, `failed`, or `retryable` | Failed states cannot be displayed as available |
| `method` | Algorithm or prediction method | Required when available |
| `source` | Database, model, or provider | Required when available |
| `version` | Method or source version | Required when available |
| `confidenceOrScore` | Confidence, score, or unavailable indicator | Must not imply certainty when absent |
| `limitations` | Plain-language uncertainty and evidence notes | Required for available or no-signal results |

## Saved Protein

Represents a valid sequence retained in the library.

| Field | Description | Rules |
|---|---|---|
| `sequenceId` | Stable identifier | Unique within the saved library |
| `name` | User-visible protein name | Searchable |
| `accession` | Optional external accession | Searchable when present |
| `type` | Optional protein type | Filterable when present |
| `sequence` | Valid normalized sequence or reference | Must be analyzable |
| `analysisSummary` | Core metrics shown in the library or comparison | Must identify unavailable values |
| `analyzedAt` | User-visible analysis time | Included in library and reports where supported |

## Alignment or Comparison

Represents a relationship view over selected valid sequences.

| Field | Description | Rules |
|---|---|---|
| `sequenceIds` | Selected sequences | Two for pairwise; at least three for multiple alignment |
| `metrics` | Side-by-side sequence properties | Missing optional metadata does not block supported metrics |
| `alignedPositions` | Position mapping across sequences | Includes gaps where applicable |
| `differences` | Matches, mismatches, insertions, and deletions | Position-aware and text-labeled |
| `conservedPositions` | Shared positions in multiple alignment | Clearly identifiable without color alone |
| `scoringAssumptions` | Scoring and gap assumptions | Visible in the result and report |
| `status` | `idle`, `running`, `complete`, `failed`, or `no-results` | Failure must include recovery guidance |

## Database Match

Represents a record discovered through an external search.

| Field | Description | Rules |
|---|---|---|
| `name` | Record or protein name | Displayed when available |
| `accession` | External accession | Displayed when available |
| `organism` | Source organism | Displayed when available |
| `length` | Record sequence length | Displayed when available |
| `source` | Database name | Required for a returned match |
| `retrievedAt` | Retrieval timestamp | Included in result details |
| `status` | `pending`, `matches`, `no-results`, `unavailable`, or `failed` | Unrelated records must never be presented as matches |

## Analysis Report

Represents an exported, auditable result.

| Field | Description | Rules |
|---|---|---|
| `inputOrReferences` | Original input or selected sequence references | Included |
| `normalizedSequences` | Sequences used for calculations when permitted | Included or referenced |
| `results` | Core metrics, predictions, comparison, or alignment | Matches visible application values |
| `methodsAndSettings` | Methods, scoring, gap, and search settings | Included |
| `assumptionsAndLimitations` | Interpretation and uncertainty notes | Included |
| `analysisVersion` | Version used for calculations | Included |
| `filename` | Meaningful downloaded filename | Generated from available identifier and date |
