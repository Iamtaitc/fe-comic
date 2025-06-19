// src/lib/api/comic.ts
import { apiClient } from "./client";
//done
export interface CategoryObject {
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
//done
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
//done
export interface HomeDataResponse {
  success: boolean;
  message: string;
  data: {
    popularStorys: {
      success: boolean;
      status: number;
      message: string;
      data: {
        stories: StoryObject[];
      };
    };
    categories: CategoryObject[];
  };
}
//done
// Updated interface cho category stories response
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
//done
export interface StoryList {
  success: boolean;
  message: string;
  data: {
    data: {
      stories: StoryObject[];
      totalHits: number;
      totalPages: number;
      currentPage: number;
    };
  };
}
//done
export interface StoryDetail {
  success: boolean;
  message: string;
  data: {
    story: StoryObject;
    chapters: {
      _id: string;
      name: string;
      slug: string;
      thumb_url: string;
      createdAt: string;
      updatedAt: string;
      deletedAt?: string | null;
    }[];
  };
}
//done
export interface ChapterDetail {
  success: boolean;
  message: string;
  data: {
    story: StoryObject;
    chapter: {
      _id: string;
      name: string;
      slug: string;
      thumb_url: string;
      createdAt: string;
      updatedAt: string;
      deletedAt?: string | null;
    };
    pages: {
      _id: string;
      url: string;
    }[];
  };
}
//done
export interface UserHistoryResponse {
  success: boolean;
  data: {
    data: {
      stories: StoryObject[];
      totalCount: number;
    };
  };
}
//done
export interface SavedStoriesResponse {
  success: boolean;
  data: {
    data: {
      stories: StoryObject[];
      totalCount: number;
    };
  };
}

export interface GenreStoriesResponse {
  success: boolean;
  data: {
    data: {
      stories: StoryObject[];
      totalCount: number;
      genre: string;
    };
  };
}
//done
// Lấy dữ liệu trang chủ
export async function getHomeData(): Promise<HomeDataResponse> {
  return apiClient.get("/home");
}
//done
// Lấy danh sách truyện mới nhất
export async function getLatestStories(params: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<StoryList> {
  return apiClient.get("/comics/latest", { params });
}
//done
// lấy danh sách thể loại truyện
export async function getCategory(): Promise<CategoryObject[]> {
  return apiClient.get("/comics/categorise");
}
//done
// lấy danh sách truyện top tuần
export async function getTopWeeklyStories(): Promise<StoryList> {
  return apiClient.get("/comics/top-weekly");
}

// Lấy danh sách truyện phổ biến
export async function getPopularStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryList> {
  return apiClient.get("/comics/popular", { params });
}
//done
// Updated function - Lấy danh sách truyện theo danh mục
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
//done
// Tìm kiếm truyện
export async function searchStories(query: string): Promise<StoryList> {
  return apiClient.get("/comics/search", {
    params: { keyword: query },
  });
}
//done
// Lấy chi tiết truyện
export async function getStoryDetail(slug: string): Promise<StoryDetail> {
  return apiClient.get(`/comics/${slug}`);
}
//done
// Lấy chi tiết chapter
export async function getChapterDetail(
  slug: string,
  chapterName: string
): Promise<ChapterDetail> {
  return apiClient.get(`/comics/${slug}/chapter/${chapterName}`);
}
//done
// Lấy danh sách truyện đang phát hành
export async function getOngoingStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryList> {
  return apiClient.get("/comics/danh-sach/dang-phat-hanh", { params });
}
//done
// Lấy danh sách truyện đã hoàn thành
export async function getCompletedStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryList> {
  return apiClient.get("/comics/danh-sach/da-hoan-thanh", { params });
}
//done
// Lấy danh sách truyện sắp ra mắt
export async function getUpcomingStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryList> {
  return apiClient.get("/comics/danh-sach/sap-ra-mat", { params });
}
//done
// Lấy lịch sử đọc của người dùng
export async function getUserHistory(
  params: {
    page?: number;
    limit?: number;
  } = { page: 1, limit: 12 }
): Promise<UserHistoryResponse> {
  return apiClient.get("/user/history", { params });
}
//done
// Lấy danh sách truyện đã bookmark
export async function getUserBookmarks(
  params: {
    page?: number;
    limit?: number;
  } = { page: 1, limit: 12 }
): Promise<SavedStoriesResponse> {
  return apiClient.get("/user/bookmarks", { params });
}

// Lấy danh sách truyện theo thể loại
export async function getStoriesByGenre(
  genre: string,
  params: { page?: number; limit?: number } = { page: 1, limit: 12 }
): Promise<GenreStoriesResponse> {
  return apiClient.get(`/stories/genre/${encodeURIComponent(genre)}`, {
    params,
  });
}
//done
// Bookmark truyện
export async function bookmarkStory(
  comicId: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(`/comic/${comicId}/bookmark`);
  return {
    success: true,
    message: response.data.message || "Đã thêm vào danh sách yêu thích",
  };
}
//done
// Bỏ bookmark truyện
export async function removeBookmark(
  comicId: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete(`/comic/${comicId}/bookmark`);
  return {
    success: true,
    message: response.data.message || "Đã bỏ khỏi danh sách yêu thích",
  };
}
//done
// Xóa toàn bộ lịch sử
export async function clearAllHistory(): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await apiClient.delete("/user/history");
  return {
    success: true,
    message: response.data.message || "Đã xóa toàn bộ lịch sử",
  };
}
//done
// Xóa một mục lịch sử cụ thể
export async function clearHistoryById(
  historyId: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete(`/user/history/${historyId}`);
  return {
    success: true,
    message: response.data.message || "Đã xóa khỏi lịch sử",
  };
}
