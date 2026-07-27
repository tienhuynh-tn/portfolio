# Small UI Fix Workflow

Use this for focused visual fixes such as spacing, wrapping, button polish, card alignment, navbar presentation, or small copy display adjustments.

Source code is the final authority.

## Files To Inspect First

- The affected component or section.
- `src/styles/global.css`.
- [../context/design-system.md](../context/design-system.md).
- [../patterns/responsive-design-patterns.md](../patterns/responsive-design-patterns.md) for mobile or wrapping issues.

## Change Rules

- Keep the edit local to the affected component and related styles.
- Reuse existing CSS variables and class patterns.
- Preserve light and dark theme behavior.
- Avoid unrelated refactors, file moves, or new dependencies.
- Do not invent portfolio content to solve layout issues.

## Verification

Use the smallest verification that matches the change. For visual changes, inspect both desktop and mobile behavior when possible. For code changes, `npm run build` is the reliable full check. `npm run lint` exists, but `README.md` states it currently reports existing React Hooks violations.
