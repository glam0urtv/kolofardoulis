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
  onComplete,
}: {
  quantity: number
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
      <BoosterBoxScene quantity={quantity} onComplete={onComplete} />
    </Suspense>
  )
}

export function LazyCardFlipScene({
  cardName,
  imageUrl,
  onComplete,
}: {
  cardName: string
  imageUrl?: string
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
      <CardFlipScene cardName={cardName} imageUrl={imageUrl} onComplete={onComplete} />
    </Suspense>
  )
}
