// fe\app\popular\page.tsx - Fixed và Clean
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPopularStoriesSection,
  clearSection,
} from "@/store/slices/homeSlice";
import { DetailHeader } from "@/components/detail/DetailHeader";
import DetailFilters from "@/components/detail/DetailFilters";
import { DetailStoryList } from "@/components/detail/DetailStoryList";
import { Flame } from "lucide-react";

type FilterState = {
  status: "all" | "ongoing" | "completed" | "paused";
  sortBy: "latest" | "popular" | "name" | "rating" | "views";
  sortOrder: "asc" | "desc";
};

export default function PopularPage() {
  const dispatch = useAppDispatch();

  // 🔧 Redux state
  const { sections } = useAppSelector((state) => state.home);
  const { stories, loading, error, lastFetched } = sections.popular;

  // 🔧 Local state cho filters
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    sortBy: "popular",
    sortOrder: "desc",
  });

  const [categoryInfo] = useState({
    title: "Truyện nổi bật",
    description:
      "Khám phá những bộ truyện được yêu thích nhất với lượt xem cao và đánh giá tốt từ cộng đồng độc giả.",
  });

  // 🔧 Client-side filtering and sorting
  const filteredAndSortedStories = useMemo(() => {
    let filtered = [...stories];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((story) => story.status === filters.status);
    }

    // Sort stories
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name, 'vi');
          break;
        case "rating":
          comparison = (b.ratingValue || 0) - (a.ratingValue || 0);
          break;
        case "views":
          comparison = (b.viewCount || 0) - (a.viewCount || 0);
          break;
        case "latest":
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case "popular":
        default:
          // Popular có thể dựa trên rating + views
          const scoreA = (a.ratingValue || 0) * 0.7 + (a.viewCount || 0) * 0.3;
          const scoreB = (b.ratingValue || 0) * 0.7 + (b.viewCount || 0) * 0.3;
          comparison = scoreB - scoreA;
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [stories, filters]);

  // 🔧 Pagination dựa trên filtered stories
  const pagination = useMemo(() => ({
    currentPage: 1,
    totalPages: 1,
    totalStories: filteredAndSortedStories.length,
    hasNextPage: false,
    limit: filteredAndSortedStories.length,
  }), [filteredAndSortedStories.length]);

  // 🔧 Fetch data on mount
  useEffect(() => {
    console.log('[PopularPage] Component mounted');
    
    // Clear section trước khi fetch
    dispatch(clearSection("popular"));
    
    // Fetch popular stories
    dispatch(
      fetchPopularStoriesSection({
        limit: 50, // Fetch nhiều để có đủ data cho filter
        force: true,
      })
    );

    return () => {
      console.log('[PopularPage] Component unmounted');
      dispatch(clearSection("popular"));
    };
  }, [dispatch]);

  // 🔧 Handle retry
  const handleRetry = useCallback(() => {
    console.log('[PopularPage] Retry clicked');
    dispatch(
      fetchPopularStoriesSection({
        limit: 50,
        force: true,
      })
    );
  }, [dispatch]);

  // 🔧 Handle filters change - chỉ update local state
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    console.log('[PopularPage] Filter change:', newFilters);
    setFilters(newFilters);
  }, []);

  // 🔧 Debug logs
  console.log('[PopularPage] Render state:', {
    originalStoriesCount: stories.length,
    filteredStoriesCount: filteredAndSortedStories.length,
    loading,
    error,
    filters,
    lastFetched: lastFetched ? new Date(lastFetched).toLocaleString() : 'Never'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <DetailHeader
        title={categoryInfo.title}
        description={categoryInfo.description}
        totalStories={pagination.totalStories}
        slug="popular"
        icon={<Flame className="h-8 w-8 text-red-500" />}
        gradient="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
      />
      
      <DetailFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalStories={pagination.totalStories}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
      />
      
      <DetailStoryList
        stories={filteredAndSortedStories}
        loading={loading}
        pagination={pagination}
        categorySlug="popular"
        filters={filters}
        error={error}
        onRetry={handleRetry}
      />
      
      {/* Debug info - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 p-2 bg-black/80 text-white text-xs rounded max-w-xs z-50">
          <div>Original: {stories.length}</div>
          <div>Filtered: {filteredAndSortedStories.length}</div>
          <div>Status: {filters.status}</div>
          <div>Sort: {filters.sortBy} ({filters.sortOrder})</div>
        </div>
      )}
    </div>
  );
}