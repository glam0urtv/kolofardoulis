/**
 * Cron Job — Release Expired Reservations
 *
 * Called by Vercel Cron every 2 minutes.
 * Finds StockReservations where status=PENDING and expiresAt < now(),
 * releases them and returns stock to inventory.
 *
 * Per docs/05-INVENTORY-CONCURRENCY-SAFETY.md (Step 3β)
 */

import { NextResponse } from "next/server"

// Vercel Cron secret to prevent unauthorized calls
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // This would use the inventory service directly when Prisma is available.
  // For now, call the Supabase REST API to find and release expired reservations.
  try {
    const BASE = process.env.SUPABASE_URL!
    const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

    // Find expired PENDING reservations
    const now = new Date().toISOString()
    const findRes = await fetch(
      `${BASE}/rest/v1/StockReservation?select=*&status=eq.PENDING&expiresAt=lt.${now}`,
      {
        headers: {
          apikey: KEY,
          Authorization: `Bearer ${KEY}`,
        },
      }
    )
    const expired = await findRes.json()

    if (!Array.isArray(expired) || expired.length === 0) {
      return NextResponse.json({ released: 0, message: "No expired reservations" })
    }

    let released = 0
    for (const reservation of expired) {
      // Mark as RELEASED
      await fetch(
        `${BASE}/rest/v1/StockReservation?id=eq.${reservation.id}`,
        {
          method: "PATCH",
          headers: {
            apikey: KEY,
            Authorization: `Bearer ${KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ status: "RELEASED" }),
        }
      )

      // Return stock to inventory
      const invRes = await fetch(
        `${BASE}/rest/v1/Inventory?productId=eq.${reservation.productId}`,
        {
          headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
        }
      )
      const [inv] = await invRes.json()
      if (inv) {
        await fetch(
          `${BASE}/rest/v1/Inventory?productId=eq.${reservation.productId}`,
          {
            method: "PATCH",
            headers: {
              apikey: KEY,
              Authorization: `Bearer ${KEY}`,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              stock: inv.stock + reservation.quantity,
            }),
          }
        )
      }

      // Audit log
      await fetch(`${BASE}/rest/v1/InventoryAuditLog`, {
        method: "POST",
        headers: {
          apikey: KEY,
          Authorization: `Bearer ${KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          productId: reservation.productId,
          delta: reservation.quantity,
          reason: `release:${reservation.sessionId}`,
          actorId: "system",
        }),
      })

      released++
    }

    return NextResponse.json({ released })
  } catch (error) {
    console.error("Cron error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
