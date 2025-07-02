// types/story.ts
export interface Story {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  content: string;
  status: string;
  thumb_url: string;
  sub_docquyen: boolean;
  authorId: string[];
  author: string[];
  category: { _id: string; name: string; slug: string }[];
  views: number;
  ratingValue: number;
  ratingCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface StoryChapter {
  _id: string;
  chapterNumber: number;
  chapter_name: string;
  chapter_title: string;
  views: number;
  likeCount: number;
  createdAt: string;
}

export interface StoryDetailData {
  story: Story;
  chapters: StoryChapter[];
}

export interface StoryDetailResponse {
  success: boolean;
  message: string;
  data: StoryDetailData;
  timestamp: string;
}
