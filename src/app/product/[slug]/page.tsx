"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { AddToCartButton } from "@/components/add-to-cart-button"
import Link from "next/link"

type Prod = {
  id: string; name: string; slug: string; type: string; priceCents: number; currency: string
  description: string | null; isActive: boolean
  attributes: Record<string, unknown> | null
  inventory?: { stock: number }[] | null
}

const typeLabels: Record<string, string> = {
  SINGLE: "Single", BOOSTER_BOX: "Booster Box", BOOSTER_PACK: "Booster Pack", PROMO: "Promo",
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Prod | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => { setProduct(d?.[0] || null); setLoading(false) })
  }, [slug])

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-8 w-48 rounded bg-stone-200" /><div className="grid gap-10 lg:grid-cols-2"><div className="aspect-square rounded-3xl bg-stone-200" /><div className="space-y-4"><div className="h-6 w-32 rounded bg-stone-200" /><div className="h-8 w-64 rounded bg-stone-200" /><div className="h-20 rounded bg-stone-200" /></div></div></div>
  if (!product) return <div className="flex flex-col items-center justify-center py-20"><span className="text-5xl">🔍</span><p className="mt-4 text-lg text-stone-500">Το προϊόν δεν βρέθηκε</p><Link href="/" className="mt-4 text-sm text-stone-600 hover:text-stone-900">← Επιστροφή</Link></div>

  const soldOut = (product.inventory?.[0]?.stock ?? 0) <= 0
  const attr = product.attributes as Record<string, string> | null

  return (
    <div className="space-y-16">
      <nav className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-700">Αρχική</Link>
        <span>/</span>
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-stone-100 flex items-center justify-center text-8xl">
          {product.type === "BOOSTER_BOX" ? "📦" : "🃏"}
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-brand">{typeLabels[product.type]}</span>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-stone-600">{product.description}</p>
          {attr && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {Object.entries(attr).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-stone-200 px-3 py-2">
                  <span className="text-[11px] uppercase text-stone-400">{key}</span>
                  <p className="text-sm font-medium text-stone-700">{String(value)}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8 flex items-end justify-between border-t border-stone-200 pt-6">
            <div>
              <span className="text-sm text-stone-500">Τιμή</span>
              <p className="text-3xl font-bold text-stone-900">{formatPrice(product.priceCents)}</p>
              {soldOut ? (
                <span className="inline-block mt-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">ΕΞΑΝΤΛΗΘΗΚΕ</span>
              ) : (
                <span className="text-sm text-stone-400">{product.inventory?.[0]?.stock ?? 0} τεμάχια διαθέσιμα</span>
              )}
            </div>
            <AddToCartButton product={product as any} disabled={soldOut} />
          </div>
        </div>
      </div>
    </div>
  )
}
