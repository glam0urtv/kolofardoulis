"use client"

import { useEffect, useState } from "react"
import { Package, FolderTree, ShoppingBag, AlertTriangle } from "lucide-react"
import Link from "next/link"

type Product = {
  id: string; name: string; type: string; inventory?: { stock: number }[] | null
}
type Category = { id: string; name: string; slug: string }

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => {})
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const lowStock = products.filter((p) => (p.inventory?.[0]?.stock ?? 0) <= 2 && (p.inventory?.[0]?.stock ?? 0) > 0)
  const totalStock = products.reduce((sum, p) => sum + (p.inventory?.[0]?.stock ?? 0), 0)

  const stats = [
    { label: "Προϊόντα", value: String(products.length), icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Κατηγορίες", value: String(categories.length), icon: FolderTree, color: "text-amber-600 bg-amber-50" },
    { label: "Συνολικό stock", value: String(totalStock), icon: ShoppingBag, color: "text-green-600 bg-green-50" },
    { label: "Χαμηλό απόθεμα", value: String(lowStock.length), icon: AlertTriangle, color: "text-purple-600 bg-purple-50" },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">Σύνοψη του καταστήματός σας</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className={`inline-flex rounded-xl p-2.5 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
            <p className="mt-3 text-2xl font-bold text-stone-900">{stat.value}</p>
            <p className="text-sm text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-stone-900">Χαμηλό απόθεμα</h2>
          </div>
          <div className="mt-4 divide-y divide-stone-100">
            {lowStock.length === 0 ? (
              <p className="py-8 text-center text-sm text-stone-400">Όλα τα προϊόντα έχουν επαρκές απόθεμα ✅</p>
            ) : lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <p className="text-sm font-medium text-stone-900">{item.name}</p>
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">{item.inventory?.[0]?.stock ?? 0} τμχ</span>
              </div>
            ))}
          </div>
          <Link href="/admin/products" className="mt-4 inline-block text-sm text-stone-500 hover:text-stone-700">Διαχείριση αποθέματος →</Link>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">Γρήγορες ενέργειες</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/admin/products" className="flex items-center gap-3 rounded-xl border border-stone-200 p-4 hover:bg-stone-50">
              <Package className="h-5 w-5 text-stone-500" />
              <span className="text-sm font-medium text-stone-700">Προσθήκη νέου προϊόντος</span>
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 rounded-xl border border-stone-200 p-4 hover:bg-stone-50">
              <FolderTree className="h-5 w-5 text-stone-500" />
              <span className="text-sm font-medium text-stone-700">Διαχείριση κατηγοριών</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
