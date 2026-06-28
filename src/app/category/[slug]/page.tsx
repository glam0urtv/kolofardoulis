import { notFound } from "next/navigation"
import { mockProducts, mockCategories } from "@/lib/mock-data"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = mockCategories.find((c) => c.slug === slug)
  if (!category) return { title: "Κατηγορία" }
  return { title: category.name }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = mockCategories.find((c) => c.slug === slug)

  if (!category) notFound()

  const products = mockProducts.filter(
    (p) => p.categorySlug === slug && p.isActive
  )

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-700">
          Αρχική
        </Link>
        <span>/</span>
        {category.parent && (
          <>
            <Link
              href={`/category/${category.parent}`}
              className="hover:text-stone-700"
            >
              {mockCategories.find((c) => c.slug === category.parent)?.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-stone-900">{category.name}</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-stone-900">{category.name}</h1>
        <p className="mt-2 text-stone-500">
          {products.length} προϊόντα σε αυτή την κατηγορία
        </p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
        <span className="text-sm font-medium text-stone-600">Ταξινόμηση:</span>
        {["Προτεινόμενα", "Τιμή ↑", "Τιμή ↓", "Νεότερα"].map((f) => (
          <button
            key={f}
            className="rounded-lg px-3 py-1.5 text-sm text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            {f}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <span className="text-5xl">📭</span>
          <p className="mt-4 text-lg">Δεν βρέθηκαν προϊόντα</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
