// lib/api/comic/chapter-detail/service.ts - Fixed version
import { apiClient } from "../../client";
import { 
  ChapterDetailResponse, 
  InternalChapterResponse, 
  ExternalChapterImagesResponse,
  ChapterImage,
  Chapter
} from "@/types/chapter";

// 🔧 Type-safe response wrapper
interface RawApiResponse {
  data: string | InternalChapterResponse;
  success?: boolean;
}

// 🔧 Type-safe JSON parsing
function parseResponse(response: RawApiResponse): InternalChapterResponse {
  if (typeof response.data === 'object' && response.data !== null) {
    return response.data;
  }
  
  if (typeof response.data === 'string') {
    const cleanedString = response.data.replace(/\n/g, '').replace(/\s+/g, ' ').trim();
    return JSON.parse(cleanedString) as InternalChapterResponse;
  }
  
  if (response.success !== undefined) {
    throw new Error('Invalid response format: unexpected RawApiResponse structure');
  }
  
  throw new Error('Invalid response format');
}

// 🔧 Type-safe image fetching
async function fetchChapterImages(chapterApiUrl: string): Promise<string[]> {
  try {
    const response = await fetch(chapterApiUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) return [];

    const data: ExternalChapterImagesResponse = await response.json();
    
    if (data.status !== 'success' || !data.data?.item?.chapter_image?.length) {
      return [];
    }

    const { domain_cdn, item } = data.data;
    
    return item.chapter_image
      .sort((a: ChapterImage, b: ChapterImage) => a.image_page - b.image_page)
      .map((img: ChapterImage) => `${domain_cdn}/${item.chapter_path}/${img.image_file}`);

  } catch (error) {
    console.error('Image fetch error:', error);
    return [];
  }
}

export async function getChapterDetail(
  slug: string,
  chapterName: string
): Promise<ChapterDetailResponse> {
  try {
    if (!slug?.trim() || !chapterName?.trim()) {
      throw new Error("Invalid parameters");
    }

    const response = await apiClient.get(`/comics/${slug}/chapter/${chapterName}`);
    const apiData: InternalChapterResponse = parseResponse(response as RawApiResponse);

    if (!apiData.success || !apiData.data?.chapter || !apiData.data?.story) {
      throw new Error(apiData.message || "Invalid API response");
    }

    const { story, chapter, navigation } = apiData.data;

    // Fetch images with proper typing
    let chapterImages: string[] = [];
    
    if (chapter.chapter_api_data) {
      chapterImages = await fetchChapterImages(chapter.chapter_api_data);
    }

    // Fallback to existing images
    if (chapterImages.length === 0 && chapter.chapter_image?.length) {
      chapterImages = chapter.chapter_image.map((img: ChapterImage) => img.image_file);
    }

    // 🔧 Build complete Chapter object
    const completeChapter: Chapter = {
      ...chapter,
      content: chapterImages, // Processed image URLs
      comic_name: story.name,
    };

    const result: ChapterDetailResponse = {
      success: true,
      message: "Success",
      data: {
        story,
        chapter: completeChapter,
        navigation,
      },
      timestamp: new Date().toISOString(),
    };

    return result;

  } catch (error) {
    console.error("Chapter detail error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("timeout")) {
      throw new Error("Tải chapter quá chậm, vui lòng thử lại");
    }

    if (message.includes("404")) {
      throw new Error("Chapter không tồn tại");
    }

    throw new Error(message);
  }
}