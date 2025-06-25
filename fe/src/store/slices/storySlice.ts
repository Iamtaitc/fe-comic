
//fe\src\store\slices\storySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getStoryDetail } from "@/lib/api/comic/detail";
import { getChapterDetail } from "@/lib/api/comic/chapter";

interface Chapter {
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
}

interface Navigation {
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

export interface StoryDetail {
  success: boolean;
  message: string;
  data: {
    story: {
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
    };
    chapters: Chapter[];
  };
  timestamp: string;
}

export interface ChapterDetail {
  success: boolean;
  message: string;
  data: {
    chapter: Chapter;
    navigation: Navigation;
  };
  timestamp: string;
}

interface StoryState {
  storyDetail: StoryDetail["data"] | null;
  chapterDetail: ChapterDetail["data"] | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  storyDetail: null,
  chapterDetail: null,
  loading: false,
  error: null,
};

export const fetchStoryDetail = createAsyncThunk(
  "story/fetchStoryDetail",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await getStoryDetail(slug);
      console.log("Fetch Story Detail Response:", response);
      if (!response.success) {
        throw new Error(response.message || "Lấy thông tin chi tiết truyện thất bại");
      }
      return response.data;
    } catch (error: any) {
      console.error("Fetch Story Detail Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.config?.url?.includes(`/comic/${slug}`)) {
        return rejectWithValue(
          error.response?.data?.message ||
            `Request failed with status code ${error.response?.status || "unknown"}`
        );
      }
      return rejectWithValue(null);
    }
  }
);

export const fetchChapterDetail = createAsyncThunk(
  "story/fetchChapterDetail",
  async ({ slug, chapterName }: { slug: string; chapterName: string }, { rejectWithValue }) => {
    try {
      const response = await getChapterDetail(slug, chapterName);
      console.log("Fetch Chapter Detail Response:", response);
      if (!response.success) {
        throw new Error(response.message || "Lấy thông tin chapter thất bại");
      }
      return response.data;
    } catch (error: any) {
      console.error("Fetch Chapter Detail Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.config?.url?.includes(`/comics/${slug}/chapter/${chapterName}`)) {
        return rejectWithValue(
          error.response?.data?.message ||
            `Request failed with status code ${error.response?.status || "unknown"}`
        );
      }
      return rejectWithValue(null);
    }
  }
);

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    setChapterDetail(state, action: PayloadAction<ChapterDetail["data"]>) {
      state.chapterDetail = action.payload;
      state.error = null;
    },
    resetStoryState(state) {
      state.storyDetail = null;
      state.chapterDetail = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryDetail.fulfilled, (state, action: PayloadAction<StoryDetail["data"]>) => {
        state.loading = false;
        state.storyDetail = action.payload;
        state.error = null;
      })
      .addCase(fetchStoryDetail.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        }
      })
      .addCase(fetchChapterDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChapterDetail.fulfilled, (state, action: PayloadAction<ChapterDetail["data"]>) => {
        state.loading = false;
        state.chapterDetail = action.payload;
        state.error = null;
      })
      .addCase(fetchChapterDetail.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        }
      });
  },
});

export const { setChapterDetail, resetStoryState } = storySlice.actions;
export default storySlice.reducer;