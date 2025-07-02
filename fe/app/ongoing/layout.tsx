// fe\app\ongoing\layout.tsx - Layout cho Ongoing Section
import { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// 🎯 SEO Metadata cho Ongoing Page
export const metadata: Metadata = {
  title: "Truyện Đang Phát Hành | SubTruyen",
  description:
    "Khám phá những bộ truyện đang được cập nhật thường xuyên với các chương mới liên tục được phát hành. Cập nhật hàng ngày với nội dung mới nhất.",
  keywords: [
    "truyện đang phát hành",
    "manga ongoing",
    "truyện tranh mới",
    "cập nhật hàng ngày",
    "tập mới",
    "ongoing manga",
    "serialized manga",
  ],
  openGraph: {
    title: "Truyện Đang Phát Hành - Cập Nhật Hàng Ngày",
    description:
      "Những bộ truyện hot nhất đang được phát hành với chương mới liên tục. Theo dõi để không bỏ lỡ!",
    type: "website",
    images: [
      {
        url: "/images/ongoing-og.jpg",
        width: 1200,
        height: 630,
        alt: "Truyện Đang Phát Hành",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Truyện Đang Phát Hành",
    description:
      "Những bộ truyện hot nhất đang được phát hành với chương mới liên tục",
    images: ["/images/ongoing-twitter.jpg"],
  },
  alternates: {
    canonical: "/ongoing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
//   verification: {
//     google: "your-google-verification-code",
//   },
};

// 🔧 Loading Skeleton cho Ongoing Page
function OngoingPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Header Skeleton */}
      <div className="relative py-16 md:py-24">
        <div className="container px-4">
          <div className="text-center space-y-6">
            {/* Icon + Title */}
            <div className="flex items-center justify-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-48 md:w-64" />
            </div>

            {/* Description */}
            <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
            <Skeleton className="h-5 w-80 mx-auto" />

            {/* Stats */}
            <div className="flex justify-center gap-8">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="border-t border-b bg-card/50">
        <div className="container px-4 py-6">
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid Skeleton */}
      <div className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(24)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="manga-card">
                <div className="manga-cover relative aspect-[2/3]">
                  <Skeleton className="absolute inset-0 rounded-lg" />
                </div>
                <div className="p-3 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// 🎯 Ongoing Layout Component
export default function OngoingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Schema.org JSON-LD cho SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Truyện Đang Phát Hành",
            description:
              "Những bộ truyện đang được cập nhật thường xuyên với các chương mới liên tục được phát hành",
            url: "/ongoing",
            mainEntity: {
              "@type": "ItemList",
              name: "Danh sách truyện đang phát hành",
              description:
                "Tuyển tập các bộ manga, manhwa đang được serialized",
              numberOfItems: "1000+",
              itemListOrder: "https://schema.org/ItemListOrderDescending",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Trang chủ",
                  item: "/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Truyện đang phát hành",
                  item: "/ongoing",
                },
              ],
            },
            publisher: {
              "@type": "Organization",
              name: "Manga Reader",
              url: "/",
            },
          }),
        }}
      />

      {/* Suspense wrapper với custom loading */}
      <Suspense fallback={<OngoingPageSkeleton />}>
        <main className="ongoing-page">{children}</main>
      </Suspense>

      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/api/comics/danh-sach/dang-phat-hanh"
        as="fetch"
        crossOrigin="anonymous"
      />

      {/* Prefetch related pages */}
      <link rel="prefetch" href="/completed" />
      <link rel="prefetch" href="/popular" />
      <link rel="prefetch" href="/upcoming" />
    </>
  );
}
