"use client"

import { useEffect, useState } from "react"
import { LazyBoosterBoxScene, LazyCardFlipScene } from "@/components/three/three-scene-loader"

type AnimationType = "booster-box" | "card-flip"
type Brand = "one-piece" | "pokemon" | "riftbound"

type AnimationState = {
  type: AnimationType
  productName: string
  quantity: number
  productId: string
  imageUrl?: string
  brand: Brand
} | null

export function triggerPurchaseAnimation(state: {
  type: AnimationType
  productName: string
  quantity: number
  productId: string
  imageUrl?: string
  brand: Brand
}) {
  window.dispatchEvent(new CustomEvent("purchase-animation", { detail: state }))
}

export function getAnimationType(productType: string): AnimationType {
  switch (productType) {
    case "BOOSTER_BOX": return "booster-box"
    case "SINGLE": case "PROMO": default: return "card-flip"
  }
}

// Map categoryId prefix to brand
export function getBrand(categoryId: string): Brand {
  if (categoryId === "cat_001" || (categoryId >= "cat_002" && categoryId <= "cat_005")) return "one-piece"
  if (categoryId >= "cat_006" && categoryId <= "cat_009") return "pokemon"
  return "riftbound"
}

export function PurchaseAnimationOverlay() {
  const [animation, setAnimation] = useState<AnimationState>(null)

  useEffect(() => {
    const handler = (e: CustomEvent<AnimationState>) => setAnimation(e.detail)
    window.addEventListener("purchase-animation", handler as EventListener)
    return () => window.removeEventListener("purchase-animation", handler as EventListener)
  }, [])

  if (!animation) return null

  const handleComplete = () => {
    setAnimation(null)
    window.dispatchEvent(new CustomEvent("open-cart"))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl">
        {animation.type === "booster-box" ? (
          <LazyBoosterBoxScene quantity={animation.quantity} imageUrl={animation.imageUrl} onComplete={handleComplete} />
        ) : (
          <LazyCardFlipScene
            cardName={animation.productName}
            imageUrl={animation.imageUrl}
            brand={animation.brand}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  )
}
