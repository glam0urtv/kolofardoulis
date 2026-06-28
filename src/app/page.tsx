import { ProductCard } from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/data"
import { LazyShowcaseScene } from "@/components/three/three-scene-loader"
import Link from "next/link"

const categoryHighlights = [
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

export default async function HomePage() {
  let featured = await getFeaturedProducts(6)
  let newArrivals = await getFeaturedProducts(4)

  return (
    <div className="space-y-16">
      {/* Hero with 3D Showcase */}
      <section className="relative overflow-hidden rounded-3xl">
        <LazyShowcaseScene />
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg md:text-5xl lg:text-6xl">
            Το trading card game κατάστημά σου
          </h1>
          <p className="mt-4 text-lg text-stone-200 drop-shadow md:text-xl">
            One Piece TCG • Singles • Booster Boxes • Promo κάρτες
          </p>
          <div className="pointer-events-auto mt-8 flex justify-center gap-4">
            <Link
              href="/category/booster-boxes"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
            >
              Booster Boxes
            </Link>
            <Link
              href="/category/singles"
              className="rounded-xl bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Singles
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold text-stone-900">Κατηγορίες</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryHighlights.map((cat) => (
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
      {featured.length > 0 && (
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
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
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
      )}
    </div>
  )
}
