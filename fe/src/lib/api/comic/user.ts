import { apiClient } from '../client';
import { StoryObject } from './types';

export interface UserHistoryResponse {
  success: boolean;
  data: {
    data: {
      stories: StoryObject[];
      totalCount: number;
    };
  };
}

export interface SavedStoriesResponse {
  success: boolean;
  data: {
    data: {
      stories: StoryObject[];
      totalCount: number;
    };
  };
}

export async function getUserHistory(
  params: {
    page?: number;
    limit?: number;
  } = { page: 1, limit: 12 }
): Promise<UserHistoryResponse> {
  return apiClient.get('/user/history', { params });
}

export async function getUserBookmarks(
  params: {
    page?: number;
    limit?: number;
  } = { page: 1, limit: 12 }
): Promise<SavedStoriesResponse> {
  return apiClient.get('/user/bookmarks', { params });
}

export async function bookmarkStory(
  comicId: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(`/comic/${comicId}/bookmark`);
  return {
    success: true,
    message: response.data.message || 'Đã thêm vào danh sách yêu thích',
  };
}

export async function removeBookmark(
  comicId: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete(`/comic/${comicId}/bookmark`);
  return {
    success: true,
    message: response.data.message || 'Đã bỏ khỏi danh sách yêu thích',
  };
}

export async function clearAllHistory(): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await apiClient.delete('/user/history');
  return {
    success: true,
    message: response.data.message || 'Đã xóa toàn bộ lịch sử',
  };
}

export async function clearHistoryById(
  historyId: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.delete(`/user/history/${historyId}`);
  return {
    success: true,
    message: response.data.message || 'Đã xóa khỏi lịch sử',
  };
}