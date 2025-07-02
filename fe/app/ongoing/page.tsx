// fe\app\ongoing\page.tsx - Fixed và Clean
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOngoingStoriesSection,
  clearSection,
} from "@/store/slices/homeSlice";
import { DetailHeader } from "@/components/detail/DetailHeader";
import DetailFilters from "@/components/detail/DetailFilters";
import { DetailStoryList } from "@/components/detail/DetailStoryList";
import { Clock } from "lucide-react";
import { StoryObject } from "@/lib/api/comic/types";

type FilterState = {
  status: "all" | "ongoing" | "completed" | "paused";
  sortBy: "latest" | "popular" | "name" | "rating" | "views";
  sortOrder: "asc" | "desc";
};

export default function OngoingPage() {
  const dispatch = useAppDispatch();

  // 🔧 Redux state
  const { sections } = useAppSelector((state) => state.home);
  const { stories, loading, error, lastFetched } = sections.ongoing;

  // 🔧 Local state cho filters
  const [filters, setFilters] = useState<FilterState>({
    status: "ongoing", // Default to ongoing vì đây là ongoing page
    sortBy: "latest",
    sortOrder: "desc",
  });

  const [categoryInfo] = useState({
    title: "Truyện đang phát hành",
    description:
      "Những bộ truyện đang được cập nhật thường xuyên với các chương mới liên tục được phát hành.",
  });

  // 🔧 Client-side filtering and sorting
  const filteredAndSortedStories = useMemo(() => {
    let filtered = [...stories];

    // Filter by status - cho phép user filter trong ongoing stories
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
          // Latest = updatedAt desc (mặc định cho ongoing)
          comparison =
            new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime();
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
      hasNextPage: false,
      limit: filteredAndSortedStories.length,
    }),
    [filteredAndSortedStories.length]
  );

  useEffect(() => {
    console.log("[OngoingPage] Component mounted");

    // Clear section trước khi fetch
    dispatch(clearSection("ongoing"));

    // Fetch ongoing stories với limit cao hơn để có đủ data cho filtering
    dispatch(
      fetchOngoingStoriesSection({
        limit: 50, // Tăng limit để có nhiều data cho filter
        force: true,
      })
    );

    return () => {
      console.log("[OngoingPage] Component unmounted");
      dispatch(clearSection("ongoing"));
    };
  }, [dispatch]);

  // 🔧 Handle retry
  const handleRetry = useCallback(() => {
    console.log("[OngoingPage] Retry clicked");
    dispatch(
      fetchOngoingStoriesSection({
        limit: 50,
        force: true,
      })
    );
  }, [dispatch]);

  // 🔧 Handle filter changes - client-side filtering
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    console.log("[OngoingPage] Filter change:", newFilters);
    setFilters(newFilters);
  }, []);

  // 🔧 Debug logs
  console.log("[OngoingPage] Render state:", {
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
        slug="ongoing"
        icon={<Clock className="h-8 w-8 text-blue-500" />}
        gradient="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"
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
        categorySlug="ongoing"
        filters={filters}
        error={error}
        onRetry={handleRetry}
      />

      {/* Debug info - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 p-2 bg-black/80 text-white text-xs rounded max-w-xs z-50">
          <div>
            <strong>Ongoing Debug:</strong>
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
