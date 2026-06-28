"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"

type Result = {
  id: string; name: string; slug: string; type: string
  priceCents: number; currency: string; imageUrl: string | null
}

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", h)
    // Keyboard shortcut: Ctrl+K to focus search
    const kh = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", kh)
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", kh) }
  }, [])

  useEffect(() => {
    if (query.length < 1) { setResults([]); return }
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data : [])
      } catch { setResults([]) }
      setLoading(false); setSelected(-1)
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, -1)) }
    else if (e.key === "Enter") {
      if (selected >= 0 && results[selected]) {
        router.push(`/product/${results[selected].slug}`)
        setOpen(false); setQuery("")
      }
    }
    else if (e.key === "Escape") { setOpen(false) }
  }

  const typeEmoji: Record<string, string> = { SINGLE: "🃏", BOOSTER_BOX: "📦", BOOSTER_PACK: "📦", PROMO: "⭐" }

  return (
    <div ref={containerRef} className="relative">
      {/* Search trigger button */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 100) }}
        className="hidden md:flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-400 transition-all hover:border-stone-300 hover:text-stone-600 hover:shadow-sm"
      >
        <Search className="h-4 w-4" />
        <span className="w-32 text-left">Αναζήτηση...</span>
        <kbd className="rounded-md border border-stone-200 bg-white px-1.5 py-0.5 text-[10px] text-stone-400">Ctrl+K</kbd>
      </button>

      {/* Mobile search icon */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 100) }}
        className="md:hidden rounded-full p-2 text-stone-600 hover:bg-stone-100"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Search overlay */}
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed left-1/2 top-24 z-50 w-[95vw] max-w-xl -translate-x-1/2">
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
              {/* Input */}
              <div className="flex items-center gap-3 border-b border-stone-100 px-4 py-3">
                <Search className="h-5 w-5 text-stone-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ψάξε για κάρτες, booster boxes..."
                  className="flex-1 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  autoFocus
                />
                {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />}
                <button onClick={() => { setOpen(false); setQuery("") }} className="rounded-full p-1 hover:bg-stone-100">
                  <X className="h-4 w-4 text-stone-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {query.length > 0 && results.length === 0 && !loading ? (
                  <div className="flex flex-col items-center py-10 text-stone-400">
                    <Search className="h-10 w-10" />
                    <p className="mt-3 text-sm">Δεν βρέθηκαν προϊόντα για "{query}"</p>
                  </div>
                ) : results.length > 0 ? (
                  results.map((r, i) => (
                    <Link
                      key={r.id}
                      href={`/product/${r.slug}`}
                      onClick={() => { setOpen(false); setQuery("") }}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${i === selected ? "bg-stone-100" : "hover:bg-stone-50"}`}
                    >
                      <div className="flex h-12 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-stone-100 text-lg">
                        {r.imageUrl ? (
                          <img src={r.imageUrl} alt="" className="h-full w-full rounded-lg object-contain p-1" />
                        ) : (
                          typeEmoji[r.type] || "🃏"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-900">{r.name}</p>
                        <p className="text-xs text-stone-400">{r.type}</p>
                      </div>
                      <p className="text-sm font-semibold text-stone-700">{formatPrice(r.priceCents)}</p>
                    </Link>
                  ))
                ) : query.length > 0 && loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10 text-stone-400">
                    <Search className="h-10 w-10" />
                    <p className="mt-3 text-sm">Ξεκίνα να γράφεις για αναζήτηση</p>
                    <p className="mt-1 text-xs">Ή πάτα <kbd className="rounded bg-stone-100 px-1 text-[10px]">ESC</kbd> για κλείσιμο</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="border-t border-stone-100 px-4 py-2 text-center text-[10px] text-stone-400">
                <kbd className="rounded bg-stone-100 px-1">↑↓</kbd> Πλοήγηση <kbd className="rounded bg-stone-100 px-1 ml-1">Enter</kbd> Επιλογή <kbd className="rounded bg-stone-100 px-1 ml-1">Esc</kbd> Κλείσιμο
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
