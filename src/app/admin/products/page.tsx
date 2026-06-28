"use client"

import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"
import { Plus, Search, Pencil, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

type Product = {
  id: string; name: string; slug: string; type: string; priceCents: number
  isActive: boolean; inventory?: { stock: number }[] | null
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
  }, [])

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Προϊόντα</h1>
          <p className="mt-1 text-sm text-stone-500">{products.length} προϊόντα</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800">
          <Plus className="h-4 w-4" />Νέο προϊόν
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input type="text" placeholder="Αναζήτηση προϊόντων..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm focus:border-stone-400 focus:outline-none" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">Προϊόν</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">Τύπος</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-stone-400">Τιμή</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-stone-400">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-stone-400">Ενεργό</th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-stone-400">{search ? "Δεν βρέθηκαν" : "Δεν υπάρχουν προϊόντα"}</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-lg">
                      {p.type === "BOOSTER_BOX" ? "📦" : "🃏"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">{p.name}</p>
                      <p className="text-xs text-stone-400">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">{p.type}</span></td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-stone-900">{formatPrice(p.priceCents)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-semibold ${(p.inventory?.[0]?.stock ?? 0) <= 2 ? "text-red-600" : "text-stone-600"}`}>{p.inventory?.[0]?.stock ?? 0}</span>
                </td>
                <td className="px-4 py-3 text-center">{p.isActive ? <Eye className="mx-auto h-4 w-4 text-green-500" /> : <EyeOff className="mx-auto h-4 w-4 text-stone-300" />}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"><Pencil className="h-3.5 w-3.5" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
