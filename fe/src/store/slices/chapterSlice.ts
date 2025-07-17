// src/store/slices/chapterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChapterDetailData } from '@/types/chapter';

interface ChapterState {
  current?: ChapterDetailData;
  loading: boolean;
  error?: string;
}

const initialState: ChapterState = {
  current: undefined,
  loading: false,
  error: undefined,
};

const chapterSlice = createSlice({
  name: "chapter",
  initialState,
  reducers: {
    fetchStart(state) {
      state.loading = true;
      state.error = undefined;
    },
    fetchSuccess(state, action: PayloadAction<ChapterDetailData>) {
      state.current = action.payload;
      state.loading = false;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearChapter(state) {
      state.current = undefined;
      state.error = undefined;
      state.loading = false;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFailure,
  clearChapter,
} = chapterSlice.actions;

// ✅ export reducer as default
export default chapterSlice.reducer;
