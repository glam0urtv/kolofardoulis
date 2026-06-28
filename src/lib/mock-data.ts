/**
 * Mock data for development.
 * Replace with Prisma queries once the database is connected.
 */

export type MockProduct = {
  id: string
  name: string
  slug: string
  type: "SINGLE" | "BOOSTER_BOX" | "BOOSTER_PACK" | "PROMO"
  priceCents: number
  currency: string
  description: string
  category: string
  categorySlug: string
  stock: number
  images: string[]
  attributes: {
    set?: string
    rarity?: string
    language?: string
    condition?: string
    packsPerBox?: number
  }
  isActive: boolean
}

export const mockProducts: MockProduct[] = [
  {
    id: "prod_001",
    name: "OP01 Booster Box — Romance Dawn",
    slug: "op01-booster-box-romance-dawn",
    type: "BOOSTER_BOX",
    priceCents: 11990,
    currency: "EUR",
    description:
      "Το πρώτο booster box του One Piece TCG. 24 booster packs, κάθε pack περιέχει 12 κάρτες. Ψάξε για τα σπάνια alternate art και τις signed κάρτες.",
    category: "Booster Boxes",
    categorySlug: "booster-boxes",
    stock: 15,
    images: [],
    attributes: {
      set: "OP01 — Romance Dawn",
      packsPerBox: 24,
      language: "Αγγλικά",
    },
    isActive: true,
  },
  {
    id: "prod_002",
    name: "Monkey D. Luffy — Leader (OP01-001)",
    slug: "monkey-d-luffy-leader-op01",
    type: "SINGLE",
    priceCents: 2490,
    currency: "EUR",
    description:
      "Monkey D. Luffy Leader card από το set Romance Dawn. Alternate Art έκδοση, Near Mint.",
    category: "Singles",
    categorySlug: "singles",
    stock: 3,
    images: [],
    attributes: {
      set: "OP01 — Romance Dawn",
      rarity: "Leader",
      condition: "Near Mint",
      language: "Αγγλικά",
    },
    isActive: true,
  },
  {
    id: "prod_003",
    name: "Roronoa Zoro — Super Rare (OP01-025)",
    slug: "roronoa-zoro-sr-op01",
    type: "SINGLE",
    priceCents: 3490,
    currency: "EUR",
    description: "Roronoa Zoro Super Rare. Άριστη κατάσταση, sleeve-protected.",
    category: "Singles",
    categorySlug: "singles",
    stock: 1,
    images: [],
    attributes: {
      set: "OP01 — Romance Dawn",
      rarity: "Super Rare",
      condition: "Mint",
      language: "Αγγλικά",
    },
    isActive: true,
  },
  {
    id: "prod_004",
    name: "OP02 Booster Box — Paramount War",
    slug: "op02-booster-box-paramount-war",
    type: "BOOSTER_BOX",
    priceCents: 12490,
    currency: "EUR",
    description:
      "OP02 Paramount War booster box. 24 packs με 12 κάρτες έκαστο. Περιέχει τις θρυλικές κάρτες του Marineford arc.",
    category: "Booster Boxes",
    categorySlug: "booster-boxes",
    stock: 8,
    images: [],
    attributes: {
      set: "OP02 — Paramount War",
      packsPerBox: 24,
      language: "Αγγλικά",
    },
    isActive: true,
  },
  {
    id: "prod_005",
    name: "Nami — Promo (P-001)",
    slug: "nami-promo-p001",
    type: "PROMO",
    priceCents: 1990,
    currency: "EUR",
    description:
      "Nami Promo κάρτα από το πρώτο event kit. Σπάνια, μόνο 500 αντίτυπα στην Ελλάδα.",
    category: "Promo",
    categorySlug: "promo",
    stock: 2,
    images: [],
    attributes: {
      rarity: "Promo",
      condition: "Mint",
      language: "Ιαπωνικά",
    },
    isActive: true,
  },
  {
    id: "prod_006",
    name: "OP01 Booster Pack — Romance Dawn",
    slug: "op01-booster-pack-romance-dawn",
    type: "BOOSTER_PACK",
    priceCents: 550,
    currency: "EUR",
    description:
      "Μεμονωμένο booster pack από το OP01 Romance Dawn. 12 τυχαίες κάρτες.",
    category: "Booster Packs",
    categorySlug: "booster-packs",
    stock: 50,
    images: [],
    attributes: {
      set: "OP01 — Romance Dawn",
      language: "Αγγλικά",
    },
    isActive: true,
  },
  {
    id: "prod_007",
    name: "Trafalgar Law — Leader (OP01-002)",
    slug: "trafalgar-law-leader-op01",
    type: "SINGLE",
    priceCents: 1990,
    currency: "EUR",
    description: "Trafalgar Law Leader card. Meta-relevant, Near Mint.",
    category: "Singles",
    categorySlug: "singles",
    stock: 4,
    images: [],
    attributes: {
      set: "OP01 — Romance Dawn",
      rarity: "Leader",
      condition: "Near Mint",
      language: "Αγγλικά",
    },
    isActive: true,
  },
  {
    id: "prod_008",
    name: "Portgas D. Ace — Secret Rare (OP02-??? )",
    slug: "portgas-d-ace-secret-rare-op02",
    type: "SINGLE",
    priceCents: 8990,
    currency: "EUR",
    description:
      "Portgas D. Ace Secret Rare από το Paramount War. Η πιο περιζήτητη κάρτα του set.",
    category: "Singles",
    categorySlug: "singles",
    stock: 1,
    images: [],
    attributes: {
      set: "OP02 — Paramount War",
      rarity: "Secret Rare",
      condition: "Mint",
      language: "Αγγλικά",
    },
    isActive: true,
  },
]

export const mockCategories = [
  { name: "One Piece", slug: "one-piece" },
  { name: "Singles", slug: "singles", parent: "one-piece" },
  { name: "Booster Boxes", slug: "booster-boxes", parent: "one-piece" },
  { name: "Booster Packs", slug: "booster-packs", parent: "one-piece" },
  { name: "Promo", slug: "promo", parent: "one-piece" },
]
