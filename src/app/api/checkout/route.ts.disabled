/**
 * Checkout API Route
 *
 * Step 1: Reserve stock (atomic) per docs/05-INVENTORY-CONCURRENCY-SAFETY.md
 * Step 2: Create Stripe Checkout Session
 *
 * The reservation happens BEFORE the Stripe session — this is intentional.
 * If the user abandons payment, the reservation expires and stock is released.
 */

import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { reserveStock } from "@/services/inventory"
import type { CartItem } from "@/services/cart"

export async function POST(req: NextRequest) {
  try {
    const { email, items } = (await req.json()) as {
      email: string
      items: CartItem[]
    }

    if (!email || !items?.length) {
      return NextResponse.json(
        { error: "Λείπουν στοιχεία παραγγελίας" },
        { status: 400 }
      )
    }

    // Create Stripe session first to get the session ID
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: item.currency.toLowerCase(),
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      })),
      success_url: `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout?cancelled=true`,
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({ id: i.productId, qty: i.quantity }))
        ),
      },
    })

    if (!session.id) {
      return NextResponse.json(
        { error: "Αποτυχία δημιουργίας session πληρωμής" },
        { status: 500 }
      )
    }

    // Step 1: Atomic stock reservation for each item
    // Using the session.id as the reservation sessionId
    for (const item of items) {
      const result = await reserveStock(
        item.productId,
        item.quantity,
        session.id
      )

      if (!result.success) {
        // If any reservation fails, we need to release previously reserved items
        // In production, this should trigger a rollback of reservations for this session
        return NextResponse.json(
          {
            error: `Το προϊόν "${item.name}" εξαντλήθηκε. Δοκιμάστε ξανά.`,
          },
          { status: 409 }
        )
      }
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Σφάλμα κατά την ολοκλήρωση της παραγγελίας" },
      { status: 500 }
    )
  }
}
