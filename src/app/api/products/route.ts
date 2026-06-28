import { NextRequest, NextResponse } from "next/server"

const BASE = process.env.SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get("category")
  const productSlug = searchParams.get("slug")
  const limit = searchParams.get("limit") || "50"

  try {
    let url = `${BASE}/rest/v1/Product?select=*,inventory!inner(stock)&limit=${limit}`

    if (productSlug) {
      url = `${BASE}/rest/v1/Product?select=*,inventory!inner(stock)&slug=eq.${productSlug}`
    } else if (categorySlug) {
      // Get category ID first
      const catRes = await fetch(
        `${BASE}/rest/v1/Category?select=id&slug=eq.${categorySlug}`,
        { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
      )
      const cats = await catRes.json()
      if (cats?.[0]) {
        url = `${BASE}/rest/v1/Product?select=*,inventory!inner(stock)&categoryId=eq.${cats[0].id}&isActive=eq.true&limit=${limit}`
      }
    } else {
      url = `${BASE}/rest/v1/Product?select=*,inventory!inner(stock)&isActive=eq.true&order=createdAt.desc&limit=${limit}`
    }

    const res = await fetch(url, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
    })
    const data = await res.json()
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
