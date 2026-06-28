"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Page error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <span className="text-7xl">⚡</span>
      <h1 className="mt-6 text-3xl font-bold text-stone-900">
        Κάτι πήγε στραβά
      </h1>
      <p className="mt-3 max-w-md text-stone-500">
        Παρουσιάστηκε ένα σφάλμα κατά τη φόρτωση της σελίδας. Δοκιμάστε ξανά σε
        λίγο.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          Δοκιμή ξανά
        </button>
        <Link
          href="/"
          className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
        >
          Αρχική σελίδα
        </Link>
      </div>
    </div>
  )
}
