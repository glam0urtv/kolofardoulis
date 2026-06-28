import { NextRequest, NextResponse } from "next/server"

const BASE = process.env.SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" }

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, type, priceCents, description, isActive, imageUrl } = body
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

    // Update product
    await fetch(`${BASE}/rest/v1/Product?id=eq.${id}`, {
      method: "PATCH", headers: H,
      body: JSON.stringify({ name, type, priceCents, description, isActive, updatedAt: new Date().toISOString() }),
    })

    // Update or create media
    if (imageUrl) {
      const existing = await fetch(`${BASE}/rest/v1/Media?select=id&productId=eq.${id}`, { headers: H }).then(r => r.json())
      if (existing?.[0]) {
        await fetch(`${BASE}/rest/v1/Media?id=eq.${existing[0].id}`, { method: "PATCH", headers: H, body: JSON.stringify({ url: imageUrl }) })
      } else {
        await fetch(`${BASE}/rest/v1/Media`, { method: "POST", headers: H, body: JSON.stringify({ id: `med_${id}`, productId: id, url: imageUrl, alt: name, position: 0 }) })
      }
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
