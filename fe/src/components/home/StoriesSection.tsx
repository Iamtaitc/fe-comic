// components/home/StoriesSection.tsx - Enhanced Loading States
"use client";

import { useEffect, memo, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AsyncThunk } from "@reduxjs/toolkit";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StoriesGrid } from "@/components/common/StoriesGrid";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { StoryObject, CACHE_TIME } from "@/lib/api/comic/types";
import { RootState } from "@/store/store";
import Link from "next/link";

type AsyncThunkAction = AsyncThunk<
  { stories: StoryObject[]; cached: boolean },
  { page?: number; limit?: number; force?: boolean },
  Record<string, unknown>
>;

interface StoriesSectionProps {
  sectionKey: keyof RootState["home"]["sections"];
  title: string;
  icon: React.ReactNode;
  iconClass: string;
  link: string;
  titleGradient: string;
  iconMotion: string;
  limit?: number;
  fetchAction: AsyncThunkAction;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
    large: number;
  };
}

const defaultColumns = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
  large: 5,
};

const animations = {
  title: {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  button: {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  contentFade: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  },
};

export const StoriesSection = memo(function StoriesSection({
  sectionKey,
  title,
  icon,
  iconClass,
  link,
  titleGradient,
  iconMotion,
  limit = 10,
  fetchAction,
  columns = defaultColumns,
}: StoriesSectionProps) {
  const dispatch = useAppDispatch();
  const { stories, loading, error, lastFetched } = useAppSelector(
    (state) => state.home.sections[sectionKey]
  );

  const displayStories = useMemo(
    () => stories.slice(0, limit),
    [stories, limit]
  );

  // 🔑 Enhanced loading states
  const isInitialLoading = loading && stories.length === 0;
  const isRefreshing = loading && stories.length > 0;
  const hasData = displayStories.length > 0;
  const shouldShowSkeleton = isInitialLoading;

  const handleFetch = useCallback(
    (force = false) => {
      const now = Date.now();
      if (!force && lastFetched && now - lastFetched < CACHE_TIME) {
        return;
      }
      dispatch(fetchAction({ limit, force }));
    },
    [dispatch, fetchAction, lastFetched, limit]
  );

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const handleRetry = useCallback(() => handleFetch(true), [handleFetch]);

  // 🎯 Always show header for consistency
  const SectionHeader = () => (
    <div className="mb-6 flex flex-col space-y-4 md:mb-8 md:flex-row md:items-center md:justify-between md:space-y-0">
      <motion.h2
        className={`flex items-center gap-2 text-lg font-bold md:text-2xl ${titleGradient} bg-clip-text text-transparent`}
        variants={animations.title}
        initial="hidden"
        animate="show"
      >
        <span className={`${iconClass} text-base md:text-xl`}>{icon}</span>
        {title}
        {/* Loading indicator next to title */}
        {isInitialLoading && (
          <motion.div
            className="ml-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </motion.div>
        )}
      </motion.h2>

      <motion.div variants={animations.button} initial="hidden" animate="show">
        <Button
          asChild
          variant="outline"
          size="sm"
          className={`border-none px-4 py-2 text-sm hover:text-red-200 md:px-6 transition-all ${
            isInitialLoading ? "opacity-50 pointer-events-none" : ""
          }`}
          disabled={isInitialLoading}
        >
          <Link href={link}>
            Xem tất cả
            <motion.span
              className={`ml-1 inline-block ${iconMotion}`}
              animate={isInitialLoading ? {} : { x: [0, 3, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              →
            </motion.span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );

  return (
    <section className="py-8 md:py-12">
      <div className="container px-4">
        <SectionHeader />

        {/* Content Area with AnimatePresence for smooth transitions */}
        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            {/* 🔄 Loading Skeleton State */}
            {shouldShowSkeleton && (
              <motion.div
                key="loading"
                variants={animations.contentFade}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <LoadingSkeleton
                  count={Math.min(limit, 10)}
                  columns={columns}
                />
              </motion.div>
            )}

            {/* ❌ Error State */}
            {error && !hasData && (
              <motion.div
                key="error"
                variants={animations.contentFade}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200"
                >
                  <AlertDescription className="text-sm">
                    {error}
                    <button
                      onClick={handleRetry}
                      className="ml-2 font-medium underline hover:no-underline transition-colors"
                      disabled={loading}
                    >
                      {loading ? "Đang thử lại..." : "Thử lại"}
                    </button>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* 📭 Empty State */}
            {!loading && !error && !hasData && (
              <motion.div
                key="empty"
                variants={animations.contentFade}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <Alert className="bg-gray-50 border-gray-200">
                  <AlertDescription className="text-sm text-gray-600">
                    Không có {title.toLowerCase()} nào hiện tại.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* ✅ Success State with Data */}
            {hasData && (
              <motion.div
                key="data"
                variants={animations.contentFade}
                initial="hidden"
                animate="show"
                exit="exit"
                className="relative"
              >
                <StoriesGrid
                  stories={displayStories}
                  columns={columns}
                  animate={true}
                  showPriority={true}
                />

                {/* 🔄 Refreshing Overlay */}
                {isRefreshing && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80 backdrop-blur-sm z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="flex items-center gap-3 rounded-lg bg-white px-6 py-3 shadow-lg border"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                    >
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm font-medium text-gray-700">
                        Đang cập nhật dữ liệu...
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
});

StoriesSection.displayName = "StoriesSection";
