# Analysis Boundary Contract

This contract defines the interface between the browser workflow and the analysis
provider. The first implementation may use a deterministic local fixture adapter;
a future provider adapter must preserve these user-facing semantics.

## Request

```json
{
  "submissionId": "string",
  "mediaType": "image/jpeg",
  "byteSize": 123456,
  "image": "browser-managed photo reference",
  "locale": "en-US"
}
```

Rules:

- The request is created only after local validation succeeds.
- `submissionId`, `mediaType`, and `byteSize` are required.
- The raw image is never written to logs or embedded in user-visible errors.
- The adapter owns provider-specific transport and response mapping; the UI owns
  state display and recovery actions.

## Response: Successful estimate

```json
{
  "outcomeKind": "success",
  "submissionId": "string",
  "items": [
    {
      "itemId": "item-1",
      "name": "Grilled chicken salad",
      "confidence": "high",
      "servingEstimate": { "amount": 1, "unit": "bowl", "assumption": "one visible serving" },
      "nutritionEstimate": {
        "calories": 420,
        "protein": { "amount": 34, "unit": "g" },
        "carbohydrates": { "amount": 18, "unit": "g" },
        "fat": { "amount": 22, "unit": "g" },
        "unitSystem": "calories-and-grams",
        "servingBasis": "one visible bowl",
        "sourceName": "nutrition-reference",
        "sourceVersion": "version-or-date"
      },
      "notes": "Estimate depends on dressing quantity."
    }
  ],
  "message": "Estimated nutrition for the visible food.",
  "nextAction": "review-assumptions",
  "assumptions": ["Portion size is estimated from the image."],
  "completedAt": "ISO-8601 timestamp"
}
```

## Response: Non-success outcomes

All non-success responses MUST contain `outcomeKind`, `submissionId`, `items: []`,
`message`, `nextAction`, and `completedAt`.

Allowed outcome examples:

```json
{
  "outcomeKind": "non_food",
  "submissionId": "string",
  "items": [],
  "message": "No recognizable food was found in this photo.",
  "nextAction": "choose-another-photo",
  "completedAt": "ISO-8601 timestamp"
}
```

```json
{
  "outcomeKind": "uncertain",
  "submissionId": "string",
  "items": [],
  "message": "The photo is not clear enough for a reliable estimate.",
  "nextAction": "retake-photo",
  "assumptions": ["Food identity or serving size could not be confirmed."],
  "completedAt": "ISO-8601 timestamp"
}
```

```json
{
  "outcomeKind": "failed",
  "submissionId": "string",
  "items": [],
  "message": "Analysis did not complete. Try again.",
  "nextAction": "retry",
  "completedAt": "ISO-8601 timestamp"
}
```

## UI Contract

The browser workflow MUST map these states consistently:

| State | Required user-visible behavior |
|---|---|
| `selected` / `validating` | Show selected-photo context and validation progress |
| `rejected` | Explain the local validation issue and offer replacement upload |
| `uploading` / `analyzing` | Show progress and prevent duplicate submission |
| `success` | Show items, estimates, units, assumptions, confidence, and source metadata |
| `uncertain` | Explain uncertainty, suppress unsupported values, and offer retake/clarify |
| `non_food` / `no_food` | Explain that food was not identified and offer another photo |
| `failed` | Explain temporary failure and offer retry or replacement |
| `cancelled` | Return to a stable upload state without stale results |
