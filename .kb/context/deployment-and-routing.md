# Deployment And Routing

Source code is the final authority for this document.

## Routing Model

The app uses React Router in `BrowserRouter` mode from `src/main.tsx`. The basename is `import.meta.env.BASE_URL`.

Routes are defined in `src/app/App.tsx`:

- `/`
- `/projects`
- `/certifications`
- `/credentials` redirecting to `/certifications`
- `/activities`
- wildcard redirect to `/`

## GitHub Pages Deployment

`.github/workflows/deploy.yml` deploys to GitHub Pages on pushes to `main` and on `workflow_dispatch`.

The workflow:

- uses Node 20;
- runs `npm ci`;
- runs `npm run build`;
- uploads `dist`;
- deploys with `actions/deploy-pages@v4`.

## Root Path Deployment

`vite.config.ts` sets `base: '/'`. Preserve this unless the deployment target changes and the user explicitly asks for it.

## Deep Link Fallback

`package.json` defines:

- `build`: `tsc -b && vite build`
- `postbuild`: `cp dist/index.html dist/404.html`

The `postbuild` copy supports direct visits to client-side routes on GitHub Pages.

## Custom Domain Handling

`README.md` states the live site is `https://tienhuynh-tn.com/`. No CNAME file is present in the current repository. Do not add, remove, or change custom-domain files or GitHub Pages settings unless the user explicitly asks.

## Public Asset Paths

Use `import.meta.env.BASE_URL` for public asset URLs that must respect Vite base behavior, as shown in `src/sections/Hero.tsx` for the resume path.

## Deployment Change Rules

Before touching routing, Vite base, workflow files, or public paths, read this document and make a short plan. Verify both direct route visits and homepage hash navigation after changes.
