// lib/api/story/service.ts - Chỉ cho Story Detail
import { apiClient } from '../../client';
import { StoryDetailResponse } from '@/types/story';

export async function getStoryDetail(slug: string): Promise<StoryDetailResponse> {
  try {
    const response = await apiClient.get(`/comics/${slug}`);
    console.log("Story Detail API Response:", response.data);
    
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Không thể tải thông tin truyện');
    }
    
    return response.data;
  } catch (error: any) {
    console.error("Story Detail API Error:", error);
    
    // Specific error handling for story detail
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy truyện này');
    }
    if (error.response?.status === 403) {
      throw new Error('Truyện này không được phép xem');
    }
    
    throw new Error(error.message || 'Có lỗi xảy ra khi tải thông tin truyện');
  }
}