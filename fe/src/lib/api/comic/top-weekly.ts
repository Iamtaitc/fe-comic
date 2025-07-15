// 🔑 lib/api/comic/top-weekly.ts - Defensive API call with detailed logging
import { apiClient } from "../client";
import { TopWeeklyResponse } from "./types";

export async function getTopWeeklyStories(): Promise<TopWeeklyResponse> {
  try {
    const response = await apiClient.get("/comics/top-weekly");
    
    // 🔍 Debug logging để hiểu response structure
    console.log("🔍 Raw API Response:", {
      type: typeof response,
      keys: response ? Object.keys(response) : "null",
      hasData: response && "data" in response,
      structure: response
    });
    
    // 🛡️ Defensive data extraction
    let actualData = response;
    
    // Case 1: Response wrapped in { data: actualResponse }
    if (response && typeof response === "object" && "data" in response) {
      actualData = (response as any).data;
      console.log("📦 Extracted from wrapper:", actualData);
    }
    
    // Case 2: Direct response
    if (actualData && typeof actualData === "object") {
      // Validate minimum required structure
      if ("success" in actualData && "data" in actualData && actualData.data) {
        const stories = actualData.data.stories;
        if (Array.isArray(stories)) {
          console.log("✅ Valid response with", stories.length, "stories");
          return actualData as TopWeeklyResponse;
        }
      }
    }
    
    // 🚨 Fallback: Try to extract stories array from any nested structure
    const fallbackStories = extractStoriesFromAnyStructure(response);
    if (fallbackStories.length > 0) {
      console.log("🔄 Fallback extraction successful:", fallbackStories.length, "stories");
      return {
        success: true,
        message: "Fallback extraction successful",
        data: {
          stories: fallbackStories,
          period: { start: "", end: "" },
          lastUpdated: new Date().toISOString(),
          computeTime: 0,
          totalStories: fallbackStories.length
        }
      };
    }
    
    throw new Error(`Invalid API response structure. Got: ${JSON.stringify(response, null, 2)}`);
    
  } catch (error) {
    console.error("❌ API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch top weekly stories: ${message}`);
  }
}

// 🔍 Helper function to extract stories from any nested structure
function extractStoriesFromAnyStructure(obj: any): any[] {
  if (!obj || typeof obj !== "object") return [];
  
  // Direct array check
  if (Array.isArray(obj)) return obj;
  
  // Search for stories array in nested structure
  const searchKeys = ["stories", "data", "items", "results"];
  
  for (const key of searchKeys) {
    if (obj[key]) {
      if (Array.isArray(obj[key])) {
        return obj[key];
      }
      // Recursive search
      const nested = extractStoriesFromAnyStructure(obj[key]);
      if (nested.length > 0) return nested;
    }
  }
  
  // Search in all object values
  for (const value of Object.values(obj)) {
    if (value && typeof value === "object") {
      const nested = extractStoriesFromAnyStructure(value);
      if (nested.length > 0) return nested;
    }
  }
  
  return [];
}