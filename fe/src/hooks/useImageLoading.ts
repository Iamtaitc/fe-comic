// hooks/useImageLoading.ts
import { useState, useCallback, useEffect } from 'react';

interface UseImageLoadingOptions {
  preloadImages?: boolean;
  onLoadComplete?: (id: string) => void;
  onLoadError?: (id: string, error: Event) => void;
}

export const useImageLoading = (
  imageIds: string[] = [],
  options: UseImageLoadingOptions = {}
) => {
  const { preloadImages = false, onLoadComplete, onLoadError } = options;
  
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});

  // 🔑 Initialize loading states
  useEffect(() => {
    const initialStates = imageIds.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setLoadingStates(initialStates);
    setErrorStates({});
  }, [imageIds]);

  // 🔑 Handle image load success
  const handleImageLoad = useCallback((id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
    setErrorStates(prev => ({ ...prev, [id]: false }));
    onLoadComplete?.(id);
  }, [onLoadComplete]);

  // 🔑 Handle image load error
  const handleImageError = useCallback((id: string, error: Event) => {
    setLoadingStates(prev => ({ ...prev, [id]: false }));
    setErrorStates(prev => ({ ...prev, [id]: true }));
    onLoadError?.(id, error);
  }, [onLoadError]);

  // 🔑 Preload images if needed
  useEffect(() => {
    if (!preloadImages || imageIds.length === 0) return;

    const preloadPromises = imageIds.map(id => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          handleImageLoad(id);
          resolve();
        };
        img.onerror = (error) => {
          const errorEvent = error instanceof Event ? error : new Event('error');
          handleImageError(id, errorEvent);
          reject(errorEvent);
        };
        // Assuming id is the image URL or you have a mapping
        img.src = id;
      });
    });

    Promise.allSettled(preloadPromises);
  }, [imageIds, preloadImages, handleImageLoad, handleImageError]);

  // 🔑 Utility functions
  const isLoading = useCallback((id: string) => loadingStates[id] ?? true, [loadingStates]);
  const hasError = useCallback((id: string) => errorStates[id] ?? false, [errorStates]);
  const isAllLoaded = useCallback(() => 
    imageIds.every(id => !loadingStates[id]), 
    [imageIds, loadingStates]
  );

  const retryImage = useCallback((id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    setErrorStates(prev => ({ ...prev, [id]: false }));
  }, []);

  return {
    loadingStates,
    errorStates,
    isLoading,
    hasError,
    isAllLoaded,
    handleImageLoad,
    handleImageError,
    retryImage,
  };
};