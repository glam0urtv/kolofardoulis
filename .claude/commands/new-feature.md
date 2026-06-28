# New Feature

The user wants to add a new feature to this repo.

## Step 1 — Understand the goal

Ask:
1. **What do you want to accomplish?** (the concrete outcome)
2. **What's the target?** (name, slug, subject)
3. **What's the mechanism?** (new route, new service, new component group, new 3D scene)
4. **Any constraints?** (environment, credentials, deadlines, dependencies on other features)

Wait for answers. Do not guess.

## Step 2 — Check what exists

1. Read `CLAUDE.md` status table — already covered?
2. Search `src/features/` for related work.
3. Skim `docs/reference/glossary.md` for any term in the request you don't know.
4. Skim `docs/reference/gotchas.md` for traps in this area.
5. Find an existing feature as a template.

Report: what exists, which pattern applies, what's new, gotchas found.

## Step 3 — Reload the rules

Before creating files, load:
1. `docs/conventions/operating-rules.md`
2. `docs/conventions/conventions.md`
3. The relevant `docs/` domain doc (e.g. `05-INVENTORY-CONCURRENCY-SAFETY.md` for checkout, `06-ANIMATIONS-3D-UX.md` for 3D)
4. `spec/` if the feature touches data model or inventory

## Step 4 — Consult subagents

For the right domain, invoke the appropriate subagent BEFORE writing production code:
- DB/inventory/checkout → `db-inventory-engineer`
- 3D/animation/UI → `frontend-3d-animator`
- Payments/auth/webhooks → `payments-security`
- Admin panel → `admin-panel-builder`

The subagent validates the approach. Don't skip this for safety-critical features.

## Step 5 — Execute

1. Create `src/features/<slug>/` (plus `src/components/`, `src/services/` additions as needed).
2. Add the artifact(s). Use the artifact's own header comment for primary documentation.
3. Add `notes.md` ONLY if there's research worth keeping that doesn't fit a header.
4. Mark status 🚧 in `CLAUDE.md`.

## Step 6 — Verify

Run `/verify-feature`. Every checklist item must pass.

## Step 7 — Finalize

After confirmation:
1. Update status (✅ / ⚠️) in `CLAUDE.md`.
2. New domain term came up? Add to `glossary.md`.
3. Hit a non-obvious trap? Add to `gotchas.md`.
4. General lesson learned? Update relevant `docs/reference/` doc or `docs/` domain doc.
5. If the feature touched checkout/inventory: `qa-tester` MUST run the oversell simulation.
