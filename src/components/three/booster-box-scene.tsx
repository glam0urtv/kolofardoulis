"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment, useTexture } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"

function BoosterBox({ quantity, imageUrl }: { quantity: number; imageUrl?: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const lidRef = useRef<THREE.Group>(null)
  const texture = imageUrl ? useTexture(imageUrl) : null
  const [animPhase, setAnimPhase] = useState(0)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })

    // Float up slightly
    tl.to(groupRef.current!.position, { y: 0.2, duration: 0.5, ease: "power2.out" })

    // Open lid
    tl.to(lidRef.current!.rotation, { x: -Math.PI * 0.7, duration: 0.8, ease: "power3.inOut" })
    tl.call(() => setAnimPhase(1))

    // Packs float out
    tl.to(groupRef.current!.position, { y: 0.4, duration: 0.4, ease: "power2.out" })
    tl.to({}, { duration: 1.5 }) // pause to admire

    // Close and settle
    tl.to(lidRef.current!.rotation, { x: 0, duration: 0.6, ease: "power2.in" })
    tl.to(groupRef.current!.position, { y: 0, duration: 0.5, ease: "power2.in" })
    tl.call(() => setAnimPhase(2))
  }, [])

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Main box body */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 1.2, 0.8]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.5} metalness={0.05} />
        ) : (
          <meshStandardMaterial color="#292524" roughness={0.5} metalness={0.1} />
        )}
      </mesh>

      {/* Front label (textured face) */}
      <mesh position={[0, 0, 0.401]}>
        <planeGeometry args={imageUrl ? 1.7 : 1.4, imageUrl ? 1.1 : 0.9} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.4} />
        ) : (
          <meshStandardMaterial color="#d4a853" roughness={0.2} metalness={0.3} />
        )}
      </mesh>

      {/* Lid */}
      <group ref={lidRef} position={[0, 0.6, 0]}>
        <mesh>
          <boxGeometry args={[1.85, 0.15, 0.85]} />
          <meshStandardMaterial color="#1c1917" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Lid top label */}
        <mesh position={[0, 0.076, 0]}>
          <planeGeometry args={[1.6, 0.7]} rotation={[-Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#292524" roughness={0.3} />
        </mesh>
      </group>

      {/* Packs inside */}
      {animPhase >= 1 && Array.from({ length: Math.min(quantity, 12) }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (i % 4 - 1.5) * 0.28,
            0.05 + Math.random() * 0.3,
            Math.floor(i / 4) * 0.25 - 0.2,
          ]}
          rotation={[(Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.2, 0]}
        >
          <boxGeometry args={[0.22, 0.35, 0.04]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#dc2626" : i % 3 === 1 ? "#d4a853" : "#2563eb"}
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

interface Props {
  quantity: number
  imageUrl?: string
  onComplete?: () => void
}

export default function BoosterBoxScene({ quantity, imageUrl, onComplete }: Props) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const timer = setTimeout(() => onComplete?.(), 4500)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (reducedMotion) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-stone-100">
        <div className="text-center">
          {imageUrl ? (
            <img src={imageUrl} alt="Booster Box" className="mx-auto h-40 rounded-xl shadow-lg" />
          ) : (
            <span className="text-7xl">📦</span>
          )}
          <p className="mt-4 text-lg font-bold text-stone-900">{quantity} booster packs</p>
          <p className="text-sm text-stone-500">Προστέθηκε στο καλάθι σας</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-stone-900">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} shadows>
        <PerspectiveCamera makeDefault position={[0, 0.5, 4]} fov={45} />
        <ambientLight intensity={0.6} />
        <spotLight position={[3, 4, 3]} angle={0.4} penumbra={1} intensity={1.2} castShadow />
        <pointLight position={[-2, 1, 2]} intensity={0.6} color="#d4a853" />
        <Suspense fallback={null}>
          <BoosterBox quantity={quantity} imageUrl={imageUrl} />
        </Suspense>
        <Environment preset="studio" />
      </Canvas>

      <button
        onClick={onComplete}
        className="absolute bottom-4 right-4 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        Παράλειψη
      </button>
    </div>
  )
}
