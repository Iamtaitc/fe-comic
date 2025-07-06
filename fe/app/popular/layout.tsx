
// fe\app\popular\layout.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { StoriesGridSkeleton } from "@/components/detail/LoadingStates";

export const metadata: Metadata = {
  title: "Truyện Nổi Bật | Manga Reader",
  description: "Khám phá những bộ truyện được yêu thích nhất với lượt xem cao và đánh giá tốt từ cộng đồng độc giả toàn thế giới.",
  keywords: [
    "truyện nổi bật",
    "manga popular", 
    "truyện tranh hot",
    "trending manga",
    "most viewed",
    "top rated manga",
    "bestseller manga"
  ],
  openGraph: {
    title: "Truyện Nổi Bật - Top Manga Được Yêu Thích Nhất",
    description: "Những bộ truyện hot nhất với lượt xem và đánh giá cao nhất từ cộng đồng",
    type: "website",
    images: [
      {
        url: "/images/popular-og.jpg",
        width: 1200,
        height: 630,
        alt: "Truyện Nổi Bật"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truyện Nổi Bật",
    description: "Top manga được yêu thích nhất với đánh giá cao",
    images: ["/images/popular-twitter.jpg"],
  },
  alternates: {
    canonical: "/popular",
  },
};

function PopularPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Header Skeleton */}
      <div className="relative py-16 md:py-24 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10">
        <div className="container px-4">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-8 w-8 rounded-full bg-red-200 animate-pulse" />
              <div className="h-8 w-48 md:w-64 bg-gradient-to-r from-red-200 to-orange-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-full max-w-2xl mx-auto bg-muted rounded animate-pulse" />
              <div className="h-5 w-80 mx-auto bg-muted rounded animate-pulse" />
            </div>
            <div className="flex justify-center gap-8">
              <div className="h-6 w-24 bg-muted rounded animate-pulse" />
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters + Grid */}
      <div className="border-t border-b bg-card/50">
        <div className="container px-4 py-6">
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            <div className="h-10 w-28 bg-muted rounded animate-pulse" />
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
      <StoriesGridSkeleton count={20} />
    </div>
  );
}

export default function PopularLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Truyện Nổi Bật",
            "description": "Bộ sưu tập những bộ truyện được yêu thích nhất",
            "url": "/popular",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top manga nổi bật",
              "numberOfItems": "1000+",
              "itemListOrder": "https://schema.org/ItemListOrderByPopularity"
            },
            "about": {
              "@type": "Thing",
              "name": "Popular Manga",
              "description": "Most popular and highly rated manga series"
            }
          })
        }}
      />

      <Suspense fallback={<PopularPageSkeleton />}>
        <main className="popular-page">
          {children}
        </main>
      </Suspense>

      <link rel="preload" href="/api/comics/noi-bat" as="fetch" crossOrigin="anonymous" />
      <link rel="prefetch" href="/ongoing" />
      <link rel="prefetch" href="/completed" />
    </>
  );
}
