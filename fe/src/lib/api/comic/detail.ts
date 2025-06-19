import { apiClient } from '../client';
import { StoryObject } from './types';

export interface StoryDetail {
  success: boolean;
  message: string;
  data: {
    Story: StoryObject & {
      origin_name: string[];
      content: string;
      sub_docquyen: boolean;
      author: string[];
      likeCount: number;
      createdAt: string;
    };
    chapters: {
      _id: string;
      chapterNumber: number;
      chapter_name: string;
      chapter_title: string;
      createdAt: string;
      likeCount: number;
      views: number;
    }[];
  };
  timestamp: string;
}

export async function getStoryDetail(slug: string): Promise<StoryDetail> {
  return apiClient.get(`/comics/${slug}`);
}