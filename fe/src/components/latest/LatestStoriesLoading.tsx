// src/components/latest/LatestStoriesLoading.tsx
"use client";

import { StoryCardSkeleton } from "./StoryCardSkeleton";

export function LatestStoriesLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-64 animate-pulse" />
        <div className="h-4 bg-muted rounded w-96 animate-pulse" />
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-4 p-4 bg-card rounded-lg border">
        <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        <div className="h-10 bg-muted rounded w-40 animate-pulse" />
        <div className="h-10 bg-muted rounded w-36 animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <StoryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}