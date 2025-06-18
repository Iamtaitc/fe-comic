// src/hooks/useLatestStories.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { StoryObject, StoryList, getLatestStories } from "@/lib/api/comic";
import { FilterOptions } from "@/components/latest/LatestStoriesContainer";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStories: number;
  hasNextPage: boolean;
  limit: number;
}

interface UseLatestStoriesReturn {
  stories: StoryObject[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  loadMore: () => Promise<void>;
}

export function useLatestStories(filters: FilterOptions): UseLatestStoriesReturn {
  const [stories, setStories] = useState<StoryObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalStories: 0,
    hasNextPage: false,
    limit: 18,
  });

  // Fetch stories function
  const fetchStories = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page,
          limit: pagination.limit,
          category: filters.category,
          status: filters.status,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        };

        // Gọi API getLatestStories
        const response: StoryList = await getLatestStories(params);

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch stories");
        }

        const { stories: newStories, totalHits, totalPages, currentPage } =
          response.data.data;

        if (append) {
          setStories((prev) => [...prev, ...newStories]);
        } else {
          setStories(newStories);
        }

        setPagination({
          currentPage,
          totalPages,
          totalStories: totalHits,
          hasNextPage: currentPage < totalPages,
          limit: pagination.limit,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  // Load more function
  const loadMore = useCallback(async () => {
    if (pagination.hasNextPage && !loading) {
      await fetchStories(pagination.currentPage + 1, true);
    }
  }, [fetchStories, pagination.hasNextPage, pagination.currentPage, loading]);

  // Initial load and filter changes
  useEffect(() => {
    fetchStories(1, false);
  }, [
    fetchStories,
    filters.category,
    filters.status,
    filters.sortBy,
    filters.sortOrder,
  ]);

  return {
    stories,
    loading,
    error,
    pagination,
    loadMore,
  };
}