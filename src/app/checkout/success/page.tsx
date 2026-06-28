"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useCartStore } from "@/services/cart"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const clearCart = useCartStore((s) => s.clearCart)
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <CheckCircle className="h-20 w-20 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold text-stone-900">
        Η αγορά ολοκληρώθηκε!
      </h1>
      <p className="mt-3 max-w-md text-stone-500">
        Ευχαριστούμε για την παραγγελία σας. Θα λάβετε email επιβεβαίωσης
        σύντομα.
      </p>
      {sessionId && (
        <p className="mt-2 text-xs text-stone-400">
          Αναφορά: {sessionId.slice(0, 20)}...
        </p>
      )}
      <Link
        href="/"
        className="mt-8 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
      >
        Συνέχεια αγορών
      </Link>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Φόρτωση...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
