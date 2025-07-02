// lib/api/chapter-detail/service.ts - Chỉ cho Chapter Reader
import { apiClient } from '../../client';
import { ChapterDetailResponse } from '@/types/chapter';

export async function getChapterDetail(
  slug: string,
  chapterName: string
): Promise<ChapterDetailResponse> {
  try {
    const response = await apiClient.get(`/comics/${slug}/chapter/${chapterName}`);
    console.log("Chapter Detail API Response:", response.data);
    
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Không thể tải chapter');
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Chapter Detail API Error:", error);
    
    // Specific error handling for chapter
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy chapter này');
    }
    if (error.response?.status === 403) {
      throw new Error('Chapter này không được phép xem');
    }
    
    throw new Error(error.message || 'Có lỗi xảy ra khi tải chapter');
  }
}
