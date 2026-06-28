# Verify Feature

Run the verification checklist against a finished feature before marking ✅. Every check passes with evidence.

## Step 1 — Intake

Ask:
1. **Which feature?** (slug)
2. **What scope?** Full checklist or targeted re-check?

## Step 2 — Load context

1. Read everything under `src/features/<slug>/`.
2. Read any related `src/services/`, `src/components/` files.
3. Load the relevant verification section from `docs/` domain docs.
4. Skim `gotchas.md` for traps in this area.
5. Load `spec/` if the feature touches data model or inventory.

## Step 3 — Run the checklist

### For every feature

- [ ] Folders follow naming rules (`^[a-z0-9-]+$`)? Conventions match?
- [ ] No secrets, credentials, or per-machine output?
- [ ] No dead code, no `console.log` in production paths?
- [ ] Error handling present for every async boundary?
- [ ] Inputs validated with Zod at route boundary (if applicable)?
- [ ] UI text in Greek, code/comments in English?

### For storefront features

- [ ] Page loads without JS errors? Navigation works?
- [ ] Works with `prefers-reduced-motion` (no 3D dependency for core function)?
- [ ] Responsive — usable on mobile viewport?
- [ ] Meta tags / title present for SEO?

### For checkout / inventory features (CRITICAL)

- [ ] Atomic `UPDATE ... WHERE stock >= quantity` used — never read-then-write?
- [ ] Reservation expires and releases stock back?
- [ ] Webhook handler verified with Stripe signing secret?
- [ ] Webhook handler is idempotent (checks for existing Order)?
- [ ] Every stock change writes an `InventoryAuditLog` row?
- [ ] **Oversell simulation passes?** (stock=N, fire >>N concurrent buys → exactly N succeed)

### For admin features

- [ ] Route protected by `ADMIN` role check (middleware, not just UI)?
- [ ] Stock changes go through inventory service (not raw SQL)?
- [ ] Image upload validates file type/size before Storage upload?
- [ ] Labels/messages in Greek?

### For 3D / animation features

- [ ] Scene lazy-loaded via `dynamic(() => import(...))`?
- [ ] Graceful fallback when WebGL unavailable?
- [ ] `prefers-reduced-motion` shows 2D/CSS alternative?
- [ ] Animation is skippable, with timeout fallback?
- [ ] Stock reservation happens BEFORE animation, not after?

## Step 4 — Report

```
## Verification Report — Feature / <slug>
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
