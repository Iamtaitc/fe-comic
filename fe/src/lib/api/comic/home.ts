import { apiClient } from '../client';
import { CategoryObject, StoryObject } from './types';


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


export async function getHomeData(): Promise<HomeDataResponse> {
  try {
    const response = await apiClient.get('/home');
    console.log("API Response Data:", response.data); // Log dữ liệu thực tế
    return response.data; // Trả về response.data
  } catch (error) {
    console.error("API Error:", error); // Log lỗi chi tiết
    throw error; // Ném lỗi để Redux xử lý
  }
}