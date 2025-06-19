// src/lib/api/client.ts
import axios from 'axios';

const baseURL =  'https://d050-2402-800-620e-5501-3887-23ea-2857-27e.ngrok-free.app/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (nếu cần)
apiClient.interceptors.request.use(
  (config) => {
    // Có thể thêm token, headers, etc.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Trích xuất data từ response
    return response.data;
  },
  (error) => {
    // Xử lý lỗi
    if (error.response) {
      // Lỗi từ server
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Không nhận được response
      console.error('No response received:', error.request);
    } else {
      // Lỗi khác
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);