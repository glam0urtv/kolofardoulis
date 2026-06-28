# 05 — Inventory Concurrency Safety (το πιο κρίσιμο αρχείο)

## Το πρόβλημα

Δύο (ή 50) άνθρωποι πατάνε "Αγόρασε" το τελευταίο τεμάχιο ταυτόχρονα. Χωρίς
σωστή λογική, θα γίνουν 2+ πωλήσεις για 1 τεμάχιο. **Αυτό δεν επιτρέπεται να
συμβεί ποτέ.**

## Λύση: Reserve → Pay → Confirm/Release

### Βήμα 1 — Reservation (atomic, μέσα στο ίδιο SQL statement)

Όταν ο χρήστης πατά "Αγόρασε", ΠΡΙΝ ανοίξει το Stripe Checkout, εκτελείται:

```sql
UPDATE "Inventory"
SET stock = stock - :quantity
WHERE "productId" = :productId AND stock >= :quantity
RETURNING stock;
```

- Αν επιστραφεί γραμμή → επιτυχία, δημιουργείται `StockReservation`
  (status `PENDING`, `expiresAt = now() + 10 λεπτά`) και ανοίγει το Stripe
  Checkout.
- Αν **δεν** επιστραφεί γραμμή (0 rows) → δεν υπήρχε αρκετό stock. Ο χρήστης
  βλέπει αμέσως "Εξαντλήθηκε", **δεν** ανοίγει καθόλου το checkout.

Αυτό είναι ασφαλές κάτω από ταυτόχρονα requests επειδή το `UPDATE ... WHERE
stock >= quantity` είναι **μία** atomic ενέργεια στο Postgres — δεν υπάρχει
παράθυρο "read, μετά write" όπου να παρεμβληθεί άλλο request.

### Βήμα 2 — Stripe Checkout

Ο χρήστης πληρώνει. Η δέσμευση του stock έχει **ήδη** γίνει στο Βήμα 1, οπότε
δεν τρέχει κίνδυνος ενόσω είναι στη σελίδα πληρωμής.

### Βήμα 3α — Επιβεβαίωση (webhook `checkout.session.completed`)

- Το `StockReservation` γίνεται `CONFIRMED`.
- Δημιουργείται `Order` + `OrderItem`s.
- **Δεν** ξαναγίνεται αφαίρεση από το stock (έχει ήδη γίνει στο Βήμα 1).
- Γράφεται `InventoryAuditLog` (`delta: -quantity, reason: "order", actorId: "system"`).
- Webhook πρέπει να είναι **idempotent** (έλεγχος αν το `stripeSessionId`
  υπάρχει ήδη ως `Order` πριν δημιουργήσει νέο — προστασία από διπλή
  επεξεργασία retry του Stripe).

### Βήμα 3β — Αποτυχία / λήξη (webhook `checkout.session.expired` ή timeout cron)

- Ένα scheduled job (Vercel Cron / Supabase Edge Function, κάθε 1-2 λεπτά)
  ψάχνει `StockReservation` με `status = PENDING AND expiresAt < now()`.
- Για κάθε μία: `status = RELEASED` + `UPDATE Inventory SET stock = stock + quantity`.
- Έτσι το stock "ξεπαγώνει" αν κάποιος εγκαταλείψει την πληρωμή.

## Realtime sold-out (καμία ψεύτικη διαθεσιμότητα)

Μετά από κάθε επιτυχή reservation, αν το νέο `stock = 0`, broadcast μέσω
Supabase Realtime σε channel `product:{id}` ένα event `sold_out: true`. Όλοι
οι browsers που κοιτάζουν εκείνη τη σελίδα ενημερώνονται **άμεσα** χωρίς
refresh — το κουμπί "Αγόρασε" απενεργοποιείται.

## Bot / scalper προστασία

- Rate limiting στο endpoint αγοράς (π.χ. max N requests/λεπτό ανά IP).
- Προαιρετικό μέγιστο ποσοτήτων ανά παραγγελία/πελάτη για περιορισμένα
  προϊόντα (π.χ. "max 2 booster boxes ανά παραγγελία" — ρυθμιζόμενο από admin).
- CAPTCHA/challenge μόνο αν εντοπιστεί ασυνήθιστο burst (όχι by default σε
  κάθε χρήστη — δεν θέλουμε τριβή στην εμπειρία).

## Test που ΠΡΕΠΕΙ να υπάρχει (ανάθεση στον `qa-tester` subagent)

Simulation: stock = 10, εκτελούνται 500 ταυτόχυρα requests "αγόρασε 1
τεμάχιο" στο ίδιο προϊόν. **Ακριβώς 10** πρέπει να πετύχουν, τα υπόλοιπα 490
πρέπει να πάρουν "Εξαντλήθηκε" — όχι λιγότερα, όχι περισσότερα από 10
επιτυχίες. Αυτό το test τρέχει σε κάθε αλλαγή κώδικα που αγγίζει checkout ή
inventory.
