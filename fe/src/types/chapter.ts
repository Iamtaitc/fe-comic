// types/chapter.ts - Fixed and unified
export interface Story {
  id: string;
  name: string;
  slug: string;
  thumb_url: string;
}

export interface ChapterImage {
  image_page: number;
  image_file: string;
  _id?: string;
}

export interface Chapter {
  _id: string;
  chapterNumber?: number;
  chapter_name: string;
  chapter_title: string;
  content: string[]; // Array of image URLs for UI
  chapter_image?: ChapterImage[]; // Raw image data from API
  chapter_api_data?: string;
  storyId?: string;
  views: number;
  likeCount: number;
  filename?: string;
  comic_name: string;
  server_name?: string;
  chapter_path?: string;
  domain_cdn?: string;
  isPublished?: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
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

// 🔧 Main response interface
export interface ChapterDetailData {
  story: Story; // 🔑 Added story field
  chapter: Chapter;
  navigation: ChapterNavigation;
}

export interface ChapterDetailResponse {
  success: boolean;
  message: string;
  data: ChapterDetailData;
  timestamp: string;
}

// 🔧 External API types
export interface ExternalChapterImagesResponse {
  status: string;
  data: {
    domain_cdn: string;
    item: {
      chapter_path: string;
      chapter_image: ChapterImage[];
    };
  };
}

// 🔧 Internal API response (before processing)
export interface InternalChapterResponse {
  success: boolean;
  message?: string;
  data?: {
    story: Story;
    chapter: Omit<Chapter, 'content' | 'comic_name'>; // Before processing
    navigation: ChapterNavigation;
  };
}