# Responsive Design Patterns

Source code is the final authority for this document.

## Responsive Strategy

Responsive behavior is mostly in `src/styles/global.css`, with Tailwind utility classes in components. Use existing breakpoints and grid patterns before adding new layout rules.

## Container And Section Rules

`Section` wraps content in `Container`. Global variables control section spacing, container width, navbar height, and scroll margins.

## Navbar Behavior

`src/components/layout/Navbar.tsx` switches to collapsed/mobile navigation through a `(max-width: 1199px)` media query in JavaScript. Related mobile menu styles live in `src/styles/global.css`.

## Grid Patterns

Existing grids include:

- projects grid changing at `601px` and `901px`;
- activity and certification grid/list styles in `src/styles/global.css`;
- section-specific responsive rules near the relevant CSS blocks.

## Text Wrapping And Overflow

The stylesheet contains explicit overflow, max-width, truncation, and nowrap rules for navbar labels, filters, cards, and section intros. Diagnose the actual container constraint before shortening copy.

## Modals And Listing Pages

Listing pages use responsive filter panels, card grids, and modal styles. Check both mobile and desktop when changing pages, cards, filters, or modal content.
