import { apiClient } from '../client';
import { StoryList } from './types';
//done
export async function getPopularStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryList> {
  return apiClient.get('/comics/popular', { params });
}