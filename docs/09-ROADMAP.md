# 09 — Roadmap (φάσεις υλοποίησης)

> Αρχή: **πρώτα το σωστό/ασφαλές θεμέλιο, μετά τα οπτικά εφέ.**

## Φάση 0 — Setup
- Next.js project, repo στο GitHub, Vercel project.
- Supabase project (DB/Auth/Storage/Realtime), Prisma αρχικό schema.
- Βασικό design system (χρώματα, τυπογραφία, shadcn theme).

## Φάση 1 — Data model
- Migrations για όλα τα μοντέλα (`docs/03-DATA-MODEL.md`).
- Seed data: μία κατηγορία (One Piece) με Singles/Booster Boxes/Promo και
  μερικά demo προϊόντα.

## Φάση 2 — Storefront core (χωρίς animations)
- Πλοήγηση κατηγοριών, λίστα προϊόντων, σελίδα προϊόντος.
- Καλάθι, checkout flow με Stripe, reservation/sold-out λογική **πλήρως
  λειτουργική** (βλ. `05-...md`).
- Στόχος φάσης: ένα 100% σωστό, ασφαλές e-shop, ακόμα κι αν είναι "άσχημο".

## Φάση 3 — Admin panel
- CRUD κατηγοριών/προϊόντων/sections/media.
- Διαχείριση παραγγελιών & αποθέματος με audit log.

## Φάση 4 — 3D περιβάλλον & cinematic scroll
- `ShowcaseScene` στην αρχική, GSAP ScrollTrigger reveals.

## Φάση 5 — Purchase animations
- `BoosterBoxScene`, `CardFlipScene`, συνδεδεμένα με το πραγματικό
  reservation flow (όχι mock).
- Reduced-motion/mobile fallback.

## Φάση 6 — Realtime & αντι-κατάχρηση
- Supabase Realtime broadcast για sold-out.
- Rate limiting σε checkout/login.
- Concurrency/oversell load test (βλ. `05-...md`) — **πρέπει να περάσει πριν
  το launch**.

## Φάση 7 — Στιλιζάρισμα & launch
- Accessibility pass, Lighthouse performance audit.
- Sentry σε production, τελικό QA.
- Νομικά κείμενα (Όροι, Απόρρητο, Επιστροφές) έτοιμα.
- Launch.
