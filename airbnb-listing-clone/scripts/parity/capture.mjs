#!/usr/bin/env node
// Headless capture of the clone at the same scroll positions as parity/reference.
// Usage: node scripts/parity/capture.mjs [--url http://localhost:3000] [--out parity/current]
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .join(" ")
    .split("--")
    .filter(Boolean)
    .map((pair) => pair.trim().split(/\s+/)),
);

const baseUrl = args.url ?? "http://localhost:3000";
const outDir = path.resolve(args.out ?? "parity/current");

// The baselines come from a 1366x543 Windows window. Its classic scrollbar leaves a 1351px layout
// for the page, but overlays lock scrolling, so they get the full 1366px. Headless Chromium draws
// overlay scrollbars that take no space, so each scene gets the width the reference laid out at.
const pageViewport = { width: 1351, height: 543 };
const overlayViewport = { width: 1366, height: 543 };
const listingOffsets = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 5716];

const overlayScenes = [
  { name: "tour-top", query: "?modal=PHOTO_TOUR_SCROLLABLE" },
  { name: "lightbox-01", query: "?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1000" },
];

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => (img.loading = "eager"));
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((resolve) => img.addEventListener("load", resolve, { once: true })),
      ),
    );
  });
  // Transitions triggered by the scroll (sticky nav) are 250ms.
  await page.waitForTimeout(400);
}

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: pageViewport, deviceScaleFactor: 1 });
await mkdir(outDir, { recursive: true });

await page.goto(baseUrl, { waitUntil: "networkidle" });
await settle(page);
for (const offset of listingOffsets) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), offset);
  await settle(page);
  const file = path.join(outDir, `listing-${String(offset).padStart(4, "0")}.png`);
  await page.screenshot({ path: file });
  console.log("captured", path.relative(process.cwd(), file));
}

await page.setViewportSize(overlayViewport);
for (const scene of overlayScenes) {
  await page.goto(baseUrl + scene.query, { waitUntil: "networkidle" });
  await settle(page);
  // Opening a dialog focuses its first control; the reference captures were taken after a
  // mouse click, which shows no focus ring, so drop focus before the screenshot.
  await page.evaluate(() => document.activeElement instanceof HTMLElement && document.activeElement.blur());
  const file = path.join(outDir, `${scene.name}.png`);
  await page.screenshot({ path: file });
  console.log("captured", path.relative(process.cwd(), file));
}

await browser.close();
