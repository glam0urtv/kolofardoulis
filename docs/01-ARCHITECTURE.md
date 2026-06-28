# 01 — Architecture

## Φιλοσοφία επιλογών

Είμαστε ένα **boutique, μικρό-μεσαίο e-shop ενός ιδιοκτήτη**, όχι ένα
enterprise marketplace. Άρα προτιμάμε:
- **Managed υπηρεσίες** (Supabase, Vercel, Stripe) αντί για self-hosted infra
  → λιγότερα bugs/συντήρηση, ο ιδιοκτήτης δεν θα διαχειρίζεται servers.
- **Λιγότερα, καλά ενσωματωμένα κομμάτια** αντί για microservices.
- **Postgres ως πηγή αλήθειας για το stock** — όχι cache/Redis ως κύριο
  μηχανισμό, γιατί οι ACID transactions του Postgres είναι το πιο αξιόπιστο
  εργαλείο για να μην ξεπουλήσουμε παραπάνω αποθέματα απ' όσα έχουμε.

## Διάγραμμα συστήματος (υψηλό επίπεδο)

```
                         ┌─────────────────────────┐
                         │        Browser           │
                         │  Next.js (React) client  │
                         │  R3F / GSAP / Framer      │
                         └────────────┬─────────────┘
                                      │ HTTPS
                         ┌────────────▼─────────────┐
                         │   Next.js (Vercel)        │
                         │   App Router + Route      │
                         │   Handlers / Server       │
                         │   Actions                 │
                         └──────┬─────────────┬──────┘
                                │             │
                    ┌───────────▼───┐   ┌─────▼─────────┐
                    │   Supabase     │   │    Stripe      │
                    │ Postgres+Auth  │   │  Checkout +    │
                    │ Storage+RT     │   │  Webhooks      │
                    └────────────────┘   └────────────────┘
```

## Στοίβα & αιτιολόγηση

| Layer | Επιλογή | Γιατί |
|---|---|---|
| Frontend framework | **Next.js 15 (App Router, TS)** | SSR/ISR για SEO στα προϊόντα, server actions για ασφαλή server-side λογική, μεγάλο ecosystem |
| 3D | **React Three Fiber + drei** | Δηλωτικός τρόπος να φτιάξεις Three.js σκηνές μέσα στο React tree, εύκολο lazy-loading ανά route |
| Cinematic scroll | **GSAP + ScrollTrigger**, **Lenis** (smooth scroll) | Βιομηχανικό στάνταρ για scroll-driven storytelling, καλή απόδοση |
| UI micro-animations | **Framer Motion** | Menus, modals, cart drawer, card-flip overlay |
| Client state | **Zustand** | Ελαφρύ, χωρίς boilerplate, καλό για cart/3D scene state |
| Στυλ / UI kit | **Tailwind CSS + shadcn/ui** | Ταχύτητα, συνέπεια, εύκολη προσαρμογή theme |
| DB | **Postgres (μέσω Supabase)** | Σχεσιακή ακεραιότητα + πραγματικά ACID transactions, must-have για το stock |
| ORM / migrations | **Prisma** | Type-safe schema, καθαρά migrations, ευανάγνωστο data model |
| Auth | **Supabase Auth** | Έτοιμο, ασφαλές, υποστηρίζει email/password, magic link, OAuth, ρόλους |
| Storage εικόνων/βίντεο | **Supabase Storage** | Ίδιο οικοσύστημα με DB/Auth, CDN-backed |
| Realtime "sold out" | **Supabase Realtime** | Broadcast αλλαγών stock σε όλους τους συνδεδεμένους clients άμεσα |
| Πληρωμές | **Stripe Checkout + Webhooks** | PCI compliance εκτός των δικών μας servers, αξιόπιστα webhooks, ευρέως δοκιμασμένο |
| Email | **Resend** | Απλό API για emails επιβεβαίωσης παραγγελίας |
| Hosting | **Vercel** | Native fit για Next.js, edge network, εύκολα previews |
| Monitoring | **Sentry** | Error tracking frontend + backend |
| Testing | **Playwright** (E2E, concurrency sims) + **Vitest** (unit) | Καλύπτει UI flows + business logic |

## Δομή repo (ενδεικτική)

```
/app                      → Next.js routes (storefront + /admin)
  /(storefront)/...
  /admin/...
  /api/checkout/route.ts
  /api/webhooks/stripe/route.ts
/components
  /three/                 → R3F σκηνές (BoosterBoxScene, CardFlipScene, ShowcaseScene)
  /ui/                    → shadcn-based κοινά components
  /admin/                 → admin-only components
/lib
  /db.ts                  → Prisma client
  /supabase/               → supabase clients (server/browser)
  /inventory.ts            → reservation/decrement λογική (κρίσιμο αρχείο)
  /stripe.ts
/prisma/schema.prisma
/docs/...                 → αυτά τα MD αρχεία
/.claude/agents/...        → subagents
/tests/
  /e2e/
  /unit/
```

## Σημεία που ΔΕΝ αλλάζουν χωρίς απόφαση του `architect` subagent

- Το μοντέλο δεδομένων του inventory/reservation (`docs/05-...md`).
- Ο τρόπος που γίνεται η πληρωμή (Stripe Checkout, όχι custom card form).
- Η επιλογή Postgres ως πηγή αλήθειας για το stock (όχι Redis-only, όχι
  in-memory counters).
