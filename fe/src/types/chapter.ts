// types/chapter.ts - Chỉ cho Chapter Reader
export interface ChapterImage {
  image_page: number;
  image_file: string;
  _id: string;
}

export interface Chapter {
  _id: string;
  chapterNumber: number;
  chapter_name: string;
  chapter_title: string;
  content: string[];
  chapter_image: ChapterImage[];
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
}

export interface ChapterNavigation {
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
}

export interface ChapterDetailData {
  chapter: Chapter;
  navigation: ChapterNavigation;
}

export interface ChapterDetailResponse {
  success: boolean;
  message: string;
  data: ChapterDetailData;
  timestamp: string;
}