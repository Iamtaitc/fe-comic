import { apiClient } from "../client";
import { TopWeeklyResponse } from "./types";

export async function getTopWeeklyStories(): Promise<TopWeeklyResponse> {
  try {
    const response = await apiClient.get("/comics/top-weekly");

    // Validate response structure
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format");
    }

    // Handle different response structures
    const data = response.data || response;

    if (
      !data.success ||
      !data.data?.stories ||
      !Array.isArray(data.data.stories)
    ) {
      throw new Error("Invalid API response structure");
    }

    return data as TopWeeklyResponse;
  } catch (error) {
    console.error("Error fetching top weekly stories:", error);
    throw new Error(
      `Failed to fetch top weekly stories: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
