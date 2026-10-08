# Data Model: Nutrition Photo Analysis

## Photo Submission

Represents one user-selected image and its lifecycle through validation and
analysis.

| Field | Description | Validation / Rules |
|---|---|---|
| `submissionId` | Unique identifier for the active attempt | Required; generated per attempt; never reused during the session |
| `fileName` | User-visible original name | Optional for rendering; must not be logged with sensitive paths |
| `mediaType` | Detected image type | Required; must be a supported still-image type |
| `byteSize` | File size | Required; must be within the published limit |
| `decodeStatus` | Whether the browser can decode the image | `unknown`, `valid`, or `invalid` |
| `qualitySignals` | Basic observable signals such as dimensions or decode result | Advisory; insufficient quality routes to uncertainty rather than fabricated results |
| `lifecycleState` | Current processing state | `selected`, `validating`, `rejected`, `uploading`, `analyzing`, `completed`, `uncertain`, `non_food`, `no_food`, `failed`, or `cancelled` |
| `createdAt` | Time the attempt began | Required for timeout and session status |

## Food Identification

Represents one food item recognized in a photo.

| Field | Description | Validation / Rules |
|---|---|---|
| `itemId` | Identifier within the analysis outcome | Required and unique within the outcome |
| `name` | Human-readable food label | Required for a confident or uncertain item |
| `confidence` | Classification confidence | `high`, `medium`, or `low`; low confidence requires visible uncertainty |
| `servingEstimate` | Estimated amount and unit | May be unknown; assumptions must be visible |
| `nutritionEstimate` | Related nutrition values | May be unavailable; never default silently to zero |
| `notes` | Clarifying assumption or ambiguity | Optional but required when the item is uncertain or partially observed |

## Nutrition Estimate

Represents available nutritional values for a food identification.

| Field | Description | Validation / Rules |
|---|---|---|
| `calories` | Estimated energy | Optional; non-negative when present; display as an estimate |
| `protein` | Protein amount | Optional; unit must be explicit |
| `carbohydrates` | Carbohydrate amount | Optional; unit must be explicit |
| `fat` | Fat amount | Optional; unit must be explicit |
| `unitSystem` | Display measurement convention | Required; initial design uses calories and grams |
| `servingBasis` | Basis for values | Required when values are present; references serving assumptions |
| `sourceName` | Nutrition reference source | Required in structured result metadata |
| `sourceVersion` | Source revision or effective date | Required when provided by the source |

## Analysis Outcome

Represents the complete user-facing response for one submission.

| Field | Description | Validation / Rules |
|---|---|---|
| `outcomeKind` | Terminal interpretation | `success`, `uncertain`, `non_food`, `no_food`, `rejected`, `failed`, or `cancelled` |
| `submissionId` | Related photo attempt | Required; must match the active submission |
| `items` | Recognized food items | Present for `success` and possibly `uncertain`; empty for `non_food`, `no_food`, `rejected`, and `failed` |
| `message` | User-facing explanation | Required for every terminal outcome; no raw photo content |
| `nextAction` | Suggested recovery action | Required for every non-success outcome |
| `assumptions` | User-visible caveats | Required when estimates are shown or confidence is limited |
| `completedAt` | Completion time | Required for terminal outcomes |

## Relationships

- One `Photo Submission` produces at most one active `Analysis Outcome`.
- One `Analysis Outcome` contains zero or more `Food Identification` records.
- Each `Food Identification` has zero or one `Nutrition Estimate`.
- A new submission replaces the active session outcome and clears stale result data.

## State Transitions

```text
selected -> validating
validating -> rejected
validating -> uploading
uploading -> analyzing
analyzing -> completed
analyzing -> uncertain
analyzing -> non_food
analyzing -> no_food
analyzing -> failed
analyzing -> cancelled
```

A `rejected` submission never enters analysis. A terminal state may transition to
`selected` only when the user starts a new attempt. A `failed` state may transition
to `uploading` only through an explicit retry that prevents duplicate concurrent
requests.
