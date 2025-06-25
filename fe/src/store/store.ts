// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice';
import uiReducer from './slices/uiSlice';
import categoryReducer from "./slices/categorySlice";
import storyReducer from "./slices/storySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      home: homeReducer,
      ui: uiReducer,
      category: categoryReducer,
      story: storyReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['HYDRATE'],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];