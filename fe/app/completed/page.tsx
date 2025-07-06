// fe\app\completed\page.tsx - Fixed với HomeSlice
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCompletedStoriesSection,
  clearSection,
} from "@/store/slices/homeSlice";
import { DetailHeader } from "@/components/detail/DetailHeader";
import DetailFilters from "@/components/detail/DetailFilters";
import { DetailStoryList } from "@/components/detail/DetailStoryList";
import { CheckCircle } from "lucide-react";
import { StoryObject } from "@/lib/api/comic/types";

type FilterState = {
  status: "all" | "ongoing" | "completed" | "paused";
  sortBy: "latest" | "popular" | "name" | "rating" | "views";
  sortOrder: "asc" | "desc";
};

export default function CompletedPage() {
  const dispatch = useAppDispatch();

  // 🔧 Redux state từ homeSlice
  const { sections } = useAppSelector((state) => state.home);
  const { stories, loading, error, lastFetched } = sections.completed;

  // 🔧 Local state cho filters
  const [filters, setFilters] = useState<FilterState>({
    status: "completed", // Default completed vì đây là completed page
    sortBy: "latest",
    sortOrder: "desc",
  });

  const [categoryInfo] = useState({
    title: "Truyện đã hoàn thành",
    description:
      "Những bộ truyện đã kết thúc hoàn chỉnh, sẵn sàng để bạn thưởng thức trọn vẹn từ đầu đến cuối.",
  });

  // 🔧 Client-side filtering and sorting
  const filteredAndSortedStories = useMemo(() => {
    let filtered = [...stories];

    // Filter by status - cho phép filter trong completed stories
    if (filters.status !== "all") {
      filtered = filtered.filter((story) => story.status === filters.status);
    }

    // Sort stories
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name, "vi");
          break;
        case "rating":
          comparison = (b.ratingValue || 0) - (a.ratingValue || 0);
          break;
        case "views":
          comparison = (b.views || 0) - (a.views || 0);
          break;
        case "popular":
          // Popular score = rating * 0.6 + views * 0.4
          const scoreA = (a.ratingValue || 0) * 0.6 + (a.views || 0) * 0.4;
          const scoreB = (b.ratingValue || 0) * 0.6 + (b.views || 0) * 0.4;
          comparison = scoreB - scoreA;
          break;
        case "latest":
        default:
          // Latest = updatedAt desc (khi nào hoàn thành)
          comparison =
            new Date(b.updatedAt ?? "").getTime() -
            new Date(a.updatedAt ?? "").getTime();
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [stories, filters]);

  // 🔧 Pagination dựa trên filtered stories
  const pagination = useMemo(
    () => ({
      currentPage: 1,
      totalPages: 1,
      totalStories: filteredAndSortedStories.length,
      hasNextPage: false, // Completed stories không cần infinite scroll mạnh
      limit: filteredAndSortedStories.length,
    }),
    [filteredAndSortedStories.length]
  );

  useEffect(() => {
    console.log("[CompletedPage] Component mounted");

    // Clear section trước khi fetch
    dispatch(clearSection("completed"));

    // Fetch completed stories với limit cao
    dispatch(
      fetchCompletedStoriesSection({
        limit: 60, // Fetch nhiều completed stories
        force: true,
      })
    );

    return () => {
      console.log("[CompletedPage] Component unmounted");
      dispatch(clearSection("completed"));
    };
  }, [dispatch]);

  // 🔧 Handle retry
  const handleRetry = useCallback(() => {
    console.log("[CompletedPage] Retry clicked");
    dispatch(
      fetchCompletedStoriesSection({
        limit: 60,
        force: true,
      })
    );
  }, [dispatch]);

  // 🔧 Handle filter changes - client-side filtering
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    console.log("[CompletedPage] Filter change:", newFilters);
    setFilters(newFilters);
  }, []);

  // 🔧 Load more handler cho completed stories
  const handleLoadMore = useCallback(async () => {
    // Completed stories có thể load thêm nếu cần
    await dispatch(
      fetchCompletedStoriesSection({
        limit: stories.length + 30, // Tăng thêm 30 stories
        force: true,
      })
    );
  }, [dispatch, stories.length]);

  // 🔧 Debug logs
  console.log("[CompletedPage] Render state:", {
    originalStoriesCount: stories.length,
    filteredStoriesCount: filteredAndSortedStories.length,
    loading,
    error,
    filters,
    lastFetched: lastFetched ? new Date(lastFetched).toLocaleString() : "Never",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <DetailHeader
        title={categoryInfo.title}
        description={categoryInfo.description}
        totalStories={pagination.totalStories}
        slug="completed"
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
        categorySlug="completed"
        filters={filters}
        error={error}
        onRetry={handleRetry}
        infiniteScroll={{
          enabled: true,
          threshold: 0.1,
          rootMargin: "100px",
          loadMoreHandler: handleLoadMore,
        }}
      />

      {/* Debug info - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 p-2 bg-black/80 text-white text-xs rounded max-w-xs z-50">
          <div>
            <strong>Completed Debug:</strong>
          </div>
          <div>Original: {stories.length}</div>
          <div>Filtered: {filteredAndSortedStories.length}</div>
          <div>Status: {filters.status}</div>
          <div>
            Sort: {filters.sortBy} ({filters.sortOrder})
          </div>
          <div>
            Last update:{" "}
            {lastFetched ? new Date(lastFetched).toLocaleTimeString() : "Never"}
          </div>
        </div>
      )}
    </div>
  );
}
