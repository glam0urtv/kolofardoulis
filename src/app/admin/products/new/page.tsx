"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

const productTypes = [
  { value: "SINGLE", label: "Single" },
  { value: "BOOSTER_BOX", label: "Booster Box" },
  { value: "BOOSTER_PACK", label: "Booster Pack" },
  { value: "PROMO", label: "Promo" },
]

export default function NewProductPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    type: "SINGLE" as string,
    categoryId: "",
    priceCents: 0,
    description: "",
    stock: 0,
    slug: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const slug =
      form.slug ||
      form.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Product`,
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          id: `prod_${Date.now()}`,
          name: form.name,
          type: form.type,
          categoryId: form.categoryId || "cat_002",
          slug,
          priceCents: form.priceCents,
          description: form.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      }
    )

    if (res.ok) {
      // Create inventory
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Inventory`,
        {
          method: "POST",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            productId: `prod_${Date.now()}`,
            stock: form.stock,
            updatedAt: new Date().toISOString(),
          }),
        }
      )

      router.push("/admin/products")
      router.refresh()
    } else {
      alert("Σφάλμα κατά την αποθήκευση")
      setSaving(false)
    }
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
          <h1 className="text-2xl font-bold text-stone-900">Νέο Προϊόν</h1>
          <p className="text-sm text-stone-500">
            Προσθήκη νέου προϊόντος στο κατάστημα
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6"
      >
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Όνομα προϊόντος
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none"
            required
          />
        </div>

        {/* Type */}
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

        {/* Price + Stock row */}
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
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-stone-700">
              Απόθεμα
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: Number(e.target.value) })
              }
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Description */}
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

        {/* Slug */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Slug{" "}
            <span className="font-normal text-stone-400">(προαιρετικό)</span>
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none"
          />
        </div>

        {/* Image upload placeholder */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700">
            Εικόνες
          </label>
          <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 py-10 text-stone-400">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8" />
              <p className="mt-2 text-sm">Drag & drop ή κλικ για upload</p>
              <p className="text-xs">PNG, JPG έως 5MB</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Αποθήκευση..." : "Δημιουργία προϊόντος"}
        </button>
      </form>
    </div>
  )
}
