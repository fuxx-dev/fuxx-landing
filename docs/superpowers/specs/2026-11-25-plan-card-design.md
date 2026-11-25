# The Plan card on the page (design, 2026-11-25)

Your picks: "add the plan card screenshot and make it rich and make the animation rich as well",
then "both" (real renders and a live demo), then "go ahead".

## What

- **A. Real renders.** Three fuxx-cli ui-shots scenes with a realistic plan ("Retry against the current
  endpoint": context, steps, a code sketch, risks, verification): `agent-plan-waiting` (the card and its
  answers), `agent-plan-reading` (a long plan opened: outline chips, the answers pinned over the box),
  `agent-plan-approved` (folded to "Approved · auto-accept edits ✓", the mode on Accept edits, edits and a
  test running). On the page: a new chapter 05, "Plan first, then build", playing the three in turn, with
  `b-plan-card` and `b-plan-progress`.
- **Richer chapter motion (every chapter).** The incoming shot rises out of a slight blur; the shown one
  zooms slowly (6 % over 9 s) toward its focus point, the shot list's optional `focus` (fractions of the
  shot; the centre by default). Off under reduced motion (the pinned layout already is).
- **B. A live Plan card** (grid card "Plan Mode, live", `demo: 'plan'`, `PlanDemo`): the plan streams in,
  folds, a pointer opens it and approves it, the card folds to one line, the mode chip flips to Accept
  edits and an edit row lands; then it loops. Catppuccin Mocha, text 11 px and up, starts in view, the
  approved card at once under reduced motion. The pointer is measured onto its targets.

## Calls made while building

- The chapters must fit the pinned box (640 px at 900 px high): "Undo, and a second thought" (`c-undo`,
  `c-close-confirm`) became a grid card and `a-unseen-dot` joined "Whatever you missed", so no chapter grew.
- A shot taller than the frame fits whole (`.story__drift picture { display: contents }`).
- The approved scene's turn numbers its calls after the planning turn's (a shared id had finished the
  wrong call).
