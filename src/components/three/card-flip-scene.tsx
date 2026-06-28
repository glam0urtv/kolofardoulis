"use client"

import { useEffect, useRef, useState, Suspense, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Environment, useTexture } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

type Brand = "one-piece" | "pokemon" | "riftbound"

const BRAND_CONFIG: Record<Brand, { bg: string; accent: string; text: string; label: string }> = {
  "one-piece": { bg: "#8b0000", accent: "#d4a853", text: "#d4a853", label: "ONE PIECE" },
  "pokemon": { bg: "#1a47b8", accent: "#ffcc00", text: "#ffffff", label: "POKÉMON" },
  "riftbound": { bg: "#1a0a2e", accent: "#00ffff", text: "#e0c0ff", label: "RIFTBOUND" },
}

function generateCardBackTexture(brand: Brand): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 400
  canvas.height = 560
  const ctx = canvas.getContext("2d")!
  const cfg = BRAND_CONFIG[brand]

  // Background with gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 400, 560)
  bgGrad.addColorStop(0, cfg.accent + "44")
  bgGrad.addColorStop(1, cfg.bg)
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, 400, 560)

  // Border
  ctx.strokeStyle = cfg.accent
  ctx.lineWidth = 8
  ctx.strokeRect(12, 12, 376, 536)

  // Inner border
  ctx.strokeStyle = cfg.accent + "88"
  ctx.lineWidth = 2
  ctx.strokeRect(24, 24, 352, 512)

  // Center circle
  ctx.beginPath()
  ctx.arc(200, 220, 80, 0, Math.PI * 2)
  ctx.strokeStyle = cfg.accent
  ctx.lineWidth = 3
  ctx.stroke()

  // Brand-specific icon
  if (brand === "pokemon") {
    // Poké Ball top half
    ctx.beginPath()
    ctx.arc(200, 220, 70, Math.PI, 0)
    ctx.fillStyle = "#ff3333"
    ctx.fill()
    // Bottom half
    ctx.beginPath()
    ctx.arc(200, 220, 70, 0, Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    // Center line
    ctx.beginPath()
    ctx.moveTo(130, 220)
    ctx.lineTo(270, 220)
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 4
    ctx.stroke()
    // Center circle
    ctx.beginPath()
    ctx.arc(200, 220, 20, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 3
    ctx.stroke()
    // Inner dot
    ctx.beginPath()
    ctx.arc(200, 220, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#333"
    ctx.fill()
  } else if (brand === "one-piece") {
    // Skull/cross bones style
    ctx.beginPath()
    ctx.arc(200, 220, 70, 0, Math.PI * 2)
    ctx.fillStyle = cfg.accent + "22"
    ctx.fill()
    ctx.strokeStyle = cfg.accent
    ctx.lineWidth = 3
    ctx.stroke()
    // Draw "X" mark
    ctx.beginPath()
    ctx.moveTo(160, 180)
    ctx.lineTo(240, 260)
    ctx.strokeStyle = cfg.accent
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(240, 180)
    ctx.lineTo(160, 260)
    ctx.stroke()
  } else {
    // Rift/Void style
    ctx.beginPath()
    ctx.moveTo(200, 140)
    ctx.lineTo(260, 220)
    ctx.lineTo(200, 300)
    ctx.lineTo(140, 220)
    ctx.closePath()
    ctx.fillStyle = cfg.accent + "22"
    ctx.fill()
    ctx.strokeStyle = cfg.accent
    ctx.lineWidth = 3
    ctx.stroke()
  }

  // Brand label at bottom
  ctx.fillStyle = cfg.text
  ctx.font = "bold 28px 'Geist Sans', sans-serif"
  ctx.textAlign = "center"
  ctx.fillText(cfg.label, 200, 380)

  // Smaller sub-text
  ctx.fillStyle = cfg.accent + "aa"
  ctx.font = "14px 'Geist Sans', sans-serif"
  ctx.fillText("TRADING CARD GAME", 200, 410)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
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
  const meshRef = useRef<THREE.Mesh>(null)
  const frontTexture = imageUrl ? useTexture(imageUrl) : null
  const backTexture = useMemo(() => generateCardBackTexture(brand), [brand])

  useEffect(() => {
    if (!animating || !meshRef.current) return
    const tl = gsap.timeline({ defaults: { duration: 0.7, ease: "power2.inOut" } })
    tl.to(meshRef.current.rotation, { y: Math.PI, duration: 0.8, ease: "power3.inOut" })
      .to(meshRef.current.position, { y: 0.3, z: 0.5, duration: 0.5, ease: "back.out(1.5)" }, "-=0.4")
      .to(meshRef.current.rotation, { y: 0, duration: 0.8, ease: "power3.inOut" }, "+=0.5")
  }, [animating])

  return (
    <group>
      {/* Card front */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[1.6, 2.2]} />
        {frontTexture ? (
          <meshStandardMaterial map={frontTexture} roughness={0.4} side={THREE.DoubleSide} />
        ) : (
          <meshStandardMaterial color="#ffffff" roughness={0.3} side={THREE.DoubleSide} />
        )}
      </mesh>

      {/* Card back — procedural texture */}
      <mesh position={[0, 0, -0.003]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.55, 2.15]} />
        <meshStandardMaterial map={backTexture} roughness={0.3} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* Gold border accent */}
      <mesh position={[0, 0, 0.002]}>
        <planeGeometry args={[1.42, 2.02]} />
        <meshStandardMaterial color="#d4a853" roughness={0.1} metalness={0.6} side={THREE.DoubleSide} transparent opacity={0.12} />
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

export { BRAND_CONFIG }
