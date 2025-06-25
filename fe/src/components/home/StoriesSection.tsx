"use client";

import { useEffect, memo, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { StoryObject } from "@/lib/api/comic/types";
import { UnknownAction } from "@reduxjs/toolkit";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";

// 🎯 Lazy load StoryCard - mobile optimization
const StoryCard = dynamic(() => import("./StoryCard").then(mod => ({ default: mod.StoryCard })), {
  loading: () => (
    <div className="manga-card animate-pulse">
      <div className="manga-cover aspect-[3/4] bg-gray-200 rounded-lg" />
      <div className="p-2 space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
    </div>
  ),
  ssr: false
});

// 📱 Mobile-first animation variants - optimized
const animations = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },
  title: {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },
  card: {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  },
  button: {
    hidden: { opacity: 0, scale: 0.95 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.25, ease: "easeOut", delay: 0.15 }
    }
  }
};

// 🎨 Memoized components
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
        <div className="p-2 space-y-2">
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

const ErrorAlert = memo(({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <Alert variant="destructive" className="border-red-200 bg-red-50">
      <AlertDescription className="text-sm">
        {error}
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 underline hover:no-underline font-medium"
          >
            Thử lại
          </button>
        )}
      </AlertDescription>
    </Alert>
  </motion.div>
));

const EmptyState = memo(({ title }: { title: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
  >
    <Alert className="border-gray-200 bg-gray-50">
      <AlertDescription className="text-sm text-gray-600">
        Không có {title.toLowerCase()} nào hiện tại.
      </AlertDescription>
    </Alert>
  </motion.div>
));

// Add display names
LoadingSkeleton.displayName = 'LoadingSkeleton';
ErrorAlert.displayName = 'ErrorAlert';
EmptyState.displayName = 'EmptyState';

// 🔑 Remove local cache - using Redux instead
import { RootState } from "@/store/store";
interface StoriesSectionProps {
  sectionKey: keyof RootState['home']['sections']; // Redux section key
  title: string;
  icon: React.ReactNode;
  iconClass: string;
  link: string;
  titleGradient: string;
  iconMotion: string;
  limit?: number;
  cacheKey?: string;
  fetchAction: () => UnknownAction; // Redux action
}


export function StoriesSection({
  sectionKey,
  title,
  icon,
  iconClass,
  link,
  titleGradient,
  iconMotion,
  limit = 10,
  cacheKey,
  fetchAction
}: StoriesSectionProps) {
  const dispatch = useAppDispatch();
  
  // 🔑 Redux state selector
  const { stories, loading, error, lastFetched } = useAppSelector(
    (state) => state.home.sections[sectionKey]
  );

  // 📱 Mobile-optimized display stories
  const displayStories = useMemo(() => {
    return stories.slice(0, limit);
  }, [stories, limit]);

  // 🔄 Smart fetch with Redux caching
  const handleFetch = useCallback(async (force = false) => {
    const now = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    // Skip if recently fetched and not forced
    if (!force && lastFetched && (now - lastFetched) < CACHE_DURATION) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${title}] Using cached Redux data`);
      }
      return;
    }

    dispatch(fetchAction());
  }, [dispatch, fetchAction, title, lastFetched]);

  // 🎯 Effect with smart caching
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // 🔄 Retry function
  const handleRetry = useCallback(() => {
    handleFetch(true); // Force refresh
  }, [handleFetch]);

  // 🎨 Render stories grid - mobile optimized
  const renderStoriesGrid = () => (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      variants={animations.container}
      initial="hidden"
      animate="show"
    >
      {displayStories.map((story: StoryObject, index: number) => (
        <motion.div 
          key={story._id}
          variants={animations.card}
          className="story-card"
        >
          <StoryCard 
            story={story} 
            priority={index < 4} // First 4 items priority for mobile
            loading="lazy"
          />
        </motion.div>
      ))}
    </motion.div>
  );

  // 🎨 Main content renderer
  const renderContent = () => {
    if (loading && displayStories.length === 0) {
      return <LoadingSkeleton count={limit > 10 ? 10 : limit} />;
    }

    if (error) {
      return <ErrorAlert error={error} onRetry={handleRetry} />;
    }

    if (displayStories.length === 0) {
      return <EmptyState title={title} />;
    }

    return renderStoriesGrid();
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container px-4">
        {/* 📱 Mobile-first header */}
        <div className="flex flex-col space-y-4 mb-6 md:flex-row md:items-center md:justify-between md:space-y-0 md:mb-8">
          <motion.h2
            className={`text-lg md:text-2xl font-bold flex items-center gap-2 ${titleGradient} bg-clip-text text-transparent`}
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
              className="px-4 py-2 text-sm border-none hover:text-red-200 md:px-6"
            >
              <Link href={link}>
                Xem tất cả
                <motion.span
                  className={`inline-block ml-1 ${iconMotion}`}
                  animate={{ x: [0, 3, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                >
                  →
                </motion.span>
              </Link>
            </Button>
          </motion.div>
        </div>
        
        {/* 🎨 Content with loading overlay */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
          
          {/* 📱 Loading overlay for refresh */}
          {loading && displayStories.length > 0 && (
            <motion.div
              className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}