// components/home/StoriesSection.tsx - Updated for existing StoryCard
"use client";

import { useEffect, memo, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { AsyncThunk } from "@reduxjs/toolkit";
import { motion } from "framer-motion";
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
  large: 5
};

const animations = {
  title: {
    hidden: { opacity: 0, y: 8 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } 
    },
  },
  button: {
    hidden: { opacity: 0, scale: 0.95 },
    show: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.25, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] } 
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
  columns = defaultColumns
}: StoriesSectionProps) {
  const dispatch = useAppDispatch();
  const { stories, loading, error, lastFetched } = useAppSelector(
    (state) => state.home.sections[sectionKey]
  );

  const displayStories = useMemo(
    () => stories.slice(0, limit),
    [stories, limit]
  );

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

  // 🔑 Loading state
  if (loading && displayStories.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="container px-4">
          <div className="mb-6 md:mb-8">
            <motion.h2
              className={`flex items-center gap-2 text-lg font-bold md:text-2xl ${titleGradient} bg-clip-text text-transparent`}
              variants={animations.title}
              initial="hidden"
              animate="show"
            >
              <span className={`${iconClass} text-base md:text-xl`}>{icon}</span>
              {title}
            </motion.h2>
          </div>
          <LoadingSkeleton count={Math.min(limit, 10)} columns={columns} />
        </div>
      </section>
    );
  }

  // 🔑 Error state
  if (error) {
    return (
      <section className="py-8 md:py-12">
        <div className="container px-4">
          <motion.h2
            className={`flex items-center gap-2 text-lg font-bold md:text-2xl ${titleGradient} bg-clip-text text-transparent mb-6`}
            variants={animations.title}
            initial="hidden"
            animate="show"
          >
            <span className={`${iconClass} text-base md:text-xl`}>{icon}</span>
            {title}
          </motion.h2>
          
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertDescription className="text-sm">
              {error}
              <button
                onClick={handleRetry}
                className="ml-2 font-medium underline hover:no-underline transition-colors"
              >
                Thử lại
              </button>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  // 🔑 Empty state
  if (displayStories.length === 0) {
    return (
      <section className="py-8 md:py-12">
        <div className="container px-4">
          <motion.h2
            className={`flex items-center gap-2 text-lg font-bold md:text-2xl ${titleGradient} bg-clip-text text-transparent mb-6`}
            variants={animations.title}
            initial="hidden"
            animate="show"
          >
            <span className={`${iconClass} text-base md:text-xl`}>{icon}</span>
            {title}
          </motion.h2>
          
          <Alert className="bg-gray-50 border-gray-200">
            <AlertDescription className="text-sm text-gray-600">
              Không có {title.toLowerCase()} nào hiện tại.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  // 🔑 Success state
  return (
    <section className="py-8 md:py-12">
      <div className="container px-4">
        {/* Header */}
        <div className="mb-6 flex flex-col space-y-4 md:mb-8 md:flex-row md:items-center md:justify-between md:space-y-0">
          <motion.h2
            className={`flex items-center gap-2 text-lg font-bold md:text-2xl ${titleGradient} bg-clip-text text-transparent`}
            variants={animations.title}
            initial="hidden"
            animate="show"
          >
            <span className={`${iconClass} text-base md:text-xl`}>{icon}</span>
            {title}
          </motion.h2>

          <motion.div
            variants={animations.button}
            initial="hidden"
            animate="show"
          >
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-none px-4 py-2 text-sm hover:text-red-200 md:px-6 transition-colors"
            >
              <Link href={link}>
                Xem tất cả
                <motion.span
                  className={`ml-1 inline-block ${iconMotion}`}
                  animate={{ x: [0, 3, 0] }}
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

        {/* Stories Grid */}
        <div className="relative">
          <StoriesGrid 
            stories={displayStories} 
            columns={columns}
            animate={true}
            showPriority={true}
          />

          {/* Loading overlay for refresh */}
          {loading && displayStories.length > 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-lg">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">Đang cập nhật...</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
});

StoriesSection.displayName = "StoriesSection";