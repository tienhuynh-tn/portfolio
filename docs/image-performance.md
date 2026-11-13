# Images and caching

Original files remain unchanged. Existing imports and stable public URLs still work.
`npm run dev` and `npm run build` run the local Vite image plugin automatically.
No external image service, runtime server, or Cloudflare paid feature is required.

## Generation and updates

- Sharp creates AVIF (quality 75) and WebP (quality 85) at widths 80, 160, 320,
  480, 640, 768, 960, 1440, and 1920, capped at each source's width. These are high-quality display
  copies, not mathematically lossless reproductions. Full-resolution viewing uses
  the untouched original.
- SVGs/PDFs remain unchanged. Animated inputs are not flattened. Transparency is
  retained; EXIF orientation is applied to display variants.
- Variants larger than the original are omitted. Equal source bytes share output.
- `.cache/images` caches results by original bytes, encoding settings, and library
  versions. It is ignored by Git. Missing cached files regenerate automatically.
  Two workers and one libvips thread per worker bound processing memory.
- Vite emits hashed assets and resolves their base paths. Keep `base: '/'` for the
  current domain. For a separate subpath deployment, test with
  `npm run build -- --base=/portfolio/` and preview that URL; do not change the
  current site's base merely to run this check.
- A clean CI build regenerates derivatives. The existing GitHub Pages workflow
  needs no changes. Build output still includes originals for compatibility, so
  deployment size increases; browser transfers decrease.

## SmartImage

Use the original import as `src`; the manifest supplies optional variants.
Provide `sizes` matching the actual layout, descriptive `alt`, and the existing
CSS class. Existing fixed-height and aspect-ratio classes still own cropping.
Dimensions come from metadata; unknown sources should supply width/height or an
existing reserved container. Offscreen images use native lazy loading and async
decoding. Lazy card/gallery images use `sizes="auto, ..."` to let supporting browsers
select a source from the rendered width, with layout-based fallbacks.

The default fetch priority is `auto`. `priority` enables eager loading and high
fetch priority for the leading listing image and selected previews. `eagerWhen`
enables eager loading for other first-row images at their layout breakpoint after
hydration; homepage sections remain lazy. `preload` additionally
requests a matching responsive preload; use it only with `priority` for a measured
critical image. No gallery or below-fold image is preloaded. `original` bypasses
variants and loads eagerly, as used by the lightbox for its single current image.
The lightbox retains the exact original and shows loading/error feedback; it does
not download neighboring originals. Large originals remain bandwidth-dependent.

On failure, the initial source gets retries after 500ms and 1500ms. It then falls
back to WebP and finally the original without another retry cycle. Unknown/original
sources get the same two retries before terminal failure. `onError` runs only at
terminal failure. Timers are canceled on unmount/source changes. There are no
random query parameters. This cannot repair a missing original or force a CDN
to discard a cached error. Gallery slots remain stable on terminal failure.

## Localized remote assets

These are exact downloaded copies of the former runtime URLs, not redrawn logos:

| Local file in `src/assets` | Source |
| --- | --- |
| `portrait/tien-huynh.jpg` | https://github.com/tienhuynh-tn.png |
| `issuers/google.png` | https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png |
| `issuers/coursera.png` | https://images.ctfassets.net/00atxywtfxvd/2QeS5ysKMhZ3ZjiU2rGRJA/e15df94b265053ce8ded4f5e630241c8/cropped-android-chrome-512x512-1.png |
| `issuers/udacity.png` | https://upload.wikimedia.org/wikipedia/en/3/3b/Udacity_logo.png |
| `issuers/udemy.png` | https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/1280px-Udemy_logo.svg.png |

The files were retrieved on November 3, 2026. Existing ownership and attribution
remain with the original owners. Updates are deliberate repository changes;
the portrait no longer follows GitHub profile changes automatically.

## Cloudflare configuration recommendations

Apply these manually after reviewing existing zone rules. No zone configuration
is changed by this repository. Cloudflare only caches images on proxied hostnames;
third-party images do not use this site's cache.

1. For successful **hashed image files under `/assets/` only**, make them eligible
   for caching. Recommend 30-day edge TTL and one-year browser TTL. Scope by path
   and image extension; do not include HTML, scripts, or stable public filenames.
   A dedicated image URL exists for each format, so no custom `Accept` cache key
   or paid image transformation is needed.
2. Keep the default query-string behavior. Filenames, not query strings, version
   generated assets. Do not add a global "ignore query string" rule.
3. Do not apply long successful-response TTLs to 404/5xx responses. Where the
   account exposes status-code TTL configuration, bypass those responses. Inspect
   rule availability in the actual dashboard before enabling an edge override.
4. Leave HTML uncached at the edge, and respect its origin browser headers unless
   a specific short-lived rule is needed. Never cache the SPA fallback as an image.
   Stable public names should retain short origin TTLs rather than a one-year rule.
5. Deploy the complete Pages artifact together. New content creates new hashes.
   Avoid cached HTML referencing files removed by a later deployment; after a
   deployment, verify fresh HTML and its image URLs. Purge individual changed
   stable URLs when needed. Previously open tabs may still reference old assets.

GitHub Pages does not implement a custom `_headers` file; adding one would not set
HTTP cache headers. Cloudflare rules are the available configuration layer here.
TTL is an upper freshness limit, not a promise that an edge retains a file.

References: [Vite assets](https://vite.dev/guide/assets),
[Sharp encoders](https://sharp.pixelplumbing.com/api-output/),
[Cloudflare Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/),
[TTL controls](https://developers.cloudflare.com/cache/how-to/edge-browser-cache-ttl/).

## Validation

Run `npm run build`, `npm run lint`, `npm run test:image-assets`, and
`npm run test:images` (build first). The asset check verifies emitted image
metadata and resolution bounds, including detection of empty cache-race outputs.
Install a Playwright Chromium browser with `npx playwright install chromium`, or
set `PLAYWRIGHT_CHROME_PATH` to an existing Chrome executable. Browser tests use
mobile DPR 2 and desktop DPR 1 against the production preview.

For a repeatable comparison, run the production preview and `npm run measure:images`.
The measurement script uses 1.6 Mbps downloads, 150ms latency, and 4x CPU slowdown.
Each of five repetitions starts with a fresh context (cold cache), followed by a
repeat visit in that context (warm cache). An unfinished original may only be
partially cached on the repeat visit. It covers all four pages, homepage scrolling,
the Codex hackathon gallery, project/certificate previews, and the original viewer.
Widths are 390px at DPR 2 and 1440px at DPR 1. Each view waits up to ten seconds for
visible images, then samples after 200ms. Reports include completion timestamps,
partial image bytes received during that navigation, LCP, and CLS. Bytes are not a
fixed-window or total eventual transfer metric. Desktop homepage views without
visible images have no image-completion timestamp.

Reports go to the OS temporary directory by default. Use `IMAGE_TEST_REPORT` for
the output path, `IMAGE_TEST_URL` for the preview URL, `IMAGE_TEST_REPEATS` for the
run count, and comma-separated `IMAGE_TEST_WIDTHS` / `IMAGE_TEST_SCENARIOS` to narrow
a diagnostic run. These settings differ from the historical November 3 benchmark;
compare current before/after runs with each other, not with that older table.

These local checks measure frontend behavior, not Cloudflare edge latency. A live
deployment needs a separate verification of HTTP status, MIME types, `Age`,
`CF-Cache-Status`, cache freshness, and the actual GitHub Pages route fallback.

### Local results, November 3, 2026

Same production-preview host, cold contexts, DPR 1, 900px height, and the throttle
settings above. Bytes include partial downloads during the fixed ten-second view;
they are not the total eventual transfer size of the unoptimized originals.

| View | Width | Before image bytes | After image bytes | Reduction |
| --- | ---: | ---: | ---: | ---: |
| Activities | 390 | 1,903,120 | 85,932 | 95.5% |
| Activities | 1440 | 1,969,944 | 98,242 | 95.0% |
| Hackathon gallery | 390 | 1,980,442 | 273,299 | 86.2% |
| Hackathon gallery | 1440 | 2,055,444 | 888,436 | 56.8% |

No visible gallery photos completed in the baseline window. After optimization,
four completed on mobile and fifteen on desktop (excluding background listing
images). The 19,139,691-byte photo `gdg-sea-summit-2025/13.jpg` becomes 49,197 bytes
as a 640px AVIF, or 51,624 bytes as WebP. Full-resolution viewing retains the
19,139,691-byte original.

CLS stayed at 0.00203 on mobile and zero on desktop. LCP was **not uniformly
improved**: mobile homepage 2.49s → 1.90s, activities 1.54s → 2.35s, gallery
1.39s → 1.62s; desktop homepage 1.51s → 1.53s, activities 1.55s → 1.66s, gallery
1.40s → 1.57s. Baseline LCP can finish while large images are still blank; these
single-run results demonstrate improved image completion and transfers, not a
general Core Web Vitals speedup. The original desktop-home image byte sample was
zero, so it is excluded from byte comparisons.

The first local encode took 8m14s; a cached production build took 23s. There are
1,376 generated image files totaling approximately 171 MB. The complete build is
approximately 806 MiB because originals remain available. All 176 pre-existing
asset files were checked against their Git hashes and remained unchanged.

## Local results, November 13, 2026

Five runs per scenario/device/cache state, using the revised measurement script
above against production previews. Cold-cache median time from navigation until
all visible images loaded:

| Device | Page | Before | After |
| --- | --- | ---: | ---: |
| Mobile | home | 0.99s | 1.01s |
| Mobile | projects | 0.76s | 0.77s |
| Mobile | certifications | 0.77s | 0.75s |
| Mobile | activities | 3.19s | 2.44s |
| Desktop | home | 0.88s | 0.90s |
| Desktop | projects | 0.90s | 0.80s |
| Desktop | certifications | 0.93s | 0.82s |
| Desktop | activities | 1.66s | 1.46s |

The mobile gallery median wait after opening/scrolling to the gallery fell from
6.23s to 4.46s. The desktop gallery median wait fell from 6.64s to 2.30s.

These are local simulated-network results, not live CDN or physical-device
measurements. Small homepage timing differences are not evidence of a meaningful
regression. The original photos and AVIF/WebP quality settings are unchanged.

The selected full-resolution original did not finish within the ten-second
visible-image window on any of the five cold visits at either screen size, before
or after. Repeat visits completed in all five after-change runs at each size, but
the preceding interrupted download means those are not guaranteed fully cached
visits. Keep the loading indicator and do not promise instant original viewing.
No material visible-image completion regression was observed in the other warm
or cold scenarios. These results do not establish a general Core Web Vitals gain.

Timing samples preceded the final error-message styling and intermediate-width
layout corrections. Those corrections preserve image requests at the measured
390px/1440px widths and were checked separately by the browser regression suite.
