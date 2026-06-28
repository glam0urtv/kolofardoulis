"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

function BoosterBox({ quantity, animating }: { quantity: number; animating: boolean }) {
  const lidRef = useRef<THREE.Group>(null)
  const packsRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!animating || !lidRef.current) return

    // Lid opening animation via GSAP + direct property manipulation
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.inOut" } })

    tl.to(lidRef.current.rotation, {
      x: -Math.PI * 0.6,
      duration: 0.8,
      ease: "power2.inOut",
    }).to(
      packsRef.current?.children || [],
      {
        duration: 0.6,
        stagger: 0.15,
        // @ts-expect-error GSAP custom properties
        y: "+=0.8",
        opacity: 1,
        ease: "back.out(2)",
      },
      "-=0.3"
    )
  }, [animating])

  return (
    <group>
      {/* Box body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1.2, 0.8]} />
        <meshStandardMaterial color="#292524" roughness={0.5} />
      </mesh>

      {/* Lid */}
      <group ref={lidRef} position={[0, 0.6, 0]}>
        <mesh>
          <boxGeometry args={[1.85, 0.15, 0.85]} />
          <meshStandardMaterial color="#1c1917" roughness={0.4} metalness={0.2} />
        </mesh>
      </group>

      {/* Packs inside */}
      <group ref={packsRef} position={[0, 0.1, 0]}>
        {Array.from({ length: Math.min(quantity, 10) }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (i % 3 - 1) * 0.35,
              -0.1,
              Math.floor(i / 3) * 0.2 - 0.2,
            ]}
            scale={[0.3, 0.45, 0.08]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? "#dc2626" : i % 3 === 1 ? "#d4a853" : "#2563eb"}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

interface Props {
  quantity: number
  onComplete?: () => void
}

export default function BoosterBoxScene({ quantity, onComplete }: Props) {
  const [animating, setAnimating] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
  }, [])

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(() => {
      if (!reducedMotion) {
        setAnimating(true)
      }
    }, 300)

    // Auto-complete after animation duration
    const completeTimer = setTimeout(() => {
      onComplete?.()
    }, 3500)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [reducedMotion, onComplete])

  if (reducedMotion) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-stone-100">
        <div className="text-center">
          <span className="text-7xl">📦</span>
          <p className="mt-4 text-lg font-bold text-stone-900">
            {quantity} booster packs στο κουτί σας
          </p>
          <p className="text-sm text-stone-500">Έτοιμο για αγορά!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-stone-900">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={45} />
        <ambientLight intensity={0.6} />
        <spotLight position={[3, 4, 3]} angle={0.4} penumbra={1} intensity={1.2} />
        <pointLight position={[-2, 1, 2]} intensity={0.6} color="#d4a853" />
        <BoosterBox quantity={quantity} animating={animating} />
        <Environment preset="studio" />
      </Canvas>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute bottom-4 right-4 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        Παράλειψη
      </button>
    </div>
  )
}
