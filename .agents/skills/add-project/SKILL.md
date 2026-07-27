---
name: add-project
description: Add or update a project entry in this portfolio. Use when the user asks to add, revise, or verify portfolio project data, cards, filters, project detail modals, project categories, or project media; do not use for unrelated content or visual-only changes.
---

# Add Project

Add or update a portfolio project without committing or pushing.

## Required Reads

1. Read `AGENTS.md`.
2. Read `.kb/README.md` and relevant content, architecture, component, and verification guidance.
3. Inspect `src/data/projects.ts` before editing.
4. Inspect consumers when behavior may be affected: `src/sections/Projects.tsx`, `src/pages/ProjectsPage.tsx`, and components under `src/components/projects/`.

## Workflow

1. Confirm user-provided facts for project name, dates, organization, role, responsibilities, technology stack, outcomes, metrics, links, and media.
2. Never fabricate professional experience, dates, responsibilities, outcomes, metrics, or technologies.
3. Follow the existing `Project` type in `src/data/projects.ts`.
4. Keep `ProjectCategory` and `PROJECT_CATEGORIES` synchronized if adding a new category.
5. Preserve current rendering behavior: featured projects, all-project search, tag filters, sorting, cards, and modals.
6. Place stable public assets in `public` and imported React media in `src/assets`, following existing usage.
7. Preserve responsive behavior, keyboard accessibility, and both light and dark themes.
8. Run applicable verification from `package.json`, usually `npm run build`; run `npm run lint` when the change is not blocked by known existing lint failures or report the known blocker clearly.
9. Review the final diff.

## Verified Repository Facts

- Project data lives in `src/data/projects.ts`.
- `allProjects` feeds the full projects page; `featuredProjects` feeds the homepage section.
- `src/pages/ProjectsPage.tsx` derives tags from `allProjects.flatMap((project) => project.tech)`, supports search, filters, and sorting.
- `ProjectModal` renders Impact from `highlights`, optional Responsibilities, optional Metrics, and Tech Stack.
- Existing project media is imported from `src/assets/projects`.
