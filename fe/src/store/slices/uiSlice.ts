// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeColor = 'default' | 'orange' | 'green' | 'blue' | 'purple';

interface UIState {
  themeMode: ThemeMode;
  themeColor: ThemeColor;
  sidebarOpen: boolean;
  searchModalOpen: boolean;
}

const initialState: UIState = {
  themeMode: 'system',
  themeColor: 'default',
  sidebarOpen: false,
  searchModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    setThemeColor: (state, action: PayloadAction<ThemeColor>) => {
      state.themeColor = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen;
    },
  },
});

export const { setThemeMode, setThemeColor, toggleSidebar, toggleSearchModal } = uiSlice.actions;
export default uiSlice.reducer;