import { NextResponse } from "next/server"

const BASE = process.env.SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET() {
  try {
    const res = await fetch(
      `${BASE}/rest/v1/Category?select=*&order=position.asc`,
      { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
    )
    const data = await res.json()
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
