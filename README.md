# Tien Huynh Portfolio

Personal portfolio website for showcasing software engineering experience, projects, certifications, activities, and contact information.

Built with React, TypeScript, Vite, React Router, Tailwind CSS, and Phosphor Icons.

Live site: [https://tienhuynh-tn.github.io/portfolio/](https://tienhuynh-tn.github.io/portfolio/)

## Features

- Responsive single-page portfolio with route-backed detail pages
- Sections for about, skills, projects, experience, education, certifications, activities, and contact
- Project, activity, and certification modals
- Theme toggle and scroll-to-top behavior
- Static resume and certificate assets served from `public`

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

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
src/
  app/           Route composition and navigation metadata
  assets/        Bundled project, activity, and certificate media
  components/    Reusable UI components
  data/          Portfolio content data
  hooks/         Shared React hooks
  layouts/       App shell layout
  pages/         Route-level pages
  sections/      Homepage sections
  styles/        Global styling
public/
  certs/         Public certificate preview assets
  issuers/       Public issuer logo assets
  resume.pdf     Downloadable resume
```

## Content Updates

Most portfolio content lives in `src/data`:

- `projects.ts` for project cards, filters, and project modals
- `certifications.ts` for certification badges and certificate details
- `activities.ts` and `activityMedia.ts` for activity cards, galleries, and modal data
- `education.ts` and `experience.ts` for timeline sections

Static files that need stable public URLs should go in `public`. Media imported by React components should go in `src/assets`.

## Deployment

The Vite base path is configured as `/portfolio/` in `vite.config.ts`. Keep this in sync with the deployment path.

## Validation Notes

`npm run build` should pass before deployment.

`npm run lint` currently reports existing React Hooks rule violations around synchronous `setState` inside effects. Those are separate code-quality fixes and are not related to the README or unused-file cleanup.
