import { apiClient } from '../client';
import { StoryList } from './types';

export async function searchStories(query: string): Promise<StoryList> {
  return apiClient.get('/comics/search', {
    params: { keyword: query },
  });
}