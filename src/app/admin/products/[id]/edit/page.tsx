"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"

const productTypes = [
  { value: "SINGLE", label: "Single" },
  { value: "BOOSTER_BOX", label: "Booster Box" },
  { value: "BOOSTER_PACK", label: "Booster Pack" },
  { value: "PROMO", label: "Promo" },
]

interface Props {
  params: Promise<{ id: string }>
}

export default function EditProductPage({ params }: Props) {
  // We need to unwrap params
  const [productId, setProductId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    type: "SINGLE" as string,
    priceCents: 0,
    description: "",
    stock: 0,
    isActive: true,
  })
  const router = useRouter()

  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id)
      fetchProduct(id)
    })
  }, [])

  const fetchProduct = async (id: string) => {
    const res = await fetch(`/api/products?limit=100`)
    const all = await res.json()
    const product = (Array.isArray(all) ? all : []).find((p: {id:string}) => p.id === id)
    if (product) {
      setForm({
        name: product.name,
        type: product.type,
        priceCents: product.priceCents,
        description: product.description || "",
        stock: product.inventory?.[0]?.stock ?? 0,
        isActive: product.isActive,
      })
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Product?id=eq.${productId}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          priceCents: form.priceCents,
          description: form.description,
          isActive: form.isActive,
          updatedAt: new Date().toISOString(),
        }),
      }
    )

    if (res.ok) {
      router.push("/admin/products")
      router.refresh()
    }
    setSaving(false)
  }

  const handleToggleActive = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Product?id=eq.${productId}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          isActive: !form.isActive,
          updatedAt: new Date().toISOString(),
        }),
      }
    )
    setForm({ ...form, isActive: !form.isActive })
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-stone-200" />
        <div className="h-96 rounded-2xl bg-stone-200" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Επεξεργασία Προϊόντος
          </h1>
          <p className="text-sm text-stone-500">{form.name}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Όνομα
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Τύπος
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none"
          >
            {productTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Τιμή (€)
            </label>
            <input
              type="number"
              value={form.priceCents / 100 || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  priceCents: Math.round(Number(e.target.value) * 100),
                })
              }
              step="0.01"
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Απόθεμα
            </label>
            <input
              type="number"
              value={form.stock}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-400"
              disabled
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Περιγραφή
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={4}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-stone-600">
              {form.isActive ? "🟢 Ενεργό" : "🔴 Ανενεργό"}
            </span>
            <button
              type="button"
              onClick={handleToggleActive}
              className="text-xs text-stone-500 underline hover:text-stone-700"
            >
              {form.isActive ? "Απενεργοποίηση" : "Ενεργοποίηση"}
            </button>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Διαγραφή
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          <Save className="h-4 w-4" />
          {saving ? "Αποθήκευση..." : "Αποθήκευση αλλαγών"}
        </button>
      </form>
    </div>
  )
}
