// app/page.tsx - Performance Optimized
"use client";

import { useEffect, useCallback, Suspense, useMemo, lazy, useState } from "react";
import { useAppDispatch, useAppSelector } from "../src/store/hooks";
import {
  fetchHomeData,
  fetchPopularStoriesSection,
  fetchOngoingStoriesSection,
  fetchCompletedStoriesSection,
  fetchUpcomingStoriesSection,
  prefetchAllSections,
  selectPopularStories,
  selectCategories,
  selectSectionState,
} from "../src/store/slices/homeSlice";
import { fetchTopWeeklyStories } from "@/store/slices/categorySlice";
import { HeroSection } from "../src/components/home/hero-section";
import { FeaturedCategories } from "../src/components/home/FeaturedCategories";
import { StoriesSection } from "../src/components/home/StoriesSection";
import { Flame, Clock, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../src/components/ui/alert";

// ============================================
// 🎯 LAZY LOADED COMPONENTS
// ============================================

// 🔑 Critical above-the-fold components loaded immediately
const HeroSkeleton = () => (
  <div className="relative h-[400px] md:h-[500px] w-full bg-muted animate-pulse">
    <div className="container relative h-full">
      <div className="flex h-full flex-col justify-end pb-12 md:pb-16">
        <div className="max-w-2xl space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-5 w-16 md:h-6 md:w-20 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-8 md:h-12 w-full max-w-lg" />
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <Skeleton className="h-5 w-24 md:h-6 md:w-28" />
            <Skeleton className="h-5 w-24 md:h-6 md:w-28" />
            <Skeleton className="h-5 w-24 md:h-6 md:w-28" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CategoriesSkeleton = () => (
  <section className="py-12 md:py-16">
    <div className="container px-4">
      <div className="text-center mb-8 md:mb-12">
        <Skeleton className="h-6 md:h-8 w-40 md:w-48 mx-auto mb-3 md:mb-4" />
        <Skeleton className="h-4 md:h-6 w-80 md:w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="p-4 md:p-6 rounded-xl border bg-accent/10">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-10 md:h-12 w-10 md:w-12 rounded-lg" />
              <Skeleton className="h-5 md:h-6 w-16 md:w-20" />
            </div>
            <Skeleton className="h-5 md:h-6 w-20 md:w-24 mb-2" />
            <Skeleton className="h-3 md:h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 🔑 Below-the-fold components lazy loaded
const LazyTopWeeklyStories = lazy(() => 
  import("../src/components/TopWeeklyStories/TopWeeklyStoriesResponsive").then(
    module => ({ default: module.default }),
    error => {
      console.warn('Failed to load TopWeeklyStories:', error);
      return { default: () => null }; // Fallback to empty component
    }
  )
);

// ============================================
// 🎯 PERFORMANCE HOOKS
// ============================================

// 🔑 Performance monitoring
const usePerformanceMonitor = (pageName: string) => {
  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return;

    const startTime = performance.now();
    performance.mark(`${pageName}-start`);
    
    return () => {
      performance.mark(`${pageName}-end`);
      performance.measure(`${pageName}-total`, `${pageName}-start`, `${pageName}-end`);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log(`🚀 [${pageName}] Performance:`, {
        totalTime: `${totalTime.toFixed(2)}ms`,
        renderTime: `${(performance.getEntriesByName(`${pageName}-total`)[0]?.duration || 0).toFixed(2)}ms`,
        isSlowRender: totalTime > 1000
      });
    };
  }, [pageName]);
};

// 🔑 Intersection observer for progressive loading
const useProgressiveLoading = () => {
  const [shouldLoadBelow, setShouldLoadBelow] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadBelow(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '300px' }
    );

    // Observe the hero section bottom
    const heroElement = document.querySelector('[data-hero-end]');
    if (heroElement) {
      observer.observe(heroElement);
    }

    return () => observer.disconnect();
  }, []);

  return shouldLoadBelow;
};

// 🔑 Smart prefetching based on user behavior
const useSmartPrefetch = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    let prefetchTimer: NodeJS.Timeout;
    let interactionTimer: NodeJS.Timeout;
    let hasInteracted = false;

    const handleUserInteraction = () => {
      if (!hasInteracted) {
        hasInteracted = true;
        clearTimeout(interactionTimer);
        
        // Start prefetching after user shows engagement
        prefetchTimer = setTimeout(() => {
          dispatch(prefetchAllSections());
        }, 500);
      }
    };

    // Fallback prefetch if no interaction within 3 seconds
    interactionTimer = setTimeout(() => {
      dispatch(prefetchAllSections());
    }, 3000);

    // Listen for user interactions
    const events = ['mouseenter', 'scroll', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
    });

    return () => {
      clearTimeout(prefetchTimer);
      clearTimeout(interactionTimer);
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [dispatch]);
};

// ============================================
// 🎯 MAIN COMPONENT
// ============================================

export default function Home() {
  const dispatch = useAppDispatch();

  // 🔑 Optimized selectors
  const popularStories = useAppSelector(selectPopularStories);
  const categories = useAppSelector(selectCategories);
  const { loading, error, lastFetched } = useAppSelector((state) => state.home);

  // Performance hooks
  usePerformanceMonitor("HomePage");
  const shouldLoadBelow = useProgressiveLoading();
  useSmartPrefetch();

  // 🔑 Memoized data loading
  const loadInitialData = useCallback(() => {
    const now = Date.now();
    const cacheTime = 5 * 60 * 1000;

    const shouldFetchHome = !lastFetched || now - lastFetched > cacheTime;
    
    if (shouldFetchHome) {
      // Fetch critical data first
      dispatch(fetchHomeData({ force: false }));
    }

    // Always fetch weekly stories as they change frequently
    dispatch(fetchTopWeeklyStories());
  }, [dispatch, lastFetched]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 🔑 Memoized render conditions
  const renderState = useMemo(() => {
    const isInitialLoading = loading && !popularStories?.length && !categories?.length;
    const hasData = (popularStories?.length || 0) > 0 || (categories?.length || 0) > 0;
    
    return {
      isInitialLoading,
      hasData,
      showError: error && !hasData
    };
  }, [loading, popularStories?.length, categories?.length, error]);

  const { isInitialLoading, hasData, showError } = renderState;

  // 🔑 Early returns for loading/error states
  if (isInitialLoading) {
    return (
      <div>
        <HeroSkeleton />
        <CategoriesSkeleton />
        <div className="py-8">
          <div className="container px-4">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="manga-card">
                  <Skeleton className="aspect-[3/4] rounded-lg" />
                  <div className="p-2 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="container py-8 md:py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            {error}
            <button
              onClick={loadInitialData}
              className="ml-2 underline hover:no-underline text-white hover:text-gray-200 transition-colors"
            >
              Thử lại
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ============================================
  // 🎯 MAIN RENDER
  // ============================================

  return (
    <div>
      {/* 🔑 Above-the-fold content - Highest priority */}
      {popularStories && popularStories.length > 0 && (
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection stories={popularStories} />
          <div data-hero-end aria-hidden="true" />
        </Suspense>
      )}

      <Suspense fallback={<CategoriesSkeleton />}>
        <FeaturedCategories />
      </Suspense>

      {/* 🔑 Critical first section - Load immediately */}
      <StoriesSection
        sectionKey="popular"
        title="Truyện nổi bật"
        icon={<Flame />}
        iconMotion="animate-pulse text-red-500"
        iconClass="h-5 w-5 md:h-6 md:w-6 text-red-500"
        link="/popular"
        titleGradient="bg-gradient-to-r from-red-500 to-white"
        fetchAction={fetchPopularStoriesSection}
        limit={10}
        priority={true}
      />

      {/* 🔑 Progressive loading for below-the-fold content */}
      {shouldLoadBelow && (
        <>
          <StoriesSection
            sectionKey="ongoing"
            title="Truyện đang phát hành"
            icon={<Clock />}
            iconMotion="animate-pulse text-blue-500"
            iconClass="h-5 w-5 md:h-6 md:w-6 text-blue-500"
            link="/ongoing"
            titleGradient="bg-gradient-to-r from-blue-500 to-white"
            fetchAction={fetchOngoingStoriesSection}
            limit={10}
          />

          <Suspense 
            fallback={
              <section className="py-12">
                <div className="container">
                  <Skeleton className="h-8 w-48 mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(6).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-32 rounded-lg" />
                    ))}
                  </div>
                </div>
              </section>
            }
          >
            <LazyTopWeeklyStories stories={[]} deviceType="mobile" />
          </Suspense>

          <StoriesSection
            sectionKey="completed"
            title="Truyện đã hoàn thành"
            icon={<CheckCircle />}
            iconMotion="animate-pulse text-green-500"
            iconClass="h-5 w-5 md:h-6 md:w-6 text-green-500"
            link="/completed"
            titleGradient="bg-gradient-to-r from-green-500 to-white"
            fetchAction={fetchCompletedStoriesSection}
            limit={10}
          />

          <StoriesSection
            sectionKey="upcoming"
            title="Truyện sắp ra mắt"
            icon={<Calendar />}
            iconMotion="animate-pulse text-purple-500"
            iconClass="h-5 w-5 md:h-6 md:w-6 text-purple-500"
            link="/upcoming"
            titleGradient="bg-gradient-to-r from-purple-500 to-white"
            fetchAction={fetchUpcomingStoriesSection}
            limit={10}
          />
        </>
      )}

      {/* 🔑 Loading indicator for background operations */}
      {loading && hasData && (
        <div className="container py-6 px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm md:text-base text-muted-foreground">
              Đang cập nhật nội dung...
            </span>
          </div>
        </div>
      )}

      {/* 🔑 Performance debug panel - Development only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 max-w-xs rounded-lg bg-black/80 p-3 text-xs text-white z-50">
          <h3 className="font-bold text-green-400">Performance</h3>
          <div className="mt-1 space-y-1">
            <div>Popular: {popularStories?.length || 0}</div>
            <div>Categories: {categories?.length || 0}</div>
            <div>Progressive: {shouldLoadBelow ? '✅' : '⏳'}</div>
            <div>Cache: {lastFetched ? '✅' : '❌'}</div>
          </div>
        </div>
      )}
    </div>
  );
}