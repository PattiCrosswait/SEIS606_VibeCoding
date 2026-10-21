# Test event log format

Testing evidence should be recorded as append-only JSON Lines. One object is
one event; do not edit or delete prior events. Timestamps must be UTC ISO 8601
with milliseconds and a `Z` suffix, for example
`2026-10-21T20:30:00.000Z`.

Required fields:

```json
{
  "timestamp": "2026-10-21T20:30:00.000Z",
  "level": "info",
  "event": "test.completed",
  "testId": "F-01",
  "actor": "developer|participant|reviewer|automation",
  "result": "pass|fail|deferred|inconclusive",
  "context": {
    "command": "npm test",
    "details": "10 tests passed"
  },
  "severity": "none|low|medium|high|critical"
}
```

Never log passwords, API keys, access tokens, sequence data supplied by a
participant, or other sensitive information. Keep the human-readable summary
in [TEST-LOG.md](../../TEST-LOG.md) and use this format for machine-readable
event evidence.

The repository does not claim that a test was run merely because a template
exists. Append a real event only after executing the test or completing the
authorized review.
