# Update Content Workflow

Use this for portfolio copy, projects, experience, education, certifications, activities, resume references, or metadata changes.

Source code is the final authority.

## Required Content Evidence

Do not invent professional history or achievements. Use exact user-provided facts or existing source facts. If the requested update implies new responsibilities, dates, metrics, or credentials, ask for confirmation.

## Data File Map

- Projects: `src/data/projects.ts`
- Experience: `src/data/experience.ts`
- Education: `src/data/education.ts`
- Certifications: `src/data/certifications.ts`
- Activities: `src/data/activities.ts`
- Activity media: `src/data/activityMedia.ts`

## Component Copy Map

- Hero name, tagline, role, resume link, social links: `src/sections/Hero.tsx`
- About text and tags: `src/sections/About.tsx`
- Skills groups and intro: `src/sections/Skills.tsx`
- Browser metadata: `index.html`

## Media Rules

- Put public URL assets in `public`.
- Put imported React media in `src/assets`.
- Keep asset imports and data references in sync.

## Verification

Search for old and new terms after broad content changes. Run `npm run build` when TypeScript data or imports changed.
