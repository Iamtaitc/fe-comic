export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalStories: number;
  hasNextPage: boolean;
  limit: number;
}

export interface FilterInfo {
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface InfiniteScrollConfig {
  enabled: boolean;
  threshold: number;
  rootMargin: string;
  loadMoreHandler?: () => Promise<void>;
}

export interface DetailStoryListProps {
  stories: StoryObject[];
  loading: boolean;
  pagination: PaginationInfo;
  categorySlug: string;
  filters: FilterInfo;
  error?: string | null;
  onRetry?: () => void;
  infiniteScroll?: InfiniteScrollConfig;
}
export interface StoryObject {
  _id: string;
  name: string;
  slug: string;
  status: string;
  thumb_url: string;
  views?: number;
  ratingValue: number;
  ratingCount: number;
  description?: string;
  updatedAt?: string;
  weeklyViewCount?: number;
}
