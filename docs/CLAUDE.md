# Kolofardoulis.gr — Master Project Brief (Mega Prompt)

> Αυτό το αρχείο διαβάζεται αυτόματα από το Claude Code σε κάθε session.
> Περιέχει το όραμα, τους κανόνες, και το πλάνο. Δεν αλλάζει εύκολα — όλα τα
> υπόλοιπα `docs/*.md` μπαίνουν σε λεπτομέρεια, αυτό είναι η "πυξίδα".

## 1. Τι φτιάχνουμε

**Kolofardoulis.gr** είναι ένα e-commerce site τύπου Shopify, εξειδικευμένο σε
trading card games (π.χ. One Piece TCG). Δεν είναι γενικό πρότυπο — είναι ένα
boutique, οπτικά εντυπωσιακό κατάστημα με 3D / κινηματογραφικό χαρακτήρα, αλλά
από κάτω-κάτω **πρέπει να είναι ένα άψογο, ασφαλές, μηδενικού-overselling
ηλεκτρονικό κατάστημα**. Η εμπειρία είναι το "make-up", η ορθότητα του stock
και των πληρωμών είναι το "σκελετό". Το ένα δεν αντικαθιστά το άλλο.

Δες αναλυτικά: `docs/02-VISION.md`

## 2. Μη-αρνητικέ απαιτήσεις (non-negotiable)

1. **Ποτέ overselling.** Αν το stock ενός προϊόντος είναι 0, ΔΕΝ μπορεί να
   ολοκληρωθεί άλλη αγορά — ούτε αν 50 άτομα πατήσουν "Αγόρασε" το ίδιο
   δευτερόλεπτο. Βλ. `docs/05-INVENTORY-CONCURRENCY-SAFETY.md`.
2. **Ασφάλεια πληρωμών πάνω από όλα.** Stripe Checkout, ποτέ raw κάρτες στον
   server μας, webhooks πάντα verified. Βλ. `docs/08-SECURITY-PAYMENTS.md`.
3. **Καμία λειτουργία δεν "σπάει" λόγω animation.** Τα 3D/cinematic εφέ είναι
   προαιρετικό layer πάνω από ένα site που δουλεύει 100% και χωρίς αυτά
   (graceful degradation σε αδύναμες συσκευές / `prefers-reduced-motion`).
4. **Ο ιδιοκτήτης ελέγχει τα πάντα από το admin** — sections, categories,
   προϊόντα, εικόνες, stock — χωρίς να αγγίζει κώδικα.
5. **Καθαρός, δοκιμασμένος κώδικας.** Καμία αλλαγή σε checkout/inventory
   χωρίς αντίστοιχο test (βλ. `qa-tester` subagent).

## 3. Στοίβα τεχνολογιών (απόφαση — βλ. αιτιολόγηση στο `docs/01-ARCHITECTURE.md`)

- **Next.js 15 (App Router, TypeScript)** — frontend + backend σε ένα monorepo
- **Supabase** — Postgres DB, Auth, Storage (εικόνες), Realtime (live sold-out)
- **Prisma** — schema & migrations πάνω στη Supabase Postgres
- **React Three Fiber + drei** — 3D σκηνές (booster box, vitrine)
- **GSAP (ScrollTrigger) + Lenis** — κινηματογραφικό scroll
- **Framer Motion** — μικρο-animations UI (menu, cart, card flip overlay)
- **Zustand** — client state (cart, 3D scene state)
- **Tailwind CSS + shadcn/ui** — storefront & admin UI components
- **Stripe** — πληρωμές (Checkout Sessions + Webhooks)
- **Resend** — emails (επιβεβαίωση παραγγελίας)
- **Vercel** — hosting/deploy
- **Sentry** — error monitoring
- **Playwright + Vitest** — testing

## 4. MCP servers που χρησιμοποιούμε

Βλ. `docs/04-MCP-LIST.md` για την πλήρη λίστα ονομαστικά (Supabase, GitHub,
Stripe, Playwright, Vercel, Sentry). Δεν χρειάζεται να τα εγκαταστήσεις εσύ —
απλά πες στο Claude Code "σύνδεσε το Supabase/Stripe/... MCP" όταν φτάσεις στο
αντίστοιχο βήμα.

## 5. Subagents (`.claude/agents/`)

| Agent | Πότε καλείται |
|---|---|
| `architect` | Πριν από κάθε δομική απόφαση / αλλαγή schema |
| `db-inventory-engineer` | Οτιδήποτε αγγίζει DB, stock, reservations, checkout transactions |
| `frontend-3d-animator` | Storefront UI, 3D σκηνές, animations |
| `payments-security` | Stripe, auth, webhooks, rate-limiting |
| `admin-panel-builder` | Το `/admin` dashboard |
| `qa-tester` | Tests — ειδικά concurrency/oversell simulations |
| `devops-release` | Deploy, env vars, migrations σε production |

Ο κύριος agent (εσύ, Claude Code) **πρέπει** να αναθέτει σε αυτά τα subagents
ανάλογα με το task, όχι να κάνει τα πάντα μόνος του στο ίδιο context.

## 6. Σειρά υλοποίησης

Ακολούθα το `docs/09-ROADMAP.md`. Με μία πρόταση: **πρώτα το σωστό θεμέλιο
(σωστό stock, σωστές πληρωμές, σωστό admin) — μετά τα οπτικά εφέ.**

## 7. Πώς να δουλεύεις σε αυτό το project

- Διάβασε πάντα το σχετικό `docs/*.md` πριν αγγίξεις τον αντίστοιχο τομέα.
- Μην προσθέτεις dependency/infra που δεν αναφέρεται εδώ χωρίς να ρωτήσεις.
- Κάθε αλλαγή σε checkout/inventory **πρέπει** να συνοδεύεται από test.
- Όλα τα κείμενα/μηνύματα προς τον τελικό χρήστη στα Ελληνικά (ο κώδικας,
  τα commits, τα comments μπορούν να είναι Αγγλικά).
- Αν κάτι στο όραμα είναι ασαφές, ρώτα τον ιδιοκτήτη — μην υποθέτεις σε
  σημεία που αγγίζουν χρήματα/stock.
