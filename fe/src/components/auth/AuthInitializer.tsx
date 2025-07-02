"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { initializeAuth } from "@/store/slices/authSlice"

export function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, isAuthenticated, user, token, error } = useSelector((state: RootState) => state.auth)
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    const localToken = localStorage.getItem("token")
    console.log("AuthInitializer: Initial state on mount:", {
      hasInitialized,
      isLoading,
      isAuthenticated,
      user,
      token,
      localToken,
      error,
      timestamp: new Date().toISOString(),
    })

    if (!hasInitialized && !isLoading && !isAuthenticated) {
      console.log("AuthInitializer: Dispatching initializeAuth...")
      dispatch(initializeAuth())
        .then((result) => {
          console.log("AuthInitializer: initializeAuth result:", result, {
            duration: `${Date.now() - startTime}ms`,
          })
          setHasInitialized(true)
        })
        .catch((err) => {
          console.error("AuthInitializer: initializeAuth error:", err, {
            duration: `${Date.now() - startTime}ms`,
          })
          setHasInitialized(true)
        })
    }
  }, [dispatch, hasInitialized, isLoading, isAuthenticated])

  useEffect(() => {
    if (hasInitialized) {
      console.log("AuthInitializer: State after initializeAuth:", {
        isAuthenticated,
        user,
        token,
        error,
        timestamp: new Date().toISOString(),
      })
    }
  }, [hasInitialized, isAuthenticated, user, token, error])

  return null
}