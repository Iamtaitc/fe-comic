// src/components/detail/DetailStoryList.tsx
"use client";

import { 
  DetailStoryListProps, 
} from "@/types/detail-story-list";
import { 
  StoriesGridSkeleton, 
  ErrorState, 
  EmptyState 
} from "./LoadingStates";
import { StoriesGrid } from "./StoriesGrid";
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger";
import { PaginationInfo } from "./PaginationInfo";
import { ScrollToTop } from "./ScrollToTop";

export function DetailStoryList({
  stories,
  loading,
  pagination,
  categorySlug,
  filters,
  error,
  onRetry,
  infiniteScroll = {
    enabled: true,
    threshold: 0.1,
    rootMargin: '100px'
  }
}: DetailStoryListProps) {

  // 🔧 Error State
  if (error && stories.length === 0) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  // 🔧 Loading State
  if (loading && stories.length === 0) {
    return <StoriesGridSkeleton />;
  }

  // 🔧 Empty State
  if (stories.length === 0) {
    return <EmptyState onRetry={onRetry} />;
  }

  return (
    <>
      {/* Stories Grid */}
      <StoriesGrid stories={stories} />

      {/* Infinite Scroll Trigger */}
      <InfiniteScrollTrigger
        pagination={pagination}
        config={infiniteScroll}
        categorySlug={categorySlug}
      />

      {/* Pagination Info */}
      <PaginationInfo 
        pagination={pagination}
        infiniteScroll={infiniteScroll}
        storiesCount={stories.length}
      />

      {/* Scroll to Top */}
      <ScrollToTop />
    </>
  );
}