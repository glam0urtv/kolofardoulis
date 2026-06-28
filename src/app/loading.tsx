export default function Loading() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero skeleton */}
      <div className="animate-pulse rounded-3xl bg-stone-200 h-[400px]" />

      {/* Categories skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-stone-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-stone-200"
            />
          ))}
        </div>
      </div>

      {/* Products skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-stone-200" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] animate-pulse rounded-2xl bg-stone-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-stone-200" />
              <div className="h-6 w-1/3 animate-pulse rounded bg-stone-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
