# Manual Browser Test Procedure

Run from the repository root with `npm run dev`. Record one row in
[TEST-LOG.md](../../TEST-LOG.md) for every scenario completed.

## Functional and usability flow

1. Open the application without assistance.
2. Use only the keyboard to focus the sequence input, sample buttons, Analyze
   sequence, Save valid sequence, navigation, and Download report controls.
3. Analyze the default sequence and record whether the displayed values have
   understandable labels and units.
4. Load a sample sequence, analyze it, and confirm that the input visibly
   changes.
5. Submit an empty sequence and then unsupported input. Confirm the input is
   preserved and the message explains how to recover.
6. Save two valid sequences, open Compare, select them, and verify the
   alignment and report download.
7. Resize the browser to a narrow mobile viewport and a wide desktop viewport.
   Record clipping, scrolling, overlap, or unreadable content.
8. Paste a sequence with at least 1,000 residues and record whether the page
   remains responsive and the residue map scrolls intentionally.

## Reliability and race-condition probes

1. Double-click Analyze sequence rapidly.
2. Press Enter repeatedly while the sequence input is focused.
3. Click Save valid sequence rapidly.
4. Refresh while viewing Analyze, Saved, Compare, and Reports.
5. Refresh immediately after saving a sequence.
6. Start a report download and immediately navigate to another section.

For each probe, record the expected result, actual result, and disposition.

## Authorized security probes

Only test this local application or an application whose owner gave permission.

1. View page source and search loaded scripts for API keys, passwords, tokens,
   private data, or hidden answers.
2. Open DevTools and edit disabled button attributes or form values. Confirm
   that server routes still validate request bodies independently of UI state.
3. Edit the `protein-sequence-analyzer.library` local-storage value with
   malformed JSON and structurally invalid JSON. Confirm the app does not
   crash or treat arbitrary data as a trusted valid protein.
4. Submit `<script>alert(1)</script>` and other markup-like input. Confirm no
   script executes and no HTML is inserted.
5. Call `/api/predictions` and `/api/protein-search` directly with missing,
   empty, and unexpected JSON fields. Record status and response shape.

## Participant usability session

Give a participant only the following task list and do not guide them:

- Analyze the default protein.
- Load and analyze a sample.
- Recover from invalid input.
- Save and compare two proteins.
- Download a report.

Record the participant role (not their name unless they consent), browser,
duration, first point of confusion, wording they expected, and any action
taken. Do not claim this session occurred until it has actually been run.
