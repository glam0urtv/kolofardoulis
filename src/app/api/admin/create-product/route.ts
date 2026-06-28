import { NextRequest, NextResponse } from "next/server"

const BASE = process.env.SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" }

export async function POST(req: NextRequest) {
  try {
    const { name, type, categoryId, priceCents, description, stock, slug, imageUrl } = await req.json()
    if (!name || !categoryId) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

    const id = `prod_${Date.now()}`
    const finalSlug = slug || name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")

    // Create product
    await fetch(`${BASE}/rest/v1/Product`, { method: "POST", headers: H, body: JSON.stringify({ id, name, type, categoryId, slug: finalSlug, priceCents, description: description || "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }) })

    // Create inventory
    await fetch(`${BASE}/rest/v1/Inventory`, { method: "POST", headers: H, body: JSON.stringify({ productId: id, stock: stock || 0, updatedAt: new Date().toISOString() }) })

    // Create media if image URL provided
    if (imageUrl) {
      await fetch(`${BASE}/rest/v1/Media`, { method: "POST", headers: H, body: JSON.stringify({ id: `med_${id}`, productId: id, url: imageUrl, alt: name, position: 0 }) })
    }

    return NextResponse.json({ success: true, id, slug: finalSlug })
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }) }
}
