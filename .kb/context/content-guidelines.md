# Content Guidelines

Source code is the final authority for this document.

## Content Source Of Truth

Most portfolio content lives in:

- `src/data/projects.ts`
- `src/data/experience.ts`
- `src/data/education.ts`
- `src/data/certifications.ts`
- `src/data/activities.ts`
- `src/data/activityMedia.ts`

Some important visible copy lives directly in:

- `src/sections/Hero.tsx`
- `src/sections/About.tsx`
- `src/sections/Skills.tsx`
- `index.html`

## Do Not Invent Content

Do not invent or inflate:

- job titles;
- dates;
- employers;
- responsibilities;
- metrics;
- project scope;
- certifications;
- issuer details;
- activity roles;
- achievements;
- resume facts.

Use only user-provided facts or facts already present in source files. If the requested content is unclear, ask or keep the wording factual and narrow.

## Metadata And Browser Tab Text

Browser metadata is in `index.html`. If the user requests visible title or role changes and also mentions tab text, update both visible source and metadata together.

Current metadata includes:

- description: `Tien Huynh portfolio - Software Developer`
- title: `Tien Huynh - Software Developer`

## Asset Placement

- Public assets with stable URLs live in `public`.
- Imported component media lives in `src/assets`.
- The current resume path used by `Hero.tsx` is based on `import.meta.env.BASE_URL` and `tienhuynh-tn-resume.pdf`.

## Resume And Certificate Handling

The repository contains `public/tienhuynh-tn-resume.pdf` and certificate media under `src/assets/certificates`. Do not alter PDF or certificate claims unless the user provides replacement assets or exact source-backed content.

## Content Update Rules

- Edit the nearest data file when content is data-driven.
- Edit section components only when the text is component-local.
- Keep project categories and arrays in sync when adding project categories.
- Verify all search terms after cleanup requests.
- Do not use README statements to override implementation when source files differ.
