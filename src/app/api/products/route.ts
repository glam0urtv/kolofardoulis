import { NextRequest, NextResponse } from "next/server"

const BASE = process.env.SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const HEADERS = { apikey: KEY, Authorization: `Bearer ${KEY}` }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get("category")
  const productSlug = searchParams.get("slug")
  const limit = searchParams.get("limit") || "50"

  try {
    let productsUrl = `${BASE}/rest/v1/Product?select=*&limit=${limit}&order=createdAt.desc`

    if (productSlug) {
      productsUrl = `${BASE}/rest/v1/Product?select=*&slug=eq.${productSlug}`
    } else if (categorySlug) {
      // Get the category AND its children (for parent categories like "Pokemon")
      const allCatsRes = await fetch(
        `${BASE}/rest/v1/Category?select=id,slug,parentId`,
        { headers: HEADERS }
      )
      const allCats = await allCatsRes.json()
      const targetCat = (allCats as {id:string;slug:string;parentId:string|null}[]).find((c) => c.slug === categorySlug)
      if (targetCat) {
        const childIds = (allCats as {id:string;parentId:string|null}[])
          .filter((c) => c.parentId === targetCat.id)
          .map((c) => c.id)
        const allIds = [targetCat.id, ...childIds].join(",")
        productsUrl = `${BASE}/rest/v1/Product?select=*&categoryId=in.(${allIds})&isActive=eq.true&limit=${limit}&order=createdAt.desc`
      }
    } else {
      productsUrl = `${BASE}/rest/v1/Product?select=*&isActive=eq.true&limit=${limit}&order=createdAt.desc`
    }

    const productsRes = await fetch(productsUrl, { headers: HEADERS })
    const products = await productsRes.json()
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json([])
    }

    // Fetch inventory + images separately
    const productIds = products.map((p: { id: string }) => p.id).join(",")

    const [invRes, mediaRes] = await Promise.all([
      fetch(`${BASE}/rest/v1/Inventory?select=productId,stock&productId=in.(${productIds})`, { headers: HEADERS }),
      fetch(`${BASE}/rest/v1/Media?select=productId,url,alt&productId=in.(${productIds})`, { headers: HEADERS })
    ])

    const inventory = await invRes.json()
    const media = await mediaRes.json()

    const stockMap = new Map(
      (Array.isArray(inventory) ? inventory : []).map(
        (i: { productId: string; stock: number }) => [i.productId, i.stock]
      )
    )

    const imageMap = new Map<string, { url: string; alt: string | null }[]>()
    const isExternal = (url: string) => url.includes("assets.tcgdex.net") || url.includes("optcgapi.com")

    for (const m of (Array.isArray(media) ? media : [])) {
      const existing = imageMap.get(m.productId) || []
      // Rewrite external image URLs through our proxy (relative URL = always current deployment)
      let imgUrl = m.url
      if (isExternal(imgUrl)) {
        imgUrl = `/api/image-proxy?url=${encodeURIComponent(imgUrl)}`
      }
      existing.push({ url: imgUrl, alt: m.alt })
      imageMap.set(m.productId, existing)
    }

    // Merge inventory + images into products
    const merged = products.map((p: Record<string, unknown>) => ({
      ...p,
      inventory: [{ stock: stockMap.get(p.id as string) ?? 0 }],
      images: imageMap.get(p.id as string) || [],
    }))

    return NextResponse.json(merged)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
