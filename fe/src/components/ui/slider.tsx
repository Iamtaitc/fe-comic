// src/store/slices/ui-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  searchModalOpen: boolean
  sidebarOpen: boolean
}

const initialState: UIState = {
  searchModalOpen: false,
  sidebarOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSearchModal: (state) => {
      state.searchModalOpen = !state.searchModalOpen
    },
    setSearchModalOpen: (state, action: PayloadAction<boolean>) => {
      state.searchModalOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
  },
})

export const { toggleSearchModal, setSearchModalOpen, toggleSidebar, setSidebarOpen } = uiSlice.actions
export default uiSlice.reducer