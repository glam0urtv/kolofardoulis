# Repository Conventions

How this repo is organized, named, documented, and maintained. Read before creating any file.

## Folder responsibilities

| Folder | Contains | Does NOT contain |
|---|---|---|
| `docs/conventions/` | Rules Claude follows. Two files only: `operating-rules.md`, `conventions.md`. | Methodology, domain reference, anything project-specific |
| `docs/reference/` | Glossary, gotchas, methodology, platform notes. Load on demand. | Rules, user-facing content |
| `docs/archive/` | Superseded docs kept for history | Active docs |
| `spec/` | Source of truth: data model, inventory concurrency, admin spec | Implementation code |
| `src/features/<slug>/` | Everything for ONE feature: components, services, hooks, optional `notes.md` | Credentials, vendor binaries, session-continuation notes |
| `src/components/three/` | R3F 3D scenes (lazy-loaded per route) | Business logic, DB calls |
| `src/components/ui/` | shadcn-based shared components | Feature-specific components |
| `src/components/admin/` | Admin-only UI components | Storefront components |
| `src/services/` | Business logic: inventory, stripe, auth | Route handlers, React components |
| `src/hooks/` | Shared React hooks | Business logic |
| `src/utils/` | Shared utilities | Business logic |
| `prisma/` | Schema + migrations | Application code |
| `.claude/rules/` | Scoped rules auto-loaded via `globs:` frontmatter | Anything else |
| `.claude/commands/` | Custom slash commands | Anything else |
| `.claude/agents/` | Subagent definitions | Application code |

## Naming rules

**Every folder name matches `^[a-z0-9-]+$`.** No spaces, no underscores, no PascalCase, no version numbers. `/update-all` enforces this. The repo root itself is exempt.

| Type | Convention | Example |
|---|---|---|
| Folder names | lowercase-hyphen | `storefront`, `booster-box-animation` |
| Reference doc | `kebab-case.md` in `docs/reference/` | `glossary.md`, `tcg-schema.md` |
| Feature notes (optional) | `notes.md` in `src/features/<slug>/` | `notes.md` |
| TypeScript source | `kebab-case.ts` / `.tsx` | `product-card.tsx`, `inventory.ts` |
| Convention docs | exactly `conventions.md` and `operating-rules.md` | (no other names allowed) |
| Roadmap/vision docs | `NN-TOPIC.md` in `docs/` | `01-ARCHITECTURE.md`, `02-VISION.md` |

**Forbidden in any filename:** spaces, underscores in folders, mixed case in folders, version markers (`v2`, `final`, `new`), `-copy`, `-backup`, `_draft`.

**Slug consistency.** If a feature exists under `src/features/<slug>/`, the same slug appears in every sibling location: configs, tests, status table. One slug, used everywhere.

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
| A new feature | `src/features/<slug>/` |
| Business logic (inventory, stripe, auth) | `src/services/<name>.ts` |
| A shared UI component | `src/components/ui/<name>.tsx` |
| A 3D scene | `src/components/three/<SceneName>.tsx` |
| An admin component | `src/components/admin/<Name>.tsx` |
| A shared hook | `src/hooks/<name>.ts` |
| A utility function | `src/utils/<name>.ts` |
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

- Always tag the language: ` ```typescript `, ` ```bash `, ` ```json `, ` ```text `
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
- **Κώδικας, commits, comments: Αγγλικά.** Κείμενα/μηνύματα προς τον τελικό χρήστη: Ελληνικά.

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
| Technical knowledge about features / platform | `docs/reference/` | Future agents need it |
| Rules Claude follows | `docs/conventions/operating-rules.md` | Auto-loaded |
| Where things live | `docs/conventions/conventions.md` | Auto-loaded |
| In-progress work / current state | Conversation or plan | Ephemeral |

### Maintenance triggers

**You finished a NEW feature.** Add the row to `CLAUDE.md` status. Add code/artifacts to `src/features/<slug>/`. Optional `notes.md` only if there's research worth keeping.

**You discovered new info about an EXISTING feature.** Edit in place. If it invalidates verified status, downgrade marker.

**You learned a domain term.** One-line entry in `glossary.md`.

**You hit a non-obvious trap.** Entry in `gotchas.md` with: what seems true / what's actually true / why it matters.

**You discovered a general lesson.** Update the relevant `docs/reference/` doc. If contradicts existing text, fix the existing text — don't append "Note: actually...".

**The user gave you durable feedback.** Save to memory, not the repo.

### How to update

**Edit in place.** Never `*-v2.md`, `*-new.md`, `*-updated.md`. If superseded, move old to `docs/archive/` and rewrite under the original name.

**Update CLAUDE.md only when needed.** It's auto-loaded every session. Update for: new feature (status table), new convention or reference doc every session should know about, hard-rule changes, folder layout changes.

**Don't update CLAUDE.md for routine per-feature edits.**

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
