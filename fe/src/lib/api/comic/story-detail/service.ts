// lib/api/comic/story-detail/service.ts - Clean & Type-Safe
import { apiClient } from "../../client";
import { StoryDetailResponse, StoryDetailData } from "@/types/story";

// Type cho response có thể có nhiều structure
type ApiResponse = StoryDetailResponse | StoryDetailData;

export async function getStoryDetail(
  slug: string
): Promise<StoryDetailResponse> {
  try {
    if (!slug?.trim()) {
      throw new Error("Slug không hợp lệ");
    }

    const response = (await apiClient.get(`/comics/${slug}`)) as
      | { data?: ApiResponse }
      | ApiResponse;

    // ApiClient trả về data directly (đã có response interceptor)
    const apiData =
      typeof response === "object" && response !== null && "data" in response
        ? (response as { data: ApiResponse }).data
        : response;

    // Normalize về đúng structure cho Redux
    if ("story" in apiData) {
      // Direct structure: { story, chapters, bookmark }
      return {
        success: true,
        message: "Success",
        data: apiData,
        timestamp: new Date().toISOString(),
      };
    }

    // Wrapped structure: { success, data: { story, chapters, bookmark } }
    if (
      typeof apiData === "object" &&
      apiData !== null &&
      "success" in apiData
    ) {
      if (!apiData.success) {
        throw new Error(
          (apiData as StoryDetailResponse).message || "API call failed"
        );
      }
      if (!(apiData as StoryDetailResponse).data?.story) {
        throw new Error("Missing story data");
      }
      return apiData as StoryDetailResponse;
    }

    throw new Error("Unexpected API response structure");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage.includes("404")) {
      throw new Error("Không tìm thấy truyện này");
    }

    throw new Error(errorMessage);
  }
}
