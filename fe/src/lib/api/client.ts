import axios from 'axios';

const baseURL = 'https://04df-2402-800-620e-a4b0-f829-eca7-60c6-1c6f.ngrok-free.app/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Retry logic
const retryRequest = async (config: any, maxRetries = 2) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await axios({ ...config, timeout: 10000 });
    } catch (error: any) {
      if (i === maxRetries - 1 || error.response?.status !== 503) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request: Headers and Token:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      token: token || 'No token',
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
    console.log("Response: Success:", {
      url: response.config.url,
      status: response.status,
      data: JSON.stringify(response.data, null, 4),
    });
    return response;
  },
  async (error) => {
    const errorDetails = {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
    console.error('API Error:', errorDetails);
    
    if (error.response?.status === 401 && error.config?.url !== '/me') {
      localStorage.removeItem("token");
      delete apiClient.defaults.headers["Authorization"];
    }
    
    if (error.config?.url === '/me' && error.response?.status === 503) {
      try {
        return await retryRequest(error.config);
      } catch (retryError) {
        console.error('Retry Failed:', retryError);
        return Promise.reject(retryError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient