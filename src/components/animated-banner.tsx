"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export default function AnimatedBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Particle system for aura/glow effect
    const particles: Particle[] = []
    const PARTICLE_COUNT = 60

    class Particle {
      x = 0; y = 0; size = 0; speedX = 0; speedY = 0
      life = 0; maxLife = 0; hue = 0

      init() {
        this.x = Math.random() * canvas!.width
        this.y = canvas!.height * 0.3 + Math.random() * canvas!.height * 0.4
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.4
        this.speedY = (Math.random() - 0.5) * 0.6 - 0.3
        this.maxLife = 100 + Math.random() * 200
        this.life = this.maxLife
        this.hue = 30 + Math.random() * 20 // gold/amber
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.life--
        if (this.life <= 0) this.init()
      }

      draw() {
        const alpha = Math.min(1, this.life / (this.maxLife * 0.3)) * 0.6
        const gradient = ctx!.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3)
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${alpha})`)
        gradient.addColorStop(1, "transparent")

        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2)
        ctx!.fillStyle = gradient
        ctx!.fill()
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new Particle()
      p.init()
      p.life = Math.random() * p.maxLife // stagger initial life
      particles.push(p)
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Pulsing background glow
      const time = Date.now() * 0.001
      const glowAlpha = 0.06 + Math.sin(time * 1.5) * 0.03
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      )
      bgGradient.addColorStop(0, `rgba(212, 168, 83, ${glowAlpha * 1.5})`)
      bgGradient.addColorStop(0.5, `rgba(220, 38, 38, ${glowAlpha})`)
      bgGradient.addColorStop(1, "transparent")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((p) => {
        p.update()
        p.draw()
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    resize()
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900">
      {/* Banner image — full width, fills the entire container */}
      <img
        src="/banner.png"
        alt="Kolofardoulis.gr"
        className="relative z-10 w-full object-cover drop-shadow-[0_0_60px_rgba(212,168,83,0.4)]"
      />

      {/* Particle canvas overlay */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-20"
      />

      {/* Pulsing bottom glow bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-px animate-pulse bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
    </div>
  )
}
