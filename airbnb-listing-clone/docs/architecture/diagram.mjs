#!/usr/bin/env node
// One layout, three outputs: an editable .excalidraw file plus SVG and PNG/PDF renders of the
// same boxes, so the picture in the submission and the source file can't drift apart.
// Usage: node docs/architecture/diagram.mjs   (PW_CHROMIUM_PATH if Playwright's browser is elsewhere)
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = path.dirname(fileURLToPath(import.meta.url));
const WIDTH = 1800;
const HEIGHT = 1150;

const palette = {
  client: { fill: "#fff4e6", stroke: "#e8590c" },
  edge: { fill: "#e7f5ff", stroke: "#1971c2" },
  service: { fill: "#ebfbee", stroke: "#2f9e44" },
  data: { fill: "#f3f0ff", stroke: "#6741d9" },
  async: { fill: "#fff9db", stroke: "#e67700" },
  ops: { fill: "#f1f3f5", stroke: "#495057" },
};

// Lanes are drawn first as labelled backgrounds; boxes sit inside them.
const lanes = [
  { x: 40, y: 90, w: 250, h: 660, title: "Clients", kind: "client" },
  { x: 320, y: 90, w: 300, h: 660, title: "Edge", kind: "edge" },
  { x: 650, y: 90, w: 640, h: 660, title: "Services (Kubernetes, per region)", kind: "service" },
  { x: 1320, y: 90, w: 440, h: 660, title: "Data & search", kind: "data" },
  { x: 40, y: 790, w: 1720, h: 150, title: "Events & analytics", kind: "async" },
  { x: 40, y: 970, w: 1720, h: 160, title: "Deployment, scaling & operations", kind: "ops" },
];

const boxes = [
  // clients
  {
    id: "web",
    lane: "client",
    x: 60,
    y: 140,
    w: 210,
    h: 110,
    title: "Web app",
    lines: ["Next.js · SSR/ISR", "listing pages cached at edge"],
  },
  {
    id: "mobile",
    lane: "client",
    x: 60,
    y: 280,
    w: 210,
    h: 90,
    title: "iOS / Android",
    lines: ["native apps, same APIs"],
  },
  {
    id: "host",
    lane: "client",
    x: 60,
    y: 400,
    w: 210,
    h: 90,
    title: "Host dashboard",
    lines: ["listings, calendar, payouts"],
  },
  // edge
  {
    id: "cdn",
    lane: "edge",
    x: 340,
    y: 140,
    w: 260,
    h: 110,
    title: "CDN + WAF",
    lines: ["static assets, HTML cache", "bot + DDoS protection"],
  },
  {
    id: "img",
    lane: "edge",
    x: 340,
    y: 450,
    w: 260,
    h: 90,
    title: "Image CDN",
    lines: ["resizes photos from object", "storage, serves AVIF/WebP"],
  },
  {
    id: "gw",
    lane: "edge",
    x: 340,
    y: 280,
    w: 260,
    h: 120,
    title: "API gateway / BFF",
    lines: ["auth (JWT/OIDC), rate limits", "GraphQL/REST fan-out", "per-screen payloads"],
  },
  // services
  {
    id: "search",
    lane: "service",
    x: 670,
    y: 140,
    w: 190,
    h: 100,
    title: "Search",
    lines: ["geo + filters + ranking"],
  },
  {
    id: "listing",
    lane: "service",
    x: 880,
    y: 140,
    w: 190,
    h: 100,
    title: "Listing",
    lines: ["details, photos, amenities"],
  },
  {
    id: "avail",
    lane: "service",
    x: 1090,
    y: 140,
    w: 180,
    h: 100,
    title: "Availability",
    lines: ["calendar, holds"],
  },
  {
    id: "pricing",
    lane: "service",
    x: 670,
    y: 270,
    w: 190,
    h: 100,
    title: "Pricing",
    lines: ["nightly rates, fees,", "dynamic pricing"],
  },
  {
    id: "booking",
    lane: "service",
    x: 880,
    y: 270,
    w: 190,
    h: 100,
    title: "Booking",
    lines: ["reservation saga,", "idempotent requests"],
  },
  {
    id: "payments",
    lane: "service",
    x: 1090,
    y: 270,
    w: 180,
    h: 100,
    title: "Payments",
    lines: ["PSP adapters, ledger,", "payouts"],
  },
  {
    id: "reviews",
    lane: "service",
    x: 670,
    y: 400,
    w: 190,
    h: 90,
    title: "Reviews",
    lines: ["ratings, moderation"],
  },
  {
    id: "messaging",
    lane: "service",
    x: 880,
    y: 400,
    w: 190,
    h: 90,
    title: "Messaging",
    lines: ["host ↔ guest, websockets"],
  },
  {
    id: "identity",
    lane: "service",
    x: 1090,
    y: 400,
    w: 180,
    h: 90,
    title: "Identity & users",
    lines: ["accounts, KYC, wishlists"],
  },
  {
    id: "media",
    lane: "service",
    x: 670,
    y: 520,
    w: 190,
    h: 90,
    title: "Media",
    lines: ["uploads, variants"],
  },
  {
    id: "notify",
    lane: "service",
    x: 880,
    y: 520,
    w: 190,
    h: 90,
    title: "Notifications",
    lines: ["email · SMS · push"],
  },
  {
    id: "trust",
    lane: "service",
    x: 1090,
    y: 520,
    w: 180,
    h: 90,
    title: "Trust & safety",
    lines: ["fraud scoring, holds"],
  },
  {
    id: "flow",
    lane: "service",
    x: 670,
    y: 630,
    w: 600,
    h: 100,
    title: "Booking write path",
    lines: [
      "hold dates in Redis (10 min TTL) → quote from Pricing → PSP authorise →",
      "insert booking (Postgres exclusion constraint) → capture → BookingConfirmed event",
    ],
  },
  // data
  {
    id: "pg",
    lane: "data",
    x: 1340,
    y: 140,
    w: 400,
    h: 110,
    title: "PostgreSQL (per service)",
    lines: ["bookings: exclusion constraint on date", "ranges stops double-booking; read replicas"],
  },
  {
    id: "redis",
    lane: "data",
    x: 1340,
    y: 280,
    w: 190,
    h: 90,
    title: "Redis",
    lines: ["cache, sessions,", "availability holds"],
  },
  {
    id: "os",
    lane: "data",
    x: 1550,
    y: 280,
    w: 190,
    h: 90,
    title: "OpenSearch",
    lines: ["geo index,", "availability bitmaps"],
  },
  {
    id: "s3",
    lane: "data",
    x: 1340,
    y: 400,
    w: 190,
    h: 90,
    title: "Object storage",
    lines: ["photos, documents"],
  },
  {
    id: "ledger",
    lane: "data",
    x: 1550,
    y: 400,
    w: 190,
    h: 90,
    title: "Payments ledger",
    lines: ["append-only, audited"],
  },
  {
    id: "psp",
    lane: "data",
    x: 1340,
    y: 520,
    w: 400,
    h: 90,
    title: "External: PSPs, maps, email/SMS providers",
    lines: ["called through adapters with retries + circuit breakers"],
  },
  // async
  {
    id: "kafka",
    lane: "async",
    x: 60,
    y: 830,
    w: 420,
    h: 90,
    title: "Kafka event bus",
    lines: ["BookingConfirmed, PriceChanged, ListingUpdated…", "outbox pattern from each service"],
  },
  {
    id: "indexer",
    lane: "async",
    x: 510,
    y: 830,
    w: 360,
    h: 90,
    title: "Search indexer (CDC consumers)",
    lines: ["keeps OpenSearch in sync within seconds"],
  },
  {
    id: "lake",
    lane: "async",
    x: 900,
    y: 830,
    w: 400,
    h: 90,
    title: "Data lake + warehouse",
    lines: ["S3 + Iceberg → Snowflake/BigQuery"],
  },
  {
    id: "ml",
    lane: "async",
    x: 1330,
    y: 830,
    w: 410,
    h: 90,
    title: "ML platform",
    lines: ["search ranking, pricing, fraud models"],
  },
  // ops
  {
    id: "k8s",
    lane: "ops",
    x: 60,
    y: 1010,
    w: 400,
    h: 100,
    title: "Multi-region Kubernetes",
    lines: ["HPA on CPU/RPS, 3 AZs per region,", "active-active reads, pinned writes"],
  },
  {
    id: "cicd",
    lane: "ops",
    x: 490,
    y: 1010,
    w: 380,
    h: 100,
    title: "CI/CD",
    lines: ["GitHub Actions → Argo CD,", "canary + feature flags, IaC (Terraform)"],
  },
  {
    id: "obs",
    lane: "ops",
    x: 900,
    y: 1010,
    w: 400,
    h: 100,
    title: "Observability",
    lines: ["OpenTelemetry traces, Prometheus,", "SLOs on search p95 and booking success"],
  },
  {
    id: "sec",
    lane: "ops",
    x: 1330,
    y: 1010,
    w: 410,
    h: 100,
    title: "Security",
    lines: ["secrets in KMS/Vault, PCI scope isolated", "to Payments, least-privilege IAM"],
  },
];

// Box-to-box arrows only where the line doesn't cut through another box; relationships between
// whole lanes are drawn once, lane to lane, with a label.
const arrows = [
  ["web", "cdn"],
  ["cdn", "gw"],
  ["mobile", "gw"],
  ["host", "gw"],
  ["booking", "avail"],
  ["booking", "pricing"],
  ["booking", "payments"],
  ["kafka", "indexer"],
  ["lake", "ml"],
];

const laneArrows = [
  { x1: 600, y1: 340, x2: 650, y2: 340 },
  {
    x1: 1290,
    y1: 330,
    x2: 1320,
    y2: 330,
    label: "each service owns its own store; no shared tables",
    labelX: 1340,
    labelY: 690,
  },
  { x1: 970, y1: 750, x2: 970, y2: 790, label: "outbox → Kafka", labelX: 982, labelY: 776 },
  {
    x1: 1540,
    y1: 790,
    x2: 1540,
    y2: 750,
    label: "indexes, features, ranking",
    labelX: 1552,
    labelY: 776,
  },
];

const byId = Object.fromEntries(boxes.map((box) => [box.id, box]));
const center = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

// Where the straight line between two box centres leaves each box.
function edgePoint(from, to) {
  const a = center(from);
  const b = center(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const scale = Math.min(
    dx === 0 ? Infinity : from.w / 2 / Math.abs(dx),
    dy === 0 ? Infinity : from.h / 2 / Math.abs(dy),
  );
  return { x: a.x + dx * scale, y: a.y + dy * scale };
}

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const font = "Inter, 'Segoe UI', Helvetica, Arial, sans-serif";

function toSvg() {
  const parts = [];
  parts.push(`<rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>`);
  parts.push(
    `<text x="40" y="52" font-family="${font}" font-size="28" font-weight="700" fill="#212529">Vacation-rental marketplace — production architecture</text>`,
    `<text x="40" y="76" font-family="${font}" font-size="15" fill="#495057">Read paths (search, listing) are cached and horizontally scaled; the booking write path is strongly consistent; everything else reacts to events.</text>`,
  );
  for (const lane of lanes) {
    const { fill, stroke } = palette[lane.kind];
    parts.push(
      `<rect x="${lane.x}" y="${lane.y}" width="${lane.w}" height="${lane.h}" rx="14" fill="${fill}" fill-opacity="0.45" stroke="${stroke}" stroke-dasharray="6 5"/>`,
      `<text x="${lane.x + 16}" y="${lane.y + 26}" font-family="${font}" font-size="15" font-weight="700" fill="${stroke}">${escape(lane.title)}</text>`,
    );
  }
  parts.push(
    `<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#868e96"/></marker></defs>`,
  );
  for (const [fromId, toId] of arrows) {
    const start = edgePoint(byId[fromId], byId[toId]);
    const end = edgePoint(byId[toId], byId[fromId]);
    parts.push(
      `<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="#868e96" stroke-width="1.6" marker-end="url(#arrow)"/>`,
    );
  }
  for (const arrow of laneArrows) {
    parts.push(
      `<line x1="${arrow.x1}" y1="${arrow.y1}" x2="${arrow.x2}" y2="${arrow.y2}" stroke="#495057" stroke-width="3" marker-end="url(#arrow)"/>`,
      arrow.label &&
        `<text x="${arrow.labelX}" y="${arrow.labelY}" font-family="${font}" font-size="13.5" font-style="normal" font-weight="600" fill="#495057">${escape(arrow.label)}</text>`,
    );
  }
  for (const box of boxes) {
    const { fill, stroke } = palette[box.lane];
    parts.push(
      `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`,
      `<text x="${box.x + 14}" y="${box.y + 28}" font-family="${font}" font-size="16" font-weight="700" fill="#212529">${escape(box.title)}</text>`,
    );
    box.lines.forEach((line, i) =>
      parts.push(
        `<text x="${box.x + 14}" y="${box.y + 52 + i * 19}" font-family="${font}" font-size="13.5" fill="#495057">${escape(line)}</text>`,
      ),
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${parts.filter(Boolean).join("")}</svg>`;
}

function toExcalidraw() {
  let seed = 1;
  const base = () => ({
    angle: 0,
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: seed++,
    version: 1,
    versionNonce: seed * 7919,
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false,
  });
  const text = (id, x, y, value, fontSize, color) => ({
    ...base(),
    id,
    type: "text",
    x,
    y,
    width: value.length * fontSize * 0.55,
    height: fontSize * 1.25,
    strokeColor: color,
    backgroundColor: "transparent",
    fillStyle: "solid",
    text: value,
    originalText: value,
    fontSize,
    fontFamily: 2,
    textAlign: "left",
    verticalAlign: "top",
    containerId: null,
    lineHeight: 1.25,
    autoResize: true,
  });
  const elements = [
    text("title", 40, 24, "Vacation-rental marketplace — production architecture", 28, "#212529"),
  ];
  for (const [i, lane] of lanes.entries()) {
    const { fill, stroke } = palette[lane.kind];
    elements.push(
      {
        ...base(),
        id: `lane-${i}`,
        type: "rectangle",
        x: lane.x,
        y: lane.y,
        width: lane.w,
        height: lane.h,
        strokeColor: stroke,
        backgroundColor: fill,
        fillStyle: "solid",
        strokeStyle: "dashed",
        roundness: { type: 3 },
        opacity: 60,
      },
      text(`lane-${i}-title`, lane.x + 16, lane.y + 10, lane.title, 16, stroke),
    );
  }
  for (const box of boxes) {
    const { fill, stroke } = palette[box.lane];
    elements.push(
      {
        ...base(),
        id: box.id,
        type: "rectangle",
        x: box.x,
        y: box.y,
        width: box.w,
        height: box.h,
        strokeColor: stroke,
        backgroundColor: fill,
        fillStyle: "solid",
        strokeWidth: 2,
        roundness: { type: 3 },
      },
      text(`${box.id}-title`, box.x + 14, box.y + 12, box.title, 16, "#212529"),
      text(`${box.id}-body`, box.x + 14, box.y + 38, box.lines.join("\n"), 13, "#495057"),
    );
  }
  for (const [i, [fromId, toId]] of arrows.entries()) {
    const start = edgePoint(byId[fromId], byId[toId]);
    const end = edgePoint(byId[toId], byId[fromId]);
    elements.push({
      ...base(),
      id: `arrow-${i}`,
      type: "arrow",
      x: start.x,
      y: start.y,
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
      strokeColor: "#868e96",
      backgroundColor: "transparent",
      fillStyle: "solid",
      points: [
        [0, 0],
        [end.x - start.x, end.y - start.y],
      ],
      lastCommittedPoint: null,
      startBinding: { elementId: fromId, focus: 0, gap: 2 },
      endBinding: { elementId: toId, focus: 0, gap: 2 },
      startArrowhead: null,
      endArrowhead: "arrow",
      elbowed: false,
    });
  }
  for (const [i, arrow] of laneArrows.entries()) {
    elements.push({
      ...base(),
      id: `lane-arrow-${i}`,
      type: "arrow",
      x: arrow.x1,
      y: arrow.y1,
      width: Math.abs(arrow.x2 - arrow.x1),
      height: Math.abs(arrow.y2 - arrow.y1),
      strokeColor: "#495057",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 3,
      points: [
        [0, 0],
        [arrow.x2 - arrow.x1, arrow.y2 - arrow.y1],
      ],
      lastCommittedPoint: null,
      startBinding: null,
      endBinding: null,
      startArrowhead: null,
      endArrowhead: "arrow",
      elbowed: false,
    });
    if (arrow.label) {
      elements.push(
        text(`lane-arrow-${i}-label`, arrow.labelX, arrow.labelY - 14, arrow.label, 13, "#495057"),
      );
    }
  }
  return {
    type: "excalidraw",
    version: 2,
    source: "docs/architecture/diagram.mjs",
    elements,
    appState: { viewBackgroundColor: "#ffffff", gridSize: null },
    files: {},
  };
}

const svg = toSvg();
await writeFile(path.join(here, "architecture.svg"), svg);
await writeFile(
  path.join(here, "architecture.excalidraw"),
  JSON.stringify(toExcalidraw(), null, 2),
);

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.screenshot({ path: path.join(here, "architecture.png") });
await page.pdf({
  path: path.join(here, "architecture.pdf"),
  width: `${WIDTH}px`,
  height: `${HEIGHT}px`,
  printBackground: true,
});
await browser.close();
console.log("wrote architecture.{excalidraw,svg,png,pdf}");
