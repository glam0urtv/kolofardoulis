"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type StockUpdate = {
  productId: string
  stock: number
  soldOut: boolean
}

/**
 * Subscribes to real-time inventory changes via Supabase Realtime.
 *
 * When a product hits stock=0, broadcasts "sold_out" to all clients
 * so the "Αγόρασε" button is disabled instantly without refresh.
 * (docs/05-INVENTORY-CONCURRENCY-SAFETY.md, "Realtime sold-out")
 */
export function useRealtimeStock(productId?: string) {
  const [stock, setStock] = useState<number | null>(null)
  const [soldOut, setSoldOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    const filter = productId
      ? `productId=eq.${productId}`
      : undefined

    const channel = supabase
      .channel("inventory-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Inventory",
          filter,
        },
        (payload: { new: { productId: string; stock: number } }) => {
          const newStock = payload.new.stock
          setStock(newStock)
          if (newStock <= 0) {
            setSoldOut(true)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [productId])

  return { stock, soldOut }
}
