"use client"

import { useEffect, useState } from "react"
import { GripVertical, Pencil, Trash2, Plus } from "lucide-react"

type Cat = { id: string; name: string; slug: string; parentId: string | null }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Cat[]>([])

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
  }, [])

  const roots = categories.filter((c) => !c.parentId)
  const children = categories.filter((c) => c.parentId)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Κατηγορίες</h1>
          <p className="mt-1 text-sm text-stone-500">{categories.length} κατηγορίες</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800">
          <Plus className="h-4 w-4" />Νέα κατηγορία
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">Όνομα</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">Γονική</th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {roots.map((root) => (
              <tbody key={root.id}>
                <tr className="border-b border-stone-50 hover:bg-stone-50">
                  <td className="px-4 py-3"><GripVertical className="h-4 w-4 cursor-grab text-stone-300" /></td>
                  <td className="px-4 py-3 text-sm font-bold text-stone-900">{root.name}</td>
                  <td className="px-4 py-3 text-sm text-stone-500">{root.slug}</td>
                  <td className="px-4 py-3 text-sm text-stone-400">—</td>
                  <td className="px-4 py-3"><div className="flex gap-1"><button className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"><Pencil className="h-3.5 w-3.5" /></button><button className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
                {children.filter((c) => c.parentId === root.id).map((child) => (
                  <tr key={child.id} className="border-b border-stone-50 bg-stone-50/50 hover:bg-stone-100">
                    <td className="px-4 py-3"><GripVertical className="h-4 w-4 cursor-grab text-stone-300" /></td>
                    <td className="px-4 py-3 text-sm font-medium text-stone-700"><span className="text-stone-300">└ </span>{child.name}</td>
                    <td className="px-4 py-3 text-sm text-stone-500">{child.slug}</td>
                    <td className="px-4 py-3 text-sm text-stone-500">{root.name}</td>
                    <td className="px-4 py-3"><div className="flex gap-1"><button className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"><Pencil className="h-3.5 w-3.5" /></button><button className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
