<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Airbnb listing clone — agent guide

Pixel-faithful rebuild of one Airbnb listing page plus its Photo tour and Lightbox overlays.
The deployed reference (https://airbnb-clone-umber-two.vercel.app) is the single source of truth
for layout, typography, colour, motion and interaction.

## Commands

| Task                      | Command                                    |
| ------------------------- | ------------------------------------------ |
| Dev server                | `npm run dev`                              |
| Types / lint / format     | `npm run check`                            |
| Production build          | `npm run build`                            |
| Behaviour + a11y tests    | `npm run test:e2e` (needs a running build) |
| Capture clone screenshots | `npm run parity:capture -- --url <url>`    |
| Diff against reference    | `npm run parity:diff`                      |

## Layout of the code

- `src/app` — route, root layout, global tokens (`globals.css`), self-hosted Cereal font.
- `src/data` — typed listing content. Components keep only UI chrome strings (button labels, headings).
- `src/components/<area>` — one folder per page area, each component with its own CSS module.
- `src/components/gallery` — Photo tour, Lightbox and the URL-synced gallery state.
- `src/components/ui` — primitives shared across areas (Dialog, Toast, icons).
- `src/hooks`, `src/lib` — small, dependency-free helpers.
- `parity/reference` — reference screenshots (1366×543 viewport) used for visual diffs.

## Conventions

- Server components by default; add `"use client"` only on the leaf that needs state or effects.
- Styling is CSS Modules + the custom properties in `globals.css`. No inline styles except for
  values computed at runtime. Measured one-off pixel values are fine — they came from the reference.
- Comments explain _why_ (a measured quirk, a browser workaround, an a11y decision). Never restate
  what the code does, never add JSDoc boilerplate.
- Names read like prose: `openPhotoTour`, `isSaved`, `nightsBetween`. No `data`, `item`, `handleClick2`.
- Keep abstractions earned: a helper exists because two call sites need it, not "just in case".

## Accessibility bar

- Every interactive element is a real `button` or `a`. Icon-only controls get an `aria-label`.
- Dialogs move focus in on open, trap Tab, close on Escape and restore focus to the trigger.
- Focus is visible via `:focus-visible` rings; hover-only affordances need a keyboard equivalent.
- Motion respects `prefers-reduced-motion`.

## Reference rules (non-negotiable)

- Measure, don't guess: use `.claude/skills/reference-inspection` to read geometry, type metrics
  and transition timings off the rendered reference.
- Never fetch or copy the reference's JS/CSS source. Photos, the font and icon artwork are assets
  and may be reused; code is always written from scratch.
- A visual change is only done when `npm run parity:diff` shows no new regressions.
