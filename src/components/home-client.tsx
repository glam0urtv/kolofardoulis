"use client"

import { useEffect, useState } from "react"
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

// TCG-specific backgrounds using our card back images
const TCG = {
  onePiece: { bg: "/card-backs/one-piece.jpg", overlay: "from-red-900/70 to-red-950/80", accent: "bg-red-500" },
  pokemon: { bg: "/card-backs/pokemon.png", overlay: "from-blue-900/70 to-blue-950/80", accent: "bg-yellow-500" },
  riftbound: { bg: "/card-backs/riftbound.png", overlay: "from-purple-900/70 to-indigo-950/80", accent: "bg-cyan-500" },
}

const categoryHighlights = [
  {
    name: "Booster Boxes", slug: "booster-boxes",
    description: "Σφραγισμένα κουτιά booster packs",
    bg: "from-stone-800 to-stone-950",
    children: [
      { name: "One Piece", slug: "booster-boxes", ...TCG.onePiece },
      { name: "Pokémon", slug: "pokemon-booster-boxes", ...TCG.pokemon },
      { name: "Riftbound", slug: "riftbound-booster-boxes", ...TCG.riftbound },
    ],
  },
  {
    name: "Singles", slug: "singles",
    description: "Μεμονωμένες κάρτες όλων των rarities",
    bg: "from-stone-800 to-stone-950",
    children: [
      { name: "One Piece", slug: "singles", ...TCG.onePiece },
      { name: "Pokémon", slug: "pokemon-singles", ...TCG.pokemon },
      { name: "Riftbound", slug: "riftbound-singles", ...TCG.riftbound },
    ],
  },
  {
    name: "Pokémon", slug: "pokemon",
    description: "151 · Surging Sparks · Evolving Skies",
    bg: "from-yellow-600 to-yellow-900",
    children: [
      { name: "Singles", slug: "pokemon-singles", ...TCG.pokemon },
      { name: "Booster Boxes", slug: "pokemon-booster-boxes", ...TCG.pokemon },
      { name: "ETBs", slug: "pokemon-etb", ...TCG.pokemon },
    ],
  },
  {
    name: "Riftbound", slug: "riftbound",
    description: "Το League of Legends TCG",
    bg: "from-purple-600 to-purple-900",
    children: [
      { name: "Singles", slug: "riftbound-singles", ...TCG.riftbound },
      { name: "Booster Boxes", slug: "riftbound-booster-boxes", ...TCG.riftbound },
    ],
  },
]

function CategoryPopover({ title, links, onClose }: {
  title: string
  links: { name: string; slug: string; bg: string; overlay: string; accent: string }[]
  onClose: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-stone-900">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-stone-100"><X className="h-5 w-5 text-stone-400" /></button>
        </div>
        <div className="grid gap-3">
          {links.map(link => (
            <Link
              key={link.slug}
              href={`/category/${link.slug}`}
              className="group relative overflow-hidden rounded-xl transition-all hover:scale-[1.02] hover:shadow-xl"
              onClick={onClose}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${link.bg})` }}
              />
              {/* Color overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${link.overlay}`} />
              {/* Content */}
              <div className="relative flex items-center gap-4 px-5 py-4">
                <div className={`h-3 w-3 rounded-full ${link.accent} shadow-[0_0_10px] shadow-current`} />
                <span className="text-base font-bold text-white">{link.name}</span>
                <span className="ml-auto text-white/60 text-sm">→</span>
              </div>
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
  const [popover, setPopover] = useState<{ title: string; children: typeof categoryHighlights[0]["children"] } | null>(null)

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
              onClick={() => setPopover({ title: cat.name, children: cat.children })}
              className={`group relative overflow-hidden rounded-2xl border border-stone-200 p-6 text-left transition-all hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br ${cat.bg}`}
            >
              <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                <p className="mt-1 text-sm text-white/70">{cat.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {popover && (
        <CategoryPopover title={popover.title} links={popover.children} onClose={() => setPopover(null)} />
      )}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900">Προτεινόμενα</h2>
          <Link href="/category/singles" className="text-sm font-medium text-stone-500 hover:text-stone-700">Προβολή όλων →</Link>
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
