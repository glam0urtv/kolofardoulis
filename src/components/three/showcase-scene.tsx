"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  Environment,
  PerspectiveCamera,
  Float,
  Text3D,
  Center,
  MeshTransmissionMaterial,
} from "@react-three/drei"
import * as THREE from "three"

function ShowcaseObjects() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <group ref={groupRef}>
      {/* Central card */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.8, 2.4, 0.05]} />
          <meshStandardMaterial
            color="#1c1917"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      </Float>

      {/* Floating booster packs */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[-1.5, 0.3, -0.5]} rotation={[0, 0.3, -0.1]}>
          <boxGeometry args={[0.6, 0.9, 0.15]} />
          <meshStandardMaterial color="#dc2626" roughness={0.4} metalness={0.2} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh position={[1.3, -0.2, -0.3]} rotation={[0, -0.2, 0.15]}>
          <boxGeometry args={[0.6, 0.9, 0.15]} />
          <meshStandardMaterial color="#d4a853" roughness={0.4} metalness={0.3} />
        </mesh>
      </Float>

      {/* Booster box */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <mesh position={[0.4, -0.8, 0.2]}>
          <boxGeometry args={[1.2, 1.2, 0.6]} />
          <meshStandardMaterial color="#292524" roughness={0.5} metalness={0.1} />
        </mesh>
      </Float>
    </group>
  )
}

export default function ShowcaseScene() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  if (reducedMotion) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-3xl bg-gradient-to-b from-stone-800 to-stone-900 text-white">
        <div className="text-center">
          <span className="text-7xl">🃏</span>
          <p className="mt-4 text-xl font-bold">Kolofardoulis.gr</p>
          <p className="text-stone-400">Trading Card Games</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-3xl bg-stone-900">
      <Canvas dpr={[1, 1.5]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <pointLight position={[-3, -2, 3]} intensity={0.8} color="#d4a853" />
        <ShowcaseObjects />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
