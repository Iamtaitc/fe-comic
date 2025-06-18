// src/app/loading.tsx
import { Skeleton } from "../src/components/ui/skeleton"

export default function Loading() {
  return (
    <div>
      {/* Hero Skeleton */}
      <div className="relative h-[500px] w-full bg-muted">
        <div className="container relative h-full">
          <div className="flex h-full flex-col justify-end pb-16">
            <div className="max-w-2xl">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
              <Skeleton className="mt-4 h-12 w-3/4" />
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-28" />
              </div>
              <div className="mt-6 flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Popular Stories Skeleton */}
      <section className="py-12">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="aspect-[2/3] w-full">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}