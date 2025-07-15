// app/page.tsx - Final Implementation with Cache & Global Loading
"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Flame, Clock, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useHomeData } from "@/hooks/useHomeData";

// Lazy load components
const HeroSection = dynamic(
  () =>
    import("@/components/home/HeroSection").then((mod) => ({
      default: mod.HeroSection,
    })),
  {
    loading: () => (
      <div className="h-[400px] md:h-[500px] bg-muted animate-pulse" />
    ),
  }
);

const FeaturedCategories = dynamic(
  () =>
    import("@/components/home/FeaturedCategories").then((mod) => ({
      default: mod.FeaturedCategories,
    })),
  {
    loading: () => (
      <div className="py-12 md:py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-muted animate-pulse rounded-xl"
                />
              ))}
          </div>
        </div>
      </div>
    ),
  }
);

const StoriesSection = dynamic(
  () =>
    import("@/components/home/StoriesSection").then((mod) => ({
      default: mod.StoriesSection,
    })),
  {
    loading: () => (
      <div className="py-8 md:py-12">
        <div className="container px-4">
          <div className="h-8 bg-muted animate-pulse rounded mb-6" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-muted animate-pulse rounded-lg"
                />
              ))}
          </div>
        </div>
      </div>
    ),
  }
);

const TopWeeklyStories = dynamic(
  () => import("@/components/TopWeeklyStories/TopWeeklyStories"),
  {
    loading: () => (
      <div className="py-12">
        <div className="container">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-muted animate-pulse rounded-lg"
                />
              ))}
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function HomePage() {
  // 🔑 Use enhanced home data hook with caching
  const {
    popularStories,
    hasData,
    error,
    sectionActions,
    refreshAllData,
    isAnyLoading,
    cacheStatus,
  } = useHomeData({
    enableAutoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // Auto refresh every 5 minutes
    debugMode: process.env.NODE_ENV === "development",
  });

  // 🔑 Error state với retry functionality
  if (error && !hasData) {
    return (
      <div className="container py-8 md:py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Không thể tải dữ liệu</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-3">{error}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => refreshAllData()}
                  className="px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                  disabled={isAnyLoading}
                >
                  {isAnyLoading ? "Đang thử lại..." : "Thử lại"}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  Tải lại trang
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 🎨 Hero Section */}
      {popularStories?.length > 0 && (
        <Suspense
          fallback={
            <div className="relative h-[400px] md:h-[500px] w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
          }
        >
          <HeroSection stories={popularStories} />
        </Suspense>
      )}

      {/* 🏷️ Featured Categories */}
      <Suspense
        fallback={
          <div className="py-12 md:py-16">
            <div className="container px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-200 animate-pulse rounded-xl"
                    />
                  ))}
              </div>
            </div>
          </div>
        }
      >
        <FeaturedCategories />
      </Suspense>

      {/* 📚 Stories Sections */}
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

      {/* 📈 Top Weekly Stories */}
      <Suspense
        fallback={
          <div className="py-12">
            <div className="container">
              <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-32 bg-gray-200 animate-pulse rounded-lg"
                    />
                  ))}
              </div>
            </div>
          </div>
        }
      >
        <TopWeeklyStories />
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

      {/* 🔄 Global Loading Indicator */}
      {isAnyLoading && hasData && (
        <motion.div
          className="container py-6 px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-center justify-center">
            <motion.div
              className="flex items-center gap-3 rounded-lg bg-white px-6 py-3 shadow-lg border"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.4 }}
            >
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
              <span className="text-sm font-medium text-gray-700">
                Đang cập nhật nội dung...
              </span>
              {process.env.NODE_ENV === "development" && (
                <span className="text-xs text-gray-500">
                  ({cacheStatus.totalEntries} cached)
                </span>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
