// store/slices/chapterSlice.ts - Chỉ cho Chapter Reader
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChapterDetail } from "@/lib/api/comic/chapter-detail/service";
import { ChapterDetailData } from "@/types/chapter";

interface ChapterState {
  chapterDetail: ChapterDetailData | null;
  loading: boolean;
  error: string | null;
  // For chapter reader specific features
  currentImageIndex: number;
  readingMode: 'vertical' | 'horizontal';
  zoomLevel: number;
}

const initialState: ChapterState = {
  chapterDetail: null,
  loading: false,
  error: null,
  currentImageIndex: 0,
  readingMode: 'vertical',
  zoomLevel: 1,
};

export const fetchChapterDetail = createAsyncThunk(
  "chapter/fetchDetail",
  async ({ slug, chapterName }: { slug: string; chapterName: string }, { rejectWithValue }) => {
    try {
      const response = await getChapterDetail(slug, chapterName);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    resetChapterState: () => initialState,
    setCurrentImageIndex: (state, action) => {
      state.currentImageIndex = action.payload;
    },
    setReadingMode: (state, action) => {
      state.readingMode = action.payload;
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },
    clearChapterError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChapterDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChapterDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.chapterDetail = action.payload;
        state.error = null;
        state.currentImageIndex = 0; // Reset to first image
      })
      .addCase(fetchChapterDetail.rejected, (state, action) => {
        state.loading = false;
        state.chapterDetail = null;
        state.error = action.payload as string;
      });
  },
});

export const { 
  resetChapterState, 
  setCurrentImageIndex, 
  setReadingMode, 
  setZoomLevel,
  clearChapterError 
} = chapterSlice.actions;
export default chapterSlice.reducer;