import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 })

    const res = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/User?select=role&email=eq.${encodeURIComponent(email)}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      }
    )
    const users = await res.json()
    const role = users?.[0]?.role || null
    return NextResponse.json({ role })
  } catch {
    return NextResponse.json({ role: null }, { status: 500 })
  }
}
