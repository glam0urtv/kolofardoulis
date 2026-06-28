"use client"

import { useState } from "react"
import { useCartStore } from "@/services/cart"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, totalCents, itemCount } = useCartStore()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    if (!email || items.length === 0) return
    setLoading(true)

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, items }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(data.error)
        setLoading(false)
      }
    } catch (err) {
      alert("Σφάλμα σύνδεσης. Προσπάθησε ξανά.")
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <span className="text-5xl">🛒</span>
        <p className="mt-4 text-lg">Το καλάθι σας είναι άδειο</p>
        <Link
          href="/"
          className="mt-4 text-sm font-medium text-stone-600 hover:text-stone-900"
        >
          ← Επιστροφή στο κατάστημα
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Συνεχίστε τις αγορές
      </Link>

      <h1 className="text-3xl font-bold text-stone-900">Ολοκλήρωση Αγοράς</h1>

      {/* Order summary */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900">
          Σύνοψη παραγγελίας
        </h2>
        <div className="mt-4 divide-y divide-stone-100">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between py-3">
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {item.name}
                </p>
                <p className="text-xs text-stone-500">
                  {item.quantity} × {formatPrice(item.priceCents)}
                </p>
              </div>
              <p className="text-sm font-semibold text-stone-900">
                {formatPrice(item.priceCents * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-stone-200 pt-4">
          <span className="text-lg font-bold text-stone-900">Σύνολο</span>
          <span className="text-lg font-bold text-stone-900">
            {formatPrice(totalCents())}
          </span>
        </div>
      </div>

      {/* Email */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-stone-900">
          Στοιχεία επικοινωνίας
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Θα στείλουμε την επιβεβαίωση της παραγγελίας σε αυτό το email.
        </p>
        <input
          type="email"
          placeholder="to@email.gr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm transition-colors focus:border-stone-900 focus:outline-none"
          required
        />
      </div>

      {/* Pay button */}
      <button
        onClick={handleCheckout}
        disabled={loading || !email}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-stone-900 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          "Μετάβαση στην πληρωμή..."
        ) : (
          <>
            <Lock className="h-4 w-4" />
            Πληρωμή με κάρτα — {formatPrice(totalCents())}
          </>
        )}
      </button>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 text-xs text-stone-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          Ασφαλής πληρωμή
        </span>
        <span className="flex items-center gap-1">
          <Lock className="h-3.5 w-3.5" />
          SSL κρυπτογράφηση
        </span>
      </div>
    </div>
  )
}
