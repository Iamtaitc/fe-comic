// fe\app\latest\page.tsx - Fixed Simple Version
"use client";

import { useState, useEffect, useCallback } from "react";
import { getLatestStories } from "@/lib/api/comic/latest";
import { DetailHeader } from "@/components/detail/DetailHeader";
import DetailFilters from "@/components/detail/DetailFilters";
import { DetailStoryList } from "@/components/detail/DetailStoryList";
import { StoryObject } from "@/lib/api/comic/types";

type FilterState = {
  status: "all" | "ongoing" | "completed" | "paused";
  sortBy: "latest" | "popular" | "name" | "rating" | "views";
  sortOrder: "asc" | "desc";
};

export default function LatestPage() {
  const [stories, setStories] = useState<StoryObject[]>([]);
  const [totalStories, setTotalStories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12,
  });

  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    sortBy: "latest",
    sortOrder: "desc",
  });

  const [categoryInfo] = useState({
    title: "Truyện Mới Cập Nhật",
    description:
      "Khám phá những bộ truyện được cập nhật gần đây nhất với các chương mới và nội dung hấp dẫn.",
  });

  // 🔧 Enhanced fetch function
  const fetchStories = useCallback(
    async (pageNum = 1, append = false) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: pageNum,
          limit: 12,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          ...(filters.status !== "all" && { status: filters.status }),
        };

        const response = await getLatestStories(params);
        if (append) {
          setStories((prev) => [...prev, ...response.stories]);
        } else {
          setStories(response.stories);
        }

        setTotalStories(response.totalStories);
        setPagination(response.pagination);

        // Check if we got data
        if (!response.stories || response.stories.length === 0) {
          if (!append) {
            setError(
              "Không có dữ liệu truyện từ API. Vui lòng kiểm tra endpoint."
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải truyện");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // 🔧 Initial fetch
  useEffect(() => {
    fetchStories(1);
  }, []); // Only run once on mount

  // 🔧 Re-fetch when filters change
  useEffect(() => {
    fetchStories(1);
  }, [filters.status, filters.sortBy, filters.sortOrder]); // Re-fetch when filters change

  // 🔧 Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  // 🔧 Handle retry
  const handleRetry = useCallback(() => {
    fetchStories(1);
  }, [fetchStories]);

  // 🔧 Load more handler
  const handleLoadMore = useCallback(async () => {
    const hasNextPage = pagination.page < pagination.pages;
    if (!hasNextPage || loading) {
      return;
    }

    await fetchStories(pagination.page + 1, true);
  }, [pagination.page, pagination.pages, loading, fetchStories]);

  const hasNextPage = pagination.page < pagination.pages;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <DetailHeader
        title={categoryInfo.title}
        description={categoryInfo.description}
        totalStories={totalStories}
        slug="latest"
      />
      <DetailFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalStories={totalStories}
        currentPage={pagination.page}
        totalPages={pagination.pages}
      />

      <DetailStoryList
        stories={stories}
        loading={loading}
        pagination={{
          currentPage: pagination.page,
          totalPages: pagination.pages,
          totalStories: totalStories,
          hasNextPage: hasNextPage,
          limit: pagination.limit,
        }}
        categorySlug="latest"
        filters={filters}
        error={error}
        onRetry={handleRetry}
        infiniteScroll={{
          enabled: true,
          threshold: 0.1,
          rootMargin: "200px",
          loadMoreHandler: handleLoadMore,
        }}
      />

      {/* Enhanced Debug Panel */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 p-3 bg-black/90 text-white text-xs rounded max-w-sm z-50 space-y-1">
          <div>
            <strong>Latest Page Debug:</strong>
          </div>
          <div>Stories: {stories.length}</div>
          <div>Total: {totalStories}</div>
          <div>
            Page: {pagination.page}/{pagination.pages}
          </div>
          <div>Has Next: {hasNextPage ? "Yes" : "No"}</div>
          <div>Loading: {loading ? "Yes" : "No"}</div>
          <div>Error: {error ? "Yes" : "No"}</div>
          <div>Status: {filters.status}</div>
          <div>
            Sort: {filters.sortBy} ({filters.sortOrder})
          </div>
        </div>
      )}
    </div>
  );
}
