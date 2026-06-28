"use client"

import Link from "next/link"
import { useCartStore } from "@/services/cart"
import { SearchBar } from "@/components/search-bar"
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const DROPDOWNS = [
  {
    label: "One Piece",
    slug: "one-piece",
    children: [
      { label: "Singles", slug: "singles" },
      { label: "Booster Boxes", slug: "booster-boxes" },
      { label: "Booster Packs", slug: "booster-packs" },
      { label: "Promo", slug: "promo" },
    ],
  },
  {
    label: "Pokémon",
    slug: "pokemon",
    children: [
      { label: "Singles", slug: "pokemon-singles" },
      { label: "Booster Boxes", slug: "pokemon-booster-boxes" },
      { label: "ETBs", slug: "pokemon-etb" },
    ],
  },
  {
    label: "Riftbound",
    slug: "riftbound",
    children: [
      { label: "Singles", slug: "riftbound-singles" },
      { label: "Booster Boxes", slug: "riftbound-booster-boxes" },
    ],
  },
]

const QUICK_LINKS = [
  { label: "Booster Boxes", slug: "booster-boxes" },
  { label: "Promo", slug: "promo" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const itemCount = useCartStore((s) => s.itemCount())
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const handleEnter = (slug: string) => {
    clearTimeout(timeoutRef.current)
    setOpenDropdown(slug)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 200)
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-stone-900">
          Kolofardoulis<span className="text-brand">.</span>gr
        </Link>

        {/* Desktop nav */}
        <div ref={dropdownRef} className="hidden items-center gap-1 md:flex">
          {DROPDOWNS.map((dd) => (
            <div
              key={dd.slug}
              className="relative"
              onMouseEnter={() => handleEnter(dd.slug)}
              onMouseLeave={handleLeave}
            >
              <Link
                href={`/category/${dd.slug}`}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
              >
                {dd.label}
                <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
              </Link>

              {openDropdown === dd.slug && (
                <div
                  className="absolute left-0 top-full mt-1 w-48 rounded-xl border border-stone-200 bg-white py-1.5 shadow-xl"
                  onMouseEnter={() => handleEnter(dd.slug)}
                  onMouseLeave={handleLeave}
                >
                  {dd.children.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/category/${child.slug}`}
                      className="block px-4 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Divider */}
          <div className="mx-2 h-5 w-px bg-stone-200" />

          {/* Quick links */}
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.slug}
              href={`/category/${link.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <SearchBar />
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
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
          {DROPDOWNS.map((dd) => (
            <div key={dd.slug} className="mb-1">
              <Link
                href={`/category/${dd.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-semibold text-stone-900 hover:bg-stone-50"
              >
                {dd.label}
              </Link>
              {dd.children.map((child) => (
                <Link
                  key={child.slug}
                  href={`/category/${child.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg py-2 pl-7 pr-3 text-sm text-stone-600 hover:bg-stone-50"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="my-2 border-t border-stone-100" />
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.slug}
              href={`/category/${link.slug}`}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-stone-700 hover:bg-stone-50"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
