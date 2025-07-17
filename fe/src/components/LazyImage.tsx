// components/LazyImage.tsx - Enhanced for manga
"use client";

import React, { useState, useEffect, memo } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt?: string;
  className?: string;
  isEager?: boolean;
  fallbackSrc?: string;
  aspectRatio?: string;
  sizes?: string; 
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage – component tải ảnh lười (lazy) kèm Skeleton & fallback.
 */
const LazyImage = memo<LazyImageProps>(
  ({
    src,
    alt = "image",
    className = "",
    isEager = false,
    fallbackSrc = "/placeholder.jpg",
    aspectRatio = "auto",
    sizes,
    width,
    height,
    onLoad,
    onError,
  }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [currentSrc, setCurrentSrc] = useState<string>(src);

    // Reset state khi src thay đổi
    useEffect(() => {
      setCurrentSrc(src);
      setIsLoading(true);
      setHasError(false);
    }, [src]);

    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleError = () => {
      // Thử fallback nếu còn
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(true);
        setHasError(false);
      } else {
        setIsLoading(false);
        setHasError(true);
        onError?.();
      }
    };

    // Render image với props đúng
    const renderImage = () => {
      const commonProps = {
        src: currentSrc,
        alt,
        className: `transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`,
        priority: isEager,
        sizes,
        onLoad: handleLoad,
        onError: handleError,
        quality: 95, // High quality for manga
      };

      // 🔧 For manga pages - use natural dimensions
      if (width === 0 && height === 0) {
        return (
          <Image
            {...commonProps}
            width={0}
            height={0}
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              display: 'block'
            }}
          />
        );
      }

      // Fixed dimensions
      if (width && height) {
        return (
          <Image {...commonProps} width={width} height={height} />
        );
      }

      // Fill container
      return <Image {...commonProps} fill className={`${commonProps.className} object-contain`} />;
    };

    return (
      <div
        className={`relative ${className}`}
        style={{ aspectRatio }}
        aria-busy={isLoading}
      >
        {/* Loading skeleton */}
        {isLoading && (
          <Skeleton className="absolute inset-0 h-full w-full min-h-[300px]" />
        )}

        {/* Error state */}
        {hasError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900 text-gray-400 min-h-[300px]">
            <div className="text-3xl mb-2">🚫</div>
            <p className="text-sm mb-2">Không thể tải hình ảnh</p>
            <button
              onClick={() => {
                setCurrentSrc(src);
                setIsLoading(true);
                setHasError(false);
              }}
              className="px-3 py-1 bg-gray-700 rounded text-xs hover:bg-gray-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : (
          renderImage()
        )}
      </div>
    );
  }
);

LazyImage.displayName = "LazyImage";
export default LazyImage;