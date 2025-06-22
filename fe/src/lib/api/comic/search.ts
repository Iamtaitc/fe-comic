//fe\src\lib\api\comic\search.ts

import { apiClient } from '../client';
import { StoryList } from './types';

export async function searchStories(query: string): Promise<StoryList> {
  try {
    const response = await apiClient.get('/comics/search', {
      params: { keyword: query },
    });
    console.log("Search Response:", response.data); // Log dữ liệu thực tế
    return response.data; // Trả về response.data để khớp với StoryList
  } catch (error) {
    console.error("API Search Error:", error);
    throw error;
  }
}