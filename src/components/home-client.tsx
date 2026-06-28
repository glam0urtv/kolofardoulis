"use client"

import { useEffect, useState, useRef } from "react"
import { ProductCard } from "@/components/product-card"
import { X } from "lucide-react"
import Link from "next/link"

type Product = {
  id: string; name: string; slug: string; type: string; priceCents: number; currency: string
  description: string | null; isActive: boolean; categoryId: string
  attributes: Record<string, unknown> | null
  inventory?: { stock: number }[] | null
  images?: { url: string; alt: string | null }[] | null
}

const categoryHighlights = [
  {
    name: "Booster Boxes", slug: "booster-boxes",
    description: "Σφραγισμένα κουτιά booster packs",
    color: "bg-red-50 border-red-200",
    children: [
      { name: "One Piece", slug: "booster-boxes" },
      { name: "Pokémon", slug: "pokemon-booster-boxes" },
      { name: "Riftbound", slug: "riftbound-booster-boxes" },
    ],
  },
  {
    name: "Singles", slug: "singles",
    description: "Μεμονωμένες κάρτες όλων των rarities",
    color: "bg-amber-50 border-amber-200",
    children: [
      { name: "One Piece", slug: "singles" },
      { name: "Pokémon", slug: "pokemon-singles" },
      { name: "Riftbound", slug: "riftbound-singles" },
    ],
  },
  {
    name: "Pokémon", slug: "pokemon",
    description: "Pokémon TCG — 151, Surging Sparks, Evolving Skies",
    color: "bg-yellow-50 border-yellow-300",
    children: [
      { name: "Singles", slug: "pokemon-singles" },
      { name: "Booster Boxes", slug: "pokemon-booster-boxes" },
      { name: "ETBs", slug: "pokemon-etb" },
    ],
  },
  {
    name: "Riftbound", slug: "riftbound",
    description: "Το νέο TCG — First Edition, Arcane Storm",
    color: "bg-purple-50 border-purple-200",
    children: [
      { name: "Singles", slug: "riftbound-singles" },
      { name: "Booster Boxes", slug: "riftbound-booster-boxes" },
    ],
  },
]

function CategoryPopover({ children, links, onClose }: {
  children: React.ReactNode
  links: { name: string; slug: string }[]
  onClose: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Popover */}
      <div className="fixed left-1/2 top-1/2 z-50 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900">{children}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-stone-100"><X className="h-5 w-5 text-stone-400" /></button>
        </div>
        <div className="space-y-1.5">
          {links.map(link => (
            <Link
              key={link.slug}
              href={`/category/${link.slug}`}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
              onClick={onClose}
            >
              {link.name}
              <span className="text-xs text-stone-400">→</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export function HomeClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [popover, setPopover] = useState<{ name: string; children: { name: string; slug: string }[] } | null>(null)

  useEffect(() => {
    fetch("/api/products?limit=6")
      .then((res) => res.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Κατηγορίες</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryHighlights.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setPopover({ name: cat.name, children: cat.children })}
              className={`rounded-2xl border p-6 text-left transition-all hover:scale-[1.02] hover:shadow-lg ${cat.color}`}
            >
              <h3 className="text-lg font-semibold text-stone-900">{cat.name}</h3>
              <p className="mt-1 text-sm text-stone-500">{cat.description}</p>
            </button>
          ))}
        </div>
      </section>

      {popover && (
        <CategoryPopover links={popover.children} onClose={() => setPopover(null)}>
          {popover.name}
        </CategoryPopover>
      )}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900">Προτεινόμενα</h2>
          <Link href="/category/singles" className="text-sm font-medium text-stone-500 hover:text-stone-700">
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
