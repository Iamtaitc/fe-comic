"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PaginationInfo, InfiniteScrollConfig } from "@/types/detail-story-list";

interface InfiniteScrollTriggerProps {
  pagination: PaginationInfo;
  config: InfiniteScrollConfig;
  categorySlug: string;
}

export function InfiniteScrollTrigger({
  pagination,
  config,
  categorySlug
}: InfiniteScrollTriggerProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 🔧 Handle load more
  const handleLoadMore = async () => {
    if (!pagination.hasNextPage || isLoadingMore || !config.loadMoreHandler) return;

    setIsLoadingMore(true);
    try {
      await config.loadMoreHandler();
    } catch (error) {
      console.error(`[${categorySlug}] Load more error:`, error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 🔧 Intersection Observer
  useEffect(() => {
    if (!config.enabled || !config.loadMoreHandler) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasNextPage && !isLoadingMore) {
          console.log(`[${categorySlug}] Infinite scroll triggered`);
          handleLoadMore();
        }
      },
      { 
        threshold: config.threshold,
        rootMargin: config.rootMargin
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [config, pagination.hasNextPage, isLoadingMore, categorySlug]);

  if (!config.enabled) return null;

  return (
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

      {/* Manual Load More Button */}
      {!isLoadingMore && pagination.hasNextPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-6"
        >
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="gap-2"
          >
            <Loader2 className={`w-4 h-4 ${isLoadingMore ? 'animate-spin' : ''}`} />
            Tải thêm truyện
          </Button>
        </motion.div>
      )}

      {/* End indicator */}
      {!pagination.hasNextPage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full text-sm text-muted-foreground">
            <span>🎉</span>
            <span>Bạn đã xem hết tất cả truyện trong danh mục này!</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}