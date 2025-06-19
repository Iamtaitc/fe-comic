import { apiClient } from '../client';
import { StoryList } from './types';

export async function getTopWeeklyStories(): Promise<StoryList> {
  return apiClient.get('/comics/top-weekly');
}