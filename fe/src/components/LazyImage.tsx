// components/LazyImage.tsx
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
  }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);
    const [currentSrc, setCurrentSrc] = useState<string>(src);

    // --- Reset state khi src thay đổi ---
    useEffect(() => {
      setCurrentSrc(src);
      setIsLoading(true);
      setHasError(false);
    }, [src]);

    const handleLoad = () => setIsLoading(false);

    const handleError = () => {
      // thử fallback nếu còn
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(true);
        setHasError(false);
      } else {
        setIsLoading(false);
        setHasError(true);
      }
    };

    // --- Helper tạo thẻ <Image> đúng props ---
    const renderImage = () => {
      const commonProps = {
        src: currentSrc,
        alt,
        className: `object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`,
        priority: isEager,
        sizes,
        onLoad: handleLoad,
        onError: handleError,
      };

      // Nếu có width & height → KHÔNG dùng fill
      if (width && height) {
        return (
          <Image {...commonProps} width={width} height={height} alt={alt} />
        );
      }

      return <Image {...commonProps} fill alt={alt} />;
    };

    return (
      <div
        className={`relative ${className}`}
        style={{ aspectRatio }}
        aria-busy={isLoading}
      >
        {isLoading && <Skeleton className="absolute inset-0 h-full w-full" />}

        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
            <span>Không thể tải hình ảnh</span>
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
