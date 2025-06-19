// src/components/latest/LatestStoriesGrid.tsx
"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryCard } from "@/components/home/StoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUp } from "lucide-react";
import { StoryObject } from "@/lib/api/comic/types";
import { FilterOptions } from "./LatestStoriesContainer";

interface LatestStoriesGridProps {
  stories: StoryObject[];
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStories: number;
    hasNextPage: boolean;
    limit: number;
  };
  filters: FilterOptions;
  onLoadMore: () => Promise<void>;
}

export function LatestStoriesGrid({
  stories,
  loading,
  pagination,
  onLoadMore,
}: LatestStoriesGridProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Infinite scroll handler
  const handleLoadMore = useCallback(async () => {
    if (pagination.hasNextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      await onLoadMore();
      setIsLoadingMore(false);
    }
  }, [onLoadMore, pagination.hasNextPage, isLoadingMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          pagination.hasNextPage &&
          !isLoadingMore
        ) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleLoadMore, pagination.hasNextPage, isLoadingMore]);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  // Initial loading state
  if (loading && stories.length === 0) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array(18)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="manga-card">
                <div className="manga-cover relative aspect-[2/3]">
                  <Skeleton className="absolute inset-0" />
                </div>
                <div className="p-3">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (stories.length === 0) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 opacity-50">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Không tìm thấy truyện</h3>
          <p className="text-muted-foreground mb-6">
            Hiện tại chưa có truyện nào hoặc không khớp với bộ lọc của bạn.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tải lại trang
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          {stories.map((story, index) => (
            <motion.div key={story._id} variants={itemVariants} layout>
              <StoryCard story={story} priority={index < 12} />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="mt-8">
          <AnimatePresence>
            {isLoadingMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang tải thêm truyện...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!pagination.hasNextPage && stories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full text-sm text-muted-foreground">
                <span>🎉</span>
                <span>Bạn đã xem hết tất cả truyện!</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Pagination Info */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8 pt-8 border-t"
          >
            <div className="text-sm text-muted-foreground">
              Hiển thị {stories.length} /{" "}
              {pagination.totalStories.toLocaleString()} truyện
              {pagination.hasNextPage && (
                <span className="ml-2">(Tự động tải thêm khi cuộn xuống)</span>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
