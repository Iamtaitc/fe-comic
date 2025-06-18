// src/components/story/StoryCardSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function StoryCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <div className="aspect-[2/3] relative">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

// src/components/story/StoryGrid.tsx
import { Suspense } from 'react';
import StoryCard from './StoryCard';
import StoryCardSkeleton from './StoryCardSkeleton';

// Wrapper component cho async data fetching
const StoryGridContent = async ({ categorySlug }) => {
  // Fetch data
  const stories = await getStoriesByCategory(categorySlug);
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {stories.map((story, index) => (
        <StoryCard key={story._id} story={story} index={index} />
      ))}
    </div>
  );
};

// Component mà parent sẽ sử dụng
export default function StoryGrid({ categorySlug }) {
  return (
    <Suspense fallback={<StoryGridSkeleton />}>
      <StoryGridContent categorySlug={categorySlug} />
    </Suspense>
  );
}

function StoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array(12).fill(0).map((_, i) => (
        <StoryCardSkeleton key={i} />
      ))}
    </div>
  );
}