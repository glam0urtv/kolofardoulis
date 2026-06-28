"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

type Product = {
  id: string
  categoryId: string
  type: string
  name: string
  slug: string
  description: string | null
  priceCents: number
  currency: string
  attributes: Record<string, unknown> | null
  isActive: boolean
  inventory?: { stock: number }[] | null
  images?: { url: string; alt: string | null }[] | null
}

const categoryHighlights = [
  { name: "Booster Boxes", slug: "booster-boxes", description: "Σφραγισμένα κουτιά booster packs", color: "bg-red-50 border-red-200" },
  { name: "Singles", slug: "singles", description: "Μεμονωμένες κάρτες όλων των rarities", color: "bg-amber-50 border-amber-200" },
  { name: "Pokémon", slug: "pokemon", description: "Pokémon TCG — 151, Surging Sparks, Evolving Skies", color: "bg-yellow-50 border-yellow-300" },
  { name: "Riftbound", slug: "riftbound", description: "Το νέο TCG — First Edition, Arcane Storm", color: "bg-purple-50 border-purple-200" },
]

export function HomeClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
    const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!BASE || !KEY) {
      setLoading(false)
      return
    }
    fetch(`${BASE}/rest/v1/Product?select=*,inventory(stock)&order=createdAt.desc&limit=6`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Κατηγορίες</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryHighlights.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`rounded-2xl border p-6 transition-all hover:scale-[1.02] hover:shadow-lg ${cat.color}`}
            >
              <h3 className="text-lg font-semibold text-stone-900">{cat.name}</h3>
              <p className="mt-1 text-sm text-stone-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900">Προτεινόμενα</h2>
          <Link href="/category/booster-boxes" className="text-sm font-medium text-stone-500 hover:text-stone-700">
            Προβολή όλων →
          </Link>
        </div>
        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-3 rounded-2xl border border-stone-200 bg-white p-4">
                <div className="aspect-[4/3] rounded-xl bg-stone-200" />
                <div className="h-4 w-3/4 rounded bg-stone-200" />
                <div className="h-6 w-1/3 rounded bg-stone-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
