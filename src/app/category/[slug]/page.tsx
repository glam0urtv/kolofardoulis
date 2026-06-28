import { notFound } from "next/navigation"
import { getCategory, getCategoryProducts, getCategories } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) return { title: "Κατηγορία" }
  return { title: category.name }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategory(slug)
  if (!category) notFound()

  const products = await getCategoryProducts(slug)

  const parent =
    category.parentId
      ? (await getCategories()).find((c) => c.id === category.parentId)?.name
      : null

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-700">
          Αρχική
        </Link>
        {parent && (
          <>
            <span>/</span>
            <Link href={`/category/${category.parentId}`} className="hover:text-stone-700">
              {parent}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-stone-900">{category.name}</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-stone-900">{category.name}</h1>
        <p className="mt-2 text-stone-500">
          {products.length} προϊόντα σε αυτή την κατηγορία
        </p>
      </div>

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
