// lib/api/comic/status.ts
import { apiClient } from '../client';
import { StoryListResponse, ListParams } from './types';

export async function getOngoingStories(params: ListParams = {}): Promise<StoryListResponse> {
  return apiClient.get('/comics/danh-sach/dang-phat-hanh', { params });
}

export async function getCompletedStories(params: ListParams = {}): Promise<StoryListResponse> {
  return apiClient.get('/comics/danh-sach/da-hoan-thanh', { params });
}

export async function getUpcomingStories(params: ListParams = {}): Promise<StoryListResponse> {
  return apiClient.get('/comics/danh-sach/sap-ra-mat', { params });
}