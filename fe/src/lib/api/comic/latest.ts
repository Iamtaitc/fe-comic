// lib/api/comic/latest.ts - Robust Version với multiple paths
import { apiClient } from "../client";
import { StoryObject } from "./types";

export interface LatestStoriesParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface LatestStoriesResponse {
  stories: StoryObject[];
  totalStories: number;
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}

// 🎯 Robust API Function với multiple extraction paths
export async function getLatestStories(
  params: LatestStoriesParams = {}
): Promise<LatestStoriesResponse> {
  try {
    const response = (await apiClient.get("/comics/latest", {
      params: {
        page: params.page || 1,
        limit: params.limit || 12,
        ...params,
      },
    })) as {
      success: boolean;
      message?: string;
      data?: {
        stories?: StoryObject[];
        totalStories?: number;
        pagination?: {
          page: number;
          pages: number;
          total: number;
          limit: number;
        };
        [key: string]: any;
      };
      stories?: StoryObject[];
      totalStories?: number;
      pagination?: {
        page: number;
        pages: number;
        total: number;
        limit: number;
      };
      [key: string]: any;
    };

    // 🔧 Check API success
    if (!response.success) {
      throw new Error(`API Error: ${response.message || "Unknown error"}`);
    }

    // 🎯 Try multiple extraction paths
    let stories: StoryObject[] = [];
    let totalStories = 0;
    let pagination = {
      page: params.page || 1,
      pages: 1,
      total: 0,
      limit: params.limit || 12,
    };

    // Extraction paths ordered by likelihood
    const extractionPaths = [
      // Path 1: Direct data (most likely based on console log)
      {
        name: "response.data",
        stories: response.data?.stories,
        totalStories: response.data?.totalStories,
        pagination: response.data?.pagination,
      },
      // Path 2: Nested data (in case structure changes)
      {
        name: "response.data.data",
        stories: response.data?.data?.stories,
        totalStories: response.data?.data?.totalStories,
        pagination: response.data?.data?.pagination,
      },
      // Path 3: Direct response (fallback)
      {
        name: "response",
        stories: response.stories,
        totalStories: response.totalStories,
        pagination: response.pagination,
      },
    ];

    // Try each path until we find valid data
    for (const path of extractionPaths) {
      if (Array.isArray(path.stories) && path.stories.length > 0) {
        stories = path.stories;
        totalStories = path.totalStories || stories.length;

        if (path.pagination && typeof path.pagination === "object") {
          pagination = {
            page: path.pagination.page || params.page || 1,
            pages: path.pagination.pages || 1,
            total: path.pagination.total || totalStories,
            limit: path.pagination.limit || params.limit || 12,
          };
        } else {
          pagination.total = totalStories;
          pagination.pages = Math.ceil(totalStories / pagination.limit);
        }

        break;
      }
    }

    const result = {
      stories,
      totalStories,
      pagination,
    };
    return result;
  } catch (error) {
    throw error;
  }
}
