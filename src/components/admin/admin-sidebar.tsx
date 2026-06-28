"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  BarChart3,
  LogOut,
} from "lucide-react"

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Κατηγορίες", icon: FolderTree },
  { href: "/admin/products", label: "Προϊόντα", icon: Package },
  { href: "/admin/orders", label: "Παραγγελίες", icon: ShoppingBag },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-stone-200 bg-white">
      <div className="flex h-16 items-center border-b border-stone-100 px-6">
        <Link href="/admin" className="text-lg font-bold text-stone-900">
          Admin<span className="text-brand">.</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-stone-900 text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-stone-100 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-400 transition-colors hover:text-stone-600"
        >
          <LogOut className="h-4 w-4" />
          Επιστροφή στο site
        </Link>
      </div>
    </aside>
  )
}
