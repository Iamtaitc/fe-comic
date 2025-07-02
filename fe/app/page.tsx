// app/page.tsx - Enhanced Home Loading States
"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
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
  () => import("@/components/TopWeeklyStories/TopWeeklyStoriesResponsive"),
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

// 🎨 Enhanced Skeleton Components
const HeroSkeleton = () => (
  <motion.div
    className="relative h-[400px] md:h-[500px] w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container relative h-full">
      <div className="flex h-full flex-col justify-end pb-12 md:pb-16">
        <div className="max-w-2xl space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-5 w-16 md:h-6 md:w-20 rounded-full bg-gray-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
          <motion.div
            className="h-8 md:h-12 w-full max-w-lg rounded-lg bg-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          />
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-5 w-24 md:h-6 md:w-28 rounded bg-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              />
            ))}
          </div>
          <div className="flex gap-3 md:gap-4 pt-2">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-9 w-28 md:h-10 md:w-32 rounded-lg bg-gray-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const CategoriesSkeleton = () => (
  <motion.section
    className="py-12 md:py-16"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="container px-4">
      <div className="text-center mb-8 md:mb-12">
        <motion.div
          className="h-6 md:h-8 w-40 md:w-48 mx-auto mb-3 md:mb-4 rounded-lg bg-gray-200 animate-pulse"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        />
        <motion.div
          className="h-4 md:h-6 w-80 md:w-96 mx-auto rounded bg-gray-200 animate-pulse"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              className="p-4 md:p-6 rounded-xl border bg-gray-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 md:h-12 w-10 md:w-12 rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-5 md:h-6 w-16 md:w-20 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="h-5 md:h-6 w-20 md:w-24 mb-2 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 md:h-4 w-full rounded bg-gray-200 animate-pulse" />
            </motion.div>
          ))}
      </div>
    </div>
  </motion.section>
);

const SectionSkeleton = () => (
  <motion.section
    className="py-8 md:py-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="container px-4">
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <motion.div
          className="h-6 md:h-8 w-48 md:w-64 rounded-lg bg-gray-200 animate-pulse"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        />
        <motion.div
          className="h-8 md:h-10 w-24 md:w-32 rounded-lg bg-gray-200 animate-pulse"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              className="manga-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="aspect-[3/4] rounded-lg bg-gray-200 animate-pulse" />
              <div className="p-2 md:p-3 space-y-2">
                <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="flex gap-1">
                  <div className="h-3 w-10 rounded bg-gray-200 animate-pulse" />
                  <div className="h-3 w-10 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  </motion.section>
);

const WeeklySkeleton = () => (
  <motion.section
    className="py-12"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="container">
      <motion.div
        className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <motion.div
              key={i}
              className="h-32 bg-gray-200 animate-pulse rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
      </div>
    </div>
  </motion.section>
);

// 🎯 Enhanced Page Loading Skeleton
const PageLoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <HeroSkeleton />
    <CategoriesSkeleton />
    <SectionSkeleton />
    <SectionSkeleton />
    <WeeklySkeleton />
    <SectionSkeleton />
    <SectionSkeleton />
  </motion.div>
);

export default function HomePage() {
  const {
    popularStories,
    isInitialLoading,
    hasData,
    error,
    sectionActions,
    loadInitialData,
    isAnyLoading,
  } = useHomeData();

  return (
    <div>
      <AnimatePresence mode="wait">
        {/* 🔄 Initial Loading State */}
        {isInitialLoading && <PageLoadingSkeleton key="page-loading" />}

        {/* ❌ Error State */}
        {error && !hasData && (
          <motion.div
            key="page-error"
            className="container py-8 md:py-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
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
          </motion.div>
        )}

        {/* ✅ Main Content */}
        {!isInitialLoading && hasData && (
          <motion.div
            key="page-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Hero Section */}
            {popularStories?.length > 0 && (
              <Suspense fallback={<HeroSkeleton />}>
                <HeroSection stories={popularStories} />
              </Suspense>
            )}

            {/* Featured Categories */}
            <Suspense fallback={<CategoriesSkeleton />}>
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
            <Suspense fallback={<WeeklySkeleton />}>
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

            {/* Global Loading Indicator */}
            {isAnyLoading && hasData && (
              <motion.div
                className="container py-6 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
                      Đang tải thêm nội dung...
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
