"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

type Order = {
  id: string
  email: string
  status: string
  totalCents: number
  stripeSessionId: string
  createdAt: string
}

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
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Order?select=*&order=createdAt.desc&limit=100`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
  }, [])

  const filtered = orders.filter(
    (o) =>
      !search ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Παραγγελίες</h1>
        <p className="mt-1 text-sm text-stone-500">
          {orders.length} παραγγελίες συνολικά
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
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-stone-400">
                Ημερομηνία
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-stone-400">
                  {search ? "Δεν βρέθηκαν παραγγελίες" : "Δεν υπάρχουν παραγγελίες ακόμα"}
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
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
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[order.status] || "text-stone-600 bg-stone-100"}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-stone-900">
                    €{(order.totalCents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-stone-400">
                    {new Date(order.createdAt).toLocaleDateString("el-GR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
