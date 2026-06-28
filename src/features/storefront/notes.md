# Storefront Feature

> 🚧 In progress — Φάση 2 του roadmap.

## Τι περιλαμβάνει

- Πλοήγηση κατηγοριών (δενδρική, από admin)
- Λίστα προϊόντων με φιλτράρισμα/ταξινόμηση
- Σελίδα προϊόντος (εικόνες, attributes, stock, CTA)
- Καλάθι (Zustand)
- Checkout flow (Stripe Checkout) — reservation ΠΡΙΝ το Stripe session
- Sold-out realtime (Supabase Realtime)

## Αρχεία

- `page.tsx` — κύρια σελίδα storefront
- `category/[slug]/page.tsx` — σελίδα κατηγορίας
- `product/[slug]/page.tsx` — σελίδα προϊόντος
- `cart.tsx` — cart drawer component
- `checkout.ts` — checkout server action
