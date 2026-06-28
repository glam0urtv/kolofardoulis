import { NextRequest, NextResponse } from "next/server"

const BASE = process.env.SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` }

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")
  if (!q || q.length < 1) return NextResponse.json([])

  try {
    // Search by name (case insensitive partial match via ilike)
    const term = q.replace(/[^a-zA-Z0-9\sͰ-Ͽ]/g, "").trim()
    if (!term) return NextResponse.json([])

    const res = await fetch(
      `${BASE}/rest/v1/Product?select=id,name,slug,type,priceCents,currency,isActive&or=(name.ilike.*${encodeURIComponent(term)}*,slug.ilike.*${encodeURIComponent(term)}*)&isActive=eq.true&limit=8`,
      { headers: H }
    )
    const products = await res.json()

    if (!Array.isArray(products)) return NextResponse.json([])

    // Fetch images for results
    const ids = products.map((p: { id: string }) => p.id).join(",")
    const mediaRes = await fetch(
      `${BASE}/rest/v1/Media?select=productId,url&productId=in.(${ids})&limit=8`,
      { headers: H }
    )
    const media = await mediaRes.json()
    const imgMap = new Map((Array.isArray(media) ? media : []).map((m: { productId: string; url: string }) => [m.productId, m.url]))

    const results = products.map((p: { id: string; name: string; slug: string; type: string; priceCents: number; currency: string }) => ({
      ...p,
      imageUrl: imgMap.get(p.id) || null,
    }))

    return NextResponse.json(results)
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}
