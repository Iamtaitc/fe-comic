import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

// 🏷️ Enhanced Type Definitions
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  timeout: number;
}

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  retryConfig?: RetryConfig;
  headers?: Record<string, string>;
}

// 🔧 Server Error Response Types
interface ServerErrorResponse {
  message?: string;
  error?: string;
  details?: Record<string, unknown>;
}

// 🎯 Generic constraint để đảm bảo type safety
type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

// 🔧 Environment Configuration
const getEnvironmentConfig = (): ApiClientConfig => {
  const isProduction = process.env.API_URL === "production";

  return {
    baseURL: isProduction
      ? "https://04df-2402-800-620e-a4b0-f829-eca7-60c6-1c6f.ngrok-free.app/api/v1"
      : "http://localhost:3000/api/v1",
    timeout: 10000,
    retryConfig: {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 10000,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  };
};

// 🔁 Enhanced Retry Logic with proper typing
const retryRequest = async <T>(
  config: AxiosRequestConfig,
  retryConfig: RetryConfig
): Promise<AxiosResponse<T>> => {
  const { maxRetries, baseDelay, timeout } = retryConfig;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await axios<T>({
        ...config,
        timeout,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetryableError = axiosError.response?.status === 503;

      if (isLastAttempt || !isRetryableError) {
        throw error;
      }

      // 📈 Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise<void>((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Retry logic failed unexpectedly");
};

// 🏗️ API Client Class với strict typing
class ApiClient {
  private client = axios.create();
  private config: ApiClientConfig;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = { ...getEnvironmentConfig(), ...config };
    this.setupClient();
    this.setupInterceptors();
  }

  private setupClient(): void {
    this.client.defaults.baseURL = this.config.baseURL;
    this.client.defaults.timeout = this.config.timeout;

    if (this.config.headers) {
      Object.assign(this.client.defaults.headers.common, this.config.headers);
    }
  }

  private setupInterceptors(): void {
    // 🔐 Request Interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        this.logRequest(config);
        return config;
      },
      (error: AxiosError) => {
        console.error("Request Error:", error);
        return Promise.reject(this.createApiError(error));
      }
    );

    // 🛡️ Response Interceptor with proper typing
    this.client.interceptors.response.use(
      <T>(response: AxiosResponse<T>) => {
        this.logResponse(response);
        return response;
      },
      async (error: AxiosError): Promise<never> => {
        return this.handleResponseError(error);
      }
    );
  }

  private async handleResponseError(error: AxiosError): Promise<never> {
    const errorDetails = this.createApiError(error);
    console.error("API Error:", errorDetails);

    // ✅ Handle 401: Clear token if not /me endpoint
    if (error.response?.status === 401 && error.config?.url !== "/me") {
      this.clearAuthentication();
    }

    // ✅ Retry logic for /me endpoint with 503 error
    if (this.shouldRetry(error)) {
      try {
        const retryConfig = this.config.retryConfig!;
        // 🎯 Retry với generic type từ original config
        const retryResult = await retryRequest<unknown>(error.config!, retryConfig);
        return retryResult as never; // Type assertion để match Promise<never>
      } catch (retryError) {
        console.error("Retry Failed:", retryError);
        throw this.createApiError(retryError as AxiosError);
      }
    }

    throw errorDetails;
  }

  private shouldRetry(error: AxiosError): boolean {
    return Boolean(
      error.config?.url === "/me" &&
        error.response?.status === 503 &&
        this.config.retryConfig
    );
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem("token");
    } catch {
      // Handle SSR or localStorage unavailable
      return null;
    }
  }

  private clearAuthentication(): void {
    try {
      localStorage.removeItem("token");
      delete this.client.defaults.headers.common["Authorization"];
    } catch {
      // Handle SSR or localStorage unavailable
      console.warn("Could not clear authentication from localStorage");
    }
  }

  private createApiError(error: AxiosError): ApiError {
    const response = error.response;
    const responseData = (response?.data as ServerErrorResponse) || {};
    
    return {
      message: responseData.message || responseData.error || error.message || "Unknown API error",
      status: response?.status || 0,
      code: error.code,
      details: responseData.details,
    };
  }

  private logRequest(config: AxiosRequestConfig): void {
    if (process.env.NODE_ENV === "development") {
      console.log("Request:", {
        url: config.url,
        method: (config.method?.toUpperCase() || "GET") as ApiMethod,
        headers: config.headers,
        token: this.getStoredToken() ? "Present" : "None",
        params: config.params,
      });
    }
  }

  private logResponse<T>(response: AxiosResponse<T>): void {
    if (process.env.NODE_ENV === "development") {
      console.log("Response Success:", {
        url: response.config.url,
        status: response.status,
        data: JSON.stringify(response.data, null, 2),
      });
    }
  }

  // 🚀 Public API Methods với strict generic constraints
  public async get<T = unknown>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  public async post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  public async patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  public async put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  public async delete<T = unknown>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // 🔧 Utility Methods
  public setToken(token: string): void {
    try {
      localStorage.setItem("token", token);
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch {
      console.warn("Could not store token in localStorage");
    }
  }

  public clearToken(): void {
    this.clearAuthentication();
  }

  public getClient(): typeof this.client {
    return this.client;
  }

  // 🎯 Generic method cho custom requests
  public async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<ApiResponse<T>>(config);
    return response.data.data;
  }
}

// 🏭 Factory & Export
const apiClient = new ApiClient();

export { ApiClient, apiClient };
export type { 
  ApiResponse, 
  ApiError, 
  ApiClientConfig, 
  RetryConfig,
  ServerErrorResponse,
  ApiMethod 
};
export default apiClient;