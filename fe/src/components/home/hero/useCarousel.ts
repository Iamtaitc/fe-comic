// components/home/hero/useCarousel.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// 🔧 Configuration
const CAROUSEL_CONFIG = {
  AUTO_PLAY_INTERVAL: 8000,
  TRANSITION_DURATION: 600,
} as const;

interface UseCarouselOptions {
  autoPlayInterval?: number;
  initialIndex?: number;
  enableAutoPlay?: boolean;
}

interface UseCarouselReturn {
  currentIndex: number;
  isAutoPlaying: boolean;
  isPaused: boolean;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  toggleAutoPlay: () => void;
  pauseCarousel: () => void;
  resumeCarousel: () => void;
  resetCarousel: () => void;
}

export const useCarousel = (
  itemCount: number,
  options: UseCarouselOptions = {}
): UseCarouselReturn => {
  const {
    autoPlayInterval = CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL,
    initialIndex = 0,
    enableAutoPlay = true
  } = options;

  // State
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(enableAutoPlay);
  const [isPaused, setIsPaused] = useState(false);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTransitioningRef = useRef(false);

  // 🎯 Navigation functions
  const goToSlide = useCallback((index: number) => {
    if (isTransitioningRef.current || index < 0 || index >= itemCount) {
      return;
    }

    isTransitioningRef.current = true;
    setCurrentIndex(index);

    // Reset transition flag after animation
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, CAROUSEL_CONFIG.TRANSITION_DURATION);
  }, [itemCount]);

  const nextSlide = useCallback(() => {
    if (itemCount <= 1) return;
    const nextIndex = (currentIndex + 1) % itemCount;
    goToSlide(nextIndex);
  }, [currentIndex, itemCount, goToSlide]);

  const prevSlide = useCallback(() => {
    if (itemCount <= 1) return;
    const prevIndex = (currentIndex - 1 + itemCount) % itemCount;
    goToSlide(prevIndex);
  }, [currentIndex, itemCount, goToSlide]);

  // 🎮 Control functions
  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  const pauseCarousel = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeCarousel = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetCarousel = useCallback(() => {
    setCurrentIndex(initialIndex);
    setIsAutoPlaying(enableAutoPlay);
    setIsPaused(false);
  }, [initialIndex, enableAutoPlay]);

  // 🔄 Auto-play effect
  useEffect(() => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Start auto-play if conditions are met
    if (isAutoPlaying && !isPaused && itemCount > 1) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying, isPaused, itemCount, autoPlayInterval, nextSlide]);

  // 🧹 Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 🔧 Handle itemCount changes
  useEffect(() => {
    if (currentIndex >= itemCount && itemCount > 0) {
      setCurrentIndex(0);
    }
  }, [itemCount, currentIndex]);

  // 📱 Handle visibility change (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseCarousel();
      } else if (isAutoPlaying) {
        resumeCarousel();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAutoPlaying, pauseCarousel, resumeCarousel]);

  return {
    currentIndex,
    isAutoPlaying,
    isPaused,
    goToSlide,
    nextSlide,
    prevSlide,
    toggleAutoPlay,
    pauseCarousel,
    resumeCarousel,
    resetCarousel
  };
};

export default useCarousel;