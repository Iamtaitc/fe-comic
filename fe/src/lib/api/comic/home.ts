import { apiClient } from '../client';
import { CategoryObject, StoryObject } from './types';

export interface HomeDataResponse {
  success: boolean;
  message: string;
  data: {
    latestStorys: {
      success: boolean;
      status: number;
      message: string;
      data: {
        stories: StoryObject[];
      };
    };
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
  timestamp: string;
}

export async function getHomeData(): Promise<HomeDataResponse> {
  return apiClient.get('/home');
}