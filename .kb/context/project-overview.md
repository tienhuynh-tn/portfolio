# Project Overview

Source code is the final authority for this document.

## Portfolio Purpose

This is a personal portfolio website for Tien Huynh. The `README.md` describes it as a site for software engineering experience, projects, certifications, activities, and contact information.

## Technology Stack

Verified from `package.json`:

- React `^19.2.0`
- React DOM `^19.2.0`
- React Router DOM `^7.13.0`
- TypeScript `~5.9.3`
- Vite `^7.2.4`
- Tailwind CSS `^3.4.19`
- Phosphor Icons `^2.1.10`
- ESLint `^9.39.1`

## Main User-Facing Areas

Verified from `src/app/navItems.ts` and `src/app/App.tsx`:

- Home
- About me
- Skills
- Projects
- Experience
- Education
- Certifications
- Activities
- Contact

The homepage is section-based. Projects, certifications, and activities also have route-backed listing pages.

## Key Commands

Verified from `package.json`:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

There is no `test` script in `package.json`.

## Current Repository Notes

- `README.md` states the live site is `https://tienhuynh-tn.com/`.
- No CNAME file is present in the repository.
- `README.md` states `npm run lint` currently reports existing React Hooks rule violations.
- Ignored local folders such as `dist` and `node_modules` may exist locally; do not treat them as app source.
