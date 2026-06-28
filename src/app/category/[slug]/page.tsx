"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

type Prod = {
  id: string; name: string; slug: string; type: string; priceCents: number
  isActive: boolean; inventory?: { stock: number }[] | null
}

type Cat = { id: string; name: string; slug: string; parentId: string | null }

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [products, setProducts] = useState<Prod[]>([])
  const [categories, setCategories] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))

    fetch(`/api/products?category=${slug}`)
      .then((r) => r.json())
      .then((d) => { setProducts(Array.isArray(d) ? d : []); setLoading(false) })
  }, [slug])

  const category = categories.find((c) => c.slug === slug)
  const parent = category?.parentId
    ? categories.find((c) => c.id === category.parentId)
    : null

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-8 w-48 rounded bg-stone-200" /><div className="grid gap-6 sm:grid-cols-3"><div className="aspect-[4/3] rounded-2xl bg-stone-200" /><div className="aspect-[4/3] rounded-2xl bg-stone-200" /><div className="aspect-[4/3] rounded-2xl bg-stone-200" /></div></div>

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="hover:text-stone-700">Αρχική</Link>
        {parent && <><span>/</span><Link href={`/category/${parent.slug}`} className="hover:text-stone-700">{parent.name}</Link></>}
        <span>/</span>
        <span className="text-stone-900">{category?.name || slug}</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-stone-900">{category?.name || slug}</h1>
        <p className="mt-2 text-stone-500">{products.length} προϊόντα</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <span className="text-5xl">📭</span>
          <p className="mt-4 text-lg">Δεν βρέθηκαν προϊόντα σε αυτή την κατηγορία</p>
          <Link href="/" className="mt-4 text-sm font-medium text-stone-600 hover:text-stone-900">← Επιστροφή στην αρχική</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p as any} />)}
        </div>
      )}
    </div>
  )
}
