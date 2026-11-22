# fuxx-landing

The landing site for [fuxx](https://github.com/fitzfitz/fuxx-cli), live at <https://fuxx.fitzfitz.site>.

TanStack Start (React) on Vite, prerendered and served from a Cloudflare Worker.

```sh
pnpm install
pnpm dev          # local dev server
pnpm test         # unit tests
pnpm build        # fetches the latest fuxx release, then prerenders the page into dist/
pnpm test:build   # checks the prerendered page
pnpm deploy       # build + wrangler deploy
```
