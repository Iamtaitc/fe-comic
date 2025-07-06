// src/store/slices/homeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  StoryObject,
  HomeState,
  StorySection,
  CACHE_TIME,
} from "@/lib/api/comic/types";
import { getHomeData } from "@/lib/api/comic/home";
import {
  getOngoingStories,
  getCompletedStories,
  getUpcomingStories,
} from "@/lib/api/comic/status";
import { getPopularStories } from "@/lib/api/comic/popular";

// ============================================
// 🎯 INITIAL STATE
// ============================================

const createInitialSection = (): StorySection => ({
  stories: [],
  loading: false,
  error: null,
  lastFetched: null,
});

const initialState: HomeState = {
  popularStories: [],
  categories: [],
  loading: false,
  error: null,
  lastFetched: null,
  sections: {
    popular: createInitialSection(),
    ongoing: createInitialSection(),
    completed: createInitialSection(),
    upcoming: createInitialSection(),
  },
};

// ============================================
// 🎯 ASYNC THUNKS
// ============================================

// 🔑 Original home data
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { home: HomeState };
    const now = Date.now();

    // Check cache
    if (state.home.lastFetched && now - state.home.lastFetched < CACHE_TIME) {
      return {
        popularStories: state.home.popularStories,
        categories: state.home.categories,
      };
    }

    try {
      const response = await getHomeData();

      if (response?.data) {
        return {
          popularStories: response.data.popularStorys?.data?.stories || [],
          categories: response.data.categories || [],
        };
      }
      return rejectWithValue("No data received");
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to fetch home data"
      );
    }
  }
);

const createSectionFetcher = (
  sectionName: keyof HomeState["sections"],
  fetchFunction: (params: { page?: number; limit?: number }) => Promise<any>,
  actionName: string
) => {
  return createAsyncThunk(
    `home/${actionName}`,
    async (
      params: { page?: number; limit?: number; force?: boolean } = {},
      { getState, rejectWithValue }
    ) => {
      const state = getState() as { home: HomeState };
      const section = state.home.sections[sectionName];
      const now = Date.now();
      const cacheTime = 5 * 60 * 1000;

      // Check cache
      if (
        !params.force &&
        section.lastFetched &&
        now - section.lastFetched < cacheTime
      ) {
        return { stories: section.stories, cached: true };
      }

      try {
        const response = await fetchFunction({
          page: params.page || 1,
          limit: params.limit || 10,
        });

        let stories: StoryObject[] = [];
        let extractionMethod = "none";

        if (response?.stories && Array.isArray(response.stories)) {
          stories = response.stories;
          extractionMethod = "direct_stories";
        } else if (
          response?.data?.stories &&
          Array.isArray(response.data.stories)
        ) {
          stories = response.data.stories;
          extractionMethod = "data_stories";
        } else if (
          response?.data?.data?.stories &&
          Array.isArray(response.data.data.stories)
        ) {
          stories = response.data.data.stories;
          extractionMethod = "data_data_stories";
        }
        // Method 4: response is array
        else if (Array.isArray(response)) {
          stories = response;
          extractionMethod = "response_is_array";
        }
        // Method 5: Try other possible nested structures
        else if (
          response?.result?.stories &&
          Array.isArray(response.result.stories)
        ) {
          stories = response.result.stories;
          extractionMethod = "result_stories";
        }
        // Method 6: Any property that's an array with story-like objects
        else {
          // Find any array property that might contain stories
          const findStoriesArray = (obj: any, path = ""): any[] => {
            if (!obj || typeof obj !== "object") return [];

            for (const [key, value] of Object.entries(obj)) {
              const currentPath = path ? `${path}.${key}` : key;

              if (Array.isArray(value)) {
                // Check if this array contains story-like objects
                if (value.length > 0 && value[0]?._id && value[0]?.name) {
                  extractionMethod = `found_at_${currentPath}`;
                  return value;
                }
              } else if (typeof value === "object") {
                const found = findStoriesArray(value, currentPath);
                if (found.length > 0) return found;
              }
            }
            return [];
          };

          stories = findStoriesArray(response);
        }

        if (stories.length === 0) {
          return rejectWithValue(
            `Không tìm thấy dữ liệu stories. Method tried: ${extractionMethod}`
          );
        }

        // Validate stories
        const validStories = stories.filter(
          (story) =>
            story && typeof story === "object" && story._id && story.name
        );

        return { stories: validStories, cached: false };
      } catch (err) {
        return rejectWithValue(
          err instanceof Error ? err.message : `Failed to fetch ${sectionName}`
        );
      }
    }
  );
};

// Create section fetchers
export const fetchPopularStoriesSection = createSectionFetcher(
  "popular",
  getPopularStories,
  "fetchPopularStoriesSection"
);
export const fetchOngoingStoriesSection = createSectionFetcher(
  "ongoing",
  getOngoingStories,
  "fetchOngoingStoriesSection"
);
export const fetchCompletedStoriesSection = createSectionFetcher(
  "completed",
  getCompletedStories,
  "fetchCompletedStoriesSection"
);
export const fetchUpcomingStoriesSection = createSectionFetcher(
  "upcoming",
  getUpcomingStories,
  "fetchUpcomingStoriesSection"
);

// ============================================
// 🎯 SLICE
// ============================================

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearHomeData: (state) => {
      Object.assign(state, initialState);
    },
    clearSection: (state, action: { payload: keyof HomeState["sections"] }) => {
      const section = state.sections[action.payload];
      section.stories = [];
      section.lastFetched = null;
      section.error = null;
    },
  },
  extraReducers: (builder) => {
    // Home data
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.popularStories = action.payload.popularStories;
        state.categories = action.payload.categories;
        state.lastFetched = Date.now();
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Section handlers
    const addSectionCases = (
      fetchAction: any,
      sectionKey: keyof HomeState["sections"]
    ) => {
      builder
        .addCase(fetchAction.pending, (state: HomeState) => {
          state.sections[sectionKey].loading = true;
          state.sections[sectionKey].error = null;
        })
        .addCase(fetchAction.fulfilled, (state: HomeState, action: any) => {
          const section = state.sections[sectionKey];
          section.loading = false;
          section.stories = action.payload.stories;
          section.error = null;
          if (!action.payload.cached) {
            section.lastFetched = Date.now();
          }
        })
        .addCase(fetchAction.rejected, (state: HomeState, action: any) => {
          const section = state.sections[sectionKey];
          section.loading = false;
          section.error = action.payload as string;
        });
    };

    addSectionCases(fetchPopularStoriesSection, "popular");
    addSectionCases(fetchOngoingStoriesSection, "ongoing");
    addSectionCases(fetchCompletedStoriesSection, "completed");
    addSectionCases(fetchUpcomingStoriesSection, "upcoming");
  },
});

export const { clearHomeData, clearSection } = homeSlice.actions;
export default homeSlice.reducer;
