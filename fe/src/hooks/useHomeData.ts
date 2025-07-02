// lib/hooks/useHomeData.ts - Enhanced with Cache Manager
"use client";

import { useEffect, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchHomeData,
  fetchPopularStoriesSection,
  fetchOngoingStoriesSection,
  fetchCompletedStoriesSection,
  fetchUpcomingStoriesSection,
} from "@/store/slices/homeSlice";
import { fetchTopWeeklyStories } from "@/store/slices/categorySlice";
import { useCacheManager } from "./useCacheManager";

interface UseHomeDataOptions {
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  debugMode?: boolean;
}

export const useHomeData = (options: UseHomeDataOptions = {}) => {
  const {
    enableAutoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    debugMode = false,
  } = options;

  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const homeState = useAppSelector((state) => state.home);
  const { popularStories, categories, loading, error, lastFetched, sections } =
    homeState;

  // 🔑 Initialize cache manager
  const cacheManager = useCacheManager({
    enableLocalStorage: true,
    enableMemoryCache: true,
    debugMode,
  });

  // 🔑 Section actions mapping
  const sectionActions = {
    popular: fetchPopularStoriesSection,
    ongoing: fetchOngoingStoriesSection,
    completed: fetchCompletedStoriesSection,
    upcoming: fetchUpcomingStoriesSection,
  };

  // 🔑 Check if we need initial data fetch
  const needsInitialFetch = useCallback(() => {
    // Check if we have any cached data
    const hasHomeData = popularStories?.length > 0 || categories?.length > 0;
    const hasSectionData = Object.values(sections).some(
      (section) => section.stories.length > 0
    );

    if (hasHomeData || hasSectionData) {
      debugMode &&
        console.log("🏠 [HomeData] Already have data, skipping initial fetch");
      return false;
    }

    // Check cache
    const shouldFetchHome = cacheManager.shouldFetch("HOME_DATA");
    const shouldFetchSections = cacheManager.shouldFetch("STORIES_SECTIONS");

    return shouldFetchHome || shouldFetchSections;
  }, [popularStories, categories, sections, cacheManager, debugMode]);

  // 🔑 Load initial data with smart caching
  const loadInitialData = useCallback(
    async (force = false) => {
      try {
        setGlobalError(null);
        debugMode &&
          console.log("🏠 [HomeData] Loading initial data...", { force });

        const promises: Promise<any>[] = [];

        // Fetch home data if needed
        if (force || cacheManager.shouldFetch("HOME_DATA")) {
          debugMode && console.log("🏠 [HomeData] Fetching home data...");
          promises.push(dispatch(fetchHomeData()));
        }

        // Fetch weekly stories if needed
        if (force || cacheManager.shouldFetch("WEEKLY_STORIES")) {
          debugMode && console.log("🏠 [HomeData] Fetching weekly stories...");
          promises.push(dispatch(fetchTopWeeklyStories()));
        }

        // Wait for initial data before proceeding
        if (promises.length > 0) {
          await Promise.allSettled(promises);
        }

        // Mark sections for loading (they will self-manage their cache)
        debugMode &&
          console.log("🏠 [HomeData] Initial data loading completed");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Không thể tải dữ liệu";
        setGlobalError(errorMessage);
        debugMode && console.error("🏠 [HomeData] Load error:", err);
      } finally {
        setIsInitializing(false);
      }
    },
    [dispatch, cacheManager, debugMode]
  );

  // 🔑 Force refresh all data
  const refreshAllData = useCallback(async () => {
    debugMode && console.log("🔄 [HomeData] Force refreshing all data...");

    // Clear relevant cache
    cacheManager.clearCache();

    // Force reload
    await loadInitialData(true);

    // Trigger section refreshes
    Object.entries(sectionActions).forEach(([key, action]) => {
      dispatch(action({ force: true, limit: 10 }));
    });
  }, [loadInitialData, cacheManager, dispatch, sectionActions, debugMode]);

  // 🔑 Auto refresh functionality
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastFetch = lastFetched ? now - lastFetched : Infinity;

      if (timeSinceLastFetch > refreshInterval) {
        debugMode && console.log("⏰ [HomeData] Auto refresh triggered");
        loadInitialData(false); // Don't force, respect cache
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [
    enableAutoRefresh,
    refreshInterval,
    lastFetched,
    loadInitialData,
    debugMode,
  ]);

  // 🔑 Initialize on mount
  useEffect(() => {
    if (needsInitialFetch()) {
      loadInitialData(false);
    } else {
      setIsInitializing(false);
    }
  }, [loadInitialData, needsInitialFetch]);

  // 🔑 Loading states
  const isInitialLoading =
    isInitializing ||
    (loading && !popularStories?.length && !categories?.length);
  const hasData =
    (popularStories?.length || 0) > 0 || (categories?.length || 0) > 0;
  const isAnyLoading =
    loading || Object.values(sections).some((s) => s.loading);
  const hasAnyData =
    hasData || Object.values(sections).some((s) => s.stories.length > 0);

  // 🔑 Combined error state
  const combinedError = globalError || error;

  // 🔑 Cache status for debugging
  const cacheStatus = cacheManager.getCacheStatus();

  // 🔑 Manual section refresh
  const refreshSection = useCallback(
    (sectionKey: keyof typeof sectionActions) => {
      debugMode &&
        console.log(`🔄 [HomeData] Refreshing section: ${sectionKey}`);
      const action = sectionActions[sectionKey];
      dispatch(action({ force: true, limit: 10 }));
    },
    [dispatch, sectionActions, debugMode]
  );

  return {
    // Data
    popularStories,
    categories,
    sections,

    // Loading states
    loading,
    isInitialLoading,
    isInitializing,
    hasData,
    hasAnyData,
    isAnyLoading,

    // Error states
    error: combinedError,
    globalError,

    // Actions
    loadInitialData,
    refreshAllData,
    refreshSection,
    sectionActions,

    // Cache info
    lastFetched,
    cacheStatus,

    // Utils
    clearCache: cacheManager.clearCache,

    // Debug info
    debugInfo: debugMode
      ? {
          cacheStatus,
          needsInitialFetch: needsInitialFetch(),
          sectionsState: Object.entries(sections).reduce(
            (acc, [key, section]) => {
              acc[key] = {
                storiesCount: section.stories.length,
                loading: section.loading,
                error: !!section.error,
                lastFetched: section.lastFetched
                  ? new Date(section.lastFetched).toISOString()
                  : null,
              };
              return acc;
            },
            {} as Record<string, any>
          ),
        }
      : undefined,
  };
};
