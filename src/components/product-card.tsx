"use client"

import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useCartStore } from "@/services/cart"
import { triggerPurchaseAnimation, getAnimationType } from "@/components/purchase-animation-overlay"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/data"

const typeLabels: Record<string, string> = {
  SINGLE: "Single",
  BOOSTER_BOX: "Booster Box",
  BOOSTER_PACK: "Booster Pack",
  PROMO: "Promo",
}

const typeBadgeColors: Record<string, string> = {
  SINGLE: "bg-amber-100 text-amber-700",
  BOOSTER_BOX: "bg-red-100 text-red-700",
  BOOSTER_PACK: "bg-blue-100 text-blue-700",
  PROMO: "bg-purple-100 text-purple-700",
}

// Determine TCG brand from categoryId prefix
function getBrand(categoryId: string): { name: string; color: string } | null {
  if (categoryId === "cat_001" || categoryId.startsWith("cat_00") && categoryId <= "cat_005") return { name: "One Piece", color: "bg-red-50 text-red-600" }
  if (categoryId.startsWith("cat_00") && categoryId >= "cat_006" && categoryId <= "cat_009") return { name: "Pokémon", color: "bg-yellow-50 text-yellow-700" }
  if (categoryId.startsWith("cat_01")) return { name: "Riftbound", color: "bg-purple-50 text-purple-600" }
  if (categoryId === "cat_002" || categoryId === "cat_003" || categoryId === "cat_004" || categoryId === "cat_005") return { name: "One Piece", color: "bg-red-50 text-red-600" }
  return null
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const stock = product.inventory?.stock ?? 0
  const soldOut = stock <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (soldOut) return
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      priceCents: product.priceCents,
      currency: product.currency,
      type: product.type,
      imageUrl: product.images?.[0]?.url,
    })
    // Open cart directly — 3D animation disabled temporarily
    window.dispatchEvent(new CustomEvent("open-cart"))
    return
    // Trigger 3D purchase animation (booster box / card flip)
    triggerPurchaseAnimation({
      type: getAnimationType(product.type),
      productName: product.name,
      quantity: 1,
      productId: product.id,
      imageUrl: product.images?.[0]?.url,
    })
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] bg-stone-100">
        {product.images?.[0]?.url ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            className="h-full w-full object-contain p-4"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            {product.type === "BOOSTER_BOX" ? "📦" : "🃏"}
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${typeBadgeColors[product.type]}`}>
            {typeLabels[product.type]}
          </span>
          {getBrand(product.categoryId) && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getBrand(product.categoryId)!.color}`}>
              {getBrand(product.categoryId)!.name}
            </span>
          )}
        </div>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-stone-900">
              ΕΞΑΝΤΛΗΘΗΚΕ
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="mt-1 text-sm font-semibold text-stone-900 line-clamp-2">
            {product.name}
          </h3>
          {(product.attributes as Record<string, string> | null)?.set && (
            <p className="mt-1 text-xs text-stone-400">
              {(product.attributes as Record<string, string>).set}
            </p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-stone-900">
            {formatPrice(product.priceCents)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={soldOut}
            className={`rounded-full p-2.5 transition-all ${
              soldOut
                ? "cursor-not-allowed bg-stone-100 text-stone-300"
                : "bg-stone-900 text-white hover:bg-stone-800 hover:scale-105 active:scale-95"
            }`}
            aria-label="Προσθήκη στο καλάθι"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}
