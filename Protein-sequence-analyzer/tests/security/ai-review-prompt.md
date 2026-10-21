# Independent AI Security/QA Review Procedure

Use a review tool different from the primary development tool. Review only
this repository and do not submit secrets or private participant information.

## Prompt

> Review this protein-sequence analyzer as an authorized security and QA
> tester. List the top five ways a user could break or misuse it, ranked by
> severity and confidence. For every finding provide the file, approximate
> line, steps to reproduce, expected behavior, actual behavior, and a minimal
> fix. Check client-side tampering, direct API calls, local-storage tampering,
> unsafe input rendering, exposed secrets, rapid repeated actions, refresh
> recovery, and unavailable-provider states. Do not invent vulnerabilities:
> distinguish verified findings from hypotheses and state what evidence would
> verify each hypothesis.

## Required human verification

For each AI finding:

1. Reproduce it against the local application or source.
2. Mark it `verified`, `rejected`, or `inconclusive`.
3. Record the evidence and disposition in [TEST-LOG.md](../../TEST-LOG.md).
4. Do not paste credentials, personal data, or private participant details into
   the review tool.
