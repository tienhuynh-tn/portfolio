# Design System

Source code is the final authority for this document.

## Styling Approach

The app uses:

- `src/styles/global.css` for theme tokens, layout, components, responsive rules, cursor styles, and most custom CSS.
- `src/index.css` for Tailwind directives.
- Utility classes in React components.
- `tailwind.config.cjs` with content paths for `index.html` and `src/**/*.{js,ts,jsx,tsx}`.
- `postcss.config.cjs` with Tailwind CSS and autoprefixer.

There are no CSS modules in the current source tree.

## Theme Tokens

Light theme tokens are defined on `:root` in `src/styles/global.css`. Dark theme tokens are defined under `:root[data-theme='dark']`.

Core tokens include background, surface, text, muted text, border, primary color, ring, spacing, radii, shadows, typography, and navbar height.

## Light And Dark Theme Behavior

`src/components/layout/ThemeToggle.tsx`:

- stores the selected theme in `localStorage` under `theme`;
- falls back to `prefers-color-scheme: dark` when no stored preference exists;
- writes `document.documentElement.dataset.theme = theme`.

When changing theme behavior, preserve `data-theme` compatibility because CSS, cursor styling, and particle palette depend on it.

## Typography And Layout Rhythm

Global typography, section spacing, container width, heading sizes, and scroll margins are controlled by variables in `src/styles/global.css`.

Do not introduce unrelated layout systems for small portfolio changes. Reuse `Section`, `Container`, and existing spacing utilities.

## Cards, Buttons, And Navigation

Cards, buttons, theme toggle, navbar, mobile menu, grids, filters, and modals are styled in `src/styles/global.css` with CSS variables and some Tailwind utility classes in components.

Navigation uses Phosphor icons from `src/app/navItems.ts` and behavior in `src/components/layout/Navbar.tsx`.

## Visual Identity Rules

- Keep the portfolio clean, readable, and content-first.
- Preserve both light and dark modes.
- Keep global effects subtle and non-blocking.
- Prefer existing CSS variables and component patterns over new visual systems.
- Do not fabricate visible content to fill UI.
