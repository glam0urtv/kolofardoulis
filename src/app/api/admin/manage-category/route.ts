import { NextRequest, NextResponse } from "next/server"

const BASE = process.env.SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" }

export async function POST(req: NextRequest) {
  try {
    const { name, slug, parentId } = await req.json()
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 })
    const id = `cat_${Date.now()}`
    await fetch(`${BASE}/rest/v1/Category`, { method: "POST", headers: H, body: JSON.stringify({ id, name, slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), parentId: parentId || null, position: 999, updatedAt: new Date().toISOString() }) })
    return NextResponse.json({ success: true, id })
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }) }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, name, slug } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    await fetch(`${BASE}/rest/v1/Category?id=eq.${id}`, { method: "PATCH", headers: H, body: JSON.stringify({ name, slug, updatedAt: new Date().toISOString() }) })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }) }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    await fetch(`${BASE}/rest/v1/Category?id=eq.${id}`, { method: "DELETE", headers: H })
    return NextResponse.json({ success: true })
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }) }
}
