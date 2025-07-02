// lib/hooks/useHomeData.ts
"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchHomeData,
  fetchPopularStoriesSection,
  fetchOngoingStoriesSection, 
  fetchCompletedStoriesSection,
  fetchUpcomingStoriesSection
} from "@/store/slices/homeSlice";
import { fetchTopWeeklyStories } from "@/store/slices/categorySlice";
import { CACHE_TIME } from "@/lib/api/comic/types";

export const useHomeData = () => {
  const dispatch = useAppDispatch();
  
  const homeState = useAppSelector((state) => state.home);
  const { 
    popularStories, 
    categories, 
    loading, 
    error, 
    lastFetched, 
    sections 
  } = homeState;

  // Auto-fetch home data
  const loadInitialData = useCallback(() => {
    const now = Date.now();
    const shouldFetchHome = !lastFetched || now - lastFetched > CACHE_TIME;
    
    if (shouldFetchHome) {
      dispatch(fetchHomeData());
    }
    
    dispatch(fetchTopWeeklyStories());
  }, [dispatch, lastFetched]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Section actions
  const sectionActions = {
    popular: fetchPopularStoriesSection,
    ongoing: fetchOngoingStoriesSection,
    completed: fetchCompletedStoriesSection,
    upcoming: fetchUpcomingStoriesSection
  };

  // Loading states
  const isInitialLoading = loading && !popularStories?.length && !categories?.length;
  const hasData = (popularStories?.length || 0) > 0 || (categories?.length || 0) > 0;
  const isAnyLoading = loading || Object.values(sections).some(s => s.loading);

  return {
    // Data
    popularStories,
    categories,
    sections,
    
    // States
    loading,
    error,
    isInitialLoading,
    hasData,
    isAnyLoading,
    
    // Actions
    loadInitialData,
    sectionActions,
    
    // Utils
    lastFetched
  };
};