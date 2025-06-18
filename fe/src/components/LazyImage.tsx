// components/LazyImage.tsx
import React, { useState, memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  isEager?: boolean;
  fallbackSrc?: string;
  aspectRatio?: string;
}

const LazyImage = memo(({ 
  src, 
  alt, 
  className = "", 
  isEager = false,
  fallbackSrc = "/placeholder.jpg",
  aspectRatio = "auto"
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  return (
    <div className={`relative ${className}`} style={{ aspectRatio }}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span>Không thể tải hình ảnh</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading={isEager ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
        />
      )}
    </div>
  );
});

LazyImage.displayName = "LazyImage";
export default LazyImage;

