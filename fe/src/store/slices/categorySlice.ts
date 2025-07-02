// 🔧 Fixed Category Slice - 100% Type Safe (No Any)

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { StoryObject, CategoryObject } from "@/lib/api/comic/types";
import { getTopWeeklyStories } from "@/lib/api/comic/top-weekly";
import { getLatestStories } from "@/lib/api/comic/latest";
import { getPopularStories } from "@/lib/api/comic/popular";
import {
  getCompletedStories,
  getUpcomingStories,
} from "@/lib/api/comic/status";
import { getStoriesByCategory, getCategory } from "@/lib/api/comic/category";

// 🎯 Strict Type Definitions
type Status = "all" | "ongoing" | "completed" | "paused";
type SortBy = "latest" | "popular" | "rating" | "views" | "name";
type SortOrder = "asc" | "desc";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages?: number;
}

interface StoriesApiData {
  stories: StoryObject[];
  pagination?: PaginationData;
  totalStories?: number;
}

// 🔒 API Response Type Hierarchy
interface InnerApiResponse<T = StoriesApiData> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ApiResponse<T = StoriesApiData> {
  success: boolean;
  message?: string;
  data?: InnerApiResponse<T>;
}

// 🔧 Type Guards
const isValidObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isValidArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

const isStoryObject = (value: unknown): value is StoryObject => {
  return (
    isValidObject(value) &&
    typeof (value as Record<string, unknown>)._id === "string" &&
    typeof (value as Record<string, unknown>).name === "string"
  );
};

const isStoryArray = (value: unknown): value is StoryObject[] => {
  return isValidArray(value) && value.every(isStoryObject);
};

const isPaginationData = (value: unknown): value is PaginationData => {
  return (
    isValidObject(value) &&
    typeof (value as Record<string, unknown>).total === "number" &&
    typeof (value as Record<string, unknown>).page === "number" &&
    typeof (value as Record<string, unknown>).limit === "number"
  );
};

// 🔧 Centralized Response Parser with Type Guards
const parseApiResponse = <T extends StoriesApiData>(
  response: unknown,
  source: string
): T => {
  console.group(`🔍 [${source}] API Response Parser`);
  console.log("Raw response:", response);

  // Validate outer wrapper
  if (!isValidObject(response)) {
    console.error("❌ Invalid response object");
    console.groupEnd();
    throw new Error(`Response không hợp lệ từ ${source}`);
  }

  const typedResponse = response as ApiResponse<T>;

  if (!typedResponse.success) {
    console.error("❌ Outer success = false");
    console.groupEnd();
    throw new Error(
      `Yêu cầu thất bại: ${typedResponse.message || "Unknown error"}`
    );
  }

  // Validate inner data
  if (!typedResponse.data) {
    console.error("❌ No data property");
    console.groupEnd();
    throw new Error(`Không có dữ liệu từ ${source}`);
  }

  if (!typedResponse.data.success) {
    console.error("❌ Inner success = false");
    console.groupEnd();
    throw new Error(
      `Dữ liệu thất bại: ${typedResponse.data.message || "Unknown error"}`
    );
  }

  // Extract actual data
  const actualData = typedResponse.data.data;
  console.log("✅ Extracted data:", actualData);
  console.groupEnd();

  if (!actualData) {
    throw new Error(`Dữ liệu trống từ ${source}`);
  }

  return actualData;
};

// 🔧 Validate Stories Data with Type Guards
const validateStoriesData = (data: unknown, source: string): StoriesApiData => {
  if (!isValidObject(data)) {
    throw new Error(`Cấu trúc dữ liệu không hợp lệ từ ${source}`);
  }

  const stories = (data as Record<string, unknown>).stories;
  if (!isStoryArray(stories)) {
    throw new Error(
      `Dữ liệu stories không hợp lệ từ ${source}. Received: ${typeof stories}`
    );
  }

  const pagination = (data as Record<string, unknown>).pagination;
  const totalStories = (data as Record<string, unknown>).totalStories;

  console.log(`✅ [${source}] Validated ${stories.length} stories`);

  return {
    stories,
    pagination:
      pagination && isPaginationData(pagination) ? pagination : undefined,
    totalStories: typeof totalStories === "number" ? totalStories : undefined,
  };
};

// 🎯 Category State Interface
interface CategoryState {
  stories: StoryObject[];
  topWeeklyStories: StoryObject[];
  categories: CategoryObject[];
  currentCategory: string | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStories: number;
    hasNextPage: boolean;
    limit: number;
  };
  filters: {
    status: Status;
    sortBy: SortBy;
    sortOrder: SortOrder;
    category?: string;
    searchQuery?: string;
  };
}

// 🎯 API Function Parameters
interface ApiParams {
  page?: number;
  limit?: number;
  status?: string;
}

interface FetchCategoryParams {
  slug: string;
  page?: number;
  filters?: Record<string, unknown>;
}

interface LoadMoreParams {
  slug: string;
  page: number;
  filters?: Record<string, unknown>;
}

// 🎯 Return Types for Thunks
interface StoriesResult {
  stories: StoryObject[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage?: boolean;
}

const initialState: CategoryState = {
  stories: [],
  topWeeklyStories: [],
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalStories: 0,
    hasNextPage: false,
    limit: 18,
  },
  filters: {
    status: "all",
    sortBy: "latest",
    sortOrder: "desc",
    category: "",
    searchQuery: "",
  },
};

// 🔧 Fixed fetchCategories
export const fetchCategories = createAsyncThunk<
  CategoryObject[],
  void,
  { rejectValue: string }
>("category/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await getCategory();
    if (!isValidArray(response)) {
      throw new Error("Dữ liệu thể loại không hợp lệ");
    }

    // Type guard for CategoryObject array
    const isValidCategories = response.every(
      (item): item is CategoryObject =>
        isValidObject(item) &&
        typeof (item as Record<string, unknown>)._id === "string" &&
        typeof (item as Record<string, unknown>).name === "string"
    );

    if (!isValidCategories) {
      throw new Error("Dữ liệu thể loại không đúng định dạng");
    }

    return response as CategoryObject[];
  } catch (error: unknown) {
    console.error("Lỗi khi lấy danh sách thể loại:", error);
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Không thể tải danh sách thể loại"
    );
  }
});

// 🔧 Fixed fetchTopWeeklyStories
export const fetchTopWeeklyStories = createAsyncThunk<
  StoryObject[],
  void,
  { rejectValue: string }
>("category/fetchTopWeeklyStories", async (_, { rejectWithValue }) => {
  try {
    const response = await getTopWeeklyStories();

    // Parse response với centralized parser
    const data = parseApiResponse<StoriesApiData>(
      response,
      "fetchTopWeeklyStories"
    );
    const validatedData = validateStoriesData(data, "fetchTopWeeklyStories");

    return validatedData.stories;
  } catch (error: unknown) {
    console.error("❌ Error in fetchTopWeeklyStories:", error);
    return rejectWithValue(
      error instanceof Error ? error.message : "Không thể tải top truyện tuần"
    );
  }
});

// 🔧 Fixed fetchStoriesByCategory
export const fetchStoriesByCategory = createAsyncThunk<
  StoriesResult,
  FetchCategoryParams,
  { state: { category: CategoryState }; rejectValue: string }
>(
  "category/fetchStoriesByCategory",
  async ({ slug, page = 1, filters = {} }, { rejectWithValue }) => {
    try {
      const mergedFilters: ApiParams = { ...filters, page };
      let response: unknown;

      // API calls based on slug
      switch (slug) {
        case "all":
          response = await getPopularStories({
            page,
            limit: mergedFilters.limit || 18,
          });
          break;
        case "ongoing":
          response = await getLatestStories({
            ...mergedFilters,
            status: "ongoing",
            limit: mergedFilters.limit || 18,
          });
          break;
        case "completed":
          response = await getCompletedStories({
            page,
            limit: mergedFilters.limit || 18,
          });
          break;
        case "upcoming":
          response = await getUpcomingStories({
            page,
            limit: mergedFilters.limit || 18,
          });
          break;
        default:
          response = await getStoriesByCategory(slug, {
            ...mergedFilters,
            limit: mergedFilters.limit || 18,
          });
          break;
      }

      console.log(`📡 [${slug}] Raw API response:`, response);

      // Parse và validate response
      const data = parseApiResponse<StoriesApiData>(
        response,
        `fetchStoriesByCategory-${slug}`
      );
      const validatedData = validateStoriesData(
        data,
        `fetchStoriesByCategory-${slug}`
      );

      // Extract pagination info
      const pagination = validatedData.pagination;
      if (!pagination) {
        console.warn(`⚠️ [${slug}] No pagination data, using defaults`);
        return {
          stories: validatedData.stories,
          total: validatedData.stories.length,
          limit: mergedFilters.limit || 18,
          page: page,
          totalPages: 1,
          hasNextPage: false,
        };
      }

      const totalPages =
        pagination.pages || Math.ceil(pagination.total / pagination.limit);

      console.log(`✅ [${slug}] Success:`, {
        storiesCount: validatedData.stories.length,
        page: pagination.page,
        totalPages,
        total: pagination.total,
      });

      return {
        stories: validatedData.stories,
        total: pagination.total,
        limit: pagination.limit,
        page: pagination.page,
        totalPages,
        hasNextPage: pagination.page < totalPages,
      };
    } catch (error: unknown) {
      console.error(`❌ Error in fetchStoriesByCategory [${slug}]:`, error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : `Không thể tải dữ liệu cho ${slug}`
      );
    }
  }
);

// 🔧 Fixed loadMoreStories
export const loadMoreStories = createAsyncThunk<
  StoriesResult,
  LoadMoreParams,
  { state: { category: CategoryState }; rejectValue: string }
>(
  "category/loadMoreStories",
  async ({ slug, page, filters = {} }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const mergedFilters: ApiParams = {
        ...state.category.filters,
        ...filters,
        page,
      };
      let response: unknown;

      // Same switch logic as fetchStoriesByCategory
      switch (slug) {
        case "all":
          response = await getPopularStories({
            page,
            limit: mergedFilters.limit || 18,
          });
          break;
        case "ongoing":
          response = await getLatestStories({
            ...mergedFilters,
            status: "ongoing",
            limit: mergedFilters.limit || 18,
          });
          break;
        case "completed":
          response = await getCompletedStories({
            page,
            limit: mergedFilters.limit || 18,
          });
          break;
        case "upcoming":
          response = await getUpcomingStories({
            page,
            limit: mergedFilters.limit || 18,
          });
          break;
        default:
          response = await getStoriesByCategory(slug, {
            ...mergedFilters,
            limit: mergedFilters.limit || 18,
          });
          break;
      }

      console.log(`📡 [${slug}] Load more raw response:`, response);

      // Parse và validate response
      const data = parseApiResponse<StoriesApiData>(
        response,
        `loadMoreStories-${slug}`
      );
      const validatedData = validateStoriesData(
        data,
        `loadMoreStories-${slug}`
      );

      const pagination = validatedData.pagination;
      if (!pagination) {
        console.warn(`⚠️ [${slug}] Load more: No pagination data`);
        return {
          stories: validatedData.stories,
          total: validatedData.stories.length,
          limit: mergedFilters.limit || 18,
          page: page,
          totalPages: 1,
          hasNextPage: false,
        };
      }

      const totalPages =
        pagination.pages || Math.ceil(pagination.total / pagination.limit);

      console.log(`✅ [${slug}] Load more success:`, {
        newStoriesCount: validatedData.stories.length,
        page: pagination.page,
        totalPages,
      });

      return {
        stories: validatedData.stories,
        total: pagination.total,
        limit: pagination.limit,
        page: pagination.page,
        totalPages,
        hasNextPage: pagination.page < totalPages,
      };
    } catch (error: unknown) {
      console.error(`❌ Error in loadMoreStories [${slug}]:`, error);
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : `Không thể tải thêm truyện cho ${slug}`
      );
    }
  }
);

// 🎯 Category Slice
export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setStories(state, action: PayloadAction<StoryObject[]>) {
      state.stories = action.payload;
    },
    setTopWeeklyStories(state, action: PayloadAction<StoryObject[]>) {
      state.topWeeklyStories = action.payload;
    },
    setCategories(state, action: PayloadAction<CategoryObject[]>) {
      state.categories = action.payload;
    },
    setPagination(state, action: PayloadAction<CategoryState["pagination"]>) {
      state.pagination = action.payload;
    },
    setCurrentCategory(state, action: PayloadAction<string>) {
      state.currentCategory = action.payload;
    },
    resetCategoryState(state) {
      state.stories = [];
      state.topWeeklyStories = [];
      state.categories = [];
      state.currentCategory = null;
      state.loading = false;
      state.error = null;
      state.pagination = initialState.pagination;
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tải danh sách thể loại";
      })
      .addCase(fetchTopWeeklyStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopWeeklyStories.fulfilled, (state, action) => {
        state.loading = false;
        state.topWeeklyStories = action.payload;
      })
      .addCase(fetchTopWeeklyStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tải top truyện tuần";
      })
      .addCase(fetchStoriesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoriesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload.stories;
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.totalPages,
          totalStories: action.payload.total,
          hasNextPage: action.payload.hasNextPage || false,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchStoriesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi không xác định khi tải dữ liệu";
      })
      .addCase(loadMoreStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = [...state.stories, ...action.payload.stories];
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.totalPages,
          totalStories: action.payload.total,
          hasNextPage: action.payload.hasNextPage || false,
          limit: action.payload.limit,
        };
      })
      .addCase(loadMoreStories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Lỗi không xác định khi tải thêm dữ liệu";
      });
  },
});

export const {
  setStories,
  setTopWeeklyStories,
  setCategories,
  setPagination,
  setCurrentCategory,
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;
