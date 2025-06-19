import { apiClient } from '../client';
import { StoryObject } from './types';

export interface ChapterDetail {
  success: boolean;
  message: string;
  data: {
    chapter: {
      _id: string;
      chapterNumber: number;
      chapter_name: string;
      chapter_title: string;
      content: string[];
      chapter_image: {
        image_page: number;
        image_file: string;
        _id: string;
      }[];
      chapter_api_data: string;
      storyId: string;
      views: number;
      likeCount: number;
      filename: string;
      comic_name: string;
      server_name: string;
      chapter_path: string;
      domain_cdn: string;
      isPublished: boolean;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    };
    navigation: {
      prev: {
        _id: string;
        chapterNumber: number;
        chapter_name: string;
      } | null;
      next: {
        _id: string;
        chapterNumber: number;
        chapter_name: string;
      } | null;
    };
  };
  timestamp: string;
}

export async function getChapterDetail(
  slug: string,
  chapterName: string
): Promise<ChapterDetail> {
  return apiClient.get(`/comics/${slug}/chapter/${chapterName}`);
}