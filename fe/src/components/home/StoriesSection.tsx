// components/StoriesSection.tsx
"use client";

import { useEffect, memo, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StoryObject } from "@/lib/api/comic/types";
import { AsyncThunk } from "@reduxjs/toolkit";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { RootState } from "@/store/store";

/* ----------------- Dynamic import ----------------- */
const StoryCard = dynamic(
  () => import("./StoryCard").then((mod) => ({ default: mod.StoryCard })),
  {
    loading: () => (
      <div className="manga-card animate-pulse">
        <div className="manga-cover aspect-[3/4] rounded-lg bg-gray-200" />
        <div className="space-y-2 p-2">
          <div className="h-4 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
        </div>
      </div>
    ),
    ssr: false,
  }
);

/* ----------------- Animation variants ----------------- */
const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.2, staggerChildren: 0.05, delayChildren: 0.1 },
    },
  },
  title: {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: easeOut },
    },
  },
  card: {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: easeOut },
    },
  },
  button: {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25, ease: easeOut, delay: 0.15 },
    },
  },
};

/* ----------------- Memo components ----------------- */
const LoadingSkeleton = memo(({ count = 6 }: { count?: number }) => (
  <motion.div
    className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
    variants={animations.container}
    initial="hidden"
    animate="show"
  >
    {Array.from({ length: count }, (_, i) => (
      <motion.div
        key={`skeleton-${i}`}
        variants={animations.card}
        className="manga-card"
      >
        <Skeleton className="manga-cover aspect-[3/4] rounded-lg" />
        <div className="space-y-2 p-2">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-3 w-16 rounded" />
          <div className="flex gap-1">
            <Skeleton className="h-3 w-10 rounded" />
            <Skeleton className="h-3 w-10 rounded" />
          </div>
        </div>
      </motion.div>
    ))}
  </motion.div>
));
LoadingSkeleton.displayName = "LoadingSkeleton";

const ErrorAlert = memo(
  ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertDescription className="text-sm">
          {error}
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-2 font-medium underline hover:no-underline"
            >
              Thử lại
            </button>
          )}
        </AlertDescription>
      </Alert>
    </motion.div>
  )
);
ErrorAlert.displayName = "ErrorAlert";

const EmptyState = memo(({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <Alert className="bg-gray-50 border-gray-200">
      <AlertDescription className="text-sm text-gray-600">
        Không có {title.toLowerCase()} nào hiện tại.
      </AlertDescription>
    </Alert>
  </motion.div>
));
EmptyState.displayName = "EmptyState";

/* ----------------- Types ----------------- */
// 🔑 Correct type for async thunk actions
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
  // 🔑 Type-safe async thunk
  fetchAction: AsyncThunkAction;
}

/* ----------------- Main component ----------------- */
export function StoriesSection({
  sectionKey,
  title,
  icon,
  iconClass,
  link,
  titleGradient,
  iconMotion,
  limit = 10,
  fetchAction,
}: StoriesSectionProps) {
  const dispatch = useAppDispatch();

  const { stories, loading, error, lastFetched } = useAppSelector(
    (state) => state.home.sections[sectionKey]
  );

  const displayStories = useMemo(
    () => stories.slice(0, limit),
    [stories, limit]
  );

  /* ----- Smart fetch with cache ----- */
  const handleFetch = useCallback(
    (force = false) => {
      const now = Date.now();
      const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
      
      // Skip if recently fetched and not forced
      if (!force && lastFetched && now - lastFetched < CACHE_TIME) {
        console.log(`[${sectionKey}] Cache hit, skipping fetch`);
        return;
      }

      console.log(`[${sectionKey}] Fetching data...`);
      // 🔑 Dispatch async thunk with correct params
      dispatch(fetchAction({ limit, force }));
    },
    [dispatch, fetchAction, lastFetched, limit, sectionKey]
  );

  // Auto-fetch on mount
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const handleRetry = useCallback(() => handleFetch(true), [handleFetch]);

  /* ----- Render helpers ----- */
  const renderStoriesGrid = useCallback(() => (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      variants={animations.container}
      initial="hidden"
      animate="show"
    >
      {displayStories.map((story: StoryObject, i) => (
        <motion.div
          key={story._id}
          variants={animations.card}
          className="story-card"
        >
          <StoryCard story={story} priority={i < 4} />
        </motion.div>
      ))}
    </motion.div>
  ), [displayStories]);

  const renderContent = () => {
    if (loading && displayStories.length === 0) {
      return <LoadingSkeleton count={Math.min(limit, 10)} />;
    }
    
    if (error) {
      return <ErrorAlert error={error} onRetry={handleRetry} />;
    }
    
    if (displayStories.length === 0) {
      return <EmptyState title={title} />;
    }
    
    return renderStoriesGrid();
  };

  /* ----- JSX ----- */
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
              className="border-none px-4 py-2 text-sm hover:text-red-200 md:px-6"
            >
              <Link href={link}>
                Xem tất cả
                <motion.span
                  className={`ml-1 inline-block ${iconMotion}`}
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: easeOut,
                  }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

          {/* Overlay loading indicator */}
          {loading && displayStories.length > 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}