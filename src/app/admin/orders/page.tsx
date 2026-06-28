"use client"

import { useState } from "react"
import { Search } from "lucide-react"

const orders = [
  {
    id: "ord_001",
    email: "customer@email.gr",
    status: "PAID",
    totalCents: 11990,
    items: 1,
    date: "2026-06-28 14:23",
  },
  {
    id: "ord_002",
    email: "another@email.gr",
    status: "PAID",
    totalCents: 2490,
    items: 1,
    date: "2026-06-28 12:15",
  },
  {
    id: "ord_003",
    email: "third@email.gr",
    status: "CANCELLED",
    totalCents: 550,
    items: 1,
    date: "2026-06-27 20:45",
  },
]

const statusLabels: Record<string, string> = {
  PAID: "Πληρώθηκε",
  PENDING: "Σε εκκρεμότητα",
  CANCELLED: "Ακυρώθηκε",
  REFUNDED: "Επιστράφηκε",
}

const statusColors: Record<string, string> = {
  PAID: "text-green-600 bg-green-50",
  PENDING: "text-amber-600 bg-amber-50",
  CANCELLED: "text-red-600 bg-red-50",
  REFUNDED: "text-purple-600 bg-purple-50",
}

export default function AdminOrders() {
  const [search, setSearch] = useState("")

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Παραγγελίες</h1>
        <p className="mt-1 text-sm text-stone-500">
          Διαχείριση παραγγελιών και επιστροφών
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Αναζήτηση με email ή αριθμό παραγγελίας..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm transition-colors focus:border-stone-400 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">
                Παραγγελία
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">
                Κατάσταση
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-stone-400">
                Ποσό
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-stone-400">
                Τεμάχια
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-stone-400">
                Ημερομηνία
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-stone-50 transition-colors hover:bg-stone-50 cursor-pointer"
              >
                <td className="px-4 py-4 text-sm font-mono text-stone-500">
                  {order.id}
                </td>
                <td className="px-4 py-4 text-sm text-stone-900">
                  {order.email}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[order.status]}`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-sm font-semibold text-stone-900">
                  €{(order.totalCents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-4 text-center text-sm text-stone-500">
                  {order.items}
                </td>
                <td className="px-4 py-4 text-right text-sm text-stone-400">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
