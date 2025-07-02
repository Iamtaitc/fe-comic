// 🏷️ lib/api/comic/types.ts
// Simple & Optimized Types

// ============================================
// 🎯 CORE ENTITIES
// ============================================

export interface CategoryObject {
  _id: string;
  name: string;
  slug: string;
  storyCount?: number;
}

export interface StoryObject {
  _id: string;
  name: string;
  slug: string;
  status: string;
  thumb_url: string;
  category: CategoryObject[];
  views?: number;
  ratingValue: number;
  ratingCount: number;
  description?: string;
  updatedAt?: string;
  weeklyViewCount?: number;
}

export interface ChapterObject {
  _id: string;
  name: string;
  slug: string;
  chapterNumber: number;
  storyId: string;
  images?: string[];
  updatedAt?: string;
}

// ============================================
// 🎯 API RESPONSES
// ============================================

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// 🔑 Response sau khi qua apiClient.get()
export interface StoryListResponse {
  stories: StoryObject[];
  totalStories?: number;
  pagination?: Pagination;
}

export interface HomeDataResponse {
  popularStorys?: {
    data: {
      stories: StoryObject[];
    };
  };
  categories?: CategoryObject[];
}

// ============================================
// 🎯 REQUEST PARAMS
// ============================================

export interface ListParams {
  page?: number;
  limit?: number;
}

// ============================================
// 🎯 REDUX STATE
// ============================================

export interface StorySection {
  stories: StoryObject[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

export interface HomeState {
  popularStories: StoryObject[];
  categories: CategoryObject[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  sections: {
    popular: StorySection;
    ongoing: StorySection;
    completed: StorySection;
    upcoming: StorySection;
  };
}

// ============================================
// 🎯 CONSTANTS
// ============================================

export const STORY_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  UPCOMING: "upcoming",
} as const;

export const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// ============================================
// 🎯 TYPE GUARDS
// ============================================

export const isStoryObject = (obj: unknown): obj is StoryObject => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as StoryObject)._id === "string" &&
    typeof (obj as StoryObject).name === "string"
  );
};

export const isValidStoryArray = (arr: unknown): arr is StoryObject[] => {
  return Array.isArray(arr) && arr.every(isStoryObject);
};
