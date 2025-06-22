export interface CategoryObject {
  id: string;
  _id: string;
  name: string;
  slug: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isActive?: boolean;
  storyCount?: number;
  description?: string;
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

export interface StoryList {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    status: number;
    message: string;
    data: {
      stories: StoryObject[];
      pagination?: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    };
  };
  pagination?: {
    totalItems: string;
    totalPages: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}