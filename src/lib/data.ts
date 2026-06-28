/**
 * Data Access Layer — Supabase REST API
 *
 * Uses the Supabase REST API for data fetching.
 * Prisma direct connection is not available locally (IPv6 issue) but
 * works when deployed to Vercel. For now, we use the Supabase client
 * which handles the REST API under the hood.
 *
 * When Prisma is available, swap these for direct Prisma calls.
 */

const BASE = process.env.SUPABASE_URL!
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!

type FetchOpts = {
  select?: string
  order?: string
  limit?: number
  filter?: string
}

async function supabaseGet(table: string, opts: FetchOpts = {}) {
  const params = new URLSearchParams()
  if (opts.select) params.set("select", opts.select)
  if (opts.order) params.set("order", opts.order)
  if (opts.limit) params.set("limit", String(opts.limit))
  if (opts.filter) {
    // Support simple filters like eq:field:value
    const [op, field, value] = opts.filter.split(":")
    params.set(field, `${op}.${value}`)
  }

  const url = `${BASE}/rest/v1/${table}?${params.toString()}`
  const res = await fetch(url, {
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${ANON}`,
    },
    next: { revalidate: 60 }, // ISR: revalidate every minute
  })

  if (!res.ok) {
    console.error(`Supabase fetch error for ${table}:`, res.status)
    return []
  }

  return res.json()
}

export type Product = {
  id: string
  categoryId: string
  type: "SINGLE" | "BOOSTER_BOX" | "BOOSTER_PACK" | "PROMO"
  name: string
  slug: string
  description: string | null
  priceCents: number
  currency: string
  attributes: Record<string, unknown> | null
  isActive: boolean
  images?: { id: string; url: string; alt: string | null }[]
  inventory?: { stock: number } | null
}

export type Category = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  parentId: string | null
  position: number
  children?: Category[]
}

export async function getProducts(opts?: FetchOpts) {
  return supabaseGet("Product", {
    select: "*,inventory(stock),images(url,alt)",
    ...opts,
  }) as Promise<Product[]>
}

export async function getProduct(slug: string) {
  const results = (await supabaseGet("Product", {
    select: "*,inventory(stock),images(url,alt)",
    filter: `eq:slug:${slug}`,
  })) as Product[]
  return results[0] || null
}

export async function getCategories() {
  return supabaseGet("Category", {
    order: "position.asc",
  }) as Promise<Category[]>
}

export async function getCategory(slug: string) {
  const results = (await supabaseGet("Category", {
    filter: `eq:slug:${slug}`,
  })) as Category[]
  return results[0] || null
}

export async function getCategoryProducts(categorySlug: string) {
  // First get the category, then get its products
  const cat = await getCategory(categorySlug)
  if (!cat) return []
  return supabaseGet("Product", {
    select: "*,inventory(stock)",
    filter: `eq:categoryId:${cat.id}`,
  }) as Promise<Product[]>
}

export async function getFeaturedProducts(limit = 6) {
  return supabaseGet("Product", {
    select: "*,inventory(stock)",
    order: "createdAt.desc",
    limit,
  }) as Promise<Product[]>
}
