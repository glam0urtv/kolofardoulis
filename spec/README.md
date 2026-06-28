# spec/ — Source of Truth

Τα spec files ορίζουν το **τι** χτίζουμε. Κάθε υλοποίηση πρέπει να συμμορφώνεται με τα specs εδώ — αν υπάρχει drift, το spec κερδίζει και η υλοποίηση διορθώνεται.

## Τρέχοντα specs (στα docs/, θα μεταφερθούν εδώ κατά την υλοποίηση)

| Spec | Τοποθεσία | Περιεχόμενο |
|---|---|---|
| Data Model | `docs/03-DATA-MODEL.md` | Prisma schema, entities, relationships, constraints |
| Inventory Concurrency | `docs/05-INVENTORY-CONCURRENCY-SAFETY.md` | Atomic reservation pattern, expiry, audit log, oversell test |
| Admin Panel | `docs/07-ADMIN-PANEL-SPEC.md` | Dashboard, CRUD, sections, orders, inventory management |

## Κανόνες

- **Τα specs αλλάζουν ΠΡΙΝ την υλοποίηση.** Αν μια υλοποίηση χρειάζεται αλλαγή spec, το spec ενημερώνεται πρώτα.
- **Ποτέ μην προσθέτεις output πέρα από το spec.** Αν δεν μπορείς να καλύψεις ένα spec πεδίο, αποτυγχάνεις δυνατά ή εκπέμπεις την τεκμηριωμένη sentinel τιμή.
- **Ένα spec = ένα folder.** Κάθε spec ζει στο δικό του υποφάκελο με όλα τα σχετικά αρχεία.
