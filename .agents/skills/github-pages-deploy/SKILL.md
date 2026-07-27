---
name: github-pages-deploy
description: Safely analyze or modify this portfolio repository's GitHub Pages deployment. Use when the user asks about deployment, custom domain, Vite base, GitHub Actions Pages workflow, SPA route fallback, public asset paths, or route refresh behavior; do not use for ordinary content changes.
---

# GitHub Pages Deploy

Analyze or change deployment behavior carefully. Do not commit, push, or deploy without explicit approval.

## Required Reads

1. Read `AGENTS.md`.
2. Read `.kb/README.md` and `.kb/context/deployment-and-routing.md`.
3. Inspect `package.json`, `vite.config.ts`, `.github/workflows/deploy.yml`, `src/main.tsx`, `src/app/App.tsx`, `README.md`, and any `CNAME` file if present.

## Workflow

1. Verify the actual deployment configuration before making claims.
2. Check Vite base configuration, BrowserRouter basename, GitHub Actions Pages workflow, documented custom-domain behavior, `CNAME` if present, SPA fallback logic, asset paths, nested routes, and redirects.
3. Present a plan before changing routing, Vite, workflow, public path, or deployment files.
4. Preserve custom-domain behavior unless the user explicitly asks to change it.
5. Check for redirect loops and nested query-string growth when touching SPA fallback or redirects.
6. Run the real build command, `npm run build`, after deployment-related edits.
7. Report checks that require live GitHub Pages, repository settings, DNS, or network access.

## Verified Repository Facts

- `vite.config.ts` sets `base: '/'`.
- `src/main.tsx` uses `BrowserRouter basename={import.meta.env.BASE_URL}`.
- `package.json` defines `build` as `tsc -b && vite build` and `postbuild` as `cp dist/index.html dist/404.html`.
- `.github/workflows/deploy.yml` deploys on pushes to `main` and `workflow_dispatch`, runs Node 20, `npm ci`, `npm run build`, uploads `dist`, and deploys with `actions/deploy-pages@v4`.
- Current routes in `src/app/App.tsx` are `/`, `/projects`, `/certifications`, `/credentials` redirecting to `/certifications`, `/activities`, and wildcard redirect to `/`.
- The current repository inspection found no `CNAME` file.
