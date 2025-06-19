"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../src/store/hooks";
import { fetchHomeData } from "../src/store/slices/homeSlice";
import { HeroSection } from "../src/components/home/hero-section";
import { FeaturedCategories } from "../src/components/home/FeaturedCategories";
import { StoriesSection } from "../src/components/home/StoriesSection";
import TopWeeklyStoriesResponsive from "../src/components/TopWeeklyStories/TopWeeklyStoriesResponsive";
import { Flame, Clock, CheckCircle, Calendar } from "lucide-react";
import {
  getPopularStories,
} from "@/lib/api/comic/popular";
import {
    getOngoingStories,
    getCompletedStories,
    getUpcomingStories,
} from "@/lib/api/comic/status";
import { Skeleton } from "../src/components/ui/skeleton";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../src/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const dispatch = useAppDispatch();
  const { popularStories, categories, loading, error } = useAppSelector(
    (state) => state.home
  );

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  console.log("Redux State:", { popularStories, categories, loading, error });

  if (loading) {
    return (
      <div>
        {/* Hero Skeleton */}
        <div className="relative h-[500px] w-full bg-muted">
          <div className="container relative h-full">
            <div className="flex h-full flex-col justify-end pb-16">
              <div className="max-w-2xl">
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
                <Skeleton className="mt-4 h-12 w-3/4" />
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-6 w-28" />
                </div>
                <div className="mt-6 flex gap-4">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Categories Skeleton */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Skeleton className="h-8 w-48 mx-auto mb-4" />
              <Skeleton className="h-6 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-6 rounded-xl border bg-accent/10">
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Stories Skeleton */}
        {["popular", "ongoing", "completed", "upcoming"].map((section) => (
          <section key={section} className="py-12">
            <div className="container">
              <div className="mb-8 flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-64" />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="manga-card">
                      <div className="manga-cover relative aspect-[2/3]">
                        <Skeleton className="absolute inset-0" />
                      </div>
                      <div className="p-3">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="mt-2 h-4 w-20" />
                        <div className="mt-2 flex gap-1">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            {error}. Vui lòng tải lại trang hoặc thử lại sau.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      {popularStories && popularStories.length > 0 && (
        <HeroSection stories={popularStories} />
      )}

      {/* Featured Categories Section */}
      <FeaturedCategories />

      {/* Stories Sections */}
      <StoriesSection
        fetchStories={(params) => getPopularStories(params || {})}
        title="Truyện nổi bật"
        icon={<Flame />}
        iconMotion="animate-pulse text-red-500"
        iconClass="h-6 w-6 text-red-500"
        link="/"
        titleGradient="bg-gradient-to-r from-red-500 to-white"
      />
      <StoriesSection
        fetchStories={(params) => getOngoingStories(params || {})}
        title="Truyện đang phát hành"
        icon={<Clock />}
        iconMotion="animate-pulse text-blue-500"
        iconClass="h-6 w-6 text-blue-500"
        link="/completed"
        titleGradient="bg-gradient-to-r from-blue-500 to-white"
      />
      <TopWeeklyStoriesResponsive />
      <StoriesSection
        fetchStories={(params) => getCompletedStories(params || {})}
        title="Truyện đã hoàn thành"
        icon={<CheckCircle />}
        iconMotion="animate-pulse text-green-500"
        iconClass="h-6 w-6 text-green-500"
        link="/completed"
        titleGradient="bg-gradient-to-r from-green-500 to-white"
      />
      <StoriesSection
        fetchStories={(params) => getUpcomingStories(params || {})}
        title="Truyện sắp ra mắt"
        icon={<Calendar />}
        iconMotion="animate-pulse text-purple-500"
        iconClass="h-6 w-6 text-purple-500"
        link="/upcoming"
        titleGradient="bg-gradient-to-r from-purple-500 to-white"
      />
    </div>
  );
}
