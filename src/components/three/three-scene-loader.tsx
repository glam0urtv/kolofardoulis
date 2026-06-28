"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const ShowcaseScene = dynamic(() => import("./showcase-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] items-center justify-center rounded-3xl bg-stone-900 text-white">
      <span className="text-7xl animate-pulse">🃏</span>
    </div>
  ),
})

const BoosterBoxScene = dynamic(() => import("./booster-box-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-3xl bg-stone-100">
      <span className="text-7xl animate-bounce">📦</span>
    </div>
  ),
})

const CardFlipScene = dynamic(() => import("./card-flip-scene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-3xl bg-stone-100">
      <span className="text-7xl animate-spin">🃏</span>
    </div>
  ),
})

export function LazyShowcaseScene() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[500px] items-center justify-center rounded-3xl bg-stone-900 text-white">
          <span className="text-7xl animate-pulse">🃏</span>
        </div>
      }
    >
      <ShowcaseScene />
    </Suspense>
  )
}

export function LazyBoosterBoxScene({
  quantity,
  imageUrl,
  onComplete,
}: {
  quantity: number
  imageUrl?: string
  onComplete?: () => void
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center rounded-3xl bg-stone-100">
          <span className="text-7xl animate-bounce">📦</span>
        </div>
      }
    >
      <BoosterBoxScene quantity={quantity} imageUrl={imageUrl} onComplete={onComplete} />
    </Suspense>
  )
}

export function LazyCardFlipScene({
  cardName,
  imageUrl,
  brand,
  onComplete,
}: {
  cardName: string
  imageUrl?: string
  brand?: "one-piece" | "pokemon" | "riftbound"
  onComplete?: () => void
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center rounded-3xl bg-stone-100">
          <span className="text-7xl animate-spin">🃏</span>
        </div>
      }
    >
      <CardFlipScene cardName={cardName} imageUrl={imageUrl} brand={brand} onComplete={onComplete} />
    </Suspense>
  )
}
