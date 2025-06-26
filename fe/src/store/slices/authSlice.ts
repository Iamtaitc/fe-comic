import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { authApi } from "@/lib/api/auth"
import { apiClient } from "@/lib/api/client"

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  lastLogin?: string;
  // Thêm các trường khác từ API nếu cần
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
}

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("loginUser: Starting login with credentials:", credentials);
      const startTime = Date.now();
      const response = await authApi.login(credentials);
      console.log("loginUser: API response:", JSON.stringify(response, null, 4), {
        duration: `${Date.now() - startTime}ms`,
      });
      if (!response.success) {
        throw new Error(response.message || "Đăng nhập thất bại");
      }
      console.log("loginUser: Returning response data:", response);
      return response;
    } catch (error: any) {
      console.error("loginUser: API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("registerUser: Starting register with userData:", userData);
      const response = await authApi.register(userData);
      console.log("registerUser: API response:", JSON.stringify(response, null, 4));
      if (!response.success) {
        throw new Error(response.message || "Đăng ký thất bại");
      }
      return response;
    } catch (error: any) {
      console.error("registerUser: API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(error.message || "Đăng ký thất bại");
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      console.log("getCurrentUser: Fetching user data");
      const response = await authApi.getMe();
      console.log("getCurrentUser: API response:", JSON.stringify(response, null, 4));
      if (!response.success) {
        throw new Error(response.message || "Lấy thông tin người dùng thất bại");
      }
      return response;
    } catch (error: any) {
      console.error("getCurrentUser: API error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return rejectWithValue(error.message || "Lấy thông tin người dùng thất bại");
    }
  }
)

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    const token = authApi.initializeToken();
    console.log("initializeAuth: Token from localStorage:", token);
    if (!token) {
      console.log("initializeAuth: No token found");
      return rejectWithValue("No token found");
    }
    try {
      console.log("initializeAuth: Fetching user data with token:", token);
      const response = await authApi.getMe();
      console.log("initializeAuth: getMe response:", JSON.stringify(response, null, 4));
      if (!response.success) {
        throw new Error(response.message || "Lấy thông tin người dùng thất bại");
      }
      return { user: response.data, token };
    } catch (error: any) {
      console.error("initializeAuth: getMe error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        delete apiClient.defaults.headers.common["Authorization"];
        return rejectWithValue("Invalid token");
      }
      return rejectWithValue("Failed to initialize auth: " + error.message);
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
      console.log("logout: State reset");
    },
    clearError: (state) => {
      state.error = null;
    },
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.isRegisterModalOpen = false;
    },
    openRegisterModal: (state) => {
      state.isRegisterModalOpen = true;
      state.isLoginModalOpen = false;
    },
    closeAuthModals: (state) => {
      state.isLoginModalOpen = false;
      state.isRegisterModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // HYDRATE
      .addCase('HYDRATE', (state, action: any) => {
        console.log("HYDRATE: Received payload:", JSON.stringify(action.payload, null, 4));
        if (action.payload?.auth) {
          state.user = action.payload.auth.user;
          state.token = action.payload.auth.token;
          state.isAuthenticated = action.payload.auth.isAuthenticated;
        }
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("loginUser: Pending");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("loginUser: Processing fulfilled action:", action.payload);
        
        // Xử lý nested data structure từ API
        let actualData;
        if (action.payload.data && action.payload.data.data) {
          // Trường hợp nested: response.data.data
          actualData = action.payload.data.data;
        } else if (action.payload.data) {
          // Trường hợp đơn giản: response.data
          actualData = action.payload.data;
        } else {
          console.error("loginUser: No data found in response", action.payload);
          state.error = "Invalid login response data";
          state.isLoading = false;
          return;
        }

        console.log("loginUser: Extracted actualData:", actualData);

        if (actualData && typeof actualData === 'object' && 'token' in actualData && 'user' in actualData) {
          state.user = actualData.user as User;
          state.token = actualData.token as string;
          state.isAuthenticated = true;
          state.isLoginModalOpen = false;
          state.error = null;
          
          // Lưu token vào localStorage và set header
          localStorage.setItem("token", actualData.token);
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${actualData.token}`;
          
          console.log("loginUser: Success, token saved:", actualData.token);
          console.log("loginUser: Redux state updated:", {
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            isLoading: state.isLoading,
          });
        } else {
          console.error("loginUser: Invalid actualData structure", actualData);
          state.error = "Invalid login response data structure";
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Đăng nhập thất bại";
        console.log("loginUser: Rejected, error:", action.payload);
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log("registerUser: Pending");
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isRegisterModalOpen = false;
        state.isLoginModalOpen = true;
        console.log("registerUser: Success");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || "Đăng ký thất bại";
        console.log("registerUser: Rejected, error:", action.payload);
      })
      // Initialize auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        console.log("initializeAuth: Pending");
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          apiClient.defaults.headers.common["Authorization"] = `Bearer ${action.payload.token}`;
          console.log("initializeAuth: Fulfilled, user:", action.payload.user);
          console.log("initializeAuth: Redux state updated:", {
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            isLoading: state.isLoading,
          });
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload === "Invalid token") {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
        state.error = action.payload as string;
        console.log("initializeAuth: Rejected, error:", action.payload);
      });
  },
})

export const { logout, clearError, openLoginModal, openRegisterModal, closeAuthModals } = authSlice.actions
export default authSlice.reducer