# 08 — Security & Payments

## Πληρωμές

- **Stripe Checkout** (hosted page) — ποτέ δεν περνάνε στοιχεία κάρτας από
  τους δικούς μας servers (PCI compliance μένει στη Stripe).
- Webhooks (`checkout.session.completed`, `checkout.session.expired`,
  `payment_intent.payment_failed`) **πάντα** verified με το Stripe signing
  secret πριν επεξεργαστούν.
- Idempotency: κάθε webhook handler ελέγχει αν το `stripeSessionId` έχει ήδη
  γίνει `Order` πριν δημιουργήσει νέο (προστασία από διπλό-trigger retries).

## Auth

- **Supabase Auth** για πελάτες (email/password ή magic link, προαιρετικό
  Google OAuth) και για τον admin (ξεχωριστή ροή/ρόλος, συνιστάται 2FA).
- Hashed passwords (το χειρίζεται η Supabase), email verification.

## Γενική ασφάλεια εφαρμογής

- HTTPS παντού (Vercel default), secure/httpOnly cookies.
- Έλεγχος εισόδου (validation) με Zod schemas, ίδια σχήματα client+server.
- Rate limiting σε ευαίσθητα endpoints: login, checkout, password reset.
- CSRF protection σε φόρμες state-changing.
- Sentry για παρακολούθηση σφαλμάτων production σε real time.

## Backups & συνέχεια λειτουργίας

- Αυτόματα daily backups Postgres (Supabase managed) + point-in-time
  recovery ενεργό.
- Environment secrets (Stripe keys, Supabase keys) μόνο σε Vercel
  environment variables — ποτέ committed στο repo.

## Νεαρό κοινό / καταναλωτική προστασία (γενική υπενθύμιση, όχι νομική συμβουλή)

- Σαφείς, ορατές τιμές χωρίς κρυφά κόστη στο checkout.
- Σαφείς Όροι Χρήσης / Πολιτική Απορρήτου / Πολιτική Επιστροφών στα Ελληνικά.
- Καλό είναι ένας λογιστής/δικηγόρος να επιβεβαιώσει τις υποχρεώσεις
  απόσταση-πώλησης (π.χ. δικαίωμα υπαναχώρησης 14 ημερών στην ΕΕ) και τις
  φορολογικές/ΦΠΑ υποχρεώσεις πριν το launch — αυτό είναι εκτός του πεδίου
  του κώδικα/architecture.
