"use client"

import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/data"

interface Props {
  product: Product
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: Props) {
  const handleClick = () => {
    import("@/services/cart").then(({ useCartStore }) => {
      useCartStore.getState().addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        priceCents: product.priceCents,
        currency: product.currency,
        type: product.type,
        imageUrl: product.images?.[0]?.url,
      })
    })
    // Trigger 3D purchase animation
    import("@/components/purchase-animation-overlay").then(
      ({ triggerPurchaseAnimation, getAnimationType }) => {
        triggerPurchaseAnimation({
          type: getAnimationType(product.type),
          productName: product.name,
          quantity: 1,
          productId: product.id,
          imageUrl: product.images?.[0]?.url,
        })
      }
    )
  }

  if (disabled) {
    return (
      <button
        disabled
        className="cursor-not-allowed rounded-xl bg-stone-200 px-8 py-3 text-sm font-semibold text-stone-400"
      >
        Εξαντλήθηκε
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-xl bg-stone-900 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-stone-800 hover:scale-105 active:scale-95"
    >
      Προσθήκη στο καλάθι — {formatPrice(product.priceCents)}
    </button>
  )
}
