# Level-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lucide icons for every faked icon, a GSAP first-load intro on every load, and Motion-driven interaction and transitions across the page.

**Architecture:** GSAP keeps time-based choreography (intro timeline, SplitText, DrawSVG, ScrollTrigger); Motion (`motion/react`) handles component state (springs, `layoutId`, `AnimatePresence`, `whileInView`, scroll progress). One `MotionConfig reducedMotion="user"` at the root; GSAP effects keep their `prefersReducedMotion()` guards. Icons come from `lucide-react` through one `Icon` wrapper so size and stroke are uniform.

**Tech Stack:** React 19, TanStack Start, Vite, GSAP 3.15.1 (+ SplitText, DrawSVG), motion, lucide-react, vitest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-25-motion-level-up-design.md`

## Global Constraints

- Every effect off under `prefers-reduced-motion: reduce`; the page renders its final state.
- Animate only transform, opacity and filter; nothing scroll-linked changes layout.
- Text 11 px and up; icons are decorative (`aria-hidden`, Lucide's default); every button keeps its text label.
- `pnpm test` and `pnpm test:build` green after every task; commits use the repo's own email.
- Node 26 for tests (`~/.local/share/fnm/node-versions/v26.8.1/installation/bin`).

## Review Focus

1. **Reduced motion:** the intro, SplitText, tilt, pills and progress bar must leave the final, readable state (no text stuck at opacity 0). → Task 2 and Task 3 tests.
2. **SSR / first paint:** the server-rendered HTML must be readable without JS (headline not hidden until JS runs). → Task 2's `the headline is readable before the intro runs` test.
3. **Intro cut short:** a scroll or key during the intro jumps it to its end, never leaving half-split text. → Task 2 test.
4. **The pinned story still fits:** chapter icons must not push a chapter past its box (the `chaptersFit` fallback). → Task 3 checks it in the browser at 1440×900 and 1280×800.
5. **Bundle size:** note the client JS before and after; Motion's cost recorded in the commit.

---

### Task 1: Lucide icons and the SVG logo mark

**Files:** Create `src/components/Icon.tsx`, `src/components/LogoMark.tsx`. Modify `DownloadButton.tsx`, `StarButton.tsx`, `CopyButton.tsx`, `Header.tsx`, `Close.tsx` (steps' arrows, footer mark), `Plugins.tsx` + `plugins.css` (› bullets), `PlanDemo.tsx`, `src/content/chapters.ts` + `grid.ts` (an `icon` name each), `Story.tsx` + `Grid.tsx` (draw it). Add `lucide-react` (Context7-checked).

**Interfaces:** `Icon({ name, size = 16 })` renders a Lucide icon from a fixed `ICONS` map (`download, star, arrowRight, check, copy, externalLink, chevronDown, chevronRight, cornerDownLeft, listChecks, brain, activity, bot, messagesSquare, layoutPanelLeft, folderGit2, squareTerminal, …`), `strokeWidth 1.75`. `LogoMark({ draw? })`: the `╭∩╮` mascot as an SVG path (from `src/hero/mascot.ts`), `currentColor` stroke, class `logo-mark__path` for the intro to draw. `Chapter.icon` and `Card.icon` are `keyof typeof ICONS`.

- [ ] Step 1: tests — `Icon.test.tsx`: renders an `<svg aria-hidden="true">` for `download`; `LogoMark.test.tsx`: one `<path class="logo-mark__path">`; a content test: every chapter and grid card names an icon in `ICONS`. Run → FAIL.
- [ ] Step 2: implement the wrapper and mark, swap every glyph listed in Files (keys stay text), add chapter/card icons. Run → PASS; `pnpm test`, `pnpm build`.
- [ ] Step 3: commit `Lucide icons for every faked icon, and the fuxx mark as SVG`.

### Task 2: The first-load intro (GSAP)

**Files:** Create `src/lib/intro.ts` (the timeline, pure-ish), `src/lib/gsap.ts` (register `SplitText`, `DrawSVGPlugin`). Modify `Hero.tsx`, `Header.tsx`, `hero.css`, `header.css`.

**Interfaces:** `playIntro(root: HTMLElement, opts: { reduced: boolean }): { cut(): void; revert(): void }` — builds one `gsap.timeline` (~1.8 s): header `y: -100% → 0`; `.logo-mark__path` `drawSVG: 0 → 100%`; kicker typed (SplitText chars, stagger 0.012); `.hero__title` SplitText `type: "chars,lines", mask: "lines"`, chars `yPercent 110 → 0`, stagger 0.018, `expo.out`; lede `y 16, autoAlpha 0 → in`; CTA buttons in from `scale 0.9` (`back.out(2)`); `.hero__stage` `autoAlpha 0, scale 1.06 → 1`; ping last. `cut()` = `progress(1)`; reduced → returns immediately, nothing hidden. The headline is visible in SSR HTML; the hiding happens only inside the timeline's `from` (set on mount, before paint via `useLayoutEffect`).

- [ ] Step 1: tests — `intro.test.ts` with a jsdom root: reduced → no element has `opacity: 0` / `visibility: hidden` afterwards; `cut()` → timeline progress 1 and SplitText reverted (headline `textContent` intact); `the headline is readable before the intro runs` (render Hero on the server via `renderToString`: the title text is present, no inline hidden style). Run → FAIL.
- [ ] Step 2: implement; wire in `Hero` (`useLayoutEffect`), cut on first `wheel`/`touchmove`/`keydown`. Run → PASS; build.
- [ ] Step 3: browser check (Playwright, 1440×900): screenshots at 0.2 s, 0.8 s, 2 s after load; and with reduced motion emulated. Commit `A first-load intro: the mark draws, the headline rises, the stage arrives`.

### Task 3: Motion for interaction and transitions

**Files:** Add `motion` (Context7-checked). Create `src/components/MotionRoot.tsx` (`MotionConfig reducedMotion="user"`), `src/components/ScrollProgress.tsx`, `src/components/TiltCard.tsx`, `src/lib/count.ts`. Modify `src/routes/__root.tsx` or `index.tsx` (wrap), `buttons.css`, `Story.tsx` (nav pill `layoutId`, chapter text `AnimatePresence`), `Grid.tsx` (cards → `TiltCard`, `whileInView` stagger), `StarButton.tsx` (count-up), `PlanDemo.tsx` (steps via `AnimatePresence`).

**Interfaces:** `TiltCard({ children, className })`: `motion.article` with `whileHover={{ y: -4 }}`, rotateX/Y from pointer (±4°, spring 300/30), a radial glow at the pointer via a CSS var `--gx/--gy`. `ScrollProgress()`: fixed 2 px bar under the header, `scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })`. `countUp(from, to, ms)` pure easing steps for the star count (`count.test.ts`). Buttons: `motion.a` `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.97 }}`.

- [ ] Step 1: tests — `count.test.ts` (eases to the exact target, monotonic); `TiltCard.test.tsx` (renders children; with reduced motion no transform style); Story nav still one active button; PlanDemo still reaches "approved". Run → FAIL where new.
- [ ] Step 2: implement. Run → PASS; build; note the client JS size before/after.
- [ ] Step 3: browser check: hover a grid card (tilt + glow), click two chapter nav buttons (the pill slides), scroll (progress bar), and confirm every chapter still fits at 1440×900 and 1280×800. Commit `Motion: springs, tilt and glow, a sliding chapter pill, presence transitions, scroll progress`.

### Task 4: GSAP scroll choreography

**Files:** Create `src/lib/reveal.ts`. Modify `Pain.tsx`, `Story.tsx`, `Grid.tsx`, `Plugins.tsx`, `Close.tsx` (section titles), `story.css`.

**Interfaces:** `revealTitles(scope: Element)`: every `.section-title` / `.close__title` gets `SplitText.create(el, { type: "words,lines", mask: "lines", autoSplit: true, onSplit: self => gsap.from(self.words, { yPercent: 100, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } }) })`; reduced → no-op. Pain words scrub `opacity 0.15 → 1` along the section. Story frame parallax `y: 24 → -24` scrubbed while pinned.

- [ ] Step 1: tests — `reveal.test.ts`: reduced → no split, titles untouched; otherwise one SplitText per title and `revert()` restores the text. Run → FAIL.
- [ ] Step 2: implement and wire. Run → PASS; build.
- [ ] Step 3: browser check down the whole page; commit `Section titles reveal by word, the pain line scrubs in, the story window drifts`.

### Task 5: Section polish

Your words: "what about sections?" … "yes, add it and start building". Per section, on top of Tasks 1–4:

- **Header:** the nav's Features/Plugins get icons and a hover pill that slides between them (`layoutId`); after
  the first 40 px of scroll the header compacts (smaller padding, a `backdrop-filter: blur` fill), the progress
  bar on its bottom edge.
- **Hero:** the two CTA buttons are magnetic (they lean up to 6 px toward a near pointer, spring back; a
  `useMagnet(ref, strength)` hook); a soft spotlight (radial gradient at the pointer, CSS vars) over the hero.
- **Pain:** the "Which one needs you?" dot ends on a ping (a ring scaling out and fading, every 2.4 s).
- **Story:** shot dots in the window's title bar (one per shot of the active chapter, the current one lit).
- **Plugins:** the plugin cards tilt like the grid's (`TiltCard`); a typed demo: a GitHub link types into a
  field shaped like Settings → Plugins, then a ✓ (Lucide `Check`) appears; starts in view, final state under
  reduced motion.
- **Close:** the mark draws when it scrolls in (`LogoMark` + DrawSVG on ScrollTrigger); the three install steps
  get icons (`Download`, `Archive`, `ShieldCheck`) and stagger in; the download button is magnetic; footer
  links get icons.

**Files:** Create `src/lib/magnet.ts` (`useMagnet`), `src/components/LinkTypeDemo.tsx`. Modify `Header.tsx` +
`header.css`, `Hero.tsx` + `hero.css`, `Pain.tsx` + `pain.css`, `Story.tsx` + `story.css`, `Plugins.tsx` +
`plugins.css`, `Close.tsx` + `close.css`.

- [ ] Step 1: tests — `magnet.test.ts` (the offset is capped at the strength and 0 beyond the reach; reduced
  motion → always 0); `LinkTypeDemo.test.tsx` (reduced → the full link and ✓ at once; in view → types to the
  end); Story renders one dot per shot of the active chapter. Run → FAIL.
- [ ] Step 2: implement. Run → PASS; build.
- [ ] Step 3: browser check per section; commit `Section polish: a compacting header, magnetic buttons, a spotlight, the pain ping, shot dots, the plugin link demo, the install steps`.

### Task 6: Ship

- [ ] Full `pnpm test` + `pnpm test:build`; the browser pass at 1440×900, 1280×800 and 390×844 (phone), plus reduced motion; delete the check screenshots.
- [ ] One whole-branch review (fresh reviewer, most capable model) against this plan and the spec; one fix wave.
- [ ] Privacy grep; commit; push; `pnpm ship`; confirm the live page.
