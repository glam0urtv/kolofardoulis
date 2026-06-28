# Full Repo Audit

Complete consistency check. Read every convention, every doc, every source file — then fix drift.

## Step 1 — Load source of truth

Read in full:
1. `docs/conventions/operating-rules.md`
2. `docs/conventions/conventions.md`
3. `.claude/rules/typescript.md`
4. `CLAUDE.md`
5. `docs/reference/glossary.md`
6. `docs/reference/gotchas.md`
7. Every `docs/` domain doc (01–09)
8. Every `docs/reference/*.md`
9. `spec/` (if present)

## Step 2 — Audit folder structure

1. List every folder under `src/features/`, `src/components/`, `src/services/`, `src/hooks/`, `src/utils/`.
2. Every folder name matches `^[a-z0-9-]+$`. Flag any that don't. (Repo root exempt.)
3. Slug consistency: if a slug exists under `src/features/` and any sibling root, they match exactly.
4. Repo root allowlist: only `CLAUDE.md`, `.gitignore`, `.mcp.json`, `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json`, declared top-level folders.
5. No forbidden files anywhere: `*.bak`, `*.old`, `*-copy.*`, `*-v2.*`, `_scratch.*`, `tmp.*`, `*.session.sql`, `nul`, `desktop.ini`, session-continuation notes.

## Step 3 — Audit every feature folder

For each `src/features/<slug>/`:
1. Has at least one artifact?
2. Artifact's header comment present and accurate?
3. If `notes.md` exists: follows doc style (heading levels, status markers, no forbidden content)?
4. No credentials, no per-machine output?

## Step 4 — Audit source files

See `.claude/rules/typescript.md` for the full list. Check each file against every rule.

## Step 5 — Audit CLAUDE.md

1. Under 150 lines?
2. Preflight block present with 4-5 numbered steps?
3. Folder layout matches disk?
4. Status table: every row = actual feature folder, every folder = a row, markers match reality?
5. Single status column (not multi-axis)?
6. Rules / commands section lists every file in `.claude/rules/` and `.claude/commands/`?
7. Hard rules still accurate?

## Step 6 — Audit docs/reference

1. `glossary.md` entries still accurate? Any code-only terms not yet listed?
2. `gotchas.md` entries still relevant? Any obsolete?
3. Methodology docs under 400-line cap?

## Step 7 — Cross-check conventions

1. `conventions.md` lists every folder type that actually exists?
2. `operating-rules.md` rules still applied in practice?
3. Convention docs under their soft caps?
4. Any doc references files or paths that no longer exist?
5. Docs contradict each other?

## Step 8 — Fix

- **Fixable in place:** fix immediately. Edit; never create `-fixed` versions.
- **Needs user input:** collect for the end.
- **Structural issues:** fix folder structure, move files.

## Step 9 — Report

```
## Audit complete — <YYYY-MM-DD>

### Fixed
- [file]: [what was wrong] → [what was changed]

### Needs your input
- [question requiring user decision]

### All clear
- [areas that passed]
```

Concise.
