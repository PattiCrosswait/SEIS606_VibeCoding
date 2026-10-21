# Implementation Plan: Protein Sequence Analysis

**Branch**: `001-protein-sequence-analysis` | **Date**: 2026-10-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from [spec.md](./spec.md)

## Summary

Build the Protein Sequence Analyzer as a maintainable Next.js web application using TypeScript and customizable shadcn/ui-style components, with Vercel as the intended deployment platform. Core sequence parsing and calculations run locally for fast, deterministic feedback. Optional prediction and external protein-search capabilities use server-side route boundaries so provider credentials and error normalization stay out of the browser. Client state supports the initial MVP, while a Web Worker entry point is available for long-sequence or alignment workloads.

## Technical Context

**Language/Version**: TypeScript with Next.js App Router

**Primary Dependencies**: Next.js, React, Tailwind CSS, lucide-react, clsx, tailwind-merge, class-variance-authority, and shadcn/ui-style local components

**Storage**: Client-side state for the initial MVP; persistent storage and authentication are deferred until the core workflows are validated

**Testing**: TypeScript checks, ESLint, focused sequence-module regression tests, browser acceptance checks, accessibility review, and production build validation

**Target Platform**: Modern desktop and mobile browsers deployed through Vercel

**Project Type**: Full-stack-capable Next.js web application

**Performance Goals**: Keep typing and navigation responsive; complete local analysis for representative short and 1,000-residue sequences without freezing the interface; move expensive future workloads to `workers/sequence-analysis.worker.ts`

**Constraints**: Safe rendering of untrusted sequence input; deterministic calculations; no misleading fallback results; keyboard and screen-reader access; external provider credentials only behind server routes; no persistent storage requirement for the MVP

**Scale/Scope**: One Next.js application with analysis, saved-library, comparison, discovery, prediction, reports, and preferences surfaces; initial implementation establishes the core analysis shell and integration boundaries

## Constitution Check

*GATE: Must pass before implementation and re-check after implementation.*

- **Code Quality**: PASS. Domain calculations live in `lib/sequence`, UI primitives live in `components/ui`, and page composition lives in `components/analysis`.
- **Testable Behavior**: PASS. The architecture supports focused module checks, browser scenarios, API-route state checks, and production-build validation.
- **Consistent User Experience**: PASS. Shared buttons, cards, text areas, status regions, navigation, responsive styles, and accessible focus behavior are established.
- **Performance by Default**: PASS. Core calculation is explicit and local; a Worker entry point is available for future expensive workloads.
- **Trustworthy Results**: PASS. Normalization and validation precede valid metrics; invalid, unavailable, and predicted states remain explicit.

## Project Structure

```text
app/
├── api/
│   ├── predictions/route.ts
│   └── protein-search/route.ts
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── analysis/
├── comparison/
├── discovery/
├── layout/
├── library/
├── predictions/
├── reports/
└── ui/
    ├── button.tsx
    ├── card.tsx
    └── textarea.tsx

lib/
├── integrations/contracts.ts
├── predictions/
├── protein/
├── reports/
├── sequence/
│   ├── analyze.ts
│   └── types.ts
└── utils.ts

workers/
└── sequence-analysis.worker.ts

tests/
├── browser/
├── fixtures/
└── unit/

mockup/
└── WhatsInMyProtein.html  # Preserved visual reference
```

**Structure Decision**: Migrate the prototype into a Next.js App Router application while retaining the original HTML mockup as a visual reference. Use local, composable UI components rather than a rigid component package. Keep domain logic framework-independent and expose optional integrations through server routes.

## Post-Design Constitution Check

- **Code Quality**: PASS. File ownership is explicit and avoids putting all behavior into one HTML document.
- **Testable Behavior**: PASS. Domain functions can be checked independently from browser rendering and server-route availability states.
- **Consistent User Experience**: PASS. Shared UI primitives and global focus/responsive styles establish common behavior.
- **Performance by Default**: PASS. The client does not need remote services for core metrics, and worker infrastructure is ready for expensive operations.
- **Trustworthy Results**: PASS. Invalid input returns an explicit invalid analysis state, while optional API routes return unavailable states instead of fake results.

## Complexity Tracking

No constitution violations require justification. The additional framework is justified by the multi-surface product scope and intended Vercel deployment.
