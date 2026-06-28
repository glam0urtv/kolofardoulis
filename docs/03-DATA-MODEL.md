# 03 — Data Model (Prisma sketch)

> Αυτό είναι ένα σκελετικό σχήμα — ο agent `db-inventory-engineer` το
> οριστικοποιεί/επεκτείνει, αλλά οι βασικές οντότητες και οι σχέσεις τους
> πρέπει να ακολουθούν αυτή τη λογική.

```prisma
model Category {
  id        String     @id @default(cuid())
  name      String
  slug      String     @unique
  imageUrl  String?
  parentId  String?
  parent    Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryTree")
  position  Int        @default(0)
  products  Product[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

enum ProductType {
  SINGLE
  BOOSTER_BOX
  BOOSTER_PACK
  PROMO
}

model Product {
  id          String      @id @default(cuid())
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])
  type        ProductType
  name        String
  slug        String      @unique
  description String?
  priceCents  Int
  currency    String      @default("EUR")
  images      Media[]
  attributes  Json?       // set, rarity, γλώσσα, κατάσταση κάρτας κ.λπ. (ευέλικτο)
  isActive    Boolean     @default(true)
  inventory   Inventory?
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Inventory {
  productId String   @id
  product   Product  @relation(fields: [productId], references: [id])
  stock     Int       @default(0)   // πραγματικό, ΔΙΑΘΕΣΙΜΟ απόθεμα (μετά reservations)
  updatedAt DateTime  @updatedAt
}

// Κρατάει το απόθεμα "παγωμένο" όσο διαρκεί ένα checkout, ώστε να μη
// δεσμευτεί δύο φορές το ίδιο τεμάχιο. Βλ. 05-INVENTORY-CONCURRENCY-SAFETY.md
model StockReservation {
  id         String   @id @default(cuid())
  productId  String
  quantity   Int
  sessionId  String   // Stripe checkout session id
  status     ReservationStatus @default(PENDING)
  expiresAt  DateTime
  createdAt  DateTime @default(now())
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  RELEASED
}

model Order {
  id           String      @id @default(cuid())
  userId       String?
  email        String
  status       OrderStatus @default(PENDING)
  totalCents   Int
  stripeSessionId String   @unique
  items        OrderItem[]
  createdAt    DateTime    @default(now())
}

enum OrderStatus {
  PENDING
  PAID
  CANCELLED
  REFUNDED
}

model OrderItem {
  id         String  @id @default(cuid())
  orderId    String
  order      Order   @relation(fields: [orderId], references: [id])
  productId  String
  quantity   Int
  unitPriceCents Int
}

model Media {
  id        String   @id @default(cuid())
  productId String?
  url       String
  alt       String?
  position  Int      @default(0)
}

// Page-builder ελαφρύ: ο admin προσθέτει/αναδιατάσσει sections στην αρχική
model HomeSection {
  id        String   @id @default(cuid())
  type      String   // "hero" | "featured_categories" | "banner" | "new_arrivals" ...
  config    Json      // ελεύθερο schema ανά τύπο section
  position  Int       @default(0)
  isVisible Boolean   @default(true)
}

enum Role {
  ADMIN
  CUSTOMER
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(CUSTOMER)
  createdAt DateTime @default(now())
}

// Audit log αλλαγών stock από admin (ζητούμενο: διαφάνεια/εμπιστοσύνη)
model InventoryAuditLog {
  id         String   @id @default(cuid())
  productId  String
  delta      Int       // +5 / -2 κ.λπ.
  reason     String?
  actorId    String?   // admin user id, ή "system" για checkout
  createdAt  DateTime  @default(now())
}
```

## Βασικοί κανόνες

- Το `Inventory.stock` είναι **πάντα** το νούμερο που πρέπει να εμπιστευόμαστε
  — ποτέ δεν υπολογίζουμε διαθεσιμότητα αθροίζοντας αλλού.
- Κάθε μεταβολή του `stock` (αγορά, ακύρωση, χειροκίνητη διόρθωση από admin)
  **πρέπει** να γράφει και ένα `InventoryAuditLog` row.
- Τα `attributes` (Json) στο `Product` υπάρχουν ακριβώς για να μπορεί ο admin
  (ή ένας μελλοντικός agent) να προσθέσει νέα χαρακτηριστικά ανά κατηγορία
  (π.χ. "rarity" για singles, "packs_per_box" για booster boxes) χωρίς νέο
  migration για κάθε μικρή ανάγκη.
