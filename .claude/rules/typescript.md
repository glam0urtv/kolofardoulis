---
globs: ["**/*.ts", "**/*.tsx"]
---

# TypeScript Rules

## Types

- `strict: true` in `tsconfig.json`. No `any`. Use `unknown` and narrow.
- `type` for unions/primitives, `interface` for object shapes.
- Never `!` (non-null assertion) to silence the compiler.
- Validate at system boundaries with Zod — same schemas client + server.

## Error handling

- `try/catch` async risky calls; log via project logger; rethrow or return typed result.
- Never swallow errors silently.
- Stripe webhook handlers: always verify signature first, then check idempotency.

## Naming

- Files: `kebab-case.ts` / `kebab-case.tsx`
- Exports: `PascalCase` for components/classes/types, `camelCase` for functions/variables
- No default exports unless the framework requires (Next.js pages/layouts are the exception)
- React components: one component per file, filename matches component name

## Async

- `async/await` over `.then()` chains
- `Promise.all` for independent awaits
- Always handle rejections
- Server Actions: wrap in try/catch, return typed results (`{ success, data, error }`)

## React / Next.js specifics

- **Server Components by default.** Only add `'use client'` when you need interactivity, browser APIs, or state.
- **Data fetching in Server Components.** Direct Prisma calls, no `useEffect` + fetch waterfall.
- **Server Actions for mutations.** Form actions → Server Action → service layer → DB. No API routes for forms.
- **Route handlers (`/api/`) only for webhooks and external callbacks** (Stripe, Resend). Not for internal mutations.
- **3D scenes: `dynamic(() => import('...'), { ssr: false })`.** Never in the initial bundle.
- **Metadata exports** for SEO on every page.

## Styling

- Tailwind CSS for all styling. Use `cn()` from `@/lib/utils` for conditional classes.
- shadcn/ui components as base; customize via Tailwind, not CSS overrides.
- No inline styles (`style={{}}`) except for dynamic values (e.g. animation progress).
- Dark mode support via Tailwind `dark:` prefix — but TCG shop is light-themed by default.

## Never do

- `console.log` in production paths — use the project logger
- Hardcode URLs / credentials / feature flags — env vars or constants files
- Raw SQL for inventory mutations — use Prisma with the atomic update pattern from `spec/`
- `any` to work around type errors — fix the types
- `useEffect` for data fetching — Server Components or Server Actions
- Block the main thread with heavy computation — Web Workers or server-side
