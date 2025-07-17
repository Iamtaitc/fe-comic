// components/comic/ChapterContent.tsx - Clean version using LazyImage
"use client";

import React, { memo, useState, useCallback } from "react";
import LazyImage from "@/components/LazyImage";

interface ChapterContentProps {
  content: string[];
  onImageInView?: (index: number) => void;
}

const ChapterContent = memo<ChapterContentProps>(({ content, onImageInView }) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

  // 📊 Handle image load
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
    onImageInView?.(index);
  }, [onImageInView]);

  // 🚨 Handle image error
  const handleImageError = useCallback((index: number) => {
    setErrorImages(prev => new Set(prev).add(index));
  }, []);

  // 🚫 Empty content
  if (!content?.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="text-xl font-semibold mb-2 text-white">Chưa có nội dung</h3>
          <p className="text-gray-400">Chapter này chưa có hình ảnh.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🖼️ Clean image display */}
      <div className="max-w-4xl mx-auto">
        {content.map((imageUrl, index) => (
          <div key={index} className="relative mb-1">
            
            {/* Page number overlay */}
            <div className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
              <span className="text-xs text-white font-medium">{index + 1}</span>
            </div>

            {/* LazyImage component */}
            <LazyImage
              src={imageUrl}
              alt={`Trang ${index + 1}`}
              className="w-full"
              isEager={index < 3} // Eager load first 3 images
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1024px"
              width={0}
              height={0}
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
            />
          </div>
        ))}
      </div>

      {/* 📊 Simple stats - floating at bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm border border-gray-700">
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-400">✅ {loadedImages.size}</span>
            {errorImages.size > 0 && (
              <span className="text-red-400">❌ {errorImages.size}</span>
            )}
            <span className="text-gray-300">{content.length}</span>
          </div>
        </div>
      </div>
    </>
  );
});

ChapterContent.displayName = "ChapterContent";
export default ChapterContent;