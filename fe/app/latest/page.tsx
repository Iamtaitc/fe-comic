// fe\app\latest\page.tsx - Fixed Simple Version
"use client";

import { useState, useEffect, useCallback } from "react";
import { getLatestStories } from "@/lib/api/comic/latest";
import { DetailHeader } from "@/components/detail/DetailHeader";
import DetailFilters from "@/components/detail/DetailFilters";
import { DetailStoryList } from "@/components/detail/DetailStoryList";
import { StoryObject } from "@/lib/api/comic/types";
import { Clock } from "lucide-react";

type FilterState = {
  status: "all" | "ongoing" | "completed" | "paused";
  sortBy: "latest" | "popular" | "name" | "rating" | "views";
  sortOrder: "asc" | "desc";
};

export default function LatestPage() {
  // 🔧 Simple states
  const [stories, setStories] = useState<StoryObject[]>([]);
  const [totalStories, setTotalStories] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12
  });

  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    sortBy: "latest",
    sortOrder: "desc",
  });

  const [categoryInfo] = useState({
    title: "Truyện Mới Cập Nhật",
    description: "Khám phá những bộ truyện được cập nhật gần đây nhất với các chương mới và nội dung hấp dẫn.",
  });

  // 🔧 Debug function to check API response structure
  const debugApiResponse = useCallback(async () => {
    try {
      console.log('🔍 [LatestPage] Testing API endpoint directly...');
      
      // Test direct fetch
      const directResponse = await fetch('http://localhost:3000/api/v1/comics/latest?page=1&limit=12');
      const directData = await directResponse.json();
      
      console.log('📦 [LatestPage] Direct fetch response:', directData);
      console.log('📊 [LatestPage] Response structure:', {
        hasData: !!directData.data,
        hasInnerData: !!directData.data?.data,
        hasStories: !!directData.data?.data?.stories,
        storiesIsArray: Array.isArray(directData.data?.data?.stories),
        storiesLength: directData.data?.data?.stories?.length || 0
      });
      
      // Test với API client
      const apiResponse = await getLatestStories({ page: 1, limit: 12 });
      console.log('🎯 [LatestPage] API client response:', apiResponse);
      
    } catch (error) {
      console.error('❌ [LatestPage] Debug error:', error);
    }
  }, []);

  // 🔧 Enhanced fetch function
  const fetchStories = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 [LatestPage] Fetching stories...');
      
      // First, debug API response
      if (pageNum === 1 && !append) {
        await debugApiResponse();
      }

      const params = {
        page: pageNum,
        limit: 12,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status !== "all" && { status: filters.status })
      };

      console.log('📤 [LatestPage] Request params:', params);
      
      const response = await getLatestStories(params);
      
      console.log('📥 [LatestPage] API response:', response);
      console.log('📊 [LatestPage] Response details:', {
        storiesCount: response.stories?.length || 0,
        totalStories: response.totalStories,
        pagination: response.pagination,
        hasStories: Array.isArray(response.stories) && response.stories.length > 0
      });

      // Handle response
      if (append) {
        setStories(prev => [...prev, ...response.stories]);
      } else {
        setStories(response.stories);
      }
      
      setTotalStories(response.totalStories);
      setPagination(response.pagination);
      
      // Check if we got data
      if (!response.stories || response.stories.length === 0) {
        console.warn('⚠️ [LatestPage] No stories received from API');
        if (!append) {
          setError('Không có dữ liệu truyện từ API. Vui lòng kiểm tra endpoint.');
        }
      }
      
    } catch (err) {
      console.error('❌ [LatestPage] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Lỗi khi tải truyện');
    } finally {
      setLoading(false);
    }
  }, [filters, debugApiResponse]);

  // 🔧 Initial fetch
  useEffect(() => {
    console.log('🎬 [LatestPage] Component mounted, starting initial fetch');
    fetchStories(1);
  }, []); // Only run once on mount

  // 🔧 Re-fetch when filters change
  useEffect(() => {
    console.log('🔄 [LatestPage] Filters changed, re-fetching');
    fetchStories(1);
  }, [filters.status, filters.sortBy, filters.sortOrder]); // Re-fetch when filters change

  // 🔧 Handle filter changes
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    console.log('🎛️ [LatestPage] Filter change:', newFilters);
    setFilters(newFilters);
  }, []);

  // 🔧 Handle retry
  const handleRetry = useCallback(() => {
    console.log('🔄 [LatestPage] Retry clicked');
    fetchStories(1);
  }, [fetchStories]);

  // 🔧 Load more handler
  const handleLoadMore = useCallback(async () => {
    const hasNextPage = pagination.page < pagination.pages;
    if (!hasNextPage || loading) {
      console.log('🚫 [LatestPage] Cannot load more:', { hasNextPage, loading });
      return;
    }

    console.log('📄 [LatestPage] Loading more, page:', pagination.page + 1);
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
        icon={<Clock className="h-8 w-8 text-blue-500" />}
        gradient="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
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
          limit: pagination.limit
        }}
        categorySlug="latest"
        filters={filters}
        error={error}
        onRetry={handleRetry}
        infiniteScroll={{
          enabled: true,
          threshold: 0.1,
          rootMargin: '200px',
          loadMoreHandler: handleLoadMore
        }}
      />

      {/* Enhanced Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 p-3 bg-black/90 text-white text-xs rounded max-w-sm z-50 space-y-1">
          <div><strong>Latest Page Debug:</strong></div>
          <div>Stories: {stories.length}</div>
          <div>Total: {totalStories}</div>
          <div>Page: {pagination.page}/{pagination.pages}</div>
          <div>Has Next: {hasNextPage ? 'Yes' : 'No'}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Error: {error ? 'Yes' : 'No'}</div>
          <div>Status: {filters.status}</div>
          <div>Sort: {filters.sortBy} ({filters.sortOrder})</div>
          
          {/* Debug actions */}
          <div className="pt-2 border-t border-gray-600">
            <button
              onClick={() => fetchStories(1)}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs mr-1"
            >
              Retry
            </button>
            <button
              onClick={debugApiResponse}
              className="px-2 py-1 bg-green-600 text-white rounded text-xs"
            >
              Debug API
            </button>
          </div>
        </div>
      )}
    </div>
  );
}