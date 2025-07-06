// fe\app\completed\layout.tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { StoriesGridSkeleton } from "@/components/detail/LoadingStates";

export const metadata: Metadata = {
  title: "Truyện Đã Hoàn Thành | Manga Reader",
  description:
    "Khám phá kho tàng truyện đã hoàn thành với cốt truyện trọn vẹn từ đầu đến cuối. Thưởng thức những tác phẩm đã kết thúc hoàn chỉnh.",
  keywords: [
    "truyện đã hoàn thành",
    "manga completed",
    "truyện tranh hoàn chỉnh",
    "cốt truyện trọn vẹn",
    "đã kết thúc",
    "finished series",
    "complete story",
  ],
  openGraph: {
    title: "Truyện Đã Hoàn Thành - Cốt Truyện Trọn Vẹn",
    description:
      "Thưởng thức những bộ truyện đã hoàn thành với cốt truyện trọn vẹn",
    type: "website",
    images: [
      {
        url: "/images/completed-og.jpg",
        width: 1200,
        height: 630,
        alt: "Truyện Đã Hoàn Thành",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truyện Đã Hoàn Thành",
    description:
      "Thưởng thức những bộ truyện đã hoàn thành với cốt truyện trọn vẹn",
    images: ["/images/completed-twitter.jpg"],
  },
  alternates: {
    canonical: "/completed",
  },
};

function CompletedPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Header Skeleton với màu green theme */}
      <div className="relative py-16 md:py-24 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10">
        <div className="container px-4">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-200 animate-pulse" />
              <div className="h-8 w-56 md:w-72 bg-gradient-to-r from-green-200 to-emerald-200 rounded animate-pulse" />
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

      {/* Completion stats skeleton */}
      <div className="border-t border-b bg-green-50/50 dark:bg-green-950/20">
        <div className="container px-4 py-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              <div className="h-5 w-32 bg-green-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <StoriesGridSkeleton count={30} />
    </div>
  );
}

export default function CompletedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Truyện Đã Hoàn Thành",
            description: "Bộ sưu tập những bộ truyện đã hoàn thành",
            url: "/completed",
            mainEntity: {
              "@type": "ItemList",
              name: "Danh sách truyện đã hoàn thành",
              numberOfItems: "5000+",
              itemListOrder: "https://schema.org/ItemListOrderDescending",
            },
            about: {
              "@type": "Thing",
              name: "Completed Manga Series",
              description: "Finished manga series with complete storylines",
            },
            temporalCoverage: "../2024",
          }),
        }}
      />

      <Suspense fallback={<CompletedPageSkeleton />}>
        <main className="completed-page">{children}</main>
      </Suspense>

      <link
        rel="preload"
        href="/api/comics/da-hoan-thanh"
        as="fetch"
        crossOrigin="anonymous"
      />
      <link rel="prefetch" href="/ongoing" />
      <link rel="prefetch" href="/popular" />
    </>
  );
}
