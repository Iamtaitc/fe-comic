// src/components/detail/PaginationInfo.tsx
"use client";

import { motion } from "framer-motion";
import { PaginationInfo as PaginationData, InfiniteScrollConfig } from "@/types/detail-story-list";

interface PaginationInfoProps {
  pagination: PaginationData;
  infiniteScroll: InfiniteScrollConfig;
  storiesCount: number;
}

export function PaginationInfo({ 
  pagination, 
  infiniteScroll, 
  storiesCount 
}: PaginationInfoProps) {
  if (storiesCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center mt-8 pt-8 border-t"
    >
      <div className="text-sm text-muted-foreground text-center">
        <div>
          Hiển thị <strong>{storiesCount}</strong> / <strong>{pagination.totalStories.toLocaleString()}</strong> truyện
        </div>
        {infiniteScroll.enabled && pagination.hasNextPage && (
          <div className="mt-1 text-xs opacity-75">
            (Tự động tải thêm khi cuộn xuống)
          </div>
        )}
        {!infiniteScroll.enabled && (
          <div className="mt-1 text-xs opacity-75">
            Sử dụng nút "Tải thêm" để xem thêm truyện
          </div>
        )}
      </div>
    </motion.div>
  );
}