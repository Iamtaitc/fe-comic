import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { StoryObject, CategoryObject } from "@/lib/api/comic";
import {
  getLatestStories,
  getPopularStories,
  getCompletedStories,
  getUpcomingStories,
  getStoriesByCategory,
  getCategory,
  getTopWeeklyStories,
} from "@/lib/api/comic";

interface CategoryState {
  stories: StoryObject[];
  topWeeklyStories: StoryObject[]; // Add this property
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
    status: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
    category?: string;
  };
}

const initialState: CategoryState = {
  stories: [],
  topWeeklyStories: [], // Initialize as empty array
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
    status: "",
    sortBy: "popularity",
    sortOrder: "desc",
    category: "",
  },
};

// Thunk để fetch danh sách thể loại
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategory();
      if (!Array.isArray(response)) {
        throw new Error("Dữ liệu thể loại không hợp lệ");
      }
      return response;
    } catch (error: unknown) {
      console.error("Lỗi khi lấy danh sách thể loại:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Không thể tải danh sách thể loại"
      );
    }
  }
);

// Thunk để fetch top truyện tuần
export const fetchTopWeeklyStories = createAsyncThunk(
  "category/fetchTopWeeklyStories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTopWeeklyStories();
      if (!response.success || !Array.isArray(response.data.stories)) {
        throw new Error("Dữ liệu top truyện tuần không hợp lệ");
      }
      return response.data.stories;
    } catch (error: unknown) {
      console.error("Lỗi khi lấy top truyện tuần:", error);
      return rejectWithValue(error instanceof Error ? error.message : "Không thể tải top truyện tuần");
    }
  }
);

// Keep other thunks as they are...
export const fetchStoriesByCategory = createAsyncThunk(
  "category/fetchStoriesByCategory",
  async (
    {
      slug,
      page = 1,
      filters = {},
    }: { slug: string; page?: number; filters?: Record<string, unknown> },
    { getState }
  ) => {
    const state = getState() as { category: CategoryState };
    const mergedFilters = { ...state.filters, ...filters, page };

    let response;
    try {
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

      console.log(
        `API response for ${slug}:`,
        JSON.stringify(response, null, 2)
      );

      if (!response.success) {
        throw new Error(
          response.message || `Lấy dữ liệu thất bại cho slug: ${slug}`
        );
      }

      let data = response.data?.data || response.data;

      if (!data || typeof data !== "object") {
        if (response && typeof response === "object" && "data" in response) {
          data = response.data;
        } else {
          throw new Error(`Cấu trúc dữ liệu không hợp lệ cho slug: ${slug}`);
        }
      }

      if (!data.stories || !Array.isArray(data.stories)) {
        throw new Error(
          `Dữ liệu truyện không hợp lệ hoặc thiếu stories cho slug: ${slug}`
        );
      }

      if (!data.pagination || typeof data.pagination !== "object") {
        console.warn(
          `Pagination thiếu cho slug: ${slug}, sử dụng giá trị mặc định`
        );
        return {
          stories: data.stories,
          total: data.stories.length,
          limit: mergedFilters.limit || 18,
          page: page,
          totalPages: 1,
          hasNextPage: false,
        };
      }

      if (
        typeof data.pagination.total !== "number" ||
        typeof data.pagination.limit !== "number" ||
        typeof data.pagination.page !== "number"
      ) {
        throw new Error(`Thông tin phân trang không đầy đủ cho slug: ${slug}`);
      }

      return {
        stories: data.stories,
        total: data.pagination.total,
        limit: data.pagination.limit,
        page: data.pagination.page,
        totalPages:
          data.pagination.pages ||
          Math.ceil(data.pagination.total / data.pagination.limit),
      };
    } catch (error: unknown) {
      console.error(`Lỗi khi lấy dữ liệu cho ${slug}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Không thể tải dữ liệu truyện cho slug: ${slug}`
      );
    }
  }
);

export const loadMoreStories = createAsyncThunk(
  "category/loadMoreStories",
  async (
    { slug, page, filters = {} }: { slug: string; page: number; filters?: Record<string, unknown> },
    { getState }
  ) => {
    const state = getState() as { category: CategoryState };
    const mergedFilters = { ...state.filters, ...filters, page };

    let response;
    try {
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

      console.log(
        `Load more response for ${slug}:`,
        JSON.stringify(response, null, 2)
      );

      if (!response.success) {
        throw new Error(
          response.message || `Tải thêm dữ liệu thất bại cho slug: ${slug}`
        );
      }

      let data = response.data?.data || response.data;

      if (!data || typeof data !== "object") {
        data = response;
      }

      if (!data.stories || !Array.isArray(data.stories)) {
        throw new Error(
          `Dữ liệu truyện không hợp lệ hoặc thiếu stories cho slug: ${slug}`
        );
      }

      if (!data.pagination || typeof data.pagination !== "object") {
        console.warn(
          `Pagination thiếu cho slug: ${slug}, sử dụng giá trị mặc định`
        );
        return {
          stories: data.stories,
          total: data.stories.length,
          limit: mergedFilters.limit || 18,
          page: page,
          totalPages: 1,
          hasNextPage: false,
        };
      }

      if (
        typeof data.pagination.total !== "number" ||
        typeof data.pagination.limit !== "number" ||
        typeof data.pagination.page !== "number"
      ) {
        throw new Error(`Thông tin phân trang không đầy đủ cho slug: ${slug}`);
      }

      return {
        stories: data.stories,
        total: data.pagination.total,
        limit: data.pagination.limit,
        page: data.pagination.page,
        totalPages:
          data.pagination.pages ||
          Math.ceil(data.pagination.total / data.pagination.limit),
      };
    } catch (error: unknown) {
      console.error(`Lỗi khi tải thêm dữ liệu cho ${slug}:`, error);
      throw new Error(
        error instanceof Error ? error.message : `Không thể tải thêm truyện cho slug: ${slug}`
      );
    }
  }
);

const categorySlice = createSlice({
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
      // Xử lý fetchCategories
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
        state.error =
          (action.payload as string) || "Lỗi khi tải danh sách thể loại";
      })
      // Xử lý fetchTopWeeklyStories - Store in topWeeklyStories instead of stories
      .addCase(fetchTopWeeklyStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopWeeklyStories.fulfilled, (state, action) => {
        state.loading = false;
        state.topWeeklyStories = action.payload; // Store in topWeeklyStories
      })
      .addCase(fetchTopWeeklyStories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Lỗi khi tải top truyện tuần";
      })
      // Xử lý fetchStoriesByCategory
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
          hasNextPage: action.payload.page < action.payload.totalPages,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchStoriesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Lỗi không xác định khi tải dữ liệu";
      })
      // Xử lý loadMoreStories
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
          hasNextPage: action.payload.page < action.payload.totalPages,
          limit: action.payload.limit,
        };
      })
      .addCase(loadMoreStories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Lỗi không xác định khi tải thêm dữ liệu";
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