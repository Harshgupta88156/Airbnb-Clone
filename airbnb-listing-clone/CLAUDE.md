@AGENTS.md

## Claude Code specifics

Sub-agents live in `.claude/agents` and are meant to run in parallel once a feature is built:

- `visual-parity-reviewer` — reads `parity/` screenshots and diffs, reports measured deltas + fixes.
- `a11y-auditor` — runs the axe/keyboard suite and reviews dialog, calendar and carousel semantics.
- `code-reviewer` — reviews the diff against the conventions above; flags boilerplate and
  over-engineering.

Skills live in `.claude/skills`:

- `reference-inspection` — how to measure the live reference (text-metric fitting, box probes,
  transition sniffing, lossless captures) without touching its source.
- `visual-parity` — capture → diff → fix loop and how to read the report.

A `PostToolUse` hook formats every file Claude writes (`.claude/hooks/format-file.mjs`), so diffs
stay focused on intent.
