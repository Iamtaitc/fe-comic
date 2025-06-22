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
  try {
    const response = await apiClient.get(`/comic/${slug}`);
    console.log("Detail Response:", response.data); // Log dữ liệu thực tế
    return response.data; // Trả về response.data để khớp với StoryDetail
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}