---
name: reference-inspection
description: Measure the live reference page (geometry, font size/weight/letter-spacing, colours, transition timings) from its rendered output without reading its source. Use whenever a component's spec is unknown or a parity diff shows a delta you cannot explain.
---

# Inspecting the reference

The reference blocks the obvious shortcut (`getComputedStyle` is patched) and the brief forbids
lifting its code. Everything here works from what the browser _renders_, the same information a
developer gets from a ruler, a colour picker and the DevTools animations panel.

## Setup

1. Open the reference in the browser (Claude in Chrome), 1366px-wide window, DPR 1.
2. Paste `probe.js` into the page with the JavaScript tool. It defines `window.probe`.
3. Long results go to the console; read them back with the console tool filtered by the tag you
   passed (tool responses truncate, console reads do not).

## Techniques

| Question                                      | Call                                                                            | Notes                                                                                |
| --------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Where is every text run, and what font is it? | `probe.text(root, "TAG")`                                                       | Fits size/weight from rendered width via canvas `measureText` with the same webfont. |
| Is there letter-spacing?                      | `probe.fitMany([["Living room 1", 188.4], ...])`                                | Solves one size/weight/tracking for several strings rendered with the same style.    |
| Boxes, icons, images                          | `probe.boxes(root, "TAG")`                                                      | Rects for buttons, links, svg, img and 1–2px dividers.                               |
| Transition timing and end values              | trigger the interaction, then `probe.motion("TAG")`                             | Reads `document.getAnimations()`: property, duration, easing, from → to.             |
| Exact colours                                 | zoom screenshot with `save_to_disk` → PNG in `/tmp/claude-chrome-screenshots-*` | Sample with Pillow. Full screenshots save as JPEG — use zoom for lossless.           |

## Gotchas learned the hard way

- If the Chrome window is occluded, `document.visibilityState` is `hidden`: requestAnimationFrame
  and IntersectionObserver stall. Take a throwaway screenshot to force a frame before reading
  scroll-driven state.
- `innerText` of hidden dialogs is empty; use `textContent`.
- Whitespace matters when fitting: measure the text node exactly as rendered (leading/trailing
  spaces included) or the fit drifts by a few tenths of a pixel.
- The Claude in Chrome cursor overlay (fixed, `z-index: 2147483646`) shows up in captures — hide
  it with an injected style before taking baselines.
