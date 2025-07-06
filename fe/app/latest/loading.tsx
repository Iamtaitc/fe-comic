// fe\app\latest\layout.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { StoriesGridSkeleton } from "@/components/detail/LoadingStates";

export const metadata: Metadata = {
  title: "Truyện Mới Cập Nhật | Manga Reader",
  description: "Khám phá những bộ truyện được cập nhật gần đây nhất với các chương mới và nội dung hấp dẫn nhất.",
  keywords: [
    "truyện mới cập nhật",
    "latest manga", 
    "manga mới",
    "chương mới",
    "cập nhật hàng ngày",
    "newest manga",
    "recent updates"
  ],
  openGraph: {
    title: "Truyện Mới Cập Nhật - Chương Mới Hàng Ngày",
    description: "Theo dõi những bộ truyện với chương mới được cập nhật liên tục",
    type: "website",
    images: [
      {
        url: "/images/latest-og.jpg",
        width: 1200,
        height: 630,
        alt: "Truyện Mới Cập Nhật"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truyện Mới Cập Nhật",
    description: "Theo dõi những bộ truyện với chương mới được cập nhật liên tục",
    images: ["/images/latest-twitter.jpg"],
  },
  alternates: {
    canonical: "/latest",
  },
};

function LatestPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Header Skeleton với màu blue-purple theme */}
      <div className="relative py-16 md:py-24 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10">
        <div className="container px-4">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-200 animate-pulse" />
              <div className="h-8 w-52 md:w-68 bg-gradient-to-r from-blue-200 to-purple-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-full max-w-2xl mx-auto bg-muted rounded animate-pulse" />
              <div className="h-5 w-80 mx-auto bg-muted rounded animate-pulse" />
            </div>
            <div className="flex justify-center gap-8">
              <div className="h-6 w-28 bg-muted rounded animate-pulse" />
              <div className="h-6 w-36 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time updates indicator */}
      <div className="border-t border-b bg-blue-50/50 dark:bg-blue-950/20">
        <div className="container px-4 py-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full animate-ping" />
              <div className="h-4 w-32 bg-blue-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <StoriesGridSkeleton count={20} />
    </div>
  );
}

export default function LatestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Truyện Mới Cập Nhật",
            "description": "Những bộ truyện được cập nhật gần đây nhất",
            "url": "/latest",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Danh sách truyện mới cập nhật",
              "numberOfItems": "10000+",
              "itemListOrder": "https://schema.org/ItemListOrderDescending"
            },
            "about": {
              "@type": "Thing",
              "name": "Latest Manga Updates",
              "description": "Recently updated manga and manhwa series"
            },
            "temporalCoverage": "2024/.."
          })
        }}
      />

      <Suspense fallback={<LatestPageSkeleton />}>
        <main className="latest-page">
          {children}
        </main>
      </Suspense>

      <link rel="preload" href="/api/v1/comics/latest" as="fetch" crossOrigin="anonymous" />
      <link rel="prefetch" href="/ongoing" />
      <link rel="prefetch" href="/popular" />
      <link rel="prefetch" href="/completed" />
    </>
  );
}