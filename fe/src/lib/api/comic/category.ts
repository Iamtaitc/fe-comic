import { apiClient } from '../client';
import { CategoryObject, StoryObject } from './types';

export interface CategoryStoriesResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    status: number;
    message: string;
    data: {
      category: {
        id: string;
        name: string;
        slug: string;
      };
      stories: StoryObject[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    };
  };
  pagination: {
    totalItems: string;
    totalPages: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}

export async function getStoriesByCategory(
  slug: string,
  params: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}
): Promise<CategoryStoriesResponse> {
  return apiClient.get(`/comics/category/${slug}`, { params });
}

export async function getCategory(): Promise<CategoryObject[]> {
  return apiClient.get('/comics/categorise');
}