"use client"

import { useState } from "react"
import { Plus, GripVertical, Pencil, Trash2 } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  parent: string | null
  productCount: number
}

const initialCategories: Category[] = [
  { id: "1", name: "One Piece", slug: "one-piece", parent: null, productCount: 8 },
  { id: "2", name: "Singles", slug: "singles", parent: "one-piece", productCount: 4 },
  { id: "3", name: "Booster Boxes", slug: "booster-boxes", parent: "one-piece", productCount: 2 },
  { id: "4", name: "Booster Packs", slug: "booster-packs", parent: "one-piece", productCount: 1 },
  { id: "5", name: "Promo", slug: "promo", parent: "one-piece", productCount: 1 },
]

export default function AdminCategories() {
  const [categories] = useState<Category[]>(initialCategories)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Κατηγορίες</h1>
          <p className="mt-1 text-sm text-stone-500">
            Διαχειριστείτε τις κατηγορίες προϊόντων και την ιεραρχία τους
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800">
          <Plus className="h-4 w-4" />
          Νέα κατηγορία
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">
                Όνομα
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">
                Γονική
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">
                Προϊόντα
              </th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-stone-50 transition-colors hover:bg-stone-50"
              >
                <td className="px-4 py-3">
                  <GripVertical className="h-4 w-4 cursor-grab text-stone-300" />
                </td>
                <td className="px-4 py-3 text-sm font-medium text-stone-900">
                  {cat.parent && <span className="text-stone-300">└ </span>}
                  {cat.name}
                </td>
                <td className="px-4 py-3 text-sm text-stone-500">{cat.slug}</td>
                <td className="px-4 py-3 text-sm text-stone-500">
                  {cat.parent || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-stone-500">
                  {cat.productCount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
