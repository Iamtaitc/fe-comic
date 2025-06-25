// src/store/slices/homeSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StoryObject, CategoryObject } from "@/lib/api/comic/types";
import { getHomeData } from '@/lib/api/comic/home';
import { getPopularStories } from "@/lib/api/comic/popular";
import { getOngoingStories, getCompletedStories, getUpcomingStories } from "@/lib/api/comic/status";

// 🔑 Story section interface
interface StorySection {
  stories: StoryObject[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface HomeState {
  // Original home data
  popularStories: StoryObject[];
  categories: CategoryObject[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // 🔑 Individual story sections with caching
  sections: {
    popular: StorySection;
    ongoing: StorySection;
    completed: StorySection;
    upcoming: StorySection;
  };
}

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

// 🔑 Original home data thunk
export const fetchHomeData = createAsyncThunk(
  "home/fetchHomeData",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { home: HomeState };
    const now = Date.now();
    
    // Cache trong 5 phút
    if (state.home.lastFetched && (now - state.home.lastFetched) < 5 * 60 * 1000) {
      return {
        popularStories: state.home.popularStories,
        categories: state.home.categories,
      };
    }

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

// 🔑 API Response type
interface ApiResponse {
  data?: {
    success?: boolean;
    data?: {
      data?: {
        stories?: StoryObject[];
      };
      stories?: StoryObject[];
    };
  };
}

// 🔑 Generic story section fetcher
const createStoryFetcher = (
  sectionName: keyof HomeState['sections'],
  fetchFunction: (params: { page?: number; limit?: number }) => Promise<ApiResponse>,
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
      const cacheTime = 5 * 60 * 1000; // 5 minutes

      // Skip if recently fetched and not forced
      if (!params.force && section.lastFetched && (now - section.lastFetched) < cacheTime) {
        return { stories: section.stories, cached: true };
      }

      try {
        const response = await fetchFunction({ 
          page: params.page || 1, 
          limit: params.limit || 10 
        });
        
        // Handle different response structures
        let stories: StoryObject[] = [];
        if (response?.data?.success && response.data.data?.data?.stories) {
          stories = response.data.data.data.stories;
        } else if (response?.data?.data?.stories) {
          stories = response.data.data.stories;
        }

        console.log(`[${actionName}] Fetched ${stories.length} stories`);
        return { stories, cached: false };
      } catch (err) {
        console.error(`[${actionName}] Error:`, err);
        return rejectWithValue(
          err instanceof Error ? err.message : `Không thể tải ${sectionName}`
        );
      }
    }
  );
};

// 🔑 Story section thunks
export const fetchPopularStoriesSection = createStoryFetcher(
  'popular',
  getPopularStories,
  'fetchPopularStoriesSection'
);

export const fetchOngoingStoriesSection = createStoryFetcher(
  'ongoing',
  getOngoingStories,
  'fetchOngoingStoriesSection'
);

export const fetchCompletedStoriesSection = createStoryFetcher(
  'completed',
  getCompletedStories,
  'fetchCompletedStoriesSection'
);

export const fetchUpcomingStoriesSection = createStoryFetcher(
  'upcoming',
  getUpcomingStories,
  'fetchUpcomingStoriesSection'
);

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    // 🔑 Clear all data
    clearHomeData: (state) => {
      state.popularStories = [];
      state.categories = [];
      state.lastFetched = null;
      state.error = null;
      // Clear sections
      Object.keys(state.sections).forEach(key => {
        const section = state.sections[key as keyof typeof state.sections];
        section.stories = [];
        section.lastFetched = null;
        section.error = null;
      });
    },
    
    // 🔑 Clear specific section
    clearSection: (state, action: { payload: keyof HomeState['sections'] }) => {
      const section = state.sections[action.payload];
      section.stories = [];
      section.lastFetched = null;
      section.error = null;
    },
    
    // 🔑 Force refresh section
    invalidateSection: (state, action: { payload: keyof HomeState['sections'] }) => {
      state.sections[action.payload].lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    // Original home data
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
      })
      
      // Popular stories section
      .addCase(fetchPopularStoriesSection.pending, (state) => {
        state.sections.popular.loading = true;
        state.sections.popular.error = null;
      })
      .addCase(fetchPopularStoriesSection.fulfilled, (state, action) => {
        state.sections.popular.loading = false;
        state.sections.popular.stories = action.payload.stories;
        state.sections.popular.error = null;
        if (!action.payload.cached) {
          state.sections.popular.lastFetched = Date.now();
        }
      })
      .addCase(fetchPopularStoriesSection.rejected, (state, action) => {
        state.sections.popular.loading = false;
        state.sections.popular.error = action.payload as string;
      })
      
      // Ongoing stories section
      .addCase(fetchOngoingStoriesSection.pending, (state) => {
        state.sections.ongoing.loading = true;
        state.sections.ongoing.error = null;
      })
      .addCase(fetchOngoingStoriesSection.fulfilled, (state, action) => {
        state.sections.ongoing.loading = false;
        state.sections.ongoing.stories = action.payload.stories;
        state.sections.ongoing.error = null;
        if (!action.payload.cached) {
          state.sections.ongoing.lastFetched = Date.now();
        }
      })
      .addCase(fetchOngoingStoriesSection.rejected, (state, action) => {
        state.sections.ongoing.loading = false;
        state.sections.ongoing.error = action.payload as string;
      })
      
      // Completed stories section
      .addCase(fetchCompletedStoriesSection.pending, (state) => {
        state.sections.completed.loading = true;
        state.sections.completed.error = null;
      })
      .addCase(fetchCompletedStoriesSection.fulfilled, (state, action) => {
        state.sections.completed.loading = false;
        state.sections.completed.stories = action.payload.stories;
        state.sections.completed.error = null;
        if (!action.payload.cached) {
          state.sections.completed.lastFetched = Date.now();
        }
      })
      .addCase(fetchCompletedStoriesSection.rejected, (state, action) => {
        state.sections.completed.loading = false;
        state.sections.completed.error = action.payload as string;
      })
      
      // Upcoming stories section
      .addCase(fetchUpcomingStoriesSection.pending, (state) => {
        state.sections.upcoming.loading = true;
        state.sections.upcoming.error = null;
      })
      .addCase(fetchUpcomingStoriesSection.fulfilled, (state, action) => {
        state.sections.upcoming.loading = false;
        state.sections.upcoming.stories = action.payload.stories;
        state.sections.upcoming.error = null;
        if (!action.payload.cached) {
          state.sections.upcoming.lastFetched = Date.now();
        }
      })
      .addCase(fetchUpcomingStoriesSection.rejected, (state, action) => {
        state.sections.upcoming.loading = false;
        state.sections.upcoming.error = action.payload as string;
      })
      
      // Handle HYDRATE
      .addCase('HYDRATE', (state, action: unknown) => {
        const hydrateAction = action as { payload?: { home?: HomeState } };
        if (hydrateAction.payload?.home) {
          return {
            ...state,
            ...hydrateAction.payload.home,
            loading: state.loading || hydrateAction.payload.home.loading,
          };
        }
        return state;
      });
  },
});

export const { clearHomeData, clearSection, invalidateSection } = homeSlice.actions;
export default homeSlice.reducer;