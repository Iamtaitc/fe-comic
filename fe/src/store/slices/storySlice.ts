// store/slices/storySlice.ts - Chỉ cho Story Detail
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      })
      .addCase(fetchStoryDetail.rejected, (state, action) => {
        state.loading = false;
        state.storyDetail = null;
        state.error = action.payload as string;
      });
  },
});

export const { resetStoryState, clearStoryError } = storySlice.actions;
export default storySlice.reducer;