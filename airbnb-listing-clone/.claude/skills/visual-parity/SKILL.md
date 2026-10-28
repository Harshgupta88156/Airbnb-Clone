---
name: visual-parity
description: Capture the clone at the same viewport and scroll positions as the reference baselines, diff them pixel by pixel, and turn the result into concrete fixes. Use after any styling or layout change and before marking a section as done.
---

# Visual parity loop

Baselines live in `parity/reference/` and are named `<scene>.png`:

- `listing-0000.png` … `listing-5716.png` — page scrolled to that `scrollY`, 1366×543 viewport
  (1351px layout width because of the 15px Windows scrollbar), DPR 1.
- `tour-top.png`, `tour-scrolled.png`, `lightbox-01.png`, `amenities.png` — overlays.

## 1. Capture the clone

Best fidelity: the same browser that produced the baselines. With Claude in Chrome, open the local
build, hide the agent cursor overlay, scroll to each position and take a lossless zoom capture of
the full viewport with `save_to_disk`; copy the PNGs into `parity/current/` with matching names.

Headless alternative (CI, quick checks):

```bash
npm run build && npm run start &
npm run parity:capture -- --url http://localhost:3000
```

`capture.mjs` uses a 1351px viewport so the layout width matches the baselines. Font
rasterisation differs slightly between Linux and Windows, so expect uniform low-level noise on
text in headless diffs — look at the shape of the diff, not the raw percentage.

## 2. Diff

```bash
npm run parity:diff            # all scenes
npm run parity:diff -- tour    # scenes whose name contains "tour"
```

Writes `parity/diff/<scene>.png` (changed pixels in red) and `parity/report.json`, and prints a
table sorted by mismatch.

## 3. Read the result

- Solid red silhouettes = geometry moved. Measure the offset and fix spacing first; it cascades.
- Red outlines around glyphs only = same layout, different type rendering (size, weight or
  letter-spacing). Re-fit with `reference-inspection`.
- Speckle inside photos = image resampling. Ignore.
- Hand the worst scenes to the `visual-parity-reviewer` agent when the cause is not obvious.
