# What's In My Protein?

What's In My Protein? is a local, deterministic protein-sequence analyzer for
students and researchers. It accepts raw amino-acid sequences and FASTA records,
reports sequence-level properties, stores sequences locally for comparison, and
exports an analysis report.

## Requirements

- Node.js 20 or newer
- npm
- A modern desktop or mobile browser

## Run locally

From the repository root:

```text
npm install
npm run dev
```

Open the local URL printed by Next.js, normally
`http://localhost:3000`.

## Use the application

1. Enter a raw amino-acid sequence or FASTA record.
2. Select **Analyze sequence**.
3. Review length, molecular weight, theoretical pI, hydrophobicity,
   composition, and the residue map.
4. Use **Save valid sequence** to add a sequence to the local library.
5. Select saved sequences and use **Compare** for pairwise or multiple-sequence
   alignment.
6. Use **Reports** or **Download report** to export the current analysis.

The core analysis runs locally and deterministically. Prediction and external
protein-search providers are intentionally represented as unavailable until a
provider is configured; the application does not present unavailable results as
successful results.

## Validation commands

```text
npm run typecheck
npm run lint
npm test
npm run build
```

## Project artifacts

- Feature specification and design artifacts:
  [specs/001-protein-sequence-analysis/](./specs/001-protein-sequence-analysis/)
- Acceptance scenarios:
  [scratch/test_protein_sequence_analyzer.txt](./scratch/test_protein_sequence_analyzer.txt)
- Test log:
  [TEST-LOG.md](./TEST-LOG.md)
- Analysis write-up:
  [ANALYSIS.md](./ANALYSIS.md)
- Presentation outline:
  [PRESENTATION.md](./PRESENTATION.md)

## Known limitations

- Biological prediction and external database search return an explicit
  unavailable state because no provider credentials or external service is
  configured.
- Browser acceptance checks are documented in
  [tests/browser/](./tests/browser/), but they are not an automated Playwright
  suite.
- Human usability testing and the independent AI-assisted review must be
  completed and recorded in [TEST-LOG.md](./TEST-LOG.md) before submission.
