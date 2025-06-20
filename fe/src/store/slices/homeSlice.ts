// src/store/slices/homeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StoryObject, CategoryObject } from "@/lib/api/comic/types";
import { getHomeData, HomeDataResponse } from '@/lib/api/comic/home';


interface HomeState {
  popularStories: StoryObject[];
  categories: CategoryObject[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  popularStories: [],
  categories: [],
  loading: false,
  error: null,
};
  
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getHomeData();
      console.log("HomeData Response:", response.data);
      if (response.success && response.data) {
        return {
          popularStories: response.data.popularStorys.data.stories || [],
          categories: response.data.categories || [],
        };
      }
      return rejectWithValue(response.message || "Failed to fetch home data");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Không thể tải dữ liệu"
      );
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.popularStories = action.payload.popularStories;
        state.categories = action.payload.categories;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default homeSlice.reducer;