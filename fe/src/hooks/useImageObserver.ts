// hooks/useImageObserver.ts
import { useEffect, useRef, useState, useCallback } from "react";

export const useImageObserver = (contentLength: number) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setCurrentImageIndex(index);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-20% 0px'
      }
    );

    // Attach observer to image elements
    const imageElements = document.querySelectorAll('[data-index]');
    imageElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    });
  }, []);

  useEffect(() => {
    if (contentLength > 0) {
      // Delay setup to ensure DOM is ready
      const timer = setTimeout(setupObserver, 100);
      return () => clearTimeout(timer);
    }
  }, [contentLength, setupObserver]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { currentImageIndex, setCurrentImageIndex };
};