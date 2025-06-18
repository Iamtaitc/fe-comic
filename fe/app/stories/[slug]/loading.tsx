// app/category/[slug]/loading.tsx
export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-10 w-64 mx-auto mb-4 bg-white/20 rounded animate-pulse" />
            <div className="h-6 w-96 mx-auto mb-8 bg-white/10 rounded animate-pulse" />
            <div className="flex justify-center gap-4">
              <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-8 w-28 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(18).fill(0).map((_, i) => (
            <div key={i} className="bg-card border rounded-lg overflow-hidden">
              <div className="aspect-[2/3] bg-muted animate-pulse" />
              <div className="p-3">
                <div className="h-5 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2" />
                <div className="flex gap-1">
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-12 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

