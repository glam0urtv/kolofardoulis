/**
 * Stripe Webhook Handler
 *
 * Handles: checkout.session.completed, checkout.session.expired
 *
 * CRITICAL: Must be idempotent — checks if stripeSessionId already processed.
 * CRITICAL: Must verify Stripe webhook signature before processing.
 *
 * IMPLEMENTS: docs/05-INVENTORY-CONCURRENCY-SAFETY.md (Βήμα 3α, 3β)
 * SECURITY: docs/08-SECURITY-PAYMENTS.md
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { confirmReservation, releaseExpiredReservations } from "@/services/inventory"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  const session = event.data.object as {
    id: string
    customer_email?: string
    metadata?: { items?: string }
    amount_total?: number
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // IDEMPOTENCY CHECK: Don't process the same session twice
        const existing = await prisma.order.findUnique({
          where: { stripeSessionId: session.id },
        })
        if (existing) {
          return NextResponse.json({ received: true, alreadyProcessed: true })
        }

        // Confirm the reservation (Step 3α in docs/05)
        const result = await confirmReservation(session.id)

        if (!result.success && !result.alreadyProcessed) {
          console.error("Reservation confirmation failed:", result)
          return NextResponse.json(
            { error: "Reservation confirmation failed" },
            { status: 500 }
          )
        }

        // Parse items from metadata
        const items = session.metadata?.items
          ? (JSON.parse(session.metadata.items) as {
              id: string
              qty: number
            }[])
          : []

        // Create the order with items
        await prisma.order.create({
          data: {
            email: session.customer_email || "unknown",
            status: "PAID",
            totalCents: session.amount_total ?? 0,
            stripeSessionId: session.id,
            items: {
              create: items.map((item) => ({
                productId: item.id,
                quantity: item.qty,
                unitPriceCents: 0, // Will be properly set when DB is connected
              })),
            },
          },
        })

        break
      }

      case "checkout.session.expired": {
        // Release the stock back (Step 3β in docs/05)
        await releaseExpiredReservations()
        break
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
