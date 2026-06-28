# Glossary

Domain vocabulary for this project. Add a term whenever you have to ask the user "what does X mean?" or look it up. One-line entries.

| Term | Meaning |
|---|---|
| TCG | Trading Card Game — συλλεκτικό παιχνίδι καρτών (π.χ. One Piece, Pokémon, Magic: The Gathering) |
| Single (card) | Μία μεμονωμένη κάρτα προς πώληση |
| Booster Box | Σφραγισμένο κουτί που περιέχει πολλαπλά booster packs (συνήθως 24) |
| Booster Pack | Σφραγισμένο πακέτο που περιέχει τυχαίες κάρτες (συνήθως 6–12) |
| Promo | Προωθητική/σπάνια κάρτα, συχνά από events ή ειδικές εκδόσεις |
| Stock / Απόθεμα | Το πραγματικό, διαθέσιμο απόθεμα ενός προϊόντος (μετά από reservations) |
| Reservation / Δέσμευση | Προσωρινό "κράτημα" αποθέματος όσο διαρκεί ένα checkout — εμποδίζει διπλή πώληση |
| Atomic update | SQL UPDATE που ελέγχει και μειώνει το stock σε ΜΙΑ εντολή — χωρίς παράθυρο read-then-write |
| Overselling | Πώληση παραπάνω τεμαχίων απ' όσα υπάρχουν — το απόλυτο bug που ΔΕΝ επιτρέπεται |
| Stripe Checkout | Hosted πληρωμή από τη Stripe — ο πελάτης πληρώνει στη Stripe, όχι στον δικό μας server |
| Supabase Realtime | Broadcast αλλαγών στη βάση σε πραγματικό χρόνο σε όλους τους συνδεδεμένους clients |
| R3F | React Three Fiber — React renderer για Three.js, δηλωτικός τρόπος για 3D σκηνές |
| GSAP | GreenSock Animation Platform — βιβλιοθήκη για high-performance animations, ειδικά scroll-driven |
| ScrollTrigger | GSAP plugin που συνδέει animations με τη θέση scroll |
| Lenis | Smooth-scroll library που αντικαθιστά το native scroll με ομαλή κύλιση |
| Framer Motion | React βιβλιοθήκη για declarative animations (menus, modals, transitions) |
| Zustand | Ελαφρύ state management για React, χωρίς boilerplate |
| shadcn/ui | Συλλογή από αντιγράψιμα React components βασισμένα σε Radix UI + Tailwind |
| Prisma | Type-safe ORM για Node.js/TypeScript — schema, migrations, query builder |
| InventoryAuditLog | Πίνακας που καταγράφει ΚΑΘΕ μεταβολή αποθέματος (ποιος, πότε, πόσο, γιατί) |
| StockReservation | Πίνακας που κρατά "παγωμένο" το απόθεμα κατά τη διάρκεια ενός checkout |
| HomeSection | Data-driven section της αρχικής σελίδας (Hero, Featured, Banner) — ο admin τα διαχειρίζεται χωρίς κώδικα |
| Vercel | Hosting πλατφόρμα optimized για Next.js, με edge network και preview deployments |
| Sentry | Error monitoring — συλλέγει και ομαδοποιεί σφάλματα από frontend και backend |
| Resend | API για αποστολή transactional emails (επιβεβαιώσεις παραγγελιών κ.λπ.) |

## How to use

- **Reading first time?** Skim before diving into unfamiliar code.
- **Found a term you didn't know?** Add it after you confirm the meaning. Don't guess.
- **Term meaning changed?** Edit in place. The previous meaning is dead.
- **Term is project-internal jargon, not industry-standard?** Mark with `(internal)` after the term.
