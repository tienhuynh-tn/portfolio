# Fix Bug Workflow

Use this for broken behavior, route issues, theme issues, modal bugs, layout defects, cursor/background problems, or regressions.

Source code is the final authority.

## Investigation Steps

- Reproduce or identify the affected behavior from the nearest source files.
- Inspect the owning component, its data file if applicable, and `src/styles/global.css` for visual bugs.
- For route bugs, inspect `src/main.tsx`, `src/app/App.tsx`, and `src/components/layout/Navbar.tsx`.
- For theme bugs, inspect `src/components/layout/ThemeToggle.tsx` and `src/styles/global.css`.
- For cursor or particle bugs, inspect [../patterns/animation-patterns.md](../patterns/animation-patterns.md).

## Scope Control

- Fix the smallest cause that explains the bug.
- Do not rewrite nearby working code for style only.
- Do not alter portfolio facts while fixing UI behavior.
- Do not change routing or deployment configuration unless the bug is specifically there and the user asked for that fix.

## Verification

Use targeted checks plus `npm run build` when TypeScript or build behavior may be affected. Mention if `npm run lint` is skipped because of the existing README-noted hook violations.
