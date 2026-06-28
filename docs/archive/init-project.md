# Initialize a New Project

Bootstrap the current working directory into a Claude-ready project: `CLAUDE.md`, two convention docs, two reference scaffolds, one scoped rule, four slash commands. This skill is self-contained — every template you need is below. Use them verbatim with placeholders substituted.

**Triage → Interview → Scaffold → Verify. In that order. No files written until Phase 2.**

Design philosophy: signal density over completeness. Fewer files, each one worth re-reading every session. If you're tempted to create a doc the user didn't ask for, don't.

---

## Phase 0 — Triage existing files

Skip if the directory is empty.

1. List top-level entries.
2. Categorize each:
   - **Keep at root**: `README.md`, `.gitignore`, `.git/`, language-standard root files (`package.json`, `pyproject.toml`, `go.mod`, `*.csproj`, `Cargo.toml`).
   - **Move to `docs/archive/`**: any project-description `.md` (prior `CLAUDE.md`, `implementation-strategy.md`, `how-to.md`, `roadmap.md`, `TODO.md`, prior `docs/` content that won't fit the new layout).
   - **Leave alone**: existing source folders, data folders, configs — confirm with user before touching.
3. Show the proposed move list. Wait for confirmation before moving anything.

If a `CLAUDE.md` exists at root: print it, ask "merge into the new CLAUDE.md, replace wholesale, or abort?". Default = ask.

---

## Phase 1 — Interview

Ask these. Wait for answers. Do not guess.

1. **Project name and slug.** Display name + lowercase-hyphenated slug for folders.
2. **One- to three-sentence description.** What it does. Who uses it.
3. **Profile.** Closest fit (drives overlay in 2.4):
   - `powershell-automation` — Windows / IT ops / NinjaOne-style scripts
   - `web-scraping` — Puppeteer / Playwright / crawlers
   - `web-app` — frontend + backend (React/Next/Vue + API)
   - `api-service` — backend-only HTTP service
   - `cli-tool` — command-line utility or script collection
   - `data-pipeline` — ETL / batch jobs
   - `sql-extraction` — read-only queries against external databases (no app code)
   - `library` — published package or internal reusable module
   - `generic` — none of the above; minimum scaffold only
4. **Primary language + runtime.** e.g. TypeScript on Node 20, Python 3.12, PowerShell 5.1, SQL (T-SQL + PL/SQL).
5. **Unit of work.** The repeatable "thing" this project produces. Name the folder pattern:
   - Recipes → `products/<slug>/`
   - Scrapers → `scrapers/<site>/`
   - Endpoints → `src/routes/<resource>/`
   - Pipeline jobs → `jobs/<job-name>/`
   - Extraction properties → `<source-system>/<property>/`
6. **Does each unit produce a single artifact or multiple?**
   - Single (one source file, one config) → unit doc not needed; the artifact's header carries the documentation.
   - Multiple (e.g. several SQL files + notes + sample data) → optional `notes.md` per unit, no rigid template.
   - **Default to no per-unit how-to doc unless user pushes back.** It's documentation theater for most projects.
7. **Spec-driven?** Is there a machine- or human-readable spec defining target output/schema/API? Where does it live? (Triggers spec overlay 2.5.)
8. **External systems?** Databases, APIs, browsers, cloud services? List them. For each: posture (read-only / read-write / destructive-allowed) and credential location. (Triggers external-systems block 2.6.)
9. **MCP servers?** Any MCP servers in scope? List with purposes. (Triggers MCP overlay 2.7.)
10. **Verification story.** How do you know a unit is "done"? Tests / manual check / fixture comparison / deployment.
11. **Status tracking.** One marker per unit (preferred) or multi-axis table? **Push back on multi-axis** — sub-status belongs in the unit's `notes.md`, not the top-level table. Only allow multi-axis if the user insists.
12. **User-facing collaboration guide?** Default no. Only create `docs/how-to-use-me.md` if the user explicitly asks. (It's for them, not for Claude.)

Echo your understanding in one short paragraph. Let the user correct before Phase 2.

---

## Phase 2 — Scaffold

### 2.1 Files to create (in order)

Substitute every `{{PLACEHOLDER}}` from interview answers. No `[fill this in]` markers left behind.

| # | Path | Template |
|---|---|---|
| 1 | `CLAUDE.md` | 2.2 + profile overlay 2.4 + spec/external/MCP blocks if applicable |
| 2 | `docs/conventions/conventions.md` | 2.2 |
| 3 | `docs/conventions/operating-rules.md` | 2.2 + external-systems rule prepended if applicable |
| 4 | `docs/reference/glossary.md` | 2.2 (seed with terms from interview) |
| 5 | `docs/reference/gotchas.md` | 2.2 (empty seed, usage note only) |
| 6 | `.claude/rules/{{LANGUAGE}}.md` | 2.3 (with `globs:` frontmatter — mandatory) |
| 7 | `.claude/commands/new-{{UNIT}}.md` | 2.2 |
| 8 | `.claude/commands/verify-{{UNIT}}.md` | 2.2 |
| 9 | `.claude/commands/update-knowledge.md` | 2.2 |
| 10 | `.claude/commands/update-all.md` | 2.2 |
| 11 | `.gitignore` | 2.2 |
| 12 | `spec/` folder (no `.gitkeep`) | Only if Q7 = yes; user populates |
| 13 | Sample unit folder `{{UNIT_ROOT}}/{{EXAMPLE_SLUG}}/` | Per Q5; create the folder, no doc inside unless Q6 = multiple |
| 14 | `docs/how-to-use-me.md` | OPTIONAL — only if Q12 = yes |

**Not created:** empty `.gitkeep` placeholders, per-unit how-to docs by default, `README.md` (user creates if wanted), `docs/archive/` (created by Phase 0 only when needed).

**Folder naming rule** (applied to every `{{PLACEHOLDER}}` resolving to a path segment): lowercase-hyphen only, matches `^[a-z0-9-]+$`. The repo root itself is exempt — if it has spaces or PascalCase, note it but don't try to rename.

---

### 2.2 Core templates

#### Template: `CLAUDE.md` (target ≤150 lines)

```markdown
# CLAUDE.md

Repository instructions for Claude Code. Auto-loaded every conversation. Detail lives in `docs/conventions/` and `docs/reference/`.

## What this project is

{{ONE_TO_THREE_SENTENCE_DESCRIPTION}}

Primary language: {{LANGUAGE_AND_RUNTIME}}. Profile: {{PROFILE}}.

## Preflight — before touching any file

1. Read `docs/conventions/operating-rules.md` (how to behave) and `docs/conventions/conventions.md` (where things go).
2. Skim `docs/reference/glossary.md` if unfamiliar with the domain.
3. Check `docs/reference/gotchas.md` for known traps in the area you're about to touch.
4. Check the unit status table below — know the starting state.
5. State your plan before writing code or docs.

## Folder layout

```
{{SPEC_FOLDER_IF_PRESENT}}
{{UNIT_ROOT}}/<slug>/       per-{{UNIT}} work
{{CONDITIONAL_FOLDERS}}
docs/
  conventions/              rules Claude follows (auto-loaded via pointers)
  reference/                glossary, gotchas, methodology — load on demand
  archive/                  superseded docs (created when needed)
.claude/
  rules/                    scoped rules auto-loaded by file-glob frontmatter
  commands/                 custom slash commands
```

## Read these before non-trivial work

1. `docs/conventions/operating-rules.md` — non-negotiable behavior rules
2. `docs/conventions/conventions.md` — folder layout, naming, doc style, maintenance
3. `docs/reference/glossary.md` — domain vocabulary
4. `docs/reference/gotchas.md` — known traps; check before debugging anything that "should work"

## Scoped rules and commands

- `.claude/rules/{{LANGUAGE}}.md` — auto-loaded on `{{LANGUAGE_GLOB}}` via frontmatter
- `/new-{{UNIT}}` — end-to-end workflow for adding a new {{UNIT}}
- `/verify-{{UNIT}}` — verification checklist on a finished {{UNIT}}
- `/update-knowledge` — session handoff (updates docs, glossary, gotchas)
- `/update-all` — full repo audit

## How "done" looks

{{VERIFICATION_STORY_SUMMARY}}

## Secrets

{{SECRETS_POLICY_ONE_LINER}}

{{MCP_SERVERS_BLOCK_IF_APPLICABLE}}

## Unit status

| {{UNIT_CAPITALIZED}} | Status | Notes |
|---|---|---|
| {{EXAMPLE_SLUG}} | 🚧 | Initial scaffold |

Update whenever state changes. Markers: ✅ verified end-to-end, ⚠️ partial, 🚧 in progress, ❌ broken.

Single status column. Sub-status (per-deliverable readiness) goes in the unit's `notes.md`, not here.

## Hard rules

{{EXTERNAL_SYSTEMS_HARD_RULES_IF_APPLICABLE}}
- **Never put files at the repo root** outside the allowlist (`CLAUDE.md`, `README.md`, `.gitignore`, `.mcp.json`, language-standard root files, declared top-level folders).
- **Never commit secrets.** No credentials, tokens, or keys in tracked files.
- **Never invent conventions.** If something isn't in `docs/conventions/`, ask.
- **Never create `*-v2.md`, `*-new.md`, `*.bak`.** Edit in place; archive to `docs/archive/` if truly superseded.
- **Never mark a {{UNIT}} ✅ without end-to-end verification.** Use 🚧 until proven, ⚠️ for partial.
- **Lowercase-hyphen folders.** Every folder matches `^[a-z0-9-]+$`.
{{SPEC_HARD_RULE_IF_APPLICABLE}}
```

---

#### Template: `docs/conventions/conventions.md` (target ≤250 lines)

```markdown
# Repository Conventions

How this repo is organized, named, documented, and maintained. Read before creating any file.

## Folder responsibilities

| Folder | Contains | Does NOT contain |
|---|---|---|
| `docs/conventions/` | Rules Claude follows. Two files only: `operating-rules.md`, `conventions.md`. | Methodology, domain reference, anything project-specific |
| `docs/reference/` | Glossary, gotchas, methodology, platform notes. Load on demand. | Rules, user-facing content |
| `docs/archive/` | Superseded docs kept for history | Active docs |
| `{{UNIT_ROOT}}/<slug>/` | Everything for ONE {{UNIT}}: artifact(s) + optional `notes.md` | Credentials, vendor binaries, session-continuation notes |
| `.claude/rules/` | Scoped rules auto-loaded via `globs:` frontmatter | Anything else |
| `.claude/commands/` | Custom slash commands | Anything else |
{{ADDITIONAL_ROWS_PER_PROFILE}}

## Naming rules

**Every folder name matches `^[a-z0-9-]+$`.** No spaces, no underscores, no PascalCase, no version numbers. `/update-all` enforces this. The repo root itself is exempt (we don't rename roots).

| Type | Convention | Example |
|---|---|---|
| Folder names | lowercase-hyphen | `{{EXAMPLE_SLUG}}`, `another-slug` |
| Reference doc | `kebab-case.md` in `docs/reference/` | `glossary.md`, `{{DOMAIN}}-schema.md` |
| Per-unit notes (optional) | `notes.md` in `{{UNIT_ROOT}}/<slug>/` | `notes.md` |
| {{LANGUAGE}} source files | {{LANGUAGE_NAMING_CONVENTION}} | {{LANGUAGE_NAMING_EXAMPLE}} |
| Convention docs | exactly `conventions.md` and `operating-rules.md` | (no other names allowed) |

**Forbidden in any filename:** spaces, underscores in folders, mixed case in folders, version markers (`v2`, `final`, `new`), `-copy`, `-backup`, `_draft`.

**Slug consistency.** If a {{UNIT}} exists under `{{UNIT_ROOT}}/<slug>/`, the same slug appears in every sibling location: configs, tests, docs, column values. One slug, used everywhere.

{{SLUG_MIRROR_RULE_IF_APPLICABLE}}

## Size discipline

| File | Soft cap | Why |
|---|---|---|
| `CLAUDE.md` | 150 lines | Auto-loaded every turn |
| `conventions.md` | 250 lines | Read at start of non-trivial work |
| `operating-rules.md` | 100 lines | Read at start of non-trivial work |
| Each reference doc | 400 lines | On-demand; split when topics diverge |
| Each scoped rule | no cap | Engine/language depth is valuable |

If a file pushes its cap, split by topic — don't compress.

## Where new things go (decision tree)

| You're adding... | It goes in... |
|---|---|
| A new {{UNIT}} | `{{UNIT_ROOT}}/<slug>/` |
| Methodology / platform reference | `docs/reference/<topic>.md` |
| A domain term you had to look up | `docs/reference/glossary.md` |
| A non-obvious trap you just hit | `docs/reference/gotchas.md` |
| A rule for Claude's behavior | `docs/conventions/operating-rules.md` |
| A change to where things live | `docs/conventions/conventions.md` |
| Temporary helper while debugging | NOT in the repo. Scratch folder outside. |
| Session-continuation context | NOT in the repo. Conversation, memory, or plan. |

## What never goes in the repo

- Temporary debug scripts (`_scratch.*`, `test.*`, `tmp.*`)
- Per-run output (logs, captures, profiler dumps) — gitignore the folder
- Session-continuation notes (`next-steps.md`, `todo.md`, `what-to-do.md`)
- Backup copies (`*.bak`, `*.old`, `*-copy.*`, `*-v2.*`)
- Editor / OS artifacts (`.DS_Store`, `desktop.ini`, `nul`, `*.session.sql`)
- Credentials in any form

---

## Doc style

### Heading levels

- `#` — document title, exactly one per file
- `##` — top-level sections
- `###` — subsections
- `####` — rare; if you need it, the section is too big

Never skip levels.

### Tables

Use tables for any structured comparison or settings list. Three columns preferred. Always include a header row. Tables beat walls of bullets.

### Code blocks

- Always tag the language: ` ```{{LANGUAGE}} `, ` ```bash `, ` ```json `, ` ```text `
- `# comment` lines above the command, never to the right
- Never paste a command without saying what to expect from it

### Status markers

| Marker | Meaning |
|---|---|
| ✅ | Verified working end-to-end |
| ⚠️ | Works with caveats / partial |
| 🚧 | In progress / untested |
| ❌ | Known broken |
| ⛔ | Do not do this |

These five only. No decorative emojis.

### Tone

- Direct and terse. Lead with the answer.
- No "we", no "let's". Imperatives or facts.
- No hedging. State the rule and the reason.
- Always explain *why* a rule exists, not just *what*.
- No session context ("as we discussed earlier"). Docs outlive conversations.

### Never include

- Real credentials, tokens, keys
- Per-machine output (specific hostnames, run timestamps)
- "TODO" / "FIXME" markers — open a real task or save a memory
- Session-specific context

### Marking ✅

Only when:
1. Ran end-to-end exactly as documented in a real environment.
2. Verification commands all returned expected output.
3. User confirmed success OR you observed it directly.

Missing any → use ⚠️ or 🚧. Downgrading later is worse than starting lower.

---

## Maintenance

### Memory vs repo vs conversation

| Information | Goes in | Why |
|---|---|---|
| Durable user preferences ("always prefer X") | Memory | Cross-conversation, not project-specific |
| References to external systems (dashboards, tickets) | Memory | External to repo |
| Domain term you had to look up | `docs/reference/glossary.md` | Future agents need it |
| Non-obvious trap or gotcha | `docs/reference/gotchas.md` | Prevents re-discovery |
| Technical knowledge about {{UNIT}}s / platform | `docs/reference/` | Future agents need it |
| Rules Claude follows | `docs/conventions/operating-rules.md` | Auto-loaded |
| Where things live | `docs/conventions/conventions.md` | Auto-loaded |
| In-progress work / current state | Conversation or plan | Ephemeral |

### Maintenance triggers

**You finished a NEW {{UNIT}}.** Add the row to `CLAUDE.md` status. Add code/artifacts to `{{UNIT_ROOT}}/<slug>/`. Optional `notes.md` only if there's research worth keeping.

**You discovered new info about an EXISTING {{UNIT}}.** Edit in place. If it invalidates verified status, downgrade marker.

**You learned a domain term.** One-line entry in `glossary.md`.

**You hit a non-obvious trap.** Entry in `gotchas.md` with: what seems true / what's actually true / why it matters.

**You discovered a general lesson.** Update the relevant `docs/reference/` doc. If contradicts existing text, fix the existing text — don't append "Note: actually...".

**The user gave you durable feedback.** Save to memory, not the repo.

### How to update

**Edit in place.** Never `*-v2.md`, `*-new.md`, `*-updated.md`. If superseded, move old to `docs/archive/` and rewrite under the original name.

**Update CLAUDE.md only when needed.** It's auto-loaded every session. Update for: new {{UNIT}} (status table), new convention or reference doc every session should know about, hard-rule changes, folder layout changes.

**Don't update CLAUDE.md for routine per-{{UNIT}} edits.**

**Conventions describe actual practice, not aspirations.** If you discover a better way, update the convention first, then bring existing files into compliance.

### Archive vs delete

| Action | When |
|---|---|
| Delete | Scratch files, broken drafts, genuine garbage |
| Archive to `docs/archive/` | Replaced by a different approach but useful as historical context |
| Edit in place | Anything still current that needs updating |

When in doubt, edit in place.

### After every maintenance update

1. Follows the doc style above?
2. No TODO / placeholder / draft markers?
3. No secrets leaked?
4. Status marker correct, with evidence for ✅?
5. New file location and name compliant?
```

---

#### Template: `docs/conventions/operating-rules.md` (target ≤100 lines)

```markdown
# Operating Rules

Non-negotiable rules for Claude in this repo. Override general defaults when they conflict.

{{EXTERNAL_SYSTEMS_RULE_IF_APPLICABLE}}

## Analyze before implementing

Default mode is **analysis and reporting**. Implementation (writing final artifacts, creating files, exporting data) happens only when the user explicitly asks.

1. User gives a task.
2. Investigate. Gather facts from the actual codebase, database, or system.
3. Report findings: what was found, what it means, options, problems.
4. Ask: "Ready to proceed with [specific next step]?"
5. User confirms → proceed. User redirects → adjust.

**Never:**
- Start a final artifact without first presenting analysis.
- Create files without being asked.
- Skip analysis because "it seems obvious".
- Make architectural decisions without presenting options first.

## Cross-check every factual claim

No assumption is trusted. Every claim about the codebase, database, or external system must be backed by evidence.

- Before writing against a module/table, inspect it.
- When mapping field A to field B, verify A exists and contains the data you think.
- When claiming something is empty, show the count or grep that proves it.
- When building filters, verify actual values with a distribution check.
- Never paste output you didn't actually observe.

## Check the gotchas before debugging

If something "should work" but doesn't, check `docs/reference/gotchas.md` BEFORE forming a theory. Half the time the trap is already documented.

## Source of truth precedence

{{SPEC_PRECEDENCE_IF_APPLICABLE}}
When convention docs and implementation disagree, the convention wins AND the implementation gets fixed. Don't silently adopt the implementation's pattern.

## Verify before declaring done

Before marking any {{UNIT}} ✅, run `/verify-{{UNIT}}`. Every checklist item must pass with evidence.

## One unit at a time

Don't work on multiple {{UNIT}}s in parallel unless the user explicitly asks. Complete one fully before starting the next.

## Document where it belongs

| What you learned | Where it goes |
|---|---|
| About this {{UNIT}} | The {{UNIT}}'s `notes.md` (if it exists) or the artifact's header comment |
| A domain term | `docs/reference/glossary.md` |
| A non-obvious trap | `docs/reference/gotchas.md` |
| Pattern across {{UNIT}}s | `docs/reference/<topic>.md` |
| Rule for Claude's behavior | `docs/conventions/operating-rules.md` |
| Collaboration preference (user → Claude) | Memory |

{{PROFILE_SPECIFIC_RULES}}
```

---

#### Template: `docs/reference/glossary.md`

```markdown
# Glossary

Domain vocabulary for this project. Add a term whenever you have to ask the user "what does X mean?" or look it up. One-line entries.

| Term | Meaning |
|---|---|
{{SEED_TERMS_FROM_INTERVIEW}}

## How to use

- **Reading first time?** Skim before diving into unfamiliar code.
- **Found a term you didn't know?** Add it after you confirm the meaning. Don't guess.
- **Term meaning changed?** Edit in place. The previous meaning is dead.
- **Term is project-internal jargon, not industry-standard?** Mark with `(internal)` after the term.
```

---

#### Template: `docs/reference/gotchas.md`

```markdown
# Gotchas

Non-obvious traps in this project. Things that look correct but aren't, or look broken but aren't, or behave in counterintuitive ways. Check here BEFORE forming a theory when something "should work" but doesn't.

## How to use

- **Before debugging:** scan for keywords related to your problem.
- **After hitting a trap:** add an entry so the next agent (you, in three weeks) doesn't re-discover it.
- **Format:** one `##` per gotcha. Three lines: what seems true / what's actually true / why it matters.

## Format

```
## <Short topic, area:something specific>

**Seems:** What a reasonable person would assume.
**Actually:** What's really going on.
**Why it matters:** What breaks if you act on the wrong assumption.
```

## Entries

(none yet — add as you discover them)
```

---

#### Template: `.claude/commands/new-{{UNIT}}.md`

```markdown
# New {{UNIT_CAPITALIZED}}

The user wants to add a new {{UNIT}} to this repo.

## Step 1 — Understand the goal

Ask:
1. **What do you want to accomplish?** (the concrete outcome)
2. **What's the target?** (name, slug, subject)
3. **What's the mechanism?** ({{MECHANISM_EXAMPLES}})
4. **Any constraints?** (environment, credentials, deadlines)

Wait for answers. Do not guess.

## Step 2 — Check what exists

1. Read `CLAUDE.md` status table — already covered?
2. Search `{{UNIT_ROOT}}/` for related work.
3. Skim `docs/reference/glossary.md` for any term in the request you don't know.
4. Skim `docs/reference/gotchas.md` for traps in this area.
5. Find an existing {{UNIT}} as a template.

Report: what exists, which pattern applies, what's new, gotchas found.

## Step 3 — Reload the rules

Before creating files, load:
1. `docs/conventions/operating-rules.md`
2. `docs/conventions/conventions.md`
3. The relevant `docs/reference/` methodology doc (if any)

## Step 4 — Execute

1. Create `{{UNIT_ROOT}}/<slug>/`.
2. Add the artifact(s). Use the artifact's own header comment for primary documentation.
3. Add `notes.md` ONLY if there's research worth keeping that doesn't fit a header.
4. Mark status 🚧 in `CLAUDE.md`.

## Step 5 — Verify

Run `/verify-{{UNIT}}`. Every checklist item must pass.

## Step 6 — Finalize

After confirmation:
1. Update status (✅ / ⚠️) in `CLAUDE.md`.
2. New domain term came up? Add to `glossary.md`.
3. Hit a non-obvious trap? Add to `gotchas.md`.
4. General lesson learned? Update relevant `docs/reference/` doc.
```

---

#### Template: `.claude/commands/verify-{{UNIT}}.md`

```markdown
# Verify {{UNIT_CAPITALIZED}}

Run the verification checklist against a finished {{UNIT}} before marking ✅. Every check passes with evidence.

## Step 1 — Intake

Ask:
1. **Which {{UNIT}}?** (slug)
2. **What scope?** Full checklist or targeted re-check?

## Step 2 — Load context

1. Read everything under `{{UNIT_ROOT}}/<slug>/`.
2. Load the verification section from the relevant `docs/reference/` doc.
3. Skim `gotchas.md` for traps in this area.

## Step 3 — Run the checklist

Go through EVERY item. Each runs a check, captures the result, records pass/fail. Do not skip.

{{VERIFICATION_CHECKLIST_SKELETON}}

## Step 4 — Report

```
## Verification Report — {{UNIT}} / <slug>
### Date: <YYYY-MM-DD>

### Passed (X of Y)
- [checks that passed]

### Failed or Flagged (X of Y)
- [check name]: [result] — [what this means]

### Not yet checked
- [anything skipped with reason]
```

## Step 5 — Decide status

- ✅ — every check passed
- ⚠️ — material checks passed but gaps exist
- 🚧 — material checks failed; not ready

Do NOT update `CLAUDE.md` until the user agrees.

## Step 6 — If anything failed

Propose a fix per failure. Wait for user approval. Re-run after. Do not mark ✅ until re-run passes.

If a failure revealed a non-obvious cause, add to `gotchas.md`.
```

---

#### Template: `.claude/commands/update-knowledge.md`

```markdown
# Update Knowledge for Session Handoff

Conversation is long, or the user is stepping away. Preserve what a new agent needs to continue.

## Step 1 — Assess what changed

Review the conversation. Identify:
1. {{UNIT}}s added, advanced, or investigated
2. Existing docs that need updating
3. New domain terms learned
4. Non-obvious traps hit
5. General lessons across {{UNIT}}s
6. Unfinished work — goal + how far you got
7. Decisions deferred to the user

## Step 2 — Update the repo

Per `docs/conventions/conventions.md` maintenance section:

- **{{UNIT}} completed:** update `CLAUDE.md` status. Ensure final state reflected. Run `/verify-{{UNIT}}`.
- **{{UNIT}} partially advanced:** status to ⚠️ or 🚧. Note what's done + what's left in the unit's `notes.md` (no `TODO:` sections — fold into existing prose).
- **New domain terms:** add to `glossary.md`.
- **Non-obvious traps:** add to `gotchas.md`.
- **Existing doc learned something:** edit in place.
- **General lesson:** update relevant `docs/reference/` doc.
- **Convention change:** update convention first, then bring existing files into compliance.

## Step 3 — Update memory if needed

For things that persist across ALL future conversations (durable preferences, external system references). Do NOT save: temporary state, debugging details, anything already in repo docs.

## Step 4 — Confirm

In one short message: which docs updated, which status changes applied, one-line instruction for the next agent.

Do not write a session-continuation `.md` file. The repo already captures state.
```

---

#### Template: `.claude/commands/update-all.md`

```markdown
# Full Repo Audit

Complete consistency check. Read every convention, every doc, every source file — then fix drift.

## Step 1 — Load source of truth

Read in full:
1. `docs/conventions/operating-rules.md`
2. `docs/conventions/conventions.md`
3. `.claude/rules/{{LANGUAGE}}.md`
4. `CLAUDE.md`
5. `docs/reference/glossary.md`
6. `docs/reference/gotchas.md`
7. Every other `docs/reference/*.md`

## Step 2 — Audit folder structure

1. List every folder under `{{UNIT_ROOT}}/`.
2. Every folder name matches `^[a-z0-9-]+$`. Flag any that don't. (Repo root exempt.)
3. Slug consistency: if a slug exists under `{{UNIT_ROOT}}/` and any sibling root, they match exactly.
4. Repo root allowlist: only `CLAUDE.md`, `README.md`, `.gitignore`, `.mcp.json`, language-standard root files, declared top-level folders.
5. No forbidden files anywhere: `*.bak`, `*.old`, `*-copy.*`, `*-v2.*`, `_scratch.*`, `tmp.*`, `*.session.sql`, `nul`, `desktop.ini`, session-continuation notes.

## Step 3 — Audit every {{UNIT}} folder

For each `{{UNIT_ROOT}}/<slug>/`:
1. Has at least one artifact?
2. Artifact's header comment present and accurate?
3. If `notes.md` exists: follows doc style (heading levels, status markers, no forbidden content)?
4. No credentials, no per-machine output?

## Step 4 — Audit source files

See `.claude/rules/{{LANGUAGE}}.md` for the full list. Check each file against every rule.

## Step 5 — Audit CLAUDE.md

1. Under 150 lines?
2. Preflight block present with 4-5 numbered steps?
3. Folder layout matches disk?
4. Status table: every row = actual folder, every folder = a row, markers match reality?
5. Single status column (not multi-axis, unless explicitly approved)?
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
```

---

#### Template: `.gitignore` (merge with language defaults)

```gitignore
# OS noise
.DS_Store
Thumbs.db
desktop.ini

# Editors
.vscode/
.idea/
.cursor/
*.swp
*~
*.session.sql

# Local personal overrides
CLAUDE.local.md

# Secrets
.env
.env.*
!.env.example
.mcp.json
{{SECRETS_FOLDER_IGNORE}}

# Per-run outputs
**/data/
logs/
*.log

# Build / cache
node_modules/
dist/
build/
__pycache__/
*.pyc
.venv/
venv/
target/
bin/
obj/

# Stray artifacts
nul
```

---

### 2.3 Scoped rule templates by language

Pick the one matching Q4. Write to `.claude/rules/<language>.md`. **Every file MUST start with `globs:` frontmatter** — that's how the harness auto-loads it. The CLAUDE.md pointer is a human reference, not a load mechanism.

---

#### `.claude/rules/powershell.md`

```markdown
---
globs: ["**/*.ps1", "**/*.psm1", "**/*.psd1"]
---

# PowerShell Rules

## Script structure

```powershell
$ErrorActionPreference = 'Stop'

function Write-Log { param([string]$Message)
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    Write-Host "[$ts] $Message"
}

try {
    Write-Log "=== <TaskName> started ==="
    # numbered steps with Write-Log before each
    Write-Log "=== <TaskName> complete ==="
    exit 0
} catch {
    Write-Log "UNHANDLED ERROR: $($_.Exception.Message)"
    Write-Log "Line: $($_.InvocationInfo.ScriptLineNumber)"
    exit 1
}
```

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | Unhandled exception |
| 10+ | Specific numbered failure (document in `.NOTES`) |

## Error handling

- `$ErrorActionPreference = 'Stop'` at the top, always
- Wrap body in `try {} catch {}`
- `Write-Host` for progress; `Write-Error` only before `exit`
- Never log sensitive data

## Naming

- Filenames: `Verb-Noun.ps1` PascalCase with an approved verb
- `$PascalCase` script-scope, `$camelCase` local
- Comment-based help (`.SYNOPSIS`, `.DESCRIPTION`, `.NOTES`) at the top

## Never do

- Hardcode credentials — env vars, SecureString, or credential store
- Invent silent-install flags — verify from the installer
- Log to paths requiring special permissions — prefer `$env:TEMP`
```

---

#### `.claude/rules/typescript.md`

```markdown
---
globs: ["**/*.ts", "**/*.tsx"]
---

# TypeScript Rules

## Types

- `strict: true` in `tsconfig.json`. No `any`. Use `unknown` and narrow.
- `type` for unions/primitives, `interface` for object shapes.
- Never `!` (non-null assertion) to silence the compiler.

## Error handling

- `try/catch` async risky calls; log via project logger; rethrow or return typed result.
- Validate at system boundaries with a schema library (Zod/Valibot).
- Never swallow errors silently.

## Naming

- Files: `kebab-case.ts` (or match project convention)
- Exports: `PascalCase` for classes/types, `camelCase` for functions
- No default exports unless framework requires

## Async

- `async/await` over `.then()` chains
- `Promise.all` for independent awaits
- Always handle rejections

## Never do

- `console.log` in production paths — use the project logger
- Hardcode URLs / credentials / feature flags
```

---

#### `.claude/rules/python.md`

```markdown
---
globs: ["**/*.py"]
---

# Python Rules

## Style

- PEP 8 via `ruff` or `black`
- Type hints on every function signature. `mypy` / `pyright` strict.
- `snake_case` functions/variables, `PascalCase` classes, `UPPER_SNAKE` constants.

## Error handling

- Catch specific exceptions, never bare `except:`
- Context managers (`with`) for any resource
- Let exceptions propagate to the boundary

## Structure

- One public class per module
- Functions under ~40 lines
- Dataclasses / pydantic models over dict-of-string

## Never do

- `print` in library code — use `logging`
- `from module import *` outside `__init__.py`
```

---

#### `.claude/rules/go.md`

```markdown
---
globs: ["**/*.go"]
---

# Go Rules

## Style

- `gofmt` / `goimports` must pass
- `PascalCase` exported, `camelCase` unexported
- Short, lowercase package names

## Error handling

- Check every error
- Wrap with context: `fmt.Errorf("reading config: %w", err)`
- Prefer sentinel or typed errors over string matching

## Concurrency

- Every goroutine has a clear shutdown path
- Always `defer cancel()` after `context.WithCancel/Timeout/Deadline`
```

---

#### `.claude/rules/sql.md`

```markdown
---
globs: ["**/*.sql"]
---

# SQL Rules

## Dialect awareness

State the engine in the file header. Never mix dialects.

| Intent | SQL Server | Oracle | PostgreSQL |
|---|---|---|---|
| Row limit | `TOP 10` | `FETCH FIRST 10 ROWS ONLY` | `LIMIT 10` |
| NULL coalesce | `ISNULL(x, y)` | `NVL(x, y)` | `COALESCE(x, y)` |
| Current datetime | `GETDATE()` | `SYSDATE` | `NOW()` |
| String concat | `'a' + 'b'` | `'a' \|\| 'b'` | `'a' \|\| 'b'` |
| Substring | `SUBSTRING(s,1,3)` | `SUBSTR(s,1,3)` | `SUBSTRING(s,1,3)` |
| String length | `LEN(s)` | `LENGTH(s)` | `LENGTH(s)` |

## File structure

Every `.sql` starts with a comment block:

```sql
-- <project>/<unit> -- <purpose>
-- Engine: {SQL Server | Oracle | PostgreSQL}
-- Source tables: <list>
-- Output columns: N columns
-- Last verified: <YYYY-MM-DD>
```

## {{SQL_ACCESS_POSTURE_BLOCK}}

## Data quality

- Empty strings → NULL via `NULLIF` + trim
- Sentinel dates → NULL with a threshold filter
- ISO codes where available
- Financial amounts preserve full precision

## JOINs — avoid row multiplication

- Know the cardinality of the joined table on the join key BEFORE writing
- 1:many → use aggregation subquery or `OUTER APPLY` / correlated subquery
- After writing: run before/after row-count check against the base table

## Never do

- `SELECT *` in production queries
- Hardcode credentials or absolute server names
- Mutating statements, even commented out
- Implicit date/number conversion — be explicit with `CAST`/`CONVERT`/`TO_DATE`
```

---

#### `.claude/rules/generic.md` (fallback)

```markdown
---
globs: ["**/*"]
---

# Generic Code Rules

## Structure

- One responsibility per file
- Keep functions short; extract helpers when they grow
- Name things so the code reads like prose

## Error handling

- Fail loudly at the boundary (user input, external APIs, file I/O)
- Never swallow errors silently
- Clear exit / return codes

## Secrets

- Never hardcode credentials, tokens, or keys
- Env vars, secret managers, or a dedicated ignored folder
- Never log sensitive values

## Style

- Follow the project's formatter
- Comments explain *why*, never *what*
- No dead code, no commented-out blocks
```

---

### 2.4 Profile overlays

Apply based on Q3. Each overlay adds folders, hard rules, and unit defaults.

---

#### `powershell-automation`

- Add folders: `installers/<slug>/`, `configs/<slug>/` (gitignored)
- {{UNIT}} default: `product` → `products/<slug>/`
- Slug mirror: `products/<slug>/`, `installers/<slug>/`, `configs/<slug>/` use the SAME slug
- Hard rules:
  - Never commit `configs/` — real production credentials
  - Never invent silent-install flags — verify from the installer binary
- Status table: "Verified working products"
- Scoped rule: `.claude/rules/powershell.md`

---

#### `web-scraping`

- Add folders: `src/scrapers/<site>/`, `src/selectors/`, `data/output/` (gitignored), `debug/screenshots/` (gitignored)
- {{UNIT}} default: `scraper` → `src/scrapers/<site>/`
- Hard rules:
  - Selectors live in `src/selectors/`, never inline
  - Always close the browser in `finally`
  - Minimum 1-2s delay between requests, randomized preferred
  - Screenshot on failure
- Scoped rule: `.claude/rules/typescript.md` or `.claude/rules/python.md`

---

#### `web-app`

- Add folders: `src/components/`, `src/pages/` (or `app/`), `src/api/`, `src/services/`, `src/hooks/`, `src/utils/`, `prisma/` or `db/` if DB
- {{UNIT}} default: `feature` → `src/features/<feature>/`
- Hard rules:
  - Business logic in `src/services/`, never in route handlers
  - Styling via project's system, never inline
  - DB schema changes require a migration file
  - Never commit `.env`
- Scoped rule: `.claude/rules/typescript.md`

---

#### `api-service`

- Add folders: `src/routes/`, `src/services/`, `src/models/` or `src/schemas/`, `src/middleware/`, `migrations/`
- {{UNIT}} default: `endpoint` → `src/routes/<resource>/`
- Hard rules:
  - Validate all inputs with a schema at the route boundary
  - Business logic in `src/services/`, never in middleware
  - All responses through a wrapper
  - Migrations append-only
- Scoped rule: language-appropriate

---

#### `cli-tool`

- Add folders: `src/commands/`, `src/lib/`, `tests/`
- {{UNIT}} default: `command` → `src/commands/<name>/`
- Hard rules:
  - Every command has a help string and examples
  - Exit codes documented in README
  - Respect `$HOME`, `$XDG_CONFIG_HOME`, platform equivalents
- Scoped rule: language-appropriate

---

#### `data-pipeline`

- Add folders: `jobs/<job>/`, `schemas/`, `configs/<env>/` (gitignored), `data/` (gitignored)
- {{UNIT}} default: `job` → `jobs/<job>/`
- Hard rules:
  - Every job idempotent — rerunning produces the same result
  - Log start/end timestamps and row counts
  - Schema changes have a documented migration plan
  - Never run against production without a dry-run first
- Scoped rule: language-appropriate

---

#### `sql-extraction`

- Add folders: `<source-system>/<property>/{query,notes,data}/` per source. Multiple roots if multiple source systems. `data/` gitignored.
- Optional: `<source-system>/test-queries/` for limit-restricted iteration variants (e.g. `ROWNUM <= 500`).
- {{UNIT}} default: `property` → `<source-system>/<property>/`
- Spec-first: assume `spec/` is present (trigger spec overlay 2.5)
- Hard rules:
  - READ-ONLY database access — SELECT only, no DDL/DML that modifies
  - Never mix dialects — know the engine per folder
  - Output only spec columns — never add, never omit
  - Parent-before-child for any FK relationship (e.g. customers before stays)
- Scoped rule: `.claude/rules/sql.md`
- Extra commands: `/explore-tables` for reconnaissance phase

---

#### `library`

- Add folders: `src/`, `tests/`, `examples/`, `docs/reference/api/`
- {{UNIT}} default: `module` → `src/<module>/`
- Hard rules:
  - Public API documented — every exported symbol has a doc comment
  - Breaking changes require major version bump and migration note
  - No internal modules leak from package entry point
- Scoped rule: language-appropriate

---

#### `generic`

- Minimum scaffold only: `CLAUDE.md`, two conventions, glossary, gotchas, one scoped rule, four slash commands.
- No profile-specific folders. No status table.

---

### 2.5 Spec overlay (if Q7 = yes)

If spec-driven, add on top of the profile:

- Create `spec/` at root. Spec file(s) live here — source of truth for outputs / schemas / contracts.
- Add to `CLAUDE.md` hard rules:
  - **Never output anything beyond spec.** If an implementation can't meet a spec field, fail loudly or emit the documented sentinel value. Never add extras.
  - **Spec changes precede implementation changes.** Update the spec first, then every dependent artifact.
- Add to `operating-rules.md` under "Source of truth precedence":
  - `spec/` wins over any other doc or implementation. If there's drift, spec wins, implementation gets fixed.

---

### 2.6 External-systems hard-rules block (if Q8 = yes)

If the project talks to external systems, inject this into `CLAUDE.md` hard rules AND `operating-rules.md` as the first rule:

```markdown
## Rule: {{ACCESS_POSTURE}} access to external systems

Connections to {{EXTERNAL_SYSTEMS_LIST}} go through {{CONNECTION_MECHANISM}}:

| System | Operation posture | Credential location |
|---|---|---|
{{EXTERNAL_SYSTEMS_TABLE}}

- **Permitted operations:** {{PERMITTED_OPS}}
- **Forbidden operations:** {{FORBIDDEN_OPS}}
- **Confirmation required before:** {{CONFIRMATION_REQUIRED}}
- **Credentials:** never echo into output, exports, commit messages, or screenshots. Reference by path only.
- **Dry-run requirement:** {{DRY_RUN_POLICY}}
```

For SQL extraction: posture = "READ-ONLY", permitted = "SELECT", forbidden = "INSERT/UPDATE/DELETE/DDL/any DML that modifies".
For web scraper: permitted = "GET only", forbidden = "POST/PUT/DELETE without explicit user approval".
For cloud admin tool: permitted = "read and list", forbidden = "anything destructive without a dry-run first".

---

### 2.7 MCP overlay (if Q9 = yes)

If the project uses MCP servers, add:

**To `.gitignore`:** `.mcp.json` (already in the template — confirm it's there).

**To `CLAUDE.md`** as a section before "Hard rules":

```markdown
## MCP servers

| Server | Purpose | Posture |
|---|---|---|
{{MCP_SERVERS_TABLE}}

`.mcp.json` at the repo root contains the live config and credentials. Never echo into output, exports, commits, or screenshots. `.gitignore` excludes it — still rotate any token that has appeared in plaintext on disk.
```

**To `operating-rules.md`** under "Cross-check every factual claim":

- When using an MCP server, name it explicitly in your reasoning ("via `mssql-db`...") so the user can verify you're hitting the right system.

---

## Phase 3 — Verify

After scaffolding, run these and report:

### Automated

1. **Every path referenced from `CLAUDE.md` exists.** Walk each one.
2. **Every `.claude/rules/*.md` has `globs:` frontmatter.** Without it the rule doesn't auto-load. Mandatory.
3. **Every `.claude/commands/*.md` starts with a `#` H1 and is self-contained.**
4. **No `{{PLACEHOLDER}}` text remains.** Grep for `{{`.
5. **Every folder under `{{UNIT_ROOT}}/` matches `^[a-z0-9-]+$`.** Single most common failure.
6. **Repo root allowlist.** Only `CLAUDE.md`, `README.md` (if requested), `.gitignore`, `.mcp.json` (if applicable), language-standard root files, and declared top-level folders.
7. **No forbidden files.** Grep for `*.bak`, `*.old`, `*-copy.*`, `*-v2.*`, `_scratch.*`, `tmp.*`, `*.session.sql`, `nul`, `desktop.ini`.
8. **Size caps.** `CLAUDE.md` ≤150. `conventions.md` ≤250. `operating-rules.md` ≤100. Each reference doc ≤400.
9. **CLAUDE.md preflight block** present with 4-5 numbered steps (including glossary + gotchas check).
10. **CLAUDE.md hard-rules section** includes: no secrets committed, no files at root outside allowlist, no invented conventions, no `*-v2.md` files, lowercase-hyphen folder rule.
11. **`docs/reference/glossary.md` and `docs/reference/gotchas.md` exist** even if mostly empty.
12. **Spec-driven?** `spec/` exists and `CLAUDE.md` references it.
13. **External systems?** External-systems block is present.
14. **MCP servers?** MCP overlay applied; `.mcp.json` in `.gitignore`.

### Manual

15. **Sample unit folder** matches the pattern declared in `conventions.md`.
16. **Slug consistency** if overlay added sibling directories.
17. **Status table is single-column** unless user explicitly approved multi-axis.
18. **No per-unit how-to doc was created** unless Q6 indicated multiple artifacts AND user wanted one.
19. **`docs/how-to-use-me.md`** exists ONLY if Q12 = yes.

### Report to user

- Tree of files created (and any moved to `docs/archive/` in Phase 0).
- Files the user should customize further.
- How to verify: start a fresh Claude session here, run `/update-all`, confirm "All clear".

---

## Guardrails

- **Never overwrite an existing file without asking.** If `CLAUDE.md` exists, show it and ask: merge, replace, or skip.
- **Never put anything at the repo root that doesn't belong.** Allowlist only.
- **Never invent structure the user didn't ask for.** One-script utility = minimal `CLAUDE.md` + one scoped rule. Match scaffold weight to project scope.
- **Never write session-continuation notes, TODO files, or "next steps" files into the repo.**
- **Never ship with placeholder text.** If a field is unfilled, ask a follow-up — don't write `[TBD]`.
- **Never create per-unit how-to docs by default.** The artifact's header carries it. `notes.md` is for genuine research.
- **Never skip Phase 3.** The greps catch the most common failures (PascalCase folders, missing `globs:` frontmatter, leftover placeholders).
