import { apiClient } from '../client';
import { StoryList } from './types';

export async function getLatestStories(params: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}): Promise<StoryList> {
  return apiClient.get('/comics/latest', { params });
}