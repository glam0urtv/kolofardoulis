"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/services/cart"
import { formatPrice } from "@/lib/utils"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const [open, setOpen] = useState(false)
  const { items, removeItem, updateQuantity, totalCents, itemCount, clearCart } =
    useCartStore()
  const router = useRouter()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("open-cart", handler)
    return () => window.removeEventListener("open-cart", handler)
  }, [])

  const handleCheckout = () => {
    setOpen(false)
    router.push("/checkout")
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-stone-700" />
            <h2 className="text-lg font-semibold text-stone-900">Καλάθι</h2>
            <span className="text-sm text-stone-500">
              ({itemCount()} προϊόντα)
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-stone-400">
              <ShoppingBag className="h-12 w-12" />
              <p className="text-sm">Το καλάθι σας είναι άδειο</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 rounded-xl border border-stone-100 bg-stone-50 p-3"
                >
                  {/* Product image */}
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-20 w-20 flex-shrink-0 rounded-lg object-cover" />
                  ) : (
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-stone-200 flex items-center justify-center text-2xl">
                      {item.type === "BOOSTER_BOX" ? "📦" : "🃏"}
                    </div>
                  )}

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-500">{item.type}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="rounded-full p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-600"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="rounded-full p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-600"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-stone-900">
                        {formatPrice(item.priceCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-stone-600">Σύνολο</span>
              <span className="text-lg font-bold text-stone-900">
                {formatPrice(totalCents())}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
            >
              Ολοκλήρωση Αγοράς
            </button>
            <button
              onClick={clearCart}
              className="mt-2 w-full rounded-xl px-6 py-2 text-xs text-stone-500 transition-colors hover:text-stone-700"
            >
              Άδειασμα καλαθιού
            </button>
          </div>
        )}
      </div>
    </>
  )
}
