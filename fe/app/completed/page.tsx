// fe\app\completed\page.tsx - useState Pattern like Popular
"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompletedStories } from "@/lib/api/comic/status";
import { DetailHeader } from "@/components/detail/DetailHeader";
import DetailFilters from "@/components/detail/DetailFilters";
import { DetailStoryList } from "@/components/detail/DetailStoryList";
import { StoryObject } from "@/lib/api/comic/types";

type FilterState = {
  status: "all" | "ongoing" | "completed" | "paused";
  sortBy: "latest" | "popular" | "name" | "rating" | "views";
  sortOrder: "asc" | "desc";
};

export default function CompletedPage() {
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
    status: "completed",
    sortBy: "latest",
    sortOrder: "desc",
  });

  // 🔧 Compact data extraction
  const extractResponseData = (response: any) => {
    const data = response?.data?.data || response?.data || response;
    return {
      stories: data.stories || [],
      totalStories: data.totalStories || 0,
      pagination: data.pagination || { page: 1, pages: 1, total: 0, limit: 12 },
    };
  };

  // 🔧 Main fetch function
  const fetchStories = useCallback(
    async (pageNum = 1, append = false) => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: pageNum,
          limit: pagination.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          ...(filters.status !== "all" && { status: filters.status }),
        };

        const response = await getCompletedStories(params);
        const { stories: newStories, totalStories: total, pagination: pag } = extractResponseData(response);

        setStories(prev => append ? [...prev, ...newStories] : newStories);
        setTotalStories(total);
        setPagination(pag);

        if (!newStories.length && !append) {
          setError("Không có dữ liệu truyện từ API.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải truyện");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  // 🔧 Effects
  useEffect(() => {
    fetchStories(1);
  }, []);
  useEffect(() => {
    fetchStories(1);
  }, [filters.status, filters.sortBy, filters.sortOrder]);

  // 🔧 Handlers
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleRetry = useCallback(() => fetchStories(1), [fetchStories]);

  const handleLoadMore = useCallback(async () => {
    const hasNextPage = pagination.page < pagination.pages;
    if (hasNextPage && !loading) {
      await fetchStories(pagination.page + 1, true);
    }
  }, [pagination.page, pagination.pages, loading, fetchStories]);

  const hasNextPage = pagination.page < pagination.pages;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      <DetailHeader
        title="Truyện Đã Hoàn Thành"
        description="Những bộ truyện đã kết thúc hoàn chỉnh, sẵn sàng để bạn thưởng thức trọn vẹn từ đầu đến cuối."
        totalStories={totalStories}
        slug="completed"
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
        categorySlug="completed"
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

      {/* Debug Panel */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-4 p-3 bg-black/90 text-white text-xs rounded max-w-sm z-50 space-y-1">
          <div><strong>Completed:</strong> {stories.length}/{totalStories}</div>
          <div>Page: {pagination.page}/{pagination.pages}</div>
          <div>Status: {loading ? "Loading" : error ? "Error" : "Ready"}</div>
        </div>
      )}
    </div>
  );
}