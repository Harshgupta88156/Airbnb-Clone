# Prompt log

The prompts that drove this build, in order. The lead agent was Claude Code (Opus). The three
reviewers ran as parallel sub-agents (Sonnet), each set up by its file in `.claude/agents/`.

## 1. The brief (from me)

> [attached: Playpower_Labs_Assignment__Airbnb-Clone_App_1.docx]
>
> Act as a Senior Software Engineer. I am completing a take-home technical assignment for Playpower and need to submit an exceptional solution to get shortlisted for the interview round.
> Below, I will provide the complete documentation, scenario, and requirements for the assignment.
> Your Objective: Design and write the optimal, production-ready solution for this assignment based on the provided details.
> Strict Coding Style Constraints (Human-like Code):
>
> - No AI Boilerplate: Avoid robotic, generic comments (e.g., do not write trivial docstrings like "This function loops through the array"). Only write comments to explain why a specific architectural decision or complex piece of business logic was used.
> - Natural Naming & Flow: Use highly descriptive, natural-sounding variable and function names. Write idiomatic code that feels organic to the chosen tech stack.
> - Practical Architecture: Structure the code cleanly and modularly. Handle real-world edge cases gracefully, but avoid over-engineering with unnecessary abstractions or design patterns if they aren't warranted.
> - Imperfections are Okay: The code should look like it was written by a talented human developer, not an AI trying to be academically perfect. Focus on readability, maintainability, and efficiency.
>
> Execution Steps:
>
> 1. Analyze: Carefully review the assignment details provided below.
> 2. Clarify First: Before writing any code, assess the entire scenario and ask me any clarifying questions you have regarding edge cases, missing parameters, or expected behaviors.
> 3. Execute: Once I answer your questions, provide the complete, structured solution.

## 2. Clarifying questions → answers

Before writing any code, the agent read the assignment, inspected the reference and asked four
multiple-choice questions. My answers:

| Question                             | Answer                                                 |
| ------------------------------------ | ------------------------------------------------------ |
| Which stack?                         | Next.js + TypeScript                                   |
| Is a backend needed?                 | None: typed data + localStorage                        |
| How should the AI workflow be shown? | Real sub-agents + their config files + this prompt log |
| Where should the project live?       | A new folder on my laptop                              |

A follow-up asked permission to download the reference's photos and font as a zip. My answer:
"Yes, download it."

## 3. How the lead agent worked

The brief stayed the only instruction. The agent split the work into tracked tasks and kept to
the rules in `AGENTS.md`:

1. **Inspect the reference without reading its source.** The `reference-inspection` skill
   (`probe.js`) measures rendered text (canvas fitting for size, weight and letter-spacing),
   reads box geometry from rects, and times transitions with `document.getAnimations()`. It
   also captures lossless screenshots at 13 scroll positions. Every number lives in the
   agent's spec notes before any CSS is written.
2. **Scaffold.** Next.js 16 app, design tokens, typed listing data, `CLAUDE.md`/`AGENTS.md`,
   sub-agent configs, skills, and the format-on-write hook.
3. **Build section by section,** then the gallery: URL state, Photo tour, Lightbox, Dialog.
4. **Parity loop** (`visual-parity` skill): capture, then `pixelmatch` diff, then fix. This
   loop found and fixed:
   - the review score's 159px line box
   - the rating columns needing `fr` tracks, not flex
   - the review-chip row clipping at the content edge
   - the lightbox image not fitting the stage
   - the calendar weekday offset
   - the review date spacing
   - the price suffix gap and the "Reviews" link underline
   - capture widths per scene
5. **Tests:** Playwright behaviour specs and axe scans (`tests/e2e`). Two real bugs surfaced
   and were fixed: stacked dialogs could inert each other when a shared link opened both, and
   two scrollable regions couldn't be reached by keyboard.
6. **Parallel reviews** by the three sub-agents below. Their findings were applied, and the
   checks were rerun.
7. **Architecture diagram and docs.**

## 4. Sub-agent prompts (verbatim)

### code-reviewer

```text
You are the `code-reviewer` sub-agent for the project at /home/claude/airbnb-listing-clone (Next.js 16 App Router + TypeScript + CSS Modules clone of an Airbnb listing page). First read /home/claude/airbnb-listing-clone/.claude/agents/code-reviewer.md and follow its method and output format exactly; also read AGENTS.md for the conventions you review against.

Scope: everything under src/ plus tests/e2e and scripts/parity. Report-only: do NOT edit any file.

Focus on, in this order:
1. Real bugs: state/effect mistakes, stale closures, hydration mismatches, history/URL handling in src/components/gallery/GalleryProvider.tsx, focus/inert handling in src/components/ui/Dialog.tsx, scroll lock counting, keyboard handling in the calendar and lightbox.
2. Accessibility defects visible in code (missing labels, wrong roles, focus traps).
3. Convention violations from AGENTS.md: comments that restate code or read as AI boilerplate, unnatural names, abstractions that aren't earned, inline styles that aren't runtime values, dead code, unused exports/CSS classes.
4. Anything that makes the code read as machine-generated rather than written by a thoughtful senior engineer.

For every finding give file:line, severity (bug / a11y / convention / nit), the concrete problem, and the smallest fix. Verify each finding by reading the code; do not report speculative issues. Keep the report under 700 words, most severe first.
```

Result: no bugs. It flagged one fragile spot: `Dialog` removing an entry at index `-1`. A guard
was added.

### a11y-auditor

```text
You are the `a11y-auditor` sub-agent for the project at /home/claude/airbnb-listing-clone (Next.js clone of an Airbnb listing page with a Photo tour dialog, a Lightbox dialog, an amenities dialog, a working availability calendar, a sticky section nav and a nearby-stays carousel). First read /home/claude/airbnb-listing-clone/.claude/agents/a11y-auditor.md and follow its method and output format. Report-only: do NOT edit any source file.

A production build is already running at http://localhost:3100. Playwright + @axe-core/playwright are installed in the project. Chromium is at /opt/pw-browsers/chromium-1194/chrome-linux/chrome (pass it as executablePath / set PW_CHROMIUM_PATH). The existing suite runs with:
  cd /home/claude/airbnb-listing-clone && BASE_URL=http://localhost:3100 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx playwright test
Run it, then go beyond it: write throwaway Playwright scripts under /tmp (not in the repo) to walk the page with the keyboard only (Tab order through header, section nav, gallery buttons, calendar grid with arrow keys, booking card, carousel), open/close each dialog by keyboard, check focus return, check that inert/aria-hidden content is not reachable, check the calendar's grid semantics and announcements, check reduced-motion behaviour, check colour contrast of secondary text, and check heading outline (h1→h2→h3).

Report concrete defects only, each with: where (file:line if you can map it, else selector), WCAG criterion, what a user experiences, and the smallest fix. Mark each as blocker / serious / minor. Under 600 words.
```

Result: 17/17 tests pass, and axe found no serious violations. Actions taken:

- The tour's room-chip scroll ignored reduced motion. Fixed: all script-driven scrolls now go
  through `preferredScrollBehavior()`.
- The calendar uses `aria-pressed` where `aria-selected` would be more conventional. Noted as
  minor.
- Booked days have low contrast. Kept for parity: WCAG exempts disabled controls, and the days
  are announced as "not available".

### visual-parity-reviewer

```text
You are the `visual-parity-reviewer` sub-agent for the project at /home/claude/airbnb-listing-clone. First read /home/claude/airbnb-listing-clone/.claude/agents/visual-parity-reviewer.md and /home/claude/airbnb-listing-clone/.claude/skills/visual-parity/SKILL.md and follow them. Report-only: do NOT edit any source file.

Inputs already on disk:
- parity/reference/*.png — reference screenshots (Windows Chrome, 1366x543 window; page scenes are laid out at 1351px because of the classic scrollbar, overlay scenes tour-top/lightbox-01 at 1366px).
- parity/current/*.png — the clone captured by headless Linux Chromium at the same layout widths and scroll offsets.
- parity/diff/*.png and parity/report.json — pixelmatch output.

Known, accepted noise (do not report): text anti-aliasing/hinting differences between Windows and Linux, emoji glyph differences, photo resampling differences inside images, focus ring on the tour's Back button in the deep-linked capture, the tour content being ~7px right in tour-top because headless Chromium's overlay scrollbar takes no width.

Your job: find real geometry/style deltas — element positions, sizes, spacing, border radii, colours, missing or extra elements, wrong icons, wrong font weight/size. Use Python + PIL (installed) to measure: crop matching regions from reference and current, find edges/bounding boxes of elements, compare row/column positions of text bands and borders. Look at every scene. For each real delta give: scene, element, reference measurement vs clone measurement in px, and the most likely CSS cause/fix (you may read the CSS modules under src/components to point at the exact rule). Rank by visual impact. Under 600 words.
```

Result: no real geometry or style differences. The lightbox scene showed a focus ring left by
the capture itself, so the capture script now clears focus before overlay screenshots.
