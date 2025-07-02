"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/store/store"
import { initializeAuth } from "@/store/slices/authSlice"

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Chỉ khởi tạo auth nếu có token trong localStorage
    const token = localStorage.getItem("token")
    if (token) {
      dispatch(initializeAuth())
    }
  }, [dispatch])

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
  }
}
