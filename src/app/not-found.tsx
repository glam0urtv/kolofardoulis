import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <span className="text-7xl">🔍</span>
      <h1 className="mt-6 text-3xl font-bold text-stone-900">
        Η σελίδα δεν βρέθηκε
      </h1>
      <p className="mt-3 max-w-md text-stone-500">
        Η σελίδα που ψάχνετε δεν υπάρχει ή έχει μετακινηθεί. Ελέγξτε τη
        διεύθυνση ή επιστρέψτε στην αρχική.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          Αρχική σελίδα
        </Link>
        <Link
          href="/category/singles"
          className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-50"
        >
          Προϊόντα
        </Link>
      </div>
    </div>
  )
}
