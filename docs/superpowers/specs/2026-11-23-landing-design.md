# fuxx landing site — design

Date: 2026-11-23 · Repo: `github.com/fitzfitz/fuxx-landing` (new, public) · Live at: `https://fuxx.fitzfitz.site`

## Intent

A landing page for **fuxx** (`github.com/fitzfitz/fuxx-cli`), a native GPU macOS terminal for people who run AI
coding agents, and for its plugins. It should feel like the TanStack and Orca sites: techy, dark, fully animated,
sections that assemble as you scroll.

**Who lands here:** developers who already run AI coding agents (Claude Code, codex, agy, …).
**What they should do:** (1) **download the app**, (2) **star the repo**. Every section serves those two.

The site will later grow into the docs site (`/docs/*`); that is **not** part of this work, but the stack and
routing must make it a plain addition.

## Goals

- Pitch fuxx to agent-running devs and convert to Download + Star.
- Cover **every user-facing capability** of fuxx v0.12.6 (inventory below), not just the README (which is stale at
  v0.10.0).
- Present the plugin system and its current plugins honestly.
- Fully animated (GSAP + three.js/WebGL) yet light and smooth.
- Screenshots refresh with one command after each fuxx release.

## Non-goals

- The docs site (later; only leave room for `/docs`).
- Changing the fuxx-cli app or its repo (it is only read, and its `scripts/ui-shots.sh` is run).
- Analytics, newsletter, blog, pricing, accounts, i18n, a Windows/Linux story.
- Auto-deploy on push (later; manual `wrangler deploy` for now).
- Updating fuxx-cli's stale README (separate chore if wanted).

## Anti-goals (fail even if it works)

1. **It stutters.** Any jank on scroll, pinned sections that hitch, the hero dropping frames, fans spinning.
2. **It looks like a generic AI startup.** Banned: purple/blue gradients, glassmorphism cards, abstract blobs,
   sparkle/✨ AI icons, "10x your workflow" copy, stock 3D shapes, generic SaaS illustrations.

## Constraints

- **Stack (user's pick):** Vite + React + `@cloudflare/vite-plugin`, deployed to **Cloudflare Workers**.
  vinext was considered and rejected (SSR weight for a page with no server data; very new).
- **Framework layer (my call, verified in TanStack docs via Context7):** **TanStack Start** (React) on that Vite +
  Cloudflare plugin setup — Cloudflare is its official hosting partner; plugin order is
  `cloudflare({ viteEnvironment: { name: 'ssr' } })`, `tanstackStart({ prerender: { enabled: true } })`,
  `viteReact()`. File routes give `/` now and `/docs/*` later; the landing page is **prerendered to static HTML**
  so crawlers and link previews see real content. Builder must confirm current versions via Context7 /
  npm before installing (never trust remembered versions).
- **Animation libs (user's pick):** GSAP (+ ScrollTrigger) and three.js (WebGL). Builder may use
  `@react-three/fiber` or plain three.js — pick whichever keeps the bundle smaller and the render loop
  controllable (must be pausable).
- **Domain:** `fuxx.fitzfitz.site` as a Worker **custom domain** (`routes: [{ pattern: "fuxx.fitzfitz.site",
  custom_domain: true }]` in `wrangler.jsonc`). `fitzfitz.site` is already a Cloudflare zone; `wrangler` on this
  Mac is logged in to that account. If the OAuth token lacks the zone rights for the custom domain, stop and tell
  the user (they add it in the dashboard or re-login with more scopes) — don't work around it.
- **Package manager:** pnpm (installed). Node 26.
- **Local checkout:** next to the fuxx-cli checkout (so `../fuxx-cli` resolves).
- **Public repo:** no work-project names, no personal paths in any screenshot or copy. Grep the outgoing tree
  before every push.
- **No commit attribution trailers** (no Co-Authored-By lines) in this user's commits.
- **Build output** stays inside the project (`dist/`, `node_modules/`), never in a scratch folder.

## Approaches considered

| | Picked? | Why |
|---|---|---|
| **A. Vite + `@cloudflare/vite-plugin` on Workers, React** (with TanStack Start for routes + prerender) | ✅ user's pick (React because it becomes a docs site) | Small, mature, fits a static page; routes ready for docs |
| B. vinext 1.0 (Next.js API on Vite → Workers) | ✗ | SSR runtime for a page with no server data; 1.0 is weeks old |
| A-vanilla (no React) | ✗ | Smaller, but the site grows into docs; React pays off there |

Page structure options shown as mockups: **A** TanStack-style catalogue grid, **B** Orca-style single pinned story,
**C** hybrid — **user picked C**. Hero options: **A** neon sign, **B** agent constellation, **C** particles → app
window — **user picked A + B combined**. Screenshots: **ui-shots renders** (user's pick) over real window captures.
Plugins: **option A** (system first, samples as try-it cards, fuxx-completes as "coming soon").

## The page (top to bottom)

```
┌──────────────────────────────────────────────┐
│ ╭∩╮ fuxx    Features  Plugins  GitHub ★ n  ⤓ │ sticky header (Download + live star count)
├──────────────────────────────────────────────┤
│      · glyph field ·    ◉ amber "needs you"  │ 1 HERO
│   ◉        ╭∩╮  (neon)         ◉             │
│ Your not-so-friendly neighborhood CLI.       │
│ [ Download for macOS ]  [ ★ Star on GitHub ] │
├──────────────────────────────────────────────┤
│ "Three agents. Which one needs you?"         │ 2 THE PAIN
├───────────────────────┬──────────────────────┤
│ 1 Knows your agents   │  [render swaps       │ 3 PINNED STORY (5 chapters)
│ 2 Agent tabs & box    │   per chapter]       │
│ 3 Workspaces & panes  │                      │
│ 4 Your repo, live     │                      │
│ 5 Script it           │  [typed terminal]    │
├───────────────────────┴──────────────────────┤
│ Everything else (grid, every remaining cap)  │ 4 GRID
├──────────────────────────────────────────────┤
│ Plugins                                      │ 5 PLUGINS
│ Download + Star · install steps · footer     │ 6 CLOSE
└──────────────────────────────────────────────┘
```

### 1. Hero (user's pick: neon sign + agent constellation)

- A three.js scene: the **╭∩╮ mascot as a 3D neon glass tube** (bloom), which **flickers on like a sign** on load
  and tilts gently toward the cursor.
- Behind it, a **field of drifting terminal glyphs** (`$ claude`, `⇧⌘U`, `cargo test`, `✓`, `✗`, `▌` …) that
  part around the cursor.
- **Agents orbit the mascot as glowing status orbs** in the app's status colours (working / waiting / done).
  Every few seconds one orb turns **amber**, a ring pulses and a small "needs you" label appears — what fuxx does.
- Headline: the README's tagline "Your not-so-friendly neighborhood CLI." + one line: "A native, GPU-fast terminal
  for people who run AI coding agents and refuse to babysit them."
- Buttons: **Download for macOS** (primary; latest release zip URL) and **★ Star on GitHub** (with live count).
  Small print: version, "macOS 11+ · Apple Silicon + Intel".
- Scroll hands off: the hero scene recedes as the pain line comes in.

### 2. The pain

One line scrubbed in word by word ("You've got three agents going…"), from the README's voice. Short.

### 3. Pinned story — five chapters (my proposal, user accepted in playback)

GSAP ScrollTrigger pins the section; the left column steps through chapters, the right shows the matching render,
swapping with a short glitch/scanline transition. Each chapter: title, 2–3 lines of copy, 3–5 bullet capabilities
with shortcut keycaps.

| # | Chapter | Covers (inventory groups) | Visual |
|---|---|---|---|
| 1 | Knows your agents | A | `agent-sidebar-waiting`, `chrome-agent-status`, `chrome-notifications` |
| 2 | Agent tabs & the agent box | B | `agent-tab-working`, `agent-tab-review`, `agent-box-model-menu`, `agent-lanes-view`, `status-bar-usage` |
| 3 | Workspaces, panes, tabs | C | `window`, `cards-split`, `palette` |
| 4 | Your repo, live | D + live changes / ask from E | `changes`, `changes-commit`, `changes-graph`, `file-live-glow`, `ask-bar` |
| 5 | Script it (CLI + MCP) | I | **no scene exists** → an animated, typed terminal replay in HTML/CSS (see below) |

### 4. Everything-else grid

A dense, staggered grid of cards so the rest of the inventory is covered: groups **E** (code & markdown viewers),
**F** (browser), **G** (SSH & persistent sessions), **H** (terminal niceties), **J** (settings, plugins entry,
welcome, updates). Each card: icon-free mono title, one line, shortcut keycaps, and a small render where a scene
exists (`file-diff-cards`, `file-tab-md-reader-github`, `browser-tab`, `shell-cards`, `command-blocks`, `cursor`,
`tokens`, `welcome`, `update-button`; for Preferences use a non-plugins shot of the `preferences` scene).
**G has no scene** → a small typed-terminal replay
(`⇧⌘S` host picker → ssh → tmux) instead. Hover: neon edge glow, the render nudges.

### 5. Plugins (user's pick: option A)

- Lead with the **plugin system**: install from a GitHub link in Settings → Plugins; theme plugins; zsh helper
  plugins; plugin settings. **Visual: an HTML mock of Settings → Plugins** styled like the app, listing only the
  two real samples (`sunset-themes`, `hello-helper`) with a settings switch row (user's call). Do **not** use the
  ui-shots `preferences-plugins` renders: their fixture shows invented plugins, incl. an installed ghost-text
  "Sparkle" that would contradict "fuxx-completes — coming soon".
- **Try it** cards for the samples `fitzfitz/fuxx-sunset-themes` and `fitzfitz/fuxx-hello-helper`, each with a
  copy-the-link button.
- **fuxx-completes — coming soon**: an animated ghost-text demo (grey suggestion completing `git push origin …`,
  then the numbered list) clearly labelled "coming soon", linking its repo.
- **Write your own**: a short `fuxx-plugin.conf` snippet (from the README) with copy button.

### 6. Close

Download + Star again, the 3-step install (unzip, drag to Applications, Open Anyway once — from the README),
"updates itself after that", footer (GitHub, releases, "Built with Rust and chaos", ╭∩╮).

### Typed terminal replays (for capabilities with no scene)

A small React component that types a scripted session in a fake terminal styled like fuxx (same font, colours):
used for chapter 5 (`fuxx new --preset claude --split right` → `fuxx wait s4` → `fuxx question s4` →
`fuxx answer s4 "yes"`, plus `claude mcp add fuxx -- fuxx mcp`) and the SSH card. Text only (cheap, crisp, no
images); starts when scrolled into view, shows the final state instantly under reduced motion.

## Capability inventory (fuxx v0.12.6, from the vault's milestone notes)

Supported agents: chat-style agent tabs for **Claude Code** and **agy (Antigravity)**; built-in presets claude,
agy, opencode, codex (+ custom); status detection works for **any CLI agent** in a terminal.

- **A. Agent awareness** — live status (working / waiting / done / idle) on avatar, tab, status bar and cursor
  colour; a waiting agent's question in the sidebar with Open; native banners that open the right terminal; bell
  list + Activity log; ⇧⌘U to the longest-waiting agent; banners name the command that finished and how
  ("`cargo test` · Failed (exit 101) after 40s").
- **B. Agent tabs & chat** — streamed Markdown chat, tool rows with a detail modal, todo list, Allow / Allow all
  edits / Deny cards, Stop / Force stop; top bar with status pill, per-turn cost, context meter; agent box with
  folder/branch chips, model menu + effort, permission mode, `+` attach file/image, `/` commands & skills, `@`
  files & subagents; pasted images as pills with a viewer; drag a shell block onto an agent tab; subagents pill
  row (⌥⌘[ / ⌥⌘]); live usage strip with reset time.
- **C. Workspaces, panes, tabs, sidebar** — split panes (⌘D / ⇧⌘D, ⌥⌘arrows); pill tab bars mixing terminals,
  agent tabs, files and web pages; drag anything anywhere; avatars, groups, pins, rename (⌘R), ⌘1–9; ⌘K search
  everything, ⌘P workspace jump; floating card layout, light & dark; full restore after restart.
- **D. Repo** (⌥⌘\) — Files tree following the active file, preview tabs; Changes (staged/unstaged) with a branch
  bar (Fetch / Pull / Push / Publish); commit with ⌘↵ and ✦ agent-written messages; branch switcher with conflict
  warnings; commit graph with lanes and "Open on GitHub".
- **E. Code & Markdown viewers** — read-only tabs, syntax colours, File | Diff | Preview, ⌘F, wrap; sticky scope,
  breadcrumb, folding, jump between changes; review-card diffs with word marks + side-by-side; live changes glow
  with who-changed-it and "Follow claude"; select lines → ⌘↵ asks the agent, agent's edit reasons as notes;
  Markdown reader with outline, callouts, code copy, Mermaid.
- **F. Browser** — web tabs (⇧⌘B), click a `:3000` port to open it; agents drive it (`fuxx browser …`, MCP).
- **G. SSH & persistent sessions** — ⇧⌘S host picker from `~/.ssh/config`, your own ssh, reconnects, optional
  tmux on the host; opt-in keep-running-after-quit.
- **H. Terminal niceties** — GPU terminal on alacritty (scrollback, links, ligatures, Nerd Font icons);
  chat-style shell cards with Copy / Rerun; command blocks (⇧⌘↑ / ⇧⌘↓, ⇧⌘C); gliding, breathing cursor with comet
  trail or sparks; key sounds; themes with live preview; idles at low CPU.
- **I. Scripting** — `fuxx` CLI (ls, new, wait, question, answer, events, note, progress; agent tabs as `aN`);
  `fuxx mcp`.
- **J. Settings, plugins, onboarding, updates** — Preferences panel (⌘,); plugins from a GitHub link (themes, zsh
  helpers, plugin settings); Welcome screen; Help menu + ⌘/ shortcut list; one-click Update Available.

Copy for every item is the builder's to write, in the README's voice, checked against this list. Nothing
claimed on the page may go beyond it.

## Screenshots (user's pick: ui-shots renders, kept light)

- Source: fuxx-cli's `scripts/ui-shots.sh --png` (off-screen renders with fixture data; output in
  fuxx-cli's `target/ui-shots/`). Path to the fuxx-cli checkout comes from an env var / argument
  (default `../fuxx-cli`). **Note (builder check):** `ui-shots.sh` takes one *substring* filter, not a list, and
  some scenes save several shots (e.g. the `preferences-plugins` scene). So `sync-shots` runs ui-shots once
  unfiltered (or once per exact scene) and then **picks shot files by exact name** from the manifest. Use the
  dark (Catppuccin Mocha) renders only.
- `scripts/sync-shots.(sh|mjs)` in fuxx-landing: reads the shot list from one manifest file
  (`shots.manifest.json`: shot file → output name, alt text, display width), then converts each to **AVIF + WebP
  fallback** at most 2× display width, target **≤ 120 KB each**, writes them to `public/shots/`, and prints sizes.
  Committed images, not generated at deploy.
- Every image: explicit width/height (no layout shift), `loading="lazy"` except the first story frame,
  descriptive alt text.
- If the user meant "don't show them big" (display size) rather than file size: keep renders at a modest display
  size inside a styled fuxx-window frame (my call either way: modest display size).
- After syncing, eyeball every image for anything personal (paths, names) before committing.

## Look & feel (guards anti-goal 2)

- Near-black background, the brand's **neon green ╭∩╮** (assets in fuxx-cli `assets/logo/3d-cyber/`), mono type
  for headings and UI (a free mono with good weights; builder's choice), a clean sans only for body if needed.
- The only extra colours are fuxx's **agent status colours** (working / waiting / done), hard-coded from the
  Catppuccin Mocha theme values in fuxx-cli `src/theme.rs` (status colours are theme-derived in the app; my call).
- Shortcuts rendered as keycaps; renders sit in a minimal fuxx window frame.
- Subtle CRT texture allowed (scanlines on transitions), never a full-screen effect that hurts readability.
- Copy: the README's snarky, plain voice. No buzzwords.

## Performance budget (guards anti-goal 1)

- 60 fps scroll and hero on a base Apple Silicon MacBook Air in Chrome and Safari.
- **One** WebGL canvas, lazy-loaded after first paint (text + buttons render without it); render loop **pauses**
  when the hero is off-screen or the tab hidden; `devicePixelRatio` capped (≤ 1.5–2); bloom at reduced
  resolution.
- GSAP animates transforms and opacity only; no layout-thrashing properties.
- Initial JS (excluding the lazily loaded three.js chunk) kept small; Lighthouse performance ≥ 90 on mobile.
- **`prefers-reduced-motion`**: static hero (lit neon, still orbs), no pinning, story chapters stack, replays show
  final state.
- **Phones**: lighter hero (fewer glyphs/orbs, no bloom if needed), story chapters stack instead of pinning,
  no horizontal scroll.
- Verification: Chrome DevTools performance trace of a full scroll + Lighthouse, numbers reported.

## Data at build / run time

- **Build time:** latest release from the GitHub API (`fitzfitz/fuxx-cli`): version and the `fuxx-<version>.zip`
  asset URL for the Download button. If the API call fails, fall back to
  `https://github.com/fitzfitz/fuxx-cli/releases/latest`.
- **Run time (browser):** star count from the GitHub API, cached in `sessionStorage`; the button works without it.

## Repo and deploy

- **Repo (user's call):** the builder creates `fitzfitz/fuxx-landing` (public, empty) with `gh`, commits locally
  while building, and **pushes once at the end** — only after (1) a grep of the whole tree for work-project
  names and personal paths comes back clean, and (2) the user has seen the deployed site. No pushes before that.
- `wrangler.jsonc` with the custom domain route above; `pnpm deploy` = build + `wrangler deploy`.
- First deploy done by the builder from this Mac; verify `https://fuxx.fitzfitz.site` serves the prerendered HTML.

## Left to the builder

Exact copy, font choice, three.js vs R3F, shader details, transition style between story frames, component
structure, test approach for the non-visual bits (manifest parsing, release-data fallback), the exact scene per
card where the inventory lists alternatives.
