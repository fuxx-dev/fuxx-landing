# Level-up: Lucide icons, a first-load intro, GSAP + Motion (design, 2026-11-25)

Your words: "trace anything that can be replaced by lucide icons, replace it. make it great and awesome. add
more animation to the website on first open (refresh counts). add gsap and motion.dev to level up 100x our ui
and user experiences and the animations, effects and also transitions!" — then "all great!" on the outline.

## Goals

1. **Lucide everywhere an icon is faked with a character** (`lucide-react`): the buttons (⤓ Download,
   ★ Star, → arrows, the copy ✓), the Plan demo (☰ ↗ ▾ ✓ ⏎), the plugin list's › bullets, plus a small icon
   beside each chapter title, grid card title and the header nav. Keyboard legends (⌘ ⇧ ⌥ ⌃ in `Keys`)
   stay text: they are what's printed on the keys.
2. **A first-load intro on every load and refresh** (~1.8 s, GSAP timeline): the header slides down; the
   fuxx mark (today the text `╭∩╮`, made an SVG `LogoMark`) draws its stroke (DrawSVG); the kicker types; the
   headline rises char by char (SplitText, masked); the lede fades up; the buttons spring in; the hero
   stage fades and scales in; the "needs you" ping fires. Scrolling or a key cuts it to its end.
3. **Motion (`motion/react`) for interaction and transitions:** springy hover/press on buttons; cards lift
   and tilt toward the pointer with a glow that follows it; the chapter nav's active pill slides
   (`layoutId`); chapter text swaps with a crossfade and slide (`AnimatePresence`); the Plan demo's steps
   enter and leave; grid cards stagger in (`whileInView`); the star count counts up; a thin scroll-progress
   bar under the header (`useScroll` + `useSpring`).
4. **GSAP scroll choreography:** section titles reveal word by word on arrival (SplitText, masked), the
   Pain section's words scrub in, the story's window drifts with a light parallax.

## Non-goals / anti-goals

- No new sections or copy claims (the inventory/coverage rules stand).
- Nothing that janks scrolling: transform and opacity only, no layout animation on scroll.
- No motion for reduced-motion users: every effect off, final states shown (`MotionConfig reducedMotion="user"`
  plus the existing `prefersReducedMotion()` checks for GSAP).
- No icon library besides Lucide; no animation library besides GSAP and Motion.

## Constraints

- GSAP 3.15.1 (SplitText and DrawSVG are free and ship in `gsap`); Motion from `motion` (import
  `motion/react`); Lucide from `lucide-react` (icons `aria-hidden` by default). Checked on Context7.
- Text stays 11 px and up. Tests stay green (`pnpm test`, `pnpm test:build`). The JS bundle may grow by
  Motion's size; the build's report is checked and noted.

## Approaches

One sensible split, your pick of both libraries: **GSAP owns time-based choreography** (the intro timeline,
SplitText, DrawSVG, ScrollTrigger scrubs, already the page's engine); **Motion owns component state**
(hover/press/tilt springs, layout pills, enter/exit presence, in-view staggers, scroll progress). Rejected:
all-GSAP (state-driven exits and layout pills are clumsy in it) and all-Motion (no SplitText/DrawSVG, and the
story's ScrollTrigger pinning already works).
