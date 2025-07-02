// app/page.tsx - Lightweight Home Page
"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Flame, Clock, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useHomeData } from "@/hooks/useHomeData";

// Lazy load components
const HeroSection = dynamic(() => import("@/components/home/HeroSection").then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="h-[400px] md:h-[500px] bg-muted animate-pulse" />
});

const FeaturedCategories = dynamic(() => import("@/components/home/FeaturedCategories").then(mod => ({ default: mod.FeaturedCategories })), {
  loading: () => <div className="py-12 md:py-16"><div className="container px-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}</div></div></div>
});

const StoriesSection = dynamic(() => import("@/components/home/StoriesSection").then(mod => ({ default: mod.StoriesSection })), {
  loading: () => <div className="py-8 md:py-12"><div className="container px-4"><div className="h-8 bg-muted animate-pulse rounded mb-6" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{Array(10).fill(0).map((_, i) => <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />)}</div></div></div>
});

const TopWeeklyStories = dynamic(() => import("@/components/TopWeeklyStories/TopWeeklyStoriesResponsive"), {
  loading: () => <div className="py-12"><div className="container"><div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}</div></div></div>,
  ssr: false,
});

export default function HomePage() {
  const {
    popularStories,
    isInitialLoading,
    hasData,
    error,
    sectionActions,
    loadInitialData,
    isAnyLoading
  } = useHomeData();

  // Loading state
  if (isInitialLoading) {
    return (
      <div>
        <div className="h-[400px] md:h-[500px] bg-muted animate-pulse" />
        <div className="py-12 md:py-16"><div className="container px-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}</div></div></div>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="py-8 md:py-12"><div className="container px-4"><div className="h-8 bg-muted animate-pulse rounded mb-6" /><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{Array(10).fill(0).map((_, j) => <div key={j} className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />)}</div></div></div>
        ))}
      </div>
    );
  }

  // Error state
  if (error && !hasData) {
    return (
      <div className="container py-8 md:py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            {error}
            <button
              onClick={loadInitialData}
              className="ml-2 underline hover:no-underline text-white hover:text-gray-200 transition-colors"
            >
              Thử lại
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      {popularStories?.length > 0 && (
        <Suspense fallback={<div className="h-[400px] md:h-[500px] bg-muted animate-pulse" />}>
          <HeroSection stories={popularStories} />
        </Suspense>
      )}

      {/* Featured Categories */}
      <Suspense fallback={<div className="py-12 md:py-16"><div className="container px-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">{Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />)}</div></div></div>}>
        <FeaturedCategories />
      </Suspense>

      {/* Stories Sections */}
      <StoriesSection
        sectionKey="popular"
        title="Truyện nổi bật"
        icon={<Flame />}
        iconMotion="animate-pulse text-red-500"
        iconClass="h-5 w-5 md:h-6 md:w-6 text-red-500"
        link="/popular"
        titleGradient="bg-gradient-to-r from-red-500 to-white"
        fetchAction={sectionActions.popular}
        limit={10}
      />

      <StoriesSection
        sectionKey="ongoing"
        title="Truyện đang phát hành"
        icon={<Clock />}
        iconMotion="animate-pulse text-blue-500"
        iconClass="h-5 w-5 md:h-6 md:w-6 text-blue-500"
        link="/ongoing"
        titleGradient="bg-gradient-to-r from-blue-500 to-white"
        fetchAction={sectionActions.ongoing}
        limit={10}
      />

      {/* Top Weekly Stories */}
      <Suspense fallback={<div className="py-12"><div className="container"><div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}</div></div></div>}>
        <TopWeeklyStories stories={[]} deviceType="mobile" />
      </Suspense>

      <StoriesSection
        sectionKey="completed"
        title="Truyện đã hoàn thành"
        icon={<CheckCircle />}
        iconMotion="animate-pulse text-green-500"
        iconClass="h-5 w-5 md:h-6 md:w-6 text-green-500"
        link="/completed"
        titleGradient="bg-gradient-to-r from-green-500 to-white"
        fetchAction={sectionActions.completed}
        limit={10}
      />

      <StoriesSection
        sectionKey="upcoming"
        title="Truyện sắp ra mắt"
        icon={<Calendar />}
        iconMotion="animate-pulse text-purple-500"
        iconClass="h-5 w-5 md:h-6 md:w-6 text-purple-500"
        link="/upcoming"
        titleGradient="bg-gradient-to-r from-purple-500 to-white"
        fetchAction={sectionActions.upcoming}
        limit={10}
      />

      {/* Loading indicator */}
      {isAnyLoading && hasData && (
        <div className="container py-6 px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm md:text-base text-muted-foreground">
              Đang tải thêm nội dung...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}