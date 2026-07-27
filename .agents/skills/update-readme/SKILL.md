---
name: update-readme
description: Update this portfolio repository's README.md. Use when the user asks to inspect, plan, or modify the portfolio README while verifying setup, commands, routes, assets, deployment, and content claims against the repository; do not use for application source changes.
---

# Update README

Update the portfolio `README.md` without committing or pushing.

## Required Reads

1. Read `AGENTS.md`.
2. Use `.kb/README.md` to choose relevant context, especially project overview, content guidelines, and deployment/routing when claims touch those areas.
3. Read the current `README.md`.
4. Verify claims against `package.json`, `vite.config.ts`, `.github/workflows/deploy.yml`, `src/main.tsx`, `src/app/App.tsx`, source files named by the README, and public asset paths when relevant.

## Workflow

1. Verify all project claims from source before editing.
2. Preserve useful existing sections and keep wording concise and professional.
3. Verify installation, development, build, lint, preview, and deployment commands from `package.json` and workflow files.
4. Verify links, routes, asset paths, and custom-domain statements against source and repository files.
5. Do not invent technologies, experience, responsibilities, dates, metrics, certifications, resume content, or deployment behavior.
6. Modify only documentation files explicitly included in the task.
7. Review the final README diff.
8. Run documentation-appropriate checks; avoid build commands when the user asks for read-only work or when generated output would be out of scope.

## Verified Repository Facts

- The app is a React, TypeScript, Vite, React Router, Tailwind CSS, and Phosphor Icons portfolio, as verified from `package.json` and `AGENTS.md`.
- `package.json` defines `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`, and `postbuild`.
- `npm run build` runs `tsc -b && vite build`; `postbuild` copies `dist/index.html` to `dist/404.html`.
- `vite.config.ts` sets `base: '/'`.
- `.github/workflows/deploy.yml` deploys GitHub Pages from `main` and `workflow_dispatch` using Node 20, `npm ci`, and `npm run build`.
- Routes are defined in `src/app/App.tsx`: `/`, `/projects`, `/certifications`, `/credentials` redirecting to `/certifications`, `/activities`, and wildcard redirect to `/`.
- No `CNAME` file is present unless a future source inspection finds one.
