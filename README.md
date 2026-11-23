# fuxx-landing

The landing site for [fuxx](https://github.com/fitzfitz/fuxx-cli), the terminal for people who run AI coding agents.
Live at <https://fuxx.fitzfitz.site>.

TanStack Start (React) on Vite 8 with the Cloudflare Vite plugin: the page is prerendered to static HTML and served
from a Cloudflare Worker. GSAP drives the scroll choreography; the hero is a lazily loaded three.js scene with a
static SVG fallback (no WebGL, or reduced motion).

## Develop

```sh
pnpm install
pnpm dev          # local dev server
pnpm test         # unit and component tests (vitest)
pnpm typecheck
pnpm build        # fetches the latest fuxx release, then prerenders into dist/
pnpm test:build   # checks the prerendered page (titles, links, image attributes)
```

## Screenshots

The images in `public/shots/` are fuxx's own off-screen renders. After a fuxx release:

```sh
(cd ../fuxx-cli && scripts/ui-shots.sh --png)   # renders every screen into fuxx-cli/target/ui-shots/
pnpm sync-shots                                  # picks the ones in shots.manifest.json → AVIF + WebP ≤ 120 KB
```

`shots.manifest.json` maps a render to a site image (with alt text, display width and an optional crop). Look at
every image before committing: renders must not show personal paths or real repository history.

## Content

Every capability the page claims lives in `src/content/inventory.ts`; `tests/coverage.test.ts` fails if one isn't
shown, or if the page shows one that isn't listed.

## Deploy

```sh
pnpm deploy       # build + wrangler deploy (Worker "fuxx-landing", custom domain fuxx.fitzfitz.site)
```
