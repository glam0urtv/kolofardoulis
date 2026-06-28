import { notFound } from "next/navigation"
import { getProduct, getCategoryProducts } from "@/lib/data"
import { formatPrice } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import Link from "next/link"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "Προϊόν" }
  return { title: product.name, description: product.description || undefined }
}

const typeLabels: Record<string, string> = {
  SINGLE: "Single",
  BOOSTER_BOX: "Booster Box",
  BOOSTER_PACK: "Booster Pack",
  PROMO: "Promo",
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const soldOut = (product.inventory?.stock ?? 0) <= 0

  // Get related products from same category
  const related = (await getCategoryProducts(slug)).filter(
    (p) => p.id !== product.id
  )

  const attr = product.attributes as Record<string, unknown> | null

  return (
    <div className="space-y-16">
      <nav className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-700">
          Αρχική
        </Link>
        <span>/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-stone-100 flex items-center justify-center text-8xl">
          {product.type === "BOOSTER_BOX" ? "📦" : "🃏"}
        </div>

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

          {attr && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {Object.entries(attr).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg border border-stone-200 px-3 py-2"
                >
                  <span className="text-[11px] uppercase text-stone-400">
                    {key}
                  </span>
                  <p className="text-sm font-medium text-stone-700">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}

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
                  {product.inventory?.stock ?? 0} τεμάχια διαθέσιμα
                </span>
              )}
            </div>

            <AddToCartButton product={product} disabled={soldOut} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-stone-900">
            Σχετικά προϊόντα
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => (
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
