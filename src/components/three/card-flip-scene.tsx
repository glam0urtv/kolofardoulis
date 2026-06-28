"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

function Card({
  animating,
  cardName,
}: {
  animating: boolean
  cardName: string
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (!animating || !meshRef.current) return

    const tl = gsap.timeline({ defaults: { duration: 0.7, ease: "power2.inOut" } })

    // Flip animation
    tl.to(meshRef.current.rotation, {
      y: Math.PI,
      duration: 0.8,
      ease: "power3.inOut",
    })
      .to(
        meshRef.current.position,
        {
          y: 0.3,
          z: 0.5,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        "-=0.4"
      )
      .to(
        meshRef.current.rotation,
        {
          y: 0,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "+=0.5"
      )
  }, [animating])

  return (
    <group>
      {/* Card face 1 (front) */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gold border accent */}
      <mesh position={[0, 0, 0.001]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.4, 2.0]} />
        <meshStandardMaterial
          color="#d4a853"
          roughness={0.2}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

interface Props {
  cardName: string
  onComplete?: () => void
}

export default function CardFlipScene({ cardName, onComplete }: Props) {
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

  if (reducedMotion) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-stone-100">
        <div className="text-center">
          <span className="text-7xl">🃏</span>
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
        <pointLight position={[-2, -1, 2]} intensity={0.5} color="#d4a853" />
        <Card animating={animating} cardName={cardName} />
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
