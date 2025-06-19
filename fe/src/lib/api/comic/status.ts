import { apiClient } from '../client';
import { StoryList } from './types';

export async function getOngoingStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryList> {
  return apiClient.get('/comics/danh-sach/dang-phat-hanh', { params });
}

export async function getCompletedStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryList> {
  return apiClient.get('/comics/danh-sach/da-hoan-thanh', { params });
}

export async function getUpcomingStories(params: {
  page?: number;
  limit?: number;
}): Promise<StoryList> {
  return apiClient.get('/comics/danh-sach/sap-ra-mat', { params });
}