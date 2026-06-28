"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import Link from "next/link"

type Product = {
  id: string; name: string; slug: string; type: string; priceCents: number; currency: string
  description: string | null; isActive: boolean; categoryId: string
  attributes: Record<string, unknown> | null
  inventory?: { stock: number }[] | null
}

type Category = { id: string; name: string; slug: string; parentId: string | null }

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
    const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!BASE || !KEY) return

    // Fetch category
    fetch(`${BASE}/rest/v1/Category?slug=eq.${slug}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const cat = data?.[0]
        setCategory(cat || null)
        if (cat) {
          fetch(`${BASE}/rest/v1/Product?select=*,inventory(stock)&categoryId=eq.${cat.id}&isActive=eq.true`, {
            headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
          })
            .then((r) => r.json())
            .then((d) => { setProducts(Array.isArray(d) ? d : []); setLoading(false) })
        } else {
          setLoading(false)
        }
      })

    // Fetch all categories for breadcrumb
    fetch(`${BASE}/rest/v1/Category?select=id,name,slug,parentId&order=position.asc`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    })
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
  }, [slug])

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
          <p className="mt-4 text-lg">Δεν βρέθηκαν προϊόντα</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p as any} />)}
        </div>
      )}
    </div>
  )
}
