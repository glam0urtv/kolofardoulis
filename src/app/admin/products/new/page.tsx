"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, Search, X, Sparkles } from "lucide-react"
import Link from "next/link"

const productTypes = [
  { value: "SINGLE", label: "Single" },
  { value: "BOOSTER_BOX", label: "Booster Box" },
  { value: "BOOSTER_PACK", label: "Booster Pack" },
  { value: "PROMO", label: "Promo" },
]

type Suggestion = { id: string; name: string; type: string; imageUrl: string; rarity: string; set: string; price: number | null; tcg: string; categorySlug: string }
type Cat = { id: string; name: string; slug: string; parentId: string | null }

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Cat[]>([])

  // Autocomplete state
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<Suggestion | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const [imagePreview, setImagePreview] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: "", type: "SINGLE" as string, categoryId: "", categoryName: "",
    priceCents: 0, description: "", stock: 1, slug: "", imageUrl: "",
  })

  // Load categories
  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []))
    const h = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSuggestions([]) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/admin/search-cards?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setSuggestions(Array.isArray(data) ? data : [])
      } catch { setSuggestions([]) }
      setSearching(false)
    }, 400)
    return () => clearTimeout(t)
  }, [query])

  // Auto-fill form when card selected
  const selectSuggestion = async (s: Suggestion) => {
    setSelected(s)
    setSuggestions([])
    setQuery("")
    setImagePreview(s.imageUrl)

    // Find matching category
    const cat = categories.find(c => c.slug === s.categorySlug) || categories[0]

    // Calculate EUR price from USD if needed
    let price = s.price || 0
    // Pokemon prices from TCGdex are in EUR (cardmarket), One Piece also in EUR

    setForm({
      name: s.name,
      type: s.type,
      categoryId: cat?.id || "",
      categoryName: cat?.name || "",
      priceCents: Math.round(price * 100),
      description: `${s.set} — ${s.rarity}`,
      stock: 1,
      slug: "",
      imageUrl: s.imageUrl,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) { alert("Επίλεξε κατηγορία!"); return }
    setSaving(true)
    const res = await fetch("/api/admin/create-product", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl: form.imageUrl || imagePreview }),
    })
    if (res.ok) { router.push("/admin/products"); router.refresh() }
    else { alert("Σφάλμα!"); setSaving(false) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { const url = reader.result as string; setForm({ ...form, imageUrl: url }); setImagePreview(url) }
    reader.readAsDataURL(file)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"><ArrowLeft className="h-5 w-5" /></Link>
        <div><h1 className="text-2xl font-bold text-stone-900">Νέο Προϊόν</h1></div>
      </div>

      {/* Auto-complete search */}
      <div ref={searchRef} className="relative">
        <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-stone-700">
          <Sparkles className="h-4 w-4 text-amber-500" />
          Αναζήτηση κάρτας για auto-complete
          <span className="font-normal text-stone-400">(optcgapi + TCGdex)</span>
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Π.χ. Boa Hancock ή Charizard..."
            className="w-full rounded-xl border-2 border-amber-200 bg-amber-50/30 py-3 pl-10 pr-4 text-sm focus:border-amber-400 focus:outline-none"
          />
          {searching && <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-amber-300 border-t-amber-600" />}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 w-full rounded-xl border border-stone-200 bg-white shadow-xl max-h-80 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button key={i} type="button" onClick={() => selectSuggestion(s)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-stone-50 border-b border-stone-50 last:border-0">
                {s.imageUrl && <img src={s.imageUrl} alt="" className="h-12 w-9 rounded object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">{s.name}</p>
                  <p className="text-xs text-stone-500">{s.set} · {s.rarity}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500">{s.tcg}</span>
                  {s.price && <p className="mt-0.5 text-xs font-semibold text-stone-700">€{s.price.toFixed(2)}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm">
          <Sparkles className="h-4 w-4 text-green-600" />
          <span className="text-green-700 font-medium">Επιλέχθηκε: {selected.name}</span>
          <span className="text-green-500 text-xs">{selected.tcg}</span>
          <button type="button" onClick={() => { setSelected(null); setForm({ ...form, name: "", imageUrl: "" }); setImagePreview("") }} className="ml-auto"><X className="h-4 w-4 text-green-400 hover:text-green-600" /></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6">
        {/* Όνομα */}
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Όνομα *</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>

        {/* Κατηγορία */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Κατηγορία *</label>
          <select value={form.categoryId} onChange={e => { const cat = categories.find(c => c.id === e.target.value); setForm({ ...form, categoryId: e.target.value, categoryName: cat?.name || "" }) }}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none">
            <option value="">Επίλεξε...</option>
            {categories.filter(c => !c.parentId).map(root => (
              <optgroup key={root.id} label={root.name}>
                {categories.filter(c => c.parentId === root.id).map(c => (
                  <option key={c.id} value={c.id}>└ {c.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Τύπος + Τιμή */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Τύπος</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none">{productTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Τιμή (€) *</label><input required type="number" value={form.priceCents / 100 || ""} onChange={e => setForm({ ...form, priceCents: Math.round(Number(e.target.value) * 100) })} step="0.01" className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>
        </div>

        {/* Stock + Slug */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Απόθεμα</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Slug <span className="font-normal text-stone-400">(auto)</span></label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>
        </div>

        {/* Περιγραφή */}
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Περιγραφή</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>

        {/* Εικόνα */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Εικόνα</label>
          {imagePreview ? (
            <div className="relative mb-3 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 object-contain" />
              <button type="button" onClick={() => { setImagePreview(""); setForm({ ...form, imageUrl: "" }) }} className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 hover:bg-white"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <div className="mb-3 flex items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 py-8 text-stone-400"><Upload className="h-6 w-6" /></div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl border border-stone-200 px-4 py-2 text-sm hover:bg-stone-50"><Upload className="mr-1 inline h-3.5 w-3.5" />Upload</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <input type="url" value={form.imageUrl} onChange={e => { setForm({ ...form, imageUrl: e.target.value }); setImagePreview(e.target.value) }} placeholder="ή URL εικόνας..." className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Δημιουργία..." : "Δημιουργία προϊόντος"}</button>
      </form>
    </div>
  )
}
