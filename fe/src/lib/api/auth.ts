import { apiClient } from "./client"

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UpdateProfileRequest {
  username?: string
  email?: string
  avatar?: string
  bio?: string
}

export interface User {
  _id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  updatedAt: string
  fullName?: string
  status?: string
  role?: string
  isActive?: boolean
  favorites?: any[]
  emailVerified?: boolean
  deletedAt?: any
  loginHistory?: any[]
  readingHistory?: any[]
  lastLogin?: string
  preferences?: any
  __v?: number
}

// Cập nhật AuthResponse để khớp với cấu trúc thực tế từ API
export interface AuthResponse {
  success: boolean
  message: string
  data: {
    success: boolean
    status: number
    message: string
    data: {
      token: string
      user: User
    }
    timestamp: string
  }
}

export interface UserResponse {
  success: boolean
  message: string
  data: User
}

export interface BaseResponse {
  success: boolean
  message: string
  data: null
}

export const authApi = {
  // Đăng ký
  register: async (data: RegisterRequest): Promise<UserResponse> => {
    const response = await apiClient.post("/register", data)
    return response.data
  },

  // Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/login", data)
    return response.data
  },

  // Lấy thông tin user hiện tại
  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get("/me")
    return response.data
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<BaseResponse> => {
    const response = await apiClient.patch("/change-password", data)
    return response.data
  },

  // Cập nhật profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    const response = await apiClient.patch("/update-profile", data)
    return response.data
  },

  // Đăng xuất (clear token)
  logout: () => {
    localStorage.removeItem("token")
     delete apiClient.defaults.headers.common["Authorization"]
  },
    // Initialize token từ localStorage
  initializeToken: () => {
    const token = localStorage.getItem("token")
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
    return token
  },
}