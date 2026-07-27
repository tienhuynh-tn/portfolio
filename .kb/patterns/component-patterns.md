# Component Patterns

Source code is the final authority for this document.

## Component Placement

- Layout components live in `src/components/layout`.
- Project components live in `src/components/projects`.
- Activity components live in `src/components/activities`.
- Certification-specific filter and modal components live in `src/components/certifications`.
- Shared generic UI lives in `src/components/shared`.
- Homepage sections live in `src/sections`.
- Route-level pages mostly live in `src/pages`; `src/app/ActivitiesPage.tsx` is an existing exception.

## Layout Components

Use `src/components/layout/Section.tsx` and `src/components/layout/Container.tsx` for section layout. `AppLayout` is for page-wide shell and global effects.

## Listing Pages

Projects, certifications, and activities listing pages use local React state for filters, sorting, search, and selected modal item.

## Cards And Modals

Card components render data records and pass selected records to modal components. Keep modal content source-backed through the relevant data file.

## Filters

Filters are implemented as local components per content area. Follow the existing component family before introducing a generic abstraction.

## Icons

The app uses Phosphor icons from `@phosphor-icons/react`. Reuse that dependency for new icon UI.
