#!/usr/bin/env node
// Pixel diff of parity/current against parity/reference.
// Usage: node scripts/parity/diff.mjs [scene-filter]
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const root = path.resolve("parity");
const referenceDir = path.join(root, "reference");
const currentDir = path.join(root, "current");
const diffDir = path.join(root, "diff");
const filter = process.argv[2] ?? "";
// Everything right of this is the scrollbar lane, which is drawn differently on every OS.
const LAYOUT_WIDTH = 1351;

const readPng = async (file) => PNG.sync.read(await readFile(file));

// Compare the shared top-left region so captures from a slightly different window still diff.
function crop(png, width, height) {
  if (png.width === width && png.height === height) return png;
  const out = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    png.data.copy(out.data, y * width * 4, y * png.width * 4, y * png.width * 4 + width * 4);
  }
  return out;
}

await mkdir(diffDir, { recursive: true });
const scenes = (await readdir(referenceDir)).filter((f) => f.endsWith(".png") && f.includes(filter));
const results = [];

for (const file of scenes) {
  let current;
  try {
    current = await readPng(path.join(currentDir, file));
  } catch {
    results.push({ scene: file, status: "missing" });
    continue;
  }
  const reference = await readPng(path.join(referenceDir, file));
  const width = Math.min(reference.width, current.width, LAYOUT_WIDTH);
  const height = Math.min(reference.height, current.height);
  const diff = new PNG({ width, height });
  const changed = pixelmatch(
    crop(reference, width, height).data,
    crop(current, width, height).data,
    diff.data,
    width,
    height,
    { threshold: 0.1, includeAA: false, alpha: 0.25 },
  );
  await writeFile(path.join(diffDir, file), PNG.sync.write(diff));
  results.push({ scene: file, status: "compared", changed, ratio: +(changed / (width * height)).toFixed(4) });
}

results.sort((a, b) => (b.ratio ?? 1) - (a.ratio ?? 1));
await writeFile(path.join(root, "report.json"), JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));

for (const r of results) {
  const pct = r.status === "compared" ? `${(r.ratio * 100).toFixed(2)}%`.padStart(7) : "  n/a  ";
  console.log(`${pct}  ${r.scene}${r.status === "missing" ? "  (no capture)" : ""}`);
}
