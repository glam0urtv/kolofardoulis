# CLAUDE.md

Repository instructions for Claude Code. Auto-loaded every conversation. Detail lives in `docs/conventions/` and `docs/reference/`.

## What this project is

**Kolofardoulis.gr** — boutique e-commerce για trading card games (One Piece TCG, μελλοντικά Pokémon, Magic κ.λπ.), ενός ιδιοκτήτη. Οπτικά εντυπωσιακό κατάστημα με 3D/κινηματογραφικό χαρακτήρα (React Three Fiber, GSAP), αλλά πάνω από όλα **άψογο, ασφαλές, μηδενικού-overselling e-shop**. Primary language: TypeScript on Next.js 15 (Node 20+). Profile: web-app.

## Preflight — before touching any file

1. Read `docs/conventions/operating-rules.md` (how to behave) and `docs/conventions/conventions.md` (where things go).
2. Skim `docs/reference/glossary.md` if unfamiliar with TCG/e-commerce domain.
3. Check `docs/reference/gotchas.md` for known traps in the area you're about to touch.
4. Check the feature status table below — know the starting state.
5. State your plan before writing code or docs.

## Folder layout

```
spec/                       source of truth: data model, inventory logic, admin spec
src/
  features/<feature>/        per-feature work (storefront, admin, checkout, inventory)
  components/
    three/                   R3F scenes (BoosterBoxScene, CardFlipScene, ShowcaseScene)
    ui/                      shadcn-based shared components
    admin/                   admin-only components
  services/                  business logic (inventory, stripe, auth)
  hooks/                     shared React hooks
  utils/                     shared utilities
prisma/                      schema + migrations
docs/
  conventions/               rules Claude follows (auto-loaded via pointers)
  reference/                 glossary, gotchas, methodology — load on demand
  archive/                   superseded docs
.claude/
  rules/                     scoped rules auto-loaded by file-glob frontmatter
  commands/                  custom slash commands
  agents/                    subagent definitions (7 agents)
```

## Read these before non-trivial work

1. `docs/conventions/operating-rules.md` — non-negotiable behavior rules
2. `docs/conventions/conventions.md` — folder layout, naming, doc style, maintenance
3. `docs/reference/glossary.md` — domain vocabulary (TCG, e-commerce)
4. `docs/reference/gotchas.md` — known traps; check before debugging anything that "should work"
5. `spec/` — data model, inventory concurrency spec, admin panel spec (source of truth)
6. Domain deep-dives: `docs/01-ARCHITECTURE.md` through `docs/09-ROADMAP.md`

## Scoped rules and commands

- `.claude/rules/typescript.md` — auto-loaded on `**/*.ts`, `**/*.tsx` via frontmatter
- `/new-feature` — end-to-end workflow for adding a new feature
- `/verify-feature` — verification checklist on a finished feature
- `/update-knowledge` — session handoff (updates docs, glossary, gotchas)
- `/update-all` — full repo audit

## How "done" looks

Playwright E2E + Vitest unit tests pass. Mandatory oversell simulation (stock=N, fire >>N concurrent buy requests → exactly N succeed) for any checkout/inventory change. Admin CRUD smoke tests. `qa-tester` subagent must sign off before ✅.

## Secrets

All secrets in `.env` (never committed) or Vercel environment variables. `.mcp.json` gitignored. Reference credentials by path only, never echo into output, exports, commits, or screenshots.

## MCP servers

| Server | Purpose | Posture |
|---|---|---|
| Supabase MCP | Schema, queries, Auth, Storage, Realtime | Read-write |
| GitHub MCP | Repo, commits, PRs, version control | Read-write |
| Stripe MCP | Products, prices, webhooks, test payments | Read-write |
| Playwright MCP | E2E tests, visual checks, concurrency simulations | Read-only |
| Vercel MCP | Deploy, env vars, previews | Read-write |
| Sentry MCP | Error monitoring, post-deploy checks | Read-only |

`.mcp.json` at repo root holds live config and credentials. Never echo into output, exports, commits, or screenshots. `.gitignore` excludes it.

## Subagents

| Agent | When to invoke |
|---|---|
| `architect` | Before any structural decision, schema change, new dependency |
| `db-inventory-engineer` | Anything touching DB, stock, reservations, checkout transactions |
| `frontend-3d-animator` | Storefront UI, 3D scenes, animations, GSAP/ScrollTrigger |
| `payments-security` | Stripe, auth, webhooks, rate-limiting |
| `admin-panel-builder` | The `/admin` dashboard |
| `qa-tester` | Tests — especially concurrency/oversell simulations |
| `devops-release` | Deploy, env vars, production migrations |

Always delegate to the correct subagent. Never do everything in the main context.

## Feature status

| Feature | Status | Notes |
|---|---|---|
| data-model | ✅ | 10 tables + 4 enums migrated, 5 categories + 8 products seeded |
| storefront | ✅ | Live Supabase data, SSR pages, cart, error/loading/404 states |
| checkout | ⚠️ | API + atomic reservation + Stripe code ready — Stripe keys pending |
| inventory | ✅ | Atomic UPDATE service + reservation expiry cron + audit log |
| admin | ✅ | Live data dashboard, categories tree, products table |
| animations-3d | ✅ | ShowcaseScene, BoosterBoxScene, CardFlipScene + reduced-motion |
| realtime | ✅ | Supabase Realtime hook + reservation expiry cron endpoint |
| polish-launch | ⚠️ | Error/loading/404 pages done — needs Vercel deploy + Sentry + Stripe |

Update whenever state changes. Markers: ✅ verified end-to-end, ⚠️ partial, 🚧 in progress, ❌ broken.

Single status column. Sub-status (per-deliverable readiness) goes in the feature's `notes.md`, not here.

## Hard rules

### Rule: Managed access to external systems

Connections to Supabase, Stripe, Vercel, Resend, Sentry go through environment variables:

| System | Operation posture | Credential location |
|---|---|---|
| Supabase | Read-write (DB/Auth/Storage/Realtime) | `.env` — `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Stripe | Read-write (Checkout + Webhooks) | `.env` — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Vercel | Deploy-only | Vercel dashboard |
| Resend | Send-only (transactional email) | `.env` — `RESEND_API_KEY` |
| Sentry | Read-only (error ingestion) | `.env` — `SENTRY_DSN` |

- **Permitted operations:** Supabase full CRUD, Stripe Checkout creation + webhook handling, Vercel deploys, Resend send, Sentry error read.
- **Forbidden operations:** Raw card data on our servers (PCI stays at Stripe), production DB drops without backup, destructive Stripe operations without dry-run.
- **Confirmation required before:** production deploy, destructive DB migration, Stripe live-mode switch.
- **Credentials:** never echo into output, exports, commit messages, or screenshots. Reference by path only.

### Spec precedence

`spec/` wins over any other doc or implementation. If there's drift, spec wins, implementation gets fixed. Never output anything beyond spec without updating the spec first.

- **Never put files at the repo root** outside the allowlist (`CLAUDE.md`, `.gitignore`, `.mcp.json`, `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `components.json`, declared top-level folders).
- **Never commit secrets.** No credentials, tokens, or keys in tracked files.
- **Never invent conventions.** If something isn't in `docs/conventions/`, ask.
- **Never create `*-v2.md`, `*-new.md`, `*.bak`.** Edit in place; archive to `docs/archive/` if truly superseded.
- **Never mark a feature ✅ without end-to-end verification.** Use 🚧 until proven, ⚠️ for partial.
- **Lowercase-hyphen folders.** Every folder matches `^[a-z0-9-]+$`.
- **Never oversell.** Atomic `UPDATE ... WHERE stock >= quantity` ALWAYS. No read-then-write for inventory.
- **Spec changes precede implementation changes.** Update the spec first, then every dependent artifact.
- **Business logic in `src/services/`, never in route handlers.** Validation at route boundary with Zod.
- **DB schema changes require a migration file.** Prisma migrations, append-only.
- **Never commit `.env`.** Vercel env vars for production.
