import { ProductCard } from "@/components/product-card"
import { mockProducts } from "@/lib/mock-data"
import Link from "next/link"

const categories = [
  {
    name: "Booster Boxes",
    slug: "booster-boxes",
    description: "Σφραγισμένα κουτιά 24 booster packs",
    color: "bg-red-50 border-red-200",
  },
  {
    name: "Singles",
    slug: "singles",
    description: "Μεμονωμένες κάρτες όλων των rarities",
    color: "bg-amber-50 border-amber-200",
  },
  {
    name: "Booster Packs",
    slug: "booster-packs",
    description: "Μεμονωμένα booster packs",
    color: "bg-blue-50 border-blue-200",
  },
  {
    name: "Promo",
    slug: "promo",
    description: "Σπάνιες promo & event κάρτες",
    color: "bg-purple-50 border-purple-200",
  },
]

export default function HomePage() {
  const featured = mockProducts.filter((p) => p.isActive).slice(0, 6)
  const newArrivals = mockProducts
    .filter((p) => p.isActive)
    .slice()
    .reverse()
    .slice(0, 4)

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-stone-900 px-6 py-20 text-center text-white md:py-32">
        <div className="relative z-10 mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Το trading card game κατάστημά σου
          </h1>
          <p className="mt-4 text-lg text-stone-300 md:text-xl">
            One Piece TCG • Singles • Booster Boxes • Promo κάρτες. Από παίκτες,
            για παίκτες.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/category/booster-boxes"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
            >
              Booster Boxes
            </Link>
            <Link
              href="/category/singles"
              className="rounded-xl bg-stone-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-600"
            >
              Singles
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-800/50 to-stone-900" />
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Κατηγορίες</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`rounded-2xl border p-6 transition-all hover:scale-[1.02] hover:shadow-lg ${cat.color}`}
            >
              <h3 className="text-lg font-semibold text-stone-900">
                {cat.name}
              </h3>
              <p className="mt-1 text-sm text-stone-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900">Προτεινόμενα</h2>
          <Link
            href="/category/singles"
            className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-700"
          >
            Προβολή όλων →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-stone-900">Νέες Αφίξεις</h2>
          <Link
            href="/category/singles"
            className="text-sm font-medium text-stone-500 transition-colors hover:text-stone-700"
          >
            Προβολή όλων →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
