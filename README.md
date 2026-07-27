# Tien Huynh Portfolio

Personal portfolio website for showcasing software engineering experience, projects, certifications, activities, and contact information.

Built with React, TypeScript, Vite, React Router, Tailwind CSS, and Phosphor Icons.

Live site: [https://tienhuynh-tn.com/](https://tienhuynh-tn.com/)

## Features

- Responsive portfolio with homepage sections, route-backed listing pages, and detail modals
- Sections for about, skills, projects, experience, education, certifications, activities, and contact
- Project, activity, and certification modals
- Theme toggle and scroll-to-top behavior
- Custom cat cursor and interactive particle background
- Static resume, logo, and issuer assets served from `public`

## Getting Started

Install dependencies:

```bash
npm install
```

Use `npm ci` instead for a clean, lockfile-based install in CI or a fresh clone.

Start the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

The production build runs TypeScript project checks, builds with Vite, and copies `dist/index.html` to `dist/404.html` for GitHub Pages route fallback support.

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Project Structure

```text
AGENTS.md      Repository instructions for Codex and other coding agents
.github/       GitHub Actions workflow for GitHub Pages deployment
.kb/           Lightweight project knowledge base for agent workflows
index.html     Vite HTML entrypoint and browser metadata
package.json   Project scripts and dependencies
vite.config.ts Vite configuration
src/
  app/           Route composition and navigation metadata
  assets/
    activities/     Imported activity media
    certificates/   Imported certificate detail media
    projects/       Imported project illustrations
  components/    Reusable UI components and feature-specific component groups
    activities/
    certifications/
    layout/
    projects/
    shared/
  data/          Portfolio content data
  hooks/         Shared React hooks
  layouts/       App shell layout
  pages/         Route-level pages
  sections/      Homepage sections
  styles/        Global styling
public/
  issuers/       Public issuer logo assets
  logo-dark.png
  logo-light.png
  tienhuynh-tn-resume.pdf
                 Downloadable resume
```

Generated and local dependency folders such as `dist` and `node_modules` may exist locally, but they are ignored and should not be treated as application source.

## Content Updates

Most portfolio content lives in `src/data`:

- `projects.ts` for project cards, filters, and project modals
- `certifications.ts` for certification badges and certificate details
- `activities.ts` and `activityMedia.ts` for activity cards, galleries, and modal data
- `education.ts` and `experience.ts` for timeline sections

Visible homepage copy also appears in section components such as `Hero.tsx`, `About.tsx`, and `Skills.tsx`. Browser metadata lives in `index.html`.

Static files that need stable public URLs should go in `public`. Media imported by React components should go in `src/assets`.

## Repository Guidance

Codex and other coding agents should start with `AGENTS.md`, then use `.kb/README.md` to find the relevant project context, workflow, pattern, or checklist. Source code is the final authority when documentation and implementation conflict.

## Deployment

The app is configured for root-path deployment at `https://tienhuynh-tn.com/`.
Vite uses `base: '/'`, and the build copies `dist/index.html` to `dist/404.html` so GitHub Pages can serve the React app for direct route visits.

Route-backed pages:

- `/`
- `/projects`
- `/certifications`
- `/credentials` redirects to `/certifications`
- `/activities`

GitHub Pages deployment is handled by `.github/workflows/deploy.yml` on pushes to `main` or manual workflow dispatch. The workflow uses Node 20, installs with `npm ci`, runs `npm run build`, uploads `dist`, and deploys with `actions/deploy-pages`.

No CNAME file is present in this repository.

## Validation Notes

`npm run build` should pass before deployment.

`npm run lint` currently reports an existing React Hooks rule violation around synchronous `setState` inside an effect in `CatCursor.tsx`. That is a separate code-quality fix and is not related to README or unused-file cleanup.

No test script is currently defined in `package.json`.
