# Review Changes Workflow

Use this when asked to review a diff, branch, PR, or local changes.

Source code is the final authority.

## Review Priorities

Lead with findings. Prioritize:

- fabricated or unsupported portfolio content;
- broken routes or GitHub Pages behavior;
- build or TypeScript risks;
- light/dark theme regressions;
- responsive layout regressions;
- cursor or particle effect regressions;
- unrelated refactoring.

## Files To Inspect

- Changed files first.
- `package.json` for command or dependency changes.
- `vite.config.ts` and `.github/workflows/deploy.yml` for deployment changes.
- `src/main.tsx` and `src/app/App.tsx` for routing changes.
- `src/styles/global.css` for styling and theme changes.
- `src/data/*` and section components for content changes.

## Verification Review

Check whether `npm run build` was run for code changes. `npm run lint` is available, but current README notes existing React Hooks rule violations. Do not require nonexistent tests; there is no `test` script in `package.json`.
