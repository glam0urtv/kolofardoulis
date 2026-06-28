import Link from "next/link"
import {
  Package,
  FolderTree,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
} from "lucide-react"

const stats = [
  {
    label: "Προϊόντα",
    value: "8",
    icon: Package,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Κατηγορίες",
    value: "5",
    icon: FolderTree,
    color: "text-amber-600 bg-amber-50",
  },
  {
    label: "Παραγγελίες σήμερα",
    value: "3",
    icon: ShoppingBag,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Έσοδα μήνα",
    value: "€1,240",
    icon: DollarSign,
    color: "text-purple-600 bg-purple-50",
  },
]

const recentOrders = [
  { id: "ord_001", email: "customer@email.gr", status: "PAID", total: "€119.90" },
  { id: "ord_002", email: "another@email.gr", status: "PAID", total: "€24.90" },
  { id: "ord_003", email: "third@email.gr", status: "PENDING", total: "€5.50" },
]

const lowStock = [
  { name: "Zoro Super Rare", stock: 1 },
  { name: "Ace Secret Rare", stock: 1 },
  { name: "Nami Promo", stock: 2 },
]

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Σύνοψη του καταστήματός σας
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-stone-200 bg-white p-5"
          >
            <div
              className={`inline-flex rounded-xl p-2.5 ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-bold text-stone-900">
              {stat.value}
            </p>
            <p className="text-sm text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-900">
              Τελευταίες παραγγελίες
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-stone-500 hover:text-stone-700"
            >
              Προβολή όλων →
            </Link>
          </div>
          <div className="mt-4 divide-y divide-stone-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {order.email}
                  </p>
                  <p className="text-xs text-stone-400">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-stone-900">
                    {order.total}
                  </p>
                  <span
                    className={`text-xs font-medium ${
                      order.status === "PAID"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {order.status === "PAID" ? "Πληρώθηκε" : "Σε εκκρεμότητα"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-stone-900">
              Χαμηλό απόθεμα
            </h2>
          </div>
          <div className="mt-4 divide-y divide-stone-100">
            {lowStock.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between py-3"
              >
                <p className="text-sm font-medium text-stone-900">
                  {item.name}
                </p>
                <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">
                  {item.stock} τεμάχια
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/products"
            className="mt-4 inline-block text-sm text-stone-500 hover:text-stone-700"
          >
            Διαχείριση αποθέματος →
          </Link>
        </div>
      </div>
    </div>
  )
}
