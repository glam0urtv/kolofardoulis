"use client"

import Link from "next/link"
import { useCartStore } from "@/services/cart"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useState } from "react"

const CATEGORIES = [
  { name: "One Piece", slug: "one-piece" },
  { name: "Singles", slug: "singles" },
  { name: "Booster Boxes", slug: "booster-boxes" },
  { name: "Booster Packs", slug: "booster-packs" },
  { name: "Promo", slug: "promo" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-stone-900"
        >
          Kolofardoulis<span className="text-brand">.</span>gr
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const event = new CustomEvent("open-cart")
              window.dispatchEvent(event)
            }}
            className="relative rounded-full p-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
            aria-label="Καλάθι"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden rounded-full p-2 text-stone-600 hover:bg-stone-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Μενού"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 pb-6 pt-2 md:hidden">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
