#!/usr/bin/env node
// PostToolUse hook: format whatever file Claude just wrote so diffs stay about intent.
// Never blocks the agent — formatting problems are reported, not fatal.
import { execFileSync } from "node:child_process";

let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const { tool_input: toolInput } = JSON.parse(input || "{}");
    const file = toolInput?.file_path;
    if (!file || !/\.(tsx?|mjs|css|json|md)$/.test(file) || file.includes("node_modules")) return;
    execFileSync("npx", ["--no-install", "prettier", "--write", "--log-level", "warn", file], {
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`format hook skipped: ${error.message}`);
  }
});
