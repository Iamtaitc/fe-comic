// src/hooks/usePagination.ts
"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
  updateURL?: boolean; // Có cập nhật URL không
  paramName?: string; // Tên parameter trong URL
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  getPageNumbers: () => (number | string)[];
}

export function usePagination({
  initialPage = 1,
  itemsPerPage = 10,
  totalItems = 0,
  updateURL = false,
  paramName = "page",
}: UsePaginationOptions): UsePaginationReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy page từ URL nếu có
  const urlPage = updateURL
    ? parseInt(searchParams.get(paramName) || "1", 10)
    : initialPage;

  const [currentPage, setCurrentPage] = useState(
    Math.max(1, urlPage || initialPage)
  );

  // Tính toán các giá trị
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / itemsPerPage)),
    [totalItems, itemsPerPage]
  );

  const startIndex = useMemo(
    () => (currentPage - 1) * itemsPerPage,
    [currentPage, itemsPerPage]
  );

  const endIndex = useMemo(
    () => Math.min(startIndex + itemsPerPage - 1, totalItems - 1),
    [startIndex, itemsPerPage, totalItems]
  );

  const hasNextPage = useMemo(
    () => currentPage < totalPages,
    [currentPage, totalPages]
  );

  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  // Cập nhật URL khi cần
  const updateURLParams = useCallback(
    (page: number) => {
      if (!updateURL) return;

      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete(paramName);
      } else {
        params.set(paramName, page.toString());
      }

      const newURL = params.toString() ? `?${params.toString()}` : "";
      router.push(newURL, { scroll: false });
    },
    [updateURL, router, searchParams, paramName]
  );

  // Các hàm điều hướng
  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(validPage);
      updateURLParams(validPage);
    },
    [totalPages, updateURLParams]
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [hasNextPage, currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      goToPage(currentPage - 1);
    }
  }, [hasPrevPage, currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  // Tạo danh sách số trang hiển thị
  const getPageNumbers = useCallback((): (number | string)[] => {
    const delta = 2;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= delta + 2) {
        for (let i = 2; i <= Math.min(delta + 3, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > delta + 3) {
          pages.push("...");
        }
      } else if (currentPage >= totalPages - delta - 1) {
        if (totalPages > delta + 3) {
          pages.push("...");
        }
        for (let i = Math.max(totalPages - delta - 2, 2); i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push("...");
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i);
        }
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    getPageNumbers,
  };
}

// src/hooks/useStoriesWithPagination.ts
("use client");

import { useState, useEffect, useCallback } from "react";
import { StoryObject, StoryList } from "@/lib/api/comic";

interface UseStoriesWithPaginationOptions {
  fetcher: (page: number, limit: number) => Promise<StoryList>;
  itemsPerPage?: number;
  cachePages?: boolean;
}

interface UseStoriesWithPaginationReturn {
  stories: StoryObject[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  loadPage: (page: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useStoriesWithPagination({
  fetcher,
  itemsPerPage = 10,
  cachePages = true,
}: UseStoriesWithPaginationOptions): UseStoriesWithPaginationReturn {
  const [stories, setStories] = useState<StoryObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Cache để lưu trữ dữ liệu các trang đã tải
  const [pageCache, setPageCache] = useState<Map<number, StoryObject[]>>(
    new Map()
  );

  const loadPage = useCallback(
    async (page: number) => {
      // Kiểm tra cache trước
      if (cachePages && pageCache.has(page)) {
        setStories(pageCache.get(page) || []);
        setCurrentPage(page);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetcher(page, itemsPerPage);

        if (response.success && response.data) {
          const newStories = response.data.data.stories;
          setStories(newStories);
          setTotalPages(response.data.data.totalPages);
          setTotalItems(response.data.data.totalHits);
          setCurrentPage(page);

          // Cập nhật cache
          if (cachePages) {
            setPageCache((prev) => new Map(prev).set(page, newStories));
          }
        } else {
          throw new Error(response.message || "Failed to fetch stories");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        console.error("Error loading stories:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetcher, itemsPerPage, cachePages, pageCache]
  );

  const refresh = useCallback(async () => {
    // Xóa cache và tải lại trang hiện tại
    setPageCache(new Map());
    await loadPage(currentPage);
  }, [currentPage, loadPage]);

  // Load trang đầu tiên khi component mount
  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    stories,
    loading,
    error,
    totalPages,
    totalItems,
    currentPage,
    hasNextPage,
    hasPrevPage,
    loadPage,
    refresh,
  };
}

// src/utils/pagination.ts
export class PaginationUtils {
  /**
   * Tính toán thông tin phân trang
   */
  static calculatePaginationInfo(
    currentPage: number,
    totalItems: number,
    itemsPerPage: number
  ) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return {
      currentPage: Math.max(1, Math.min(currentPage, totalPages)),
      totalPages,
      totalItems,
      itemsPerPage,
      startItem: totalItems > 0 ? startItem : 0,
      endItem: totalItems > 0 ? endItem : 0,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      isEmpty: totalItems === 0,
    };
  }

  /**
   * Tạo danh sách số trang hiển thị với ellipsis
   */
  static generatePageNumbers(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 7
  ): (number | string)[] {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const delta = Math.floor((maxVisible - 3) / 2); // 3 = first + last + current

    pages.push(1);

    if (currentPage <= delta + 2) {
      // Gần đầu
      for (let i = 2; i <= Math.min(maxVisible - 1, totalPages - 1); i++) {
        pages.push(i);
      }
      if (totalPages > maxVisible - 1) {
        pages.push("...");
      }
    } else if (currentPage >= totalPages - delta - 1) {
      // Gần cuối
      if (totalPages > maxVisible - 1) {
        pages.push("...");
      }
      for (
        let i = Math.max(totalPages - maxVisible + 2, 2);
        i < totalPages;
        i++
      ) {
        pages.push(i);
      }
    } else {
      // Ở giữa
      pages.push("...");
      for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        pages.push(i);
      }
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  /**
   * Validate page number
   */
  static validatePage(page: number, totalPages: number): number {
    if (isNaN(page) || page < 1) return 1;
    if (page > totalPages) return totalPages;
    return Math.floor(page);
  }

  /**
   * Tạo URL với pagination parameters
   */
  static createPaginationURL(
    baseURL: string,
    page: number,
    additionalParams: Record<string, string> = {}
  ): string {
    const url = new URL(baseURL, window.location.origin);

    if (page > 1) {
      url.searchParams.set("page", page.toString());
    }

    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    return url.pathname + url.search;
  }

  /**
   * Tính offset cho database queries
   */
  static calculateOffset(page: number, limit: number): number {
    return Math.max(0, (page - 1) * limit);
  }
}
