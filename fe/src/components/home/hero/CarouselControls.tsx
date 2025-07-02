// components/home/hero/CarouselControls.tsx
"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { StoryObject } from "@/lib/api/comic/types";

interface CarouselControlsProps {
  stories: StoryObject[];
  currentIndex: number;
  isAutoPlaying: boolean;
  onSlideChange: (index: number) => void;
  onToggleAutoPlay: () => void;
  className?: string;
}

// 🎨 Animation variants
const controlsAnimations = {
  button: {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  },
  indicator: {
    hover: { scale: 1.2 },
    tap: { scale: 0.9 }
  }
};

export const CarouselControls = memo(function CarouselControls({
  stories,
  currentIndex,
  isAutoPlaying,
  onSlideChange,
  onToggleAutoPlay,
  className = ""
}: CarouselControlsProps) {
  // Don't render if only one story
  if (stories.length <= 1) {
    return null;
  }

  return (
    <div className={`mt-8 flex items-center justify-center gap-4 ${className}`}>
      {/* Auto-play Toggle Button */}
      <motion.button
        onClick={onToggleAutoPlay}
        className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        variants={controlsAnimations.button}
        whileHover="hover"
        whileTap="tap"
        aria-label={isAutoPlaying ? 'Tạm dừng tự động chuyển slide' : 'Tiếp tục tự động chuyển slide'}
      >
        {isAutoPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </motion.button>

      {/* Slide Indicators */}
      <div className="flex gap-2" role="tablist" aria-label="Chọn slide">
        {stories.map((story, index) => {
          const isActive = index === currentIndex;
          
          return (
            <motion.button
              key={story._id}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                isActive
                  ? 'w-8 bg-primary shadow-lg'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => onSlideChange(index)}
              variants={controlsAnimations.indicator}
              whileHover="hover"
              whileTap="tap"
              role="tab"
              aria-selected={isActive}
              aria-controls={`slide-${index}`}
              aria-label={`Chuyển đến slide ${index + 1}: ${story.name}`}
              tabIndex={isActive ? 0 : -1}
            />
          );
        })}
      </div>

      {/* Progress Indicator (Optional) */}
      <div className="hidden sm:flex items-center gap-2 text-white/70 text-sm">
        <span>{currentIndex + 1}</span>
        <span>/</span>
        <span>{stories.length}</span>
      </div>
    </div>
  );
});

CarouselControls.displayName = "CarouselControls";

export default CarouselControls;