# Release and Presentation Pre-flight

Complete this checklist before presenting or sharing the application.

## Application

- [ ] `npm install` works from a clean checkout.
- [ ] `npm run typecheck` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run dev` starts and the main flow completes.
- [ ] A backup recording or screenshots are available.

## Testing evidence

- [ ] Functional test entries include what, how, result, action, and severity.
- [ ] Edge cases include empty input, unsupported input, long input, rapid
  actions, and refresh recovery.
- [ ] A participant completed the usability flow without assistance.
- [ ] At least three authorized security probes are recorded.
- [ ] An independent AI security/QA review is recorded.
- [ ] Every AI finding was independently verified, rejected, or marked
  inconclusive.

## Security and privacy

- [ ] No passwords, API keys, tokens, or private data appear in source,
  screenshots, logs, or presentation materials.
- [ ] Page source and browser DevTools were inspected.
- [ ] Direct API requests were tested independently of UI controls.
- [ ] Local-storage tampering behavior is recorded.
- [ ] User input is rendered safely as text.
- [ ] The unavailable prediction and search states are explained honestly.

## Deployment discussion

- [ ] Development and production environments are clearly distinguished.
- [ ] The local-storage data model and its lack of server-side backup are
  disclosed.
- [ ] Monitoring, downtime response, and provider failure behavior are
  documented as current limitations or implemented controls.
