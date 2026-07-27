# Add UI Feature Workflow

Use this when adding a small portfolio feature such as a new card type, filter, section behavior, modal affordance, or listing-page control.

Source code is the final authority.

## Before Adding Anything

- Read [../context/architecture.md](../context/architecture.md).
- Read [../context/design-system.md](../context/design-system.md).
- Read [../patterns/component-patterns.md](../patterns/component-patterns.md).
- Read [../context/content-guidelines.md](../context/content-guidelines.md) if the feature touches content.

Make a short plan for multi-file work, route changes, global layout changes, or feature work that touches data models.

## Preferred Implementation Path

- Reuse existing data files in `src/data` when records are already data-driven.
- Place route-level pages in `src/pages` unless the existing local pattern says otherwise.
- Place shared shell UI in `src/components/layout`.
- Place domain components under `src/components/projects`, `src/components/activities`, or `src/components/certifications`.
- Use Phosphor icons because the app already depends on `@phosphor-icons/react`.

## Styling Rules

- Prefer existing CSS variables from `src/styles/global.css`.
- Keep dark and light modes working.
- Preserve existing responsive grids and overflow constraints.
- Keep global effects non-blocking.

## Verification

Run `npm run build` for feature work. Use route and responsive checks for any page, nav, modal, filter, or layout behavior.
