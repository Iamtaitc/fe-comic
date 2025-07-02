// components/home/HeroSection.tsx - Main Hero Section
"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryObject } from "@/lib/api/comic/types";

// 🧩 Import components
import { HeroImage } from "./hero/HeroImage";
import { HeroContent } from "./hero/HeroContent";
import { CarouselControls } from "./hero/CarouselControls";
import { useCarousel } from "./hero/useCarousel";

// 🔧 Configuration
const CONFIG = {
  FEATURED_LIMIT: 6,
  ANIMATION_DURATION: 0.6,
} as const;

interface HeroSectionProps {
  stories: StoryObject[];
}

// 🎨 Animation variants
const sectionAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: CONFIG.ANIMATION_DURATION,
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.4 }
    }
  }
};

// 🎭 Loading placeholder component
const HeroLoading = () => (
  <section className="relative w-full h-[500px]  flex items-center justify-center">
    <div className="text-center text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-lg">Đang tải nội dung...</p>
    </div>
  </section>
);

// 🎭 Empty state component
const HeroEmpty = () => (
  <section className="relative w-full h-[400px]  flex items-center justify-center">
    <div className="text-center text-white">
      <h2 className="text-2xl font-bold mb-2">Chưa có truyện nổi bật</h2>
      <p className="text-gray-300">Hãy quay lại sau để xem nội dung mới!</p>
    </div>
  </section>
);

export function HeroSection({ stories }: HeroSectionProps) {
  // 🔍 Process stories
  const featuredStories = useMemo(
    () => stories?.slice(0, CONFIG.FEATURED_LIMIT) || [],
    [stories]
  );

  // 🎠 Carousel logic
  const {
    currentIndex,
    isAutoPlaying,
    goToSlide,
    toggleAutoPlay,
    pauseCarousel,
    resumeCarousel
  } = useCarousel(featuredStories.length, {
    enableAutoPlay: featuredStories.length > 1,
    autoPlayInterval: 8000
  });

  const currentStory = featuredStories[currentIndex];

  // 🔍 Early returns for edge cases
  if (!stories || stories.length === 0) {
    return <HeroEmpty />;
  }

  if (!currentStory) {
    return <HeroLoading />;
  }

  return (
    <section
      className="relative w-full overflow-hidden "
      onMouseEnter={pauseCarousel}
      onMouseLeave={resumeCarousel}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]" />
      </div>

      {/* Background Gradient Animation */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container relative py-12 lg:py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory._id}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
            variants={sectionAnimations.container}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Image Section */}
            <div className="order-2 lg:order-1">
              <HeroImage 
                story={currentStory} 
                priority={currentIndex === 0}
              />
            </div>

            {/* Content Section */}
            <div className="order-1 lg:order-2">
              <HeroContent story={currentStory} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <CarouselControls
          stories={featuredStories}
          currentIndex={currentIndex}
          isAutoPlaying={isAutoPlaying}
          onSlideChange={goToSlide}
          onToggleAutoPlay={toggleAutoPlay}
        />
      </div>
    </section>
  );
}

export default HeroSection;