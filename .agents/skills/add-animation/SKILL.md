---
name: add-animation
description: Add or modify animation and interactive visual behavior in this portfolio. Use when the user asks about cat cursor, particle background, scroll effects, hover motion, visual intensity, reduced motion, pointer behavior, or page-wide overlays; do not use for static content-only edits.
---

# Add Animation

Add or modify portfolio animation without committing or pushing.

## Required Reads

1. Read `AGENTS.md`.
2. Read `.kb/README.md`, `.kb/context/design-system.md`, `.kb/context/architecture.md`, and animation or responsive guidance when relevant.
3. Inspect existing implementations before editing: `src/layouts/AppLayout.tsx`, `src/components/CatCursor.tsx`, `src/components/ParticleConstellationBackground.tsx`, scroll components, and related CSS in `src/styles/global.css`.

## Workflow

1. Preserve the portfolio's clean, content-first visual identity.
2. Keep global effects subtle and non-blocking.
3. Reuse existing CSS variables, component patterns, refs, and cleanup patterns.
4. Avoid adding dependencies unless the user explicitly approves.
5. Check desktop, mobile and touch behavior, light theme, dark theme, reduced-motion preferences, keyboard accessibility, performance, overlay and stacking behavior, and cleanup of events and animation frames.
6. Preserve native cursor behavior for text inputs, editable content, and coarse/touch pointers.
7. Use `requestAnimationFrame`, refs, and event cleanup consistently when changing animation loops.
8. Run applicable verification from `package.json`, usually `npm run build`; report known lint blockers if `npm run lint` fails for unrelated existing code.
9. Review the final diff.

## Verified Repository Facts

- `src/layouts/AppLayout.tsx` mounts `ParticleConstellationBackground`, `CatCursor`, route scroll behavior, and the scroll-to-top button.
- `ThemeToggle` writes `document.documentElement.dataset.theme`, and CSS uses `:root[data-theme='dark']`.
- `CatCursor` gates custom cursor behavior with `(hover: hover) and (pointer: fine)` and reduced-motion media queries.
- `ParticleConstellationBackground` uses a canvas, pointer events, visibility handling, reduced-motion handling, `requestAnimationFrame`, and a mutation observer for `data-theme`.
- Cursor and particle styles live in `src/styles/global.css`.
