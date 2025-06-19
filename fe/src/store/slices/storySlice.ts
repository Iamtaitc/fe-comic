import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getStoryDetail } from "@/lib/api/comic/detail";
import { getChapterDetail } from "@/lib/api/comic/chapter";

interface Chapter {
  _id: string;
  chapterNumber: number;
  chapter_name: string;
  chapter_title: string;
  createdAt: string;
  likeCount: number;
  views: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface StoryDetail {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  status: string;
  thumb_url: string;
  sub_docquyen: boolean;
  category: Category[];
  views: number;
  ratingValue: number;
  ratingCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[]; // Optional vì chapters đến từ API response riêng biệt
}

interface StoryWithChapters extends StoryDetail {
  chapters: Chapter[];
}

interface ChapterImage {
  image_page: number;
  image_file: string;
  _id: string;
}

interface ChapterDetail {
  chapter: {
    _id: string;
    chapterNumber: number;
    storyId: string;
    chapter_name: string;
    chapter_title: string;
    content: string[];
    createdAt: string;
    updatedAt: string;
    likeCount: number;
    views: number;
    chapter_image: ChapterImage[];
    chapter_path: string;
    comic_name: string;
    domain_cdn: string;
  };
  navigation: {
    prev: { _id: string; chapterNumber: number; chapter_name: string } | null;
    next: { _id: string; chapterNumber: number; chapter_name: string } | null;
  };
}

interface StoryState {
  storyDetail: StoryWithChapters | null;
  chapterDetail: ChapterDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  storyDetail: null,
  chapterDetail: null,
  loading: false,
  error: null,
};

// Thunk để lấy chi tiết truyện
export const fetchStoryDetail = createAsyncThunk(
  "story/fetchStoryDetail",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await getStoryDetail(slug);
      if (!response.success || !response.data?.Story) {
        return rejectWithValue(response.message || "Không thể lấy chi tiết truyện");
      }
      
      // Kết hợp Story với chapters từ API response
      const storyWithChapters: StoryWithChapters = {
        ...response.data.Story,
        chapters: response.data.chapters || []
      };
      
      return storyWithChapters;
    } catch (error: any) {
      console.error(`Lỗi khi lấy chi tiết truyện cho slug: ${slug}`, error);
      return rejectWithValue(error.message || "Không thể lấy chi tiết truyện");
    }
  }
);

// Thunk để lấy chi tiết chapter
export const fetchChapterDetail = createAsyncThunk(
  "story/fetchChapterDetail",
  async (
    { slug, chapterName }: { slug: string; chapterName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await getChapterDetail(slug, chapterName);
      if (!response.success || !response.data) {
        return rejectWithValue(response.message || "Không thể lấy chi tiết chapter");
      }
      return response.data;
    } catch (error: any) {
      console.error(`Lỗi khi lấy chi tiết chapter ${chapterName} cho slug: ${slug}`, error);
      return rejectWithValue(error.message || "Không thể lấy chi tiết chapter");
    }
  }
);

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    resetStoryState(state) {
      state.storyDetail = null;
      state.chapterDetail = null;
      state.loading = false;
      state.error = null;
    },
    setChapterDetail: (state, action) => {
      state.chapterDetail = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStoryDetail
      .addCase(fetchStoryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryDetail.fulfilled, (state, action: PayloadAction<StoryWithChapters>) => {
        state.loading = false;
        state.storyDetail = action.payload;
      })
      .addCase(fetchStoryDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchChapterDetail
      .addCase(fetchChapterDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChapterDetail.fulfilled, (state, action: PayloadAction<ChapterDetail>) => {
        state.loading = false;
        state.chapterDetail = action.payload;
      })
      .addCase(fetchChapterDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetStoryState, setChapterDetail } = storySlice.actions;
export default storySlice.reducer;