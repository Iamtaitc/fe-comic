import { apiClient } from '../client';
import { StoryListResponse } from './types';
//done
export async function getPopularStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryListResponse> {
  return apiClient.get('/comics/popular', { params });
}