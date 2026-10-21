# Project 1 Presentation Outline

Target length: 5–7 minutes, followed by questions.

## 1. What the app is and who it is for — about 1 minute

- What's In My Protein? is a browser-based protein sequence analyzer.
- It is intended for students and researchers who need quick, transparent
  sequence-level observations.
- The core analysis is local and deterministic, so the same input produces the
  same displayed values.

## 2. Live demo — about 2–3 minutes

1. Open the app and show the default sequence metrics.
2. Paste a FASTA record and select **Analyze sequence**.
3. Enter invalid input and show that it is preserved with a corrective message.
4. Save two valid sequences.
5. Open **Compare**, show the alignment, and download a report.
6. Briefly show the explicit unavailable state for provider-dependent features.

Backup plan: use the screenshots or a short recording prepared before class if
the local development server or network is unavailable.

## 3. Most interesting testing finding — about 2 minutes

Use the completed entry from [TEST-LOG.md](./TEST-LOG.md). The current
technical finding to discuss is that provider-dependent prediction and search
paths return explicit unavailable states while local metrics remain usable.
Also discuss the participant's usability observation once the session is
completed.

## 4. Gap analysis and next steps — about 1 minute

- Current baseline: local analysis, validation, saved library, comparison, and
  reports.
- Partial areas: prediction and external search providers are not configured.
- Immediate submission work: complete participant usability evidence, the
  independent AI review, and browser acceptance checks.
- Longer-term work: configure providers and add browser automation.

## 5. Discussion preparation

Ask a classmate: “Which result or interaction would you want explained more
clearly before trusting this analyzer for a research decision?”

Be ready to explain:

- Why the application does not claim unavailable predictions are valid.
- How invalid input is normalized or rejected.
- Which limitations are product decisions versus implementation gaps.
