import { NextRequest, NextResponse } from "next/server"

/**
 * Image proxy — bypasses CORS restrictions for external card images.
 * Fetches the image server-side and returns it with proper CORS headers.
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 })
  }

  // Only allow known image hosts
  const allowed = [
    "assets.tcgdex.net",
    "optcgapi.com",
  ]
  const host = new URL(url).hostname
  if (!allowed.some((h) => host.endsWith(h))) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 })
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Kolofardoulis.gr/1.0" },
    })
    if (!res.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    const contentType = res.headers.get("content-type") || "image/jpeg"
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}
