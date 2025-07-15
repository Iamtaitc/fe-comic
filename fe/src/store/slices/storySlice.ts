// store/slices/storySlice.ts - Fixed Version
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getStoryDetail } from "@/lib/api/comic/story-detail/service";
import { StoryDetailData } from "@/types/story";

interface StoryState {
  storyDetail: StoryDetailData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  storyDetail: null,
  loading: false,
  error: null,
};

export const fetchStoryDetail = createAsyncThunk(
  "story/fetchDetail",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await getStoryDetail(slug);

      // 🔑 Debug logs để trace data flow
      console.log("Redux fetchStoryDetail - Full response:", response);
      console.log("Redux fetchStoryDetail - Response data:", response.data);

      // ✅ Fix: Return đúng nested data structure
      if (!response.success || !response.data) {
        throw new Error(response.message || "Không thể tải dữ liệu truyện");
      }

      return response.data; // Đây mới là { story: {...}, chapters: [...] }
    } catch (error: any) {
      console.error("Redux fetchStoryDetail - Error:", error);
      return rejectWithValue(error.message || "Có lỗi xảy ra khi tải truyện");
    }
  }
);

const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    resetStoryState: () => initialState,
    clearStoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoryDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.storyDetail = action.payload;
        state.error = null;

        // 🔑 Debug log để verify payload structure
        console.log("Redux fulfilled - Payload:", action.payload);
      })
      .addCase(fetchStoryDetail.rejected, (state, action) => {
        state.loading = false;
        state.storyDetail = null;
        state.error = action.payload as string;

        // 🔑 Debug log để track errors
        console.log("Redux rejected - Error:", action.payload);
      });
  },
});

export const { resetStoryState, clearStoryError } = storySlice.actions;
export default storySlice.reducer;
