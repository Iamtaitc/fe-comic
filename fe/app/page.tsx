"use client";

import { useEffect, useCallback, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "../src/store/hooks";
import { 
  fetchHomeData,
  fetchPopularStoriesSection,
  fetchOngoingStoriesSection,
  fetchCompletedStoriesSection,
  fetchUpcomingStoriesSection
} from "../src/store/slices/homeSlice";
import { fetchTopWeeklyStories } from "@/store/slices/categorySlice";
import { HeroSection } from "../src/components/home/hero-section";
import { FeaturedCategories } from "../src/components/home/FeaturedCategories";
import { StoriesSection } from "../src/components/home/StoriesSection";
import TopWeeklyStoriesResponsive from "../src/components/TopWeeklyStories/TopWeeklyStoriesResponsive";
import { Flame, Clock, CheckCircle, Calendar, AlertCircle } from "lucide-react";
import { Skeleton } from "../src/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "../src/components/ui/alert";
import dynamic from "next/dynamic";

// 🎯 Lazy load heavy components
const LazyTopWeeklyStories = dynamic(
  () => import("../src/components/TopWeeklyStories/TopWeeklyStoriesResponsive"),
  {
    loading: () => (
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
    ),
    ssr: false
  }
);

// 🔑 Performance monitoring
const usePerformanceMonitor = (pageName: string) => {
  useEffect(() => {
    if (typeof window === "undefined" || process.env.NODE_ENV !== "development") return;
    
    performance.mark(`${pageName}-start`);
    
    return () => {
      performance.mark(`${pageName}-end`);
      performance.measure(`${pageName}-total`, `${pageName}-start`, `${pageName}-end`);
      
      const entries = performance.getEntriesByName(`${pageName}-total`);
      if (entries.length > 0) {
        console.log(`[${pageName}] Load time: ${entries[0].duration.toFixed(2)}ms`);
      }
    };
  }, [pageName]);
};

// 🎨 Skeleton Components - Memoized
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
          <div className="flex gap-3 md:gap-4 pt-2">
            <Skeleton className="h-9 w-28 md:h-10 md:w-32" />
            <Skeleton className="h-9 w-28 md:h-10 md:w-32" />
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

const StoriesSkeleton = ({ title }: { title: string }) => (
  <section className="py-8 md:py-12">
    <div className="container px-4">
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <h2 className="text-lg md:text-2xl font-bold">{title}</h2>
        <Skeleton className="h-8 md:h-10 w-24 md:w-32" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array(10).fill(0).map((_, i) => (
          <div key={i} className="manga-card">
            <Skeleton className="manga-cover aspect-[3/4] rounded-lg" />
            <div className="p-2 md:p-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-16" />
              <div className="flex gap-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HomePageSkeleton = () => (
  <div>
    <HeroSkeleton />
    <CategoriesSkeleton />
    <StoriesSkeleton title="Đang tải truyện..." />
    <StoriesSkeleton title="Đang tải truyện..." />
    <StoriesSkeleton title="Đang tải truyện..." />
    <StoriesSkeleton title="Đang tải truyện..." />
  </div>
);

export default function Home() {
  const dispatch = useAppDispatch();
  
  // 🔑 Redux selectors - optimized
  const { popularStories, categories, loading, error, lastFetched } = useAppSelector((state) => state.home);
  const sections = useAppSelector((state) => state.home.sections);

  // 🔑 Performance monitoring
  usePerformanceMonitor("HomePage");

  // 🔑 Smart data loading with progressive rendering
  const loadInitialData = useCallback(() => {
    const now = Date.now();
    const cacheTime = 5 * 60 * 1000; // 5 minutes

    // Load critical home data first
    const shouldFetchHome = !lastFetched || now - lastFetched > cacheTime;
    if (shouldFetchHome) {
      console.log("[HomePage] Fetching home data...");
      dispatch(fetchHomeData());
    }

    // Load top weekly stories (independent)
    dispatch(fetchTopWeeklyStories());
  }, [dispatch, lastFetched]);

  // 🔑 Load story sections progressively
  const loadStorySections = useCallback(() => {
    // Load sections one by one to avoid overwhelming the API
    dispatch(fetchPopularStoriesSection({ limit: 10 }));
    
    setTimeout(() => {
      dispatch(fetchOngoingStoriesSection({ limit: 10 }));
    }, 200);
    
    setTimeout(() => {
      dispatch(fetchCompletedStoriesSection({ limit: 10 }));
    }, 400);
    
    setTimeout(() => {
      dispatch(fetchUpcomingStoriesSection({ limit: 10 }));
    }, 600);
  }, [dispatch]);

  // 🎯 Initial load effect
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // 🎯 Load story sections after home data is loaded
  useEffect(() => {
    // Only load sections after home data is available or failed
    if (!loading) {
      loadStorySections();
    }
  }, [loading, loadStorySections]);

  // 🔑 Memoized Redux wrapper functions
  const reduxFetchFunctions = {
    fetchPopularStories: useCallback(() => {
      return dispatch(fetchPopularStoriesSection({ limit: 10 }));
    }, [dispatch]),
    
    fetchOngoingStories: useCallback(() => {
      return dispatch(fetchOngoingStoriesSection({ limit: 10 }));
    }, [dispatch]),
    
    fetchCompletedStories: useCallback(() => {
      return dispatch(fetchCompletedStoriesSection({ limit: 10 }));
    }, [dispatch]),
    
    fetchUpcomingStories: useCallback(() => {
      return dispatch(fetchUpcomingStoriesSection({ limit: 10 }));
    }, [dispatch]),
  };

  // 🔑 Debug Redux state
  if (process.env.NODE_ENV === 'development') {
    console.log("Redux State:", {
      popularStories: popularStories?.length || 0,
      categories: categories?.length || 0,
      loading,
      error,
      lastFetched: lastFetched ? new Date(lastFetched).toLocaleTimeString() : null,
      sections: {
        popular: sections.popular.stories.length,
        ongoing: sections.ongoing.stories.length,
        completed: sections.completed.stories.length,
        upcoming: sections.upcoming.stories.length,
      }
    });
  }

  // 🔑 Loading logic
  const isInitialLoading = loading && !popularStories?.length && !categories?.length;
  const hasData = (popularStories?.length || 0) > 0 || (categories?.length || 0) > 0;

  // 🔑 Show skeleton for initial loading
  if (isInitialLoading) {
    return <HomePageSkeleton />;
  }

  // 🔑 Show error only when no data
  if (error && !hasData) {
    return (
      <div className="container py-8 md:py-12 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            {error}.
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

  return (
    <div>
      {/* Hero Section - only render when data available */}
      {popularStories && popularStories.length > 0 && (
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection stories={popularStories} />
        </Suspense>
      )}

      {/* Featured Categories Section */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <FeaturedCategories />
      </Suspense>

      {/* Stories Sections with Redux integration */}
      <StoriesSection
        sectionKey="popular"
        title="Truyện nổi bật"
        icon={<Flame />}
        iconMotion="animate-pulse text-red-500"
        iconClass="h-5 w-5 md:h-6 md:w-6 text-red-500"
        link="/popular"
        titleGradient="bg-gradient-to-r from-red-500 to-white"
        fetchAction={reduxFetchFunctions.fetchPopularStories}
        limit={10}
        cacheKey="popular_stories"
      />

      <StoriesSection
        sectionKey="ongoing"
        title="Truyện đang phát hành"
        icon={<Clock />}
        iconMotion="animate-pulse text-blue-500"
        iconClass="h-5 w-5 md:h-6 md:w-6 text-blue-500"
        link="/ongoing"
        titleGradient="bg-gradient-to-r from-blue-500 to-white"
        fetchAction={reduxFetchFunctions.fetchOngoingStories}
        limit={10}
        cacheKey="ongoing_stories"
      />

      {/* Lazy load heavy component */}
      <Suspense fallback={<StoriesSkeleton title="Bảng xếp hạng tuần" />}>
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
        fetchAction={reduxFetchFunctions.fetchCompletedStories}
        limit={10}
        cacheKey="completed_stories"
      />

      <StoriesSection
        sectionKey="upcoming"
        title="Truyện sắp ra mắt"
        icon={<Calendar />}
        iconMotion="animate-pulse text-purple-500"
        iconClass="h-5 w-5 md:h-6 md:w-6 text-purple-500"
        link="/upcoming"
        titleGradient="bg-gradient-to-r from-purple-500 to-white"
        fetchAction={reduxFetchFunctions.fetchUpcomingStories}
        limit={10}
        cacheKey="upcoming_stories"
      />

      {/* Global loading indicator */}
      {(loading || Object.values(sections).some(s => s.loading)) && hasData && (
        <div className="container py-6 px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm md:text-base text-muted-foreground">
              Đang tải thêm nội dung...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}