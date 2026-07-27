# Animation Patterns

Source code is the final authority for this document.

## Animation Principles

Keep motion subtle, readable, and supportive of the content. Preserve reduced-motion behavior where it already exists.

## Cat Cursor Pattern

`src/components/CatCursor.tsx`:

- renders through a portal into `document.body`;
- tracks pointer position with refs and `requestAnimationFrame`;
- enables only for `(hover: hover) and (pointer: fine)` mouse pointers;
- switches modes for default, active, text, and disabled targets;
- creates limited trail elements with class `catCursorTrail`;
- respects `prefers-reduced-motion`.

Styles live in `src/styles/global.css` under `.catCursor`, `.customCursorEnabled`, and related selectors.

Do not remove pointer gating, text-target behavior, `pointer-events: none`, or reduced-motion handling unless the user explicitly asks.

## Particle Background Pattern

`src/components/ParticleConstellationBackground.tsx` renders a fixed full-screen canvas. It:

- builds particles and floating symbols based on viewport width;
- reacts to pointer movement;
- pauses or restarts on visibility changes;
- respects `prefers-reduced-motion`;
- updates its palette through a `MutationObserver` watching `data-theme`.

The canvas class is `.particleConstellation`, styled in `src/styles/global.css`.

## Scroll Behavior

- `src/components/ScrollToTop.tsx` handles route and hash scroll after navigation.
- `src/components/layout/ScrollToTop.tsx` renders the floating scroll-to-top button.
- `src/components/layout/Navbar.tsx` includes active-section and scroll-direction behavior.

## Theme-Aware Effects

Cursor and particle effects rely on `document.documentElement.dataset.theme` and `:root[data-theme='dark']`. Preserve that contract.
