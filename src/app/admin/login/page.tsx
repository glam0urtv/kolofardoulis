"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Lock, Mail, Key, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Λάθος email ή κωδικός"
          : authError.message
      )
      setLoading(false)
      return
    }

    // Check if user has admin role
    const { data } = await supabase
      .from("User")
      .select("role")
      .eq("email", email)
      .single()

    if (data?.role !== "ADMIN") {
      await supabase.auth.signOut()
      setError("Δεν έχετε δικαιώματα διαχειριστή")
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-stone-900">
            Kolofardoulis<span className="text-brand">.</span>gr
          </Link>
          <p className="mt-2 text-sm text-stone-500">Πίνακας Διαχείρισης</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-stone-100 p-3">
              <Lock className="h-6 w-6 text-stone-600" />
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stone-500">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kolofardoulis.gr"
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3 text-sm transition-colors focus:border-stone-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-stone-500">
                Κωδικός
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-3 text-sm transition-colors focus:border-stone-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                "Σύνδεση..."
              ) : (
                <>
                  Σύνδεση
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-xs text-stone-400">
          Kolofardoulis.gr — Πίνακας Διαχείρισης
        </p>
      </div>
    </div>
  )
}
