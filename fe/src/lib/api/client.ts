import axios from 'axios';

const baseURL = 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("Raw Response Data from Server:", response.data);
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
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