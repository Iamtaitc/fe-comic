// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import homeReducer from "./slices/homeSlice";
import uiReducer from "./slices/uiSlice";
import categoryReducer from "./slices/categorySlice";
import storyReducer from "./slices/storySlice";
import authReducer from "./slices/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      home: homeReducer,
      ui: uiReducer,
      category: categoryReducer,
      story: storyReducer,
      auth: authReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["HYDRATE"],
        },
      }),
  });
};

// Export types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Tạo singleton store cho client
let store: AppStore | undefined;

export const getStore = (): AppStore => {
  // Tạo store mới cho mỗi request trên server
  if (typeof window === "undefined") {
    return makeStore();
  }

  // Tái sử dụng store trên client
  if (!store) {
    store = makeStore();
  }

  return store;
};
