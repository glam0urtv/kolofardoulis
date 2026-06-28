"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Environment, useTexture } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

type Brand = "one-piece" | "pokemon" | "riftbound"

const CARD_BACKS: Record<Brand, string> = {
  "one-piece": "/card-backs/one-piece.jpg",
  "pokemon": "/card-backs/pokemon.png",
  "riftbound": "/card-backs/riftbound.png",
}

const BRAND_CONFIG: Record<Brand, { accent: string }> = {
  "one-piece": { accent: "#d4a853" },
  "pokemon": { accent: "#ffcc00" },
  "riftbound": { accent: "#00ffff" },
}

function CardTexture({
  animating,
  imageUrl,
  brand,
}: {
  animating: boolean
  imageUrl?: string
  brand: Brand
}) {
  const groupRef = useRef<THREE.Group>(null)
  const frontTexture = imageUrl ? useTexture(imageUrl) : null
  const backTexture = useTexture(CARD_BACKS[brand])

  useEffect(() => {
    if (!animating || !groupRef.current) return
    const tl = gsap.timeline({ defaults: { duration: 0.7, ease: "power2.inOut" } })

    // Flip to back (180°) — card comes forward and rotates, showing the back image
    tl.to(groupRef.current.rotation, { y: Math.PI, duration: 0.9, ease: "power3.inOut" })
      .to(groupRef.current.position, { z: 0.8, duration: 0.5, ease: "back.out(2)" }, "-=0.6")
      // Pause briefly to show the back
      .to(groupRef.current.position, { z: 0.8, duration: 0.8, ease: "none" })
      // Flip back to front
      .to(groupRef.current.rotation, { y: 0, duration: 0.9, ease: "power3.inOut" })
      .to(groupRef.current.position, { z: 0, duration: 0.5, ease: "back.in(2)" }, "-=0.6")
  }, [animating])

  return (
    <group ref={groupRef}>
      {/* Card front — FrontSide: visible from front, invisible from back */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[1.6, 2.2]} />
        {frontTexture ? (
          <meshStandardMaterial map={frontTexture} roughness={0.4} side={THREE.FrontSide} />
        ) : (
          <meshStandardMaterial color="#ffffff" roughness={0.3} side={THREE.FrontSide} />
        )}
      </mesh>

      {/* Card back — pre-rotated 180°, FrontSide: visible when card flips */}
      <mesh position={[0, 0, -0.002]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.55, 2.15]} />
        <meshStandardMaterial map={backTexture} roughness={0.3} metalness={0.1} side={THREE.FrontSide} />
      </mesh>

      {/* Gold border — on both sides */}
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[1.42, 2.02]} />
        <meshStandardMaterial color="#d4a853" roughness={0.1} metalness={0.6} side={THREE.DoubleSide} transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

interface Props {
  cardName: string
  imageUrl?: string
  brand?: Brand
  onComplete?: () => void
}

export default function CardFlipScene({ cardName, imageUrl, brand = "one-piece", onComplete }: Props) {
  const [animating, setAnimating] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
  }, [])

  useEffect(() => {
    if (!reducedMotion && flipped) {
      setAnimating(true)
      const timer = setTimeout(() => onComplete?.(), 3000)
      return () => clearTimeout(timer)
    }
  }, [flipped, reducedMotion, onComplete])

  const cfg = BRAND_CONFIG[brand]

  if (reducedMotion) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-stone-100">
        <div className="text-center">
          {imageUrl ? (
            <img src={imageUrl} alt={cardName} className="mx-auto h-48 rounded-xl shadow-lg" />
          ) : (
            <span className="text-7xl">🃏</span>
          )}
          <p className="mt-4 text-lg font-bold text-stone-900">{cardName}</p>
          <p className="text-sm text-stone-500">Προστέθηκε στο καλάθι σας</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-stone-900">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={45} />
        <ambientLight intensity={0.7} />
        <spotLight position={[3, 3, 3]} angle={0.3} penumbra={1} intensity={1.5} />
        <pointLight position={[-2, -1, 2]} intensity={0.5} color={cfg.accent} />
        <Suspense fallback={null}>
          <CardTexture animating={animating} imageUrl={imageUrl} brand={brand} />
        </Suspense>
        <Environment preset="city" />
      </Canvas>

      {!flipped ? (
        <button
          onClick={() => setFlipped(true)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-stone-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          Αποκάλυψη κάρτας
        </button>
      ) : (
        <button
          onClick={onComplete}
          className="absolute bottom-4 right-4 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          Παράλειψη
        </button>
      )}
    </div>
  )
}
