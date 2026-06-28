"use client"

import { useEffect, useState } from "react"
import { LazyBoosterBoxScene, LazyCardFlipScene } from "@/components/three/three-scene-loader"

type AnimationType = "booster-box" | "card-flip"

type AnimationState = {
  type: AnimationType
  productName: string
  quantity: number
  productId: string
} | null

// Global event system for triggering purchase animations
export function triggerPurchaseAnimation(state: {
  type: AnimationType
  productName: string
  quantity: number
  productId: string
}) {
  window.dispatchEvent(new CustomEvent("purchase-animation", { detail: state }))
}

function getAnimationType(
  productType: string
): AnimationType {
  switch (productType) {
    case "BOOSTER_BOX":
      return "booster-box"
    case "SINGLE":
    case "PROMO":
      return "card-flip"
    default:
      return "card-flip"
  }
}

export function PurchaseAnimationOverlay() {
  const [animation, setAnimation] = useState<AnimationState>(null)

  useEffect(() => {
    const handler = (e: CustomEvent<AnimationState>) => {
      setAnimation(e.detail)
    }
    window.addEventListener("purchase-animation", handler as EventListener)
    return () =>
      window.removeEventListener("purchase-animation", handler as EventListener)
  }, [])

  // Also listen for add-to-cart events
  useEffect(() => {
    const originalAddItem = window.addEventListener

    // Intercept add-to-cart to show animation
    const cartHandler = (e: CustomEvent) => {
      if (e.type === "purchase-animation") return
    }

    return () => {
      window.removeEventListener("purchase-animation", cartHandler as EventListener)
    }
  }, [])

  if (!animation) return null

  const handleComplete = () => {
    setAnimation(null)
    // Open the cart drawer after animation
    window.dispatchEvent(new CustomEvent("open-cart"))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl">
        {animation.type === "booster-box" ? (
          <LazyBoosterBoxScene
            quantity={animation.quantity}
            onComplete={handleComplete}
          />
        ) : (
          <LazyCardFlipScene
            cardName={animation.productName}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  )
}

// Export helper for components to trigger the right animation type
export { getAnimationType }
