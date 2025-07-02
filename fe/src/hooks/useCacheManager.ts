// lib/hooks/useCacheManager.ts
"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// 🔑 Cache configuration
const CACHE_CONFIG = {
  HOME_DATA: 5 * 60 * 1000, // 5 minutes
  STORIES_SECTIONS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 10 * 60 * 1000, // 10 minutes
  WEEKLY_STORIES: 15 * 60 * 1000, // 15 minutes
  FORCE_REFRESH: 30 * 60 * 1000, // 30 minutes - force refresh
} as const;

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface CacheManagerOptions {
  enableLocalStorage?: boolean;
  enableMemoryCache?: boolean;
  debugMode?: boolean;
}

export const useCacheManager = (options: CacheManagerOptions = {}) => {
  const {
    enableLocalStorage = true,
    enableMemoryCache = true,
    debugMode = false,
  } = options;

  const dispatch = useAppDispatch();
  const memoryCache = useRef<Map<string, CacheEntry>>(new Map());
  const initialized = useRef(false);

  // 🔑 Cache utilities
  const getCacheKey = useCallback(
    (type: string, params?: Record<string, any>) => {
      const baseKey = `manga_app_${type}`;
      if (!params) return baseKey;

      const sortedParams = Object.keys(params)
        .sort()
        .reduce((result, key) => {
          result[key] = params[key];
          return result;
        }, {} as Record<string, any>);

      return `${baseKey}_${JSON.stringify(sortedParams)}`;
    },
    []
  );

  // 🔑 Check if cache is valid
  const isCacheValid = useCallback((entry: CacheEntry): boolean => {
    const now = Date.now();
    const age = now - entry.timestamp;
    return age < entry.ttl;
  }, []);

  // 🔑 Get from memory cache
  const getFromMemoryCache = useCallback(
    (key: string): any => {
      if (!enableMemoryCache) return null;

      const entry = memoryCache.current.get(key);
      if (!entry) return null;

      if (isCacheValid(entry)) {
        debugMode && console.log(`📦 [Cache] Memory hit: ${key}`);
        return entry.data;
      }

      // Clean expired entry
      memoryCache.current.delete(key);
      debugMode && console.log(`🗑️ [Cache] Memory expired: ${key}`);
      return null;
    },
    [enableMemoryCache, isCacheValid, debugMode]
  );

  // 🔑 Set to memory cache
  const setToMemoryCache = useCallback(
    (key: string, data: any, ttl: number) => {
      if (!enableMemoryCache) return;

      memoryCache.current.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
      });

      debugMode && console.log(`💾 [Cache] Memory set: ${key}`);
    },
    [enableMemoryCache, debugMode]
  );

  // 🔑 Get from localStorage
  const getFromLocalStorage = useCallback(
    (key: string): any => {
      if (!enableLocalStorage || typeof window === "undefined") return null;

      try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;

        const entry: CacheEntry = JSON.parse(stored);
        if (isCacheValid(entry)) {
          debugMode && console.log(`📦 [Cache] LocalStorage hit: ${key}`);
          return entry.data;
        }

        // Clean expired entry
        localStorage.removeItem(key);
        debugMode && console.log(`🗑️ [Cache] LocalStorage expired: ${key}`);
        return null;
      } catch (error) {
        debugMode && console.error(`❌ [Cache] LocalStorage error:`, error);
        return null;
      }
    },
    [enableLocalStorage, isCacheValid, debugMode]
  );

  // 🔑 Set to localStorage
  const setToLocalStorage = useCallback(
    (key: string, data: any, ttl: number) => {
      if (!enableLocalStorage || typeof window === "undefined") return;

      try {
        const entry: CacheEntry = {
          data,
          timestamp: Date.now(),
          ttl,
        };

        localStorage.setItem(key, JSON.stringify(entry));
        debugMode && console.log(`💾 [Cache] LocalStorage set: ${key}`);
      } catch (error) {
        debugMode && console.error(`❌ [Cache] LocalStorage set error:`, error);
      }
    },
    [enableLocalStorage, debugMode]
  );

  // 🔑 Get cached data (memory first, then localStorage)
  const getCachedData = useCallback(
    (cacheKey: string): any => {
      // Try memory cache first (fastest)
      const memoryData = getFromMemoryCache(cacheKey);
      if (memoryData !== null) return memoryData;

      // Fallback to localStorage
      const localData = getFromLocalStorage(cacheKey);
      if (localData !== null) {
        // Promote to memory cache for faster access
        setToMemoryCache(cacheKey, localData, CACHE_CONFIG.STORIES_SECTIONS);
        return localData;
      }

      return null;
    },
    [getFromMemoryCache, getFromLocalStorage, setToMemoryCache]
  );

  // 🔑 Cache data in both memory and localStorage
  const setCachedData = useCallback(
    (cacheKey: string, data: any, ttl: number) => {
      setToMemoryCache(cacheKey, data, ttl);
      setToLocalStorage(cacheKey, data, ttl);
    },
    [setToMemoryCache, setToLocalStorage]
  );

  // 🔑 Check if should fetch (cache miss or expired)
  const shouldFetch = useCallback(
    (
      cacheType: keyof typeof CACHE_CONFIG,
      params?: Record<string, any>,
      force = false
    ): boolean => {
      if (force) {
        debugMode && console.log(`🔄 [Cache] Force fetch: ${cacheType}`);
        return true;
      }

      const cacheKey = getCacheKey(cacheType, params);
      const cachedData = getCachedData(cacheKey);

      const should = cachedData === null;
      debugMode && console.log(`🤔 [Cache] Should fetch ${cacheType}:`, should);

      return should;
    },
    [getCacheKey, getCachedData, debugMode]
  );

  // 🔑 Get cached data by type
  const getCacheByType = useCallback(
    (
      cacheType: keyof typeof CACHE_CONFIG,
      params?: Record<string, any>
    ): any => {
      const cacheKey = getCacheKey(cacheType, params);
      return getCachedData(cacheKey);
    },
    [getCacheKey, getCachedData]
  );

  // 🔑 Set cache by type
  const setCacheByType = useCallback(
    (
      cacheType: keyof typeof CACHE_CONFIG,
      data: any,
      params?: Record<string, any>
    ) => {
      const cacheKey = getCacheKey(cacheType, params);
      const ttl = CACHE_CONFIG[cacheType];
      setCachedData(cacheKey, data, ttl);
    },
    [getCacheKey, setCachedData]
  );

  // 🔑 Clear cache
  const clearCache = useCallback(
    (pattern?: string) => {
      // Clear memory cache
      if (pattern) {
        for (const [key] of memoryCache.current.entries()) {
          if (key.includes(pattern)) {
            memoryCache.current.delete(key);
            debugMode && console.log(`🗑️ [Cache] Cleared memory: ${key}`);
          }
        }
      } else {
        memoryCache.current.clear();
        debugMode && console.log(`🗑️ [Cache] Cleared all memory cache`);
      }

      // Clear localStorage
      if (enableLocalStorage && typeof window !== "undefined") {
        try {
          const keys = Object.keys(localStorage);
          for (const key of keys) {
            if (
              key.startsWith("manga_app_") &&
              (!pattern || key.includes(pattern))
            ) {
              localStorage.removeItem(key);
              debugMode &&
                console.log(`🗑️ [Cache] Cleared localStorage: ${key}`);
            }
          }
        } catch (error) {
          debugMode &&
            console.error(`❌ [Cache] Clear localStorage error:`, error);
        }
      }
    },
    [enableLocalStorage, debugMode]
  );

  // 🔑 Cleanup expired cache on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const cleanupExpiredCache = () => {
      debugMode && console.log(`🧹 [Cache] Cleaning up expired cache...`);

      // Cleanup localStorage
      if (enableLocalStorage && typeof window !== "undefined") {
        try {
          const keys = Object.keys(localStorage);
          let cleanedCount = 0;

          for (const key of keys) {
            if (key.startsWith("manga_app_")) {
              try {
                const stored = localStorage.getItem(key);
                if (stored) {
                  const entry: CacheEntry = JSON.parse(stored);
                  if (!isCacheValid(entry)) {
                    localStorage.removeItem(key);
                    cleanedCount++;
                  }
                }
              } catch {
                localStorage.removeItem(key);
                cleanedCount++;
              }
            }
          }

          debugMode &&
            console.log(
              `🧹 [Cache] Cleaned ${cleanedCount} expired localStorage entries`
            );
        } catch (error) {
          debugMode && console.error(`❌ [Cache] Cleanup error:`, error);
        }
      }
    };

    cleanupExpiredCache();
  }, [enableLocalStorage, isCacheValid, debugMode]);

  // 🔑 Cache status for debugging
  const getCacheStatus = useCallback(() => {
    const memorySize = memoryCache.current.size;
    let localStorageSize = 0;

    if (enableLocalStorage && typeof window !== "undefined") {
      const keys = Object.keys(localStorage);
      localStorageSize = keys.filter((key) =>
        key.startsWith("manga_app_")
      ).length;
    }

    return {
      memoryEntries: memorySize,
      localStorageEntries: localStorageSize,
      totalEntries: memorySize + localStorageSize,
    };
  }, [enableLocalStorage]);

  return {
    // Cache operations
    shouldFetch,
    getCacheByType,
    setCacheByType,
    clearCache,

    // Utilities
    getCacheStatus,

    // Config
    CACHE_CONFIG,
  };
};
