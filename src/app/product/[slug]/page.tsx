import { notFound } from "next/navigation"
import { mockProducts } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import Link from "next/link"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = mockProducts.find((p) => p.slug === slug)
  if (!product) return { title: "Προϊόν" }
  return {
    title: product.name,
    description: product.description,
  }
}

const typeLabels: Record<string, string> = {
  SINGLE: "Single",
  BOOSTER_BOX: "Booster Box",
  BOOSTER_PACK: "Booster Pack",
  PROMO: "Promo",
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = mockProducts.find((p) => p.slug === slug)

  if (!product) notFound()

  const related = mockProducts
    .filter(
      (p) =>
        p.categorySlug === product.categorySlug &&
        p.id !== product.id &&
        p.isActive
    )
    .slice(0, 4)

  const soldOut = product.stock <= 0

  return (
    <div className="space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-700">
          Αρχική
        </Link>
        <span>/</span>
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-stone-700"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      {/* Product detail */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square rounded-3xl bg-stone-100 flex items-center justify-center text-8xl">
          {product.type === "BOOSTER_BOX" ? "📦" : "🃏"}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-brand">
            {typeLabels[product.type]}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">
            {product.name}
          </h1>
          <p className="mt-4 leading-relaxed text-stone-600">
            {product.description}
          </p>

          {/* Attributes */}
          {product.attributes && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {product.attributes.set && (
                <div className="rounded-lg border border-stone-200 px-3 py-2">
                  <span className="text-[11px] uppercase text-stone-400">
                    Set
                  </span>
                  <p className="text-sm font-medium text-stone-700">
                    {product.attributes.set}
                  </p>
                </div>
              )}
              {product.attributes.rarity && (
                <div className="rounded-lg border border-stone-200 px-3 py-2">
                  <span className="text-[11px] uppercase text-stone-400">
                    Rarity
                  </span>
                  <p className="text-sm font-medium text-stone-700">
                    {product.attributes.rarity}
                  </p>
                </div>
              )}
              {product.attributes.condition && (
                <div className="rounded-lg border border-stone-200 px-3 py-2">
                  <span className="text-[11px] uppercase text-stone-400">
                    Κατάσταση
                  </span>
                  <p className="text-sm font-medium text-stone-700">
                    {product.attributes.condition}
                  </p>
                </div>
              )}
              {product.attributes.language && (
                <div className="rounded-lg border border-stone-200 px-3 py-2">
                  <span className="text-[11px] uppercase text-stone-400">
                    Γλώσσα
                  </span>
                  <p className="text-sm font-medium text-stone-700">
                    {product.attributes.language}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Price & CTA */}
          <div className="mt-8 flex items-end justify-between border-t border-stone-200 pt-6">
            <div>
              <span className="text-sm text-stone-500">Τιμή</span>
              <p className="text-3xl font-bold text-stone-900">
                {formatPrice(product.priceCents)}
              </p>
              {soldOut ? (
                <span className="inline-block mt-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                  ΕΞΑΝΤΛΗΘΗΚΕ
                </span>
              ) : (
                <span className="text-sm text-stone-400">
                  {product.stock} τεμάχια διαθέσιμα
                </span>
              )}
            </div>

            <AddToCartButton product={product} disabled={soldOut} />
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-stone-900">
            Σχετικά προϊόντα
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className="group rounded-2xl border border-stone-200 bg-white p-4 transition-all hover:shadow-lg"
              >
                <div className="aspect-[4/3] rounded-xl bg-stone-100 flex items-center justify-center text-3xl">
                  {p.type === "BOOSTER_BOX" ? "📦" : "🃏"}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-stone-900">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm font-bold text-stone-700">
                  {formatPrice(p.priceCents)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
