# Portfolio Agent Guide

This repository is Tien Huynh's personal portfolio built with React, TypeScript, Vite, React Router, Tailwind CSS, and Phosphor Icons. Keep changes small, source-backed, and appropriate for a personal portfolio.

Source code is the final authority. If this guide, `.kb`, or `README.md` conflicts with implementation, verify the implementation first and update documentation only when asked.

## Start Here

- Read [.kb/README.md](.kb/README.md) to choose the right guide.
- For broad orientation, read [.kb/context/project-overview.md](.kb/context/project-overview.md).
- Before editing, use [.kb/checklists/pre-change-checklist.md](.kb/checklists/pre-change-checklist.md).
- Before finishing, use [.kb/checklists/verification-checklist.md](.kb/checklists/verification-checklist.md).

## Task Routing

- UI tweak or small visual fix: [.kb/workflows/small-ui-fix.md](.kb/workflows/small-ui-fix.md), [.kb/context/design-system.md](.kb/context/design-system.md).
- New UI feature: [.kb/workflows/add-ui-feature.md](.kb/workflows/add-ui-feature.md), [.kb/context/architecture.md](.kb/context/architecture.md), [.kb/patterns/component-patterns.md](.kb/patterns/component-patterns.md).
- Bug fix: [.kb/workflows/fix-bug.md](.kb/workflows/fix-bug.md).
- Portfolio content update: [.kb/workflows/update-content.md](.kb/workflows/update-content.md), [.kb/context/content-guidelines.md](.kb/context/content-guidelines.md).
- Routing, public paths, GitHub Pages, or domain behavior: [.kb/context/deployment-and-routing.md](.kb/context/deployment-and-routing.md).
- Cat cursor, particle background, scroll, hover, or motion: [.kb/patterns/animation-patterns.md](.kb/patterns/animation-patterns.md).
- Responsive layout: [.kb/patterns/responsive-design-patterns.md](.kb/patterns/responsive-design-patterns.md).
- Review request: [.kb/workflows/review-changes.md](.kb/workflows/review-changes.md).

## Non-Negotiable Rules

- Do not invent resume content, experience, project responsibilities, dates, metrics, certifications, or achievements.
- Do not change application source, configuration, dependencies, routing, or deployment files unless the user asks for that work.
- Do not change `vite.config.ts`, `.github/workflows/deploy.yml`, `package.json`, or route definitions as part of documentation work.
- Preserve GitHub Pages compatibility: `vite.config.ts` uses `base: '/'`, and `postbuild` copies `dist/index.html` to `dist/404.html`.
- Treat the custom domain as documented by `README.md`; no CNAME file is present in the repository.
- Preserve light and dark theme behavior based on `document.documentElement.dataset.theme`.
- Preserve the custom cat cursor and particle background unless the user explicitly asks to change them.
- Keep unrelated refactoring out of portfolio maintenance tasks.
- Do not commit or push unless explicitly requested.

## Planning And Verification

Small copy or style fixes can stay lightweight after reading the relevant files. Higher-risk changes need a short plan first: routing, deployment, theme system, content model, global layout, cursor/background effects, or multi-file feature work.

Use commands exactly as defined in `package.json`: `npm run dev`, `npm run build`, `npm run lint`, and `npm run preview`. There is no test script defined.
