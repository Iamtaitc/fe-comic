// components/home/hero/HeroImage.tsx
"use client";

import { useState, memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StoryObject } from "@/lib/api/comic/types";

// 🎨 Animation variants
const imageAnimations = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.4 },
  },
};

interface HeroImageProps {
  story: StoryObject;
  priority?: boolean;
  className?: string;
}

export const HeroImage = memo(function HeroImage({
  story,
  priority = false,
  className = "",
}: HeroImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
    console.warn(`Failed to load hero image: ${story.thumb_url}`);
  };

  return (
    <motion.div
      className={`relative w-full max-w-[280px] mx-auto lg:max-w-[350px] ${className}`}
      variants={imageAnimations}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl group">
        {/* Main Image */}
        <Image
          src={hasError ? "/placeholder-manga.jpg" : story.thumb_url}
          alt={story.name}
          fill
          className={`object-cover transition-all duration-700 ${
            isLoading ? "blur-sm scale-105" : "blur-0 scale-100"
          } group-hover:scale-105`}
          sizes="(max-width: 1024px) 280px, 350px"
          priority={priority}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-2xl" />

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-sm">
            Không thể tải ảnh
          </div>
        )}
      </div>
    </motion.div>
  );
});

HeroImage.displayName = "HeroImage";

export default HeroImage;