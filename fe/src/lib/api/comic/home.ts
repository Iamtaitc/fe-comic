import { apiClient } from "../client";
import { CategoryObject, StoryObject } from "./types";

// 🏷️ Server Response Types (thực tế từ API)
interface ServerStoriesResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    stories: StoryObject[];
  };
}

interface ServerHomeResponse {
  latestStorys: ServerStoriesResponse;
  popularStorys: ServerStoriesResponse;
  categories: CategoryObject[];
}

// 🎯 Client Response Type (cho consumer sử dụng)
export interface HomeDataResponse {
  success: boolean;
  message: string;
  data: {
    latestStorys: {
      success: boolean;
      status: number;
      message: string;
      data: {
        stories: StoryObject[];
      };
    };
    popularStorys: {
      success: boolean;
      status: number;
      message: string;
      data: {
        stories: StoryObject[];
      };
    };
    categories: CategoryObject[];
  };
  timestamp: string;
}

// 🔧 Utility Functions
const buildFullUrl = (endpoint: string): string => {
  // Lấy baseURL từ apiClient
  const client = apiClient.getClient();
  const baseUrl = client.defaults.baseURL || "";
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

const logApiCall = (
  method: string,
  fullUrl: string,
  status: "START" | "SUCCESS" | "ERROR",
  duration?: number
): void => {
  const timestamp = new Date().toISOString();
  const emoji = status === "START" ? "🚀" : status === "SUCCESS" ? "✅" : "❌";

  if (status === "START") {
    console.log(`${emoji} [${method}] Starting API call`);
    console.log(`📍 Full URL: ${fullUrl}`);
    console.log(`⏰ Timestamp: ${timestamp}`);
  } else {
    const durationText = duration ? ` (${duration}ms)` : "";
    console.log(`${emoji} [${method}] ${fullUrl} - ${status}${durationText}`);
  }
};

// 🏠 Main Home Data Function
export async function getHomeData(): Promise<HomeDataResponse> {
  const endpoint = "/home";
  const fullUrl = buildFullUrl(endpoint);
  const startTime = performance.now();

  // 📊 Log API call start
  logApiCall("GET", fullUrl, "START");

  try {
    // 🔑 Gọi API với correct typing
    const serverResponse = await apiClient.get<ServerHomeResponse>(endpoint);

    const duration = Math.round(performance.now() - startTime);
    logApiCall("GET", fullUrl, "SUCCESS", duration);

    // 🎯 Transform server response thành client format
    const transformedResponse: HomeDataResponse = {
      success: true,
      message: "Home data fetched successfully",
      data: {
        latestStorys: serverResponse.latestStorys,
        popularStorys: serverResponse.popularStorys,
        categories: serverResponse.categories,
      },
      timestamp: new Date().toISOString(),
    };

    // 📋 Log response summary
    if (process.env.NODE_ENV === "development") {
      console.log("📋 Home Data Summary:", {
        latestStories: serverResponse.latestStorys?.data?.stories?.length || 0,
        popularStories:
          serverResponse.popularStorys?.data?.stories?.length || 0,
        categories: serverResponse.categories?.length || 0,
      });
    }

    return transformedResponse;
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    logApiCall("GET", fullUrl, "ERROR", duration);

    // 🔥 Enhanced error logging với full context
    console.error("🔥 API Error in getHomeData:", {
      fullUrl,
      endpoint,
      duration,
      error,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }
}

// 🔧 Alternative: Simplified version nếu không cần transform
export async function getHomeDataSimple(): Promise<ServerHomeResponse> {
  const endpoint = "/home";
  try {
    const response = await apiClient.get<ServerHomeResponse>(endpoint);
    return response;
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// 🎯 Type-safe helper functions
export const getLatestStories = async (): Promise<StoryObject[]> => {
  const homeData = await getHomeData();
  return homeData.data.latestStorys.data.stories;
};

export const getPopularStories = async (): Promise<StoryObject[]> => {
  const homeData = await getHomeData();
  return homeData.data.popularStorys.data.stories;
};

export const getCategories = async (): Promise<CategoryObject[]> => {
  const homeData = await getHomeData();
  return homeData.data.categories;
};

// 🐛 Debug utility
export const debugHomeEndpoint = (): void => {
  const fullUrl = buildFullUrl("/home");
  console.group("🐛 Home Endpoint Debug");
  console.log("Endpoint:", "/home");
  console.log("Full URL:", fullUrl);
  console.log("Expected Response Type:", "ServerHomeResponse");
  console.groupEnd();
};
