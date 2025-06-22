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
  const response = await apiClient.get('/comics/categorise');
  // Kiểm tra nếu response.data là object chứa mảng data
  if (response.data && response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  // Nếu response.data là mảng trực tiếp
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // Nếu response là mảng trực tiếp (trường hợp log Array(54))
  if (Array.isArray(response)) {
    return response;
  }
  throw new Error("Dữ liệu API không hợp lệ");
}