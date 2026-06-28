"use client"

import { useEffect, useState } from "react"
import { GripVertical, Pencil, Trash2, Plus, X } from "lucide-react"

type Cat = { id: string; name: string; slug: string; parentId: string | null }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Cat[]>([])
  const [editing, setEditing] = useState<Cat | null>(null)
  const [editName, setEditName] = useState("")
  const [editSlug, setEditSlug] = useState("")

  const load = () => {
    fetch("/api/categories").then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []))
  }
  useEffect(() => { load() }, [])

  const handleEdit = (cat: Cat) => { setEditing(cat); setEditName(cat.name); setEditSlug(cat.slug) }
  const handleSave = async () => {
    if (!editing) return
    await fetch("/api/admin/manage-category", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, name: editName, slug: editSlug }) })
    setEditing(null); load()
  }
  const handleDelete = async (id: string) => {
    if (!confirm("Σίγουρα; Θα διαγραφούν και όλα τα προϊόντα της.")) return
    await fetch("/api/admin/manage-category", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    load()
  }

  const roots = categories.filter(c => !c.parentId)
  const children = categories.filter(c => c.parentId)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-stone-900">Κατηγορίες</h1><p className="mt-1 text-sm text-stone-500">{categories.length} κατηγορίες</p></div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"><Plus className="h-4 w-4" />Νέα</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <table className="w-full">
          <thead><tr className="border-b border-stone-100 bg-stone-50"><th className="w-10 px-4 py-3" /><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">Όνομα</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">Slug</th><th className="px-4 py-3 text-left text-xs font-semibold uppercase text-stone-400">Γονική</th><th className="w-24 px-4 py-3" /></tr></thead>
          <tbody>
            {roots.map(root => (
              <tbody key={root.id}>
                <tr className="border-b border-stone-50 hover:bg-stone-50">
                  <td className="px-4 py-3"><GripVertical className="h-4 w-4 cursor-grab text-stone-300" /></td>
                  <td className="px-4 py-3 text-sm font-bold text-stone-900">{root.name}</td>
                  <td className="px-4 py-3 text-sm text-stone-500">{root.slug}</td>
                  <td className="px-4 py-3 text-sm text-stone-400">—</td>
                  <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => handleEdit(root)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => handleDelete(root.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
                {children.filter(c => c.parentId === root.id).map(child => (
                  <tr key={child.id} className="border-b border-stone-50 bg-stone-50/50 hover:bg-stone-100">
                    <td className="px-4 py-3"><GripVertical className="h-4 w-4 cursor-grab text-stone-300" /></td>
                    <td className="px-4 py-3 text-sm font-medium text-stone-700"><span className="text-stone-300">└ </span>{child.name}</td>
                    <td className="px-4 py-3 text-sm text-stone-500">{child.slug}</td>
                    <td className="px-4 py-3 text-sm text-stone-500">{root.name}</td>
                    <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => handleEdit(child)} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => handleDelete(child.id)} className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Επεξεργασία κατηγορίας</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5 text-stone-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-semibold text-stone-500">Όνομα</label><input value={editName} onChange={e => setEditName(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm mt-1" /></div>
              <div><label className="text-xs font-semibold text-stone-500">Slug</label><input value={editSlug} onChange={e => setEditSlug(e.target.value)} className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm mt-1" /></div>
              <button onClick={handleSave} className="w-full rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800">Αποθήκευση</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
