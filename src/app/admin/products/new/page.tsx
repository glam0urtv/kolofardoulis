"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, ChevronDown, Search, X } from "lucide-react"
import Link from "next/link"

const productTypes = [
  { value: "SINGLE", label: "Single" },
  { value: "BOOSTER_BOX", label: "Booster Box" },
  { value: "BOOSTER_PACK", label: "Booster Pack" },
  { value: "PROMO", label: "Promo" },
]

type Cat = { id: string; name: string; slug: string; parentId: string | null }

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Cat[]>([])
  const [catSearch, setCatSearch] = useState("")
  const [catOpen, setCatOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const catRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({
    name: "", type: "SINGLE" as string, categoryId: "", categoryName: "",
    priceCents: 0, description: "", stock: 0, slug: "",
  })

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []))
    // Close dropdown on outside click
    const h = (e: MouseEvent) => { if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const parents = categories.filter(c => !c.parentId)
  const filtered = categories.filter(c =>
    !catSearch || c.name.toLowerCase().includes(catSearch.toLowerCase()) || c.slug.toLowerCase().includes(catSearch.toLowerCase())
  )

  const selectCategory = (cat: Cat) => {
    setForm({ ...form, categoryId: cat.id, categoryName: cat.name })
    setCatSearch("")
    setCatOpen(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const url = reader.result as string
      setImageUrl(url); setImagePreview(url)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) { alert("Επίλεξε κατηγορία!"); return }
    setSaving(true)
    const res = await fetch("/api/admin/create-product", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, imageUrl }),
    })
    if (res.ok) { router.push("/admin/products"); router.refresh() }
    else { alert("Σφάλμα!"); setSaving(false) }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"><ArrowLeft className="h-5 w-5" /></Link>
        <div><h1 className="text-2xl font-bold text-stone-900">Νέο Προϊόν</h1></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6">
        {/* Όνομα */}
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Όνομα *</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>

        {/* Κατηγορία dropdown */}
        <div ref={catRef} className="relative">
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Κατηγορία *</label>
          <button type="button" onClick={() => setCatOpen(!catOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-stone-200 px-4 py-2.5 text-sm hover:bg-stone-50">
            <span className={form.categoryName ? "text-stone-900" : "text-stone-400"}>
              {form.categoryName || "Επίλεξε κατηγορία..."}
            </span>
            <ChevronDown className="h-4 w-4 text-stone-400" />
          </button>
          {catOpen && (
            <div className="absolute z-20 mt-1 w-full rounded-xl border border-stone-200 bg-white shadow-lg">
              <div className="relative border-b border-stone-100 p-2">
                <Search className="absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" />
                <input value={catSearch} onChange={e => setCatSearch(e.target.value)} placeholder="Αναζήτηση..." className="w-full rounded-lg py-2 pl-8 pr-3 text-sm focus:outline-none" autoFocus />
              </div>
              <div className="max-h-64 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-stone-400">Δεν βρέθηκαν</p>
                ) : (
                  filtered.map(cat => (
                    <button key={cat.id} type="button" onClick={() => selectCategory(cat)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-stone-100 ${form.categoryId === cat.id ? "bg-stone-100 font-semibold" : ""}`}>
                      <span>{cat.parentId ? "└ " : ""}{cat.name}</span>
                      <span className="text-xs text-stone-400">{cat.slug}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Τύπος + Τιμή */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Τύπος</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none">{productTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Τιμή (€) *</label><input required type="number" value={form.priceCents / 100 || ""} onChange={e => setForm({ ...form, priceCents: Math.round(Number(e.target.value) * 100) })} step="0.01" className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>
        </div>

        {/* Stock + Slug */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Απόθεμα</label><input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>
          <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Slug <span className="font-normal text-stone-400">(auto αν κενό)</span></label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>
        </div>

        {/* Περιγραφή */}
        <div><label className="mb-1.5 block text-sm font-semibold text-stone-700">Περιγραφή</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none" /></div>

        {/* Εικόνα */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">Εικόνα</label>
          {imagePreview ? (
            <div className="relative mb-3 overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 object-contain" />
              <button type="button" onClick={() => { setImagePreview(""); setImageUrl("") }} className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 hover:bg-white"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <div className="mb-3 flex items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 py-8 text-stone-400"><Upload className="h-6 w-6" /></div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-xl border border-stone-200 px-4 py-2 text-sm hover:bg-stone-50"><Upload className="mr-1 inline h-3.5 w-3.5" />Upload</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <input type="url" value={imageUrl} onChange={e => { setImageUrl(e.target.value); setImagePreview(e.target.value) }} placeholder="ή URL εικόνας..." className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-stone-400 focus:outline-none" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Δημιουργία..." : "Δημιουργία προϊόντος"}</button>
      </form>
    </div>
  )
}
