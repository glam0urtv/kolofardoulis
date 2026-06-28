/**
 * Inventory Service — Atomic stock reservation
 *
 * IMPLEMENTS: docs/05-INVENTORY-CONCURRENCY-SAFETY.md
 * CORE RULE: Never oversell. Atomic UPDATE ... WHERE stock >= quantity ALWAYS.
 * No read-then-write. No exceptions.
 */

import { prisma } from "@/lib/db"

type ReserveResult =
  | { success: true; newStock: number }
  | { success: false; reason: "INSUFFICIENT_STOCK" | "PRODUCT_NOT_FOUND" }

type ReleaseResult =
  | { success: true; newStock: number }
  | { success: false; reason: "RESERVATION_NOT_FOUND" | "ALREADY_RELEASED" }

/**
 * Step 1 of the checkout flow (docs/05, Βήμα 1).
 *
 * Atomic reservation: decrements stock in a SINGLE SQL statement.
 * If the product doesn't have enough stock, returns INSUFFICIENT_STOCK immediately.
 * If successful, creates a StockReservation with a 10-minute expiry.
 *
 * Called BEFORE opening Stripe Checkout.
 */
export async function reserveStock(
  productId: string,
  quantity: number,
  sessionId: string
): Promise<ReserveResult> {
  // Atomic UPDATE — the single most important SQL statement in this project.
  // Postgres locks the row during this operation. No other transaction can
  // read or write stock between the check and the decrement.
  const [inventory, reservation] = await prisma.$transaction([
    prisma.inventory.findUnique({ where: { productId } }),
    prisma.inventory.updateMany({
      where: {
        productId,
        stock: { gte: quantity },
      },
      data: {
        stock: { decrement: quantity },
      },
    }),
  ])

  if (inventory === null) {
    return { success: false, reason: "PRODUCT_NOT_FOUND" }
  }

  // updateMany returns count of updated rows. 0 means stock was insufficient.
  if (reservation.count === 0) {
    return { success: false, reason: "INSUFFICIENT_STOCK" }
  }

  // Create reservation record — expires in 10 minutes
  const newStock = inventory.stock - quantity
  await prisma.stockReservation.create({
    data: {
      productId,
      quantity,
      sessionId,
      status: "PENDING",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  })

  // Audit log for every stock change
  await prisma.inventoryAuditLog.create({
    data: {
      productId,
      delta: -quantity,
      reason: `reservation:${sessionId}`,
      actorId: "system",
    },
  })

  return { success: true, newStock }
}

/**
 * Step 3α (docs/05, Βήμα 3α).
 *
 * Confirms a reservation after successful payment (webhook).
 * MUST be idempotent — checks if stripeSessionId already processed.
 */
export async function confirmReservation(stripeSessionId: string) {
  // Idempotency check — prevent double-processing of Stripe webhook retries
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId },
  })
  if (existing) {
    return { success: true, orderId: existing.id, alreadyProcessed: true }
  }

  const reservation = await prisma.stockReservation.findFirst({
    where: { sessionId: stripeSessionId, status: "PENDING" },
  })

  if (!reservation) {
    return { success: false, reason: "RESERVATION_NOT_FOUND" }
  }

  // Mark reservation as confirmed
  await prisma.stockReservation.update({
    where: { id: reservation.id },
    data: { status: "CONFIRMED" },
  })

  return { success: true, reservation, alreadyProcessed: false }
}

/**
 * Step 3β (docs/05, Βήμα 3β).
 *
 * Releases expired reservations and returns stock to inventory.
 * Called by a scheduled job (Vercel Cron) every 1-2 minutes.
 */
export async function releaseExpiredReservations(): Promise<number> {
  const expired = await prisma.stockReservation.findMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: new Date() },
    },
  })

  let released = 0
  for (const reservation of expired) {
    await prisma.$transaction([
      prisma.stockReservation.update({
        where: { id: reservation.id },
        data: { status: "RELEASED" },
      }),
      prisma.inventory.update({
        where: { productId: reservation.productId },
        data: { stock: { increment: reservation.quantity } },
      }),
      prisma.inventoryAuditLog.create({
        data: {
          productId: reservation.productId,
          delta: reservation.quantity,
          reason: `release:${reservation.sessionId}`,
          actorId: "system",
        },
      }),
    ])
    released++
  }

  return released
}

/**
 * Manually adjust stock (admin only).
 * Every change writes an InventoryAuditLog entry.
 */
export async function adjustStock(
  productId: string,
  delta: number,
  reason: string,
  actorId: string
) {
  const inventory = await prisma.inventory.update({
    where: { productId },
    data: { stock: { increment: delta } },
  })

  await prisma.inventoryAuditLog.create({
    data: { productId, delta, reason, actorId },
  })

  return inventory
}
