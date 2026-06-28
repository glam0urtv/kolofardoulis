# Operating Rules

Non-negotiable rules for Claude in this repo. Override general defaults when they conflict.

## Rule: Managed access to external systems

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
- **Dry-run requirement:** for any destructive operation (DB, Stripe, deploy), confirm scope with user first.

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
- When using an MCP server, name it explicitly in your reasoning ("via `supabase` MCP...") so the user can verify you're hitting the right system.

## Check the gotchas before debugging

If something "should work" but doesn't, check `docs/reference/gotchas.md` BEFORE forming a theory. Half the time the trap is already documented.

## Source of truth precedence

`spec/` wins over any other doc or implementation. If there's drift, spec wins, implementation gets fixed. Don't silently adopt the implementation's pattern.

When convention docs and implementation disagree, the convention wins AND the implementation gets fixed. Don't silently adopt the implementation's pattern.

## Verify before declaring done

Before marking any feature ✅, run `/verify-feature`. Every checklist item must pass with evidence.

## One unit at a time

Don't work on multiple features in parallel unless the user explicitly asks. Complete one fully before starting the next.

## Document where it belongs

| What you learned | Where it goes |
|---|---|
| About this feature | The feature's `notes.md` (if it exists) or the artifact's header comment |
| A domain term | `docs/reference/glossary.md` |
| A non-obvious trap | `docs/reference/gotchas.md` |
| Pattern across features | `docs/reference/<topic>.md` |
| Rule for Claude's behavior | `docs/conventions/operating-rules.md` |
| Collaboration preference (user → Claude) | Memory |

## Profile-specific rules (web-app)

- **Business logic in `src/services/`, never in route handlers.** Route handlers handle HTTP — services handle the domain.
- **Validate all inputs with Zod at the route boundary.** Same schemas client + server.
- **DB schema changes require a Prisma migration.** Append-only; never edit an existing migration after it's applied.
- **Styling via Tailwind CSS + shadcn/ui.** Never inline styles or one-off CSS modules without a documented reason.
- **3D scenes lazy-loaded via `dynamic(() => import(...))`.** Never in the initial bundle of non-3D routes.
- **Every animation respects `prefers-reduced-motion`.** Provide a 2D/CSS fallback for every 3D/animated interaction.
- **UI text in Greek, code in English.** Κείμενα/μηνύματα προς τον τελικό χρήστη στα Ελληνικά. Κώδικας, commits, comments, variable names στα Αγγλικά.
