# Architecture

Source code is the final authority for this document.

## Entry Points

- `index.html` defines the root element and metadata.
- `src/main.tsx` imports global styles, creates the React root, wraps the app in `StrictMode`, and mounts `BrowserRouter basename={import.meta.env.BASE_URL}`.
- `src/app/App.tsx` defines the route tree and homepage section composition.

## App Shell

`src/layouts/AppLayout.tsx` is the global shell. It mounts:

- `ParticleConstellationBackground`
- `CatCursor`
- `.appFrame`
- `Navbar`
- route `Outlet`
- route scroll behavior from `src/components/ScrollToTop.tsx`
- floating scroll-to-top button from `src/components/layout/ScrollToTop.tsx`
- `Footer`

Use this layout for page-wide concerns.

## Routing Model

`src/app/App.tsx` defines these routes:

- `/`: homepage sections
- `/projects`: full projects page
- `/certifications`: full certifications page
- `/credentials`: redirects to `/certifications`
- `/activities`: full activities page
- `*`: redirects to `/`

Navigation metadata lives in `src/app/navItems.ts`.

## Homepage Composition

The homepage maps `NAV_ITEMS` to section components:

- `Hero`
- `About`
- `Skills`
- `Projects`
- `Experience`
- `Education`
- `Certifications`
- `Activity`
- `Contact`

## Page Organization

- `src/pages/ProjectsPage.tsx` renders all projects with search, tags, sorting, cards, and modal selection.
- `src/pages/CertificationsPage.tsx` renders all certifications with filters, sorting, badge tiles, and modal selection.
- `src/app/ActivitiesPage.tsx` renders all activities with filters, sorting, cards, and modal selection.
- `src/app/CertificationsPage.tsx` re-exports `src/pages/CertificationsPage.tsx`.

## Component Organization

- `src/components/layout`: layout primitives and shell UI.
- `src/components/projects`: project cards, filters, modal, tech chips, and bullet parsing.
- `src/components/activities`: activity cards, filters, and modal.
- `src/components/certifications`: certification filters and modal.
- `src/components/shared`: shared UI such as `ImageLightbox`.

## Data Flow

Portfolio records are mostly imported from `src/data`. Components filter, sort, and render those typed records locally. Do not duplicate data when an existing data file can be extended safely.
