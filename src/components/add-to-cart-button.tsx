"use client"

import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import type { MockProduct } from "@/lib/mock-data"

interface Props {
  product: MockProduct
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: Props) {
  const router = useRouter()

  const handleClick = () => {
    // Import dynamically to avoid SSR issues with zustand
    import("@/services/cart").then(({ useCartStore }) => {
      useCartStore.getState().addItem({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        priceCents: product.priceCents,
        currency: product.currency,
        type: product.type,
        imageUrl: product.images[0],
      })
      window.dispatchEvent(new CustomEvent("open-cart"))
    })
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
