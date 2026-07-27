# Verification Checklist

Source code is the final authority.

## Standard Commands

From `package.json`:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

There is no `test` script. `README.md` states `npm run lint` currently reports existing React Hooks rule violations.

## Content Verification

- Search for replaced terms after broad content edits.
- Confirm no unsupported dates, metrics, credentials, or responsibilities were added.
- Check `index.html` when browser title or meta description should change.

## UI Verification

- Check the changed area on desktop and mobile sizes when layout is affected.
- Verify text does not overflow or overlap.
- Check cards, filters, modals, and nav states if touched.

## Theme Verification

- Check light and dark theme behavior for visual changes.
- Preserve `document.documentElement.dataset.theme` and `:root[data-theme='dark']`.

## Routing Verification

- Verify `/`, `/projects`, `/certifications`, `/credentials`, and `/activities` if routing or navigation changed.
- Verify homepage hash links such as `/#projects` when nav behavior changed.

## Effects Verification

- For cursor changes, check precise-pointer behavior, text inputs, disabled targets, and reduced motion.
- For particle changes, check canvas rendering, pointer interaction, reduced motion, theme changes, and visibility pause behavior.

## Deployment Verification

- Preserve `vite.config.ts` `base: '/'`.
- Preserve `postbuild` copying `dist/index.html` to `dist/404.html`.
- Preserve GitHub Pages workflow behavior unless the user explicitly requests deployment changes.
