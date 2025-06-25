"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, Star, Pause, Play } from "lucide-react";
import { StoryObject } from "@/lib/api/comic/types";

// 🔑 Constants
const CAROUSEL_CONFIG = {
  AUTO_PLAY_INTERVAL: 5000,
  FEATURED_STORIES_LIMIT: 5,
  ANIMATION_DURATION: 1,
} as const;

const MOTION_VARIANTS = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
} as const;

// 🎯 Custom Hook for Carousel Logic
const useCarousel = (
  itemCount: number,
  autoPlayInterval: number = CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % itemCount);
  }, [itemCount]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount);
  }, [itemCount]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  // 🔑 Auto-play management
  useEffect(() => {
    if (isAutoPlaying && itemCount > 1) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, itemCount, nextSlide, autoPlayInterval]);

  // 🔑 Pause on user interaction
  const pauseAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeAutoPlay = useCallback(() => {
    if (isAutoPlaying && itemCount > 1) {
      intervalRef.current = setInterval(nextSlide, autoPlayInterval);
    }
  }, [isAutoPlaying, itemCount, nextSlide, autoPlayInterval]);

  return {
    currentIndex,
    isAutoPlaying,
    goToSlide,
    nextSlide,
    prevSlide,
    toggleAutoPlay,
    pauseAutoPlay,
    resumeAutoPlay,
  };
};

// 🎯 Memoized Components
const StoryImage = ({
  story,
  isLoading,
  onLoadComplete,
}: {
  story: StoryObject;
  isLoading: boolean;
  onLoadComplete: () => void;
}) => (
  <div className="relative w-full max-w-[400px] mx-auto lg:max-w-[500px] group">
    <div className="relative overflow-hidden rounded-lg shadow-2xl">
      <Image
        src={story.thumb_url}
        alt={story.name}
        fill
        className={`object-cover transition-all duration-700 ${
          isLoading ? "blur-sm scale-105" : "blur-0 scale-100"
        } group-hover:scale-105`}
        sizes="(max-width: 1024px) 400px, 500px"
        priority
        onLoad={onLoadComplete}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
    </div>
  </div>
);

const CategoryBadges = ({
  categories,
}: {
  categories: StoryObject["category"];
}) => (
  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
    {categories.slice(0, 3).map((cat) => (
      <Link
        key={cat._id}
        href={`/category/${cat.slug}`}
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                   bg-primary/90 text-primary-foreground hover:bg-primary 
                   transition-colors duration-200 backdrop-blur-sm"
      >
        {cat.name}
      </Link>
    ))}
  </div>
);

const StoryStats = ({ story }: { story: StoryObject }) => (
  <div className="mt-4 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
    <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      <span className="text-sm font-medium text-white">
        {story.ratingValue.toFixed(1)} ({story.ratingCount.toLocaleString()})
      </span>
    </div>
    <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
      <BookOpen className="h-4 w-4 text-white" />
      <span className="text-sm font-medium text-white">
        {story.views} lượt đọc
      </span>
    </div>
    <Badge
      variant={story.status === "completed" ? "default" : "secondary"}
      className="backdrop-blur-sm"
    >
      {story.status === "completed" ? "Hoàn thành" : "Đang phát hành"}
    </Badge>
  </div>
);

const CarouselControls = ({
  stories,
  currentIndex,
  isAutoPlaying,
  onSlideChange,
  onToggleAutoPlay,
}: {
  stories: StoryObject[];
  currentIndex: number;
  isAutoPlaying: boolean;
  onSlideChange: (index: number) => void;
  onToggleAutoPlay: () => void;
}) => (
  <div className="mt-8 flex items-center justify-center gap-4">
    {/* Auto-play control */}
    <button
      onClick={onToggleAutoPlay}
      className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-colors"
      aria-label={
        isAutoPlaying ? "Tạm dừng tự động chuyển" : "Tiếp tục tự động chuyển"
      }
    >
      {isAutoPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
    </button>

    {/* Slide indicators */}
    <div className="flex gap-2">
      {stories.map((story, index) => (
        <button
          key={story._id}
          className={`h-2 w-8 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? "bg-primary shadow-lg"
              : "bg-white/50 hover:bg-white/80"
          }`}
          onClick={() => onSlideChange(index)}
          aria-label={`Chuyển đến slide ${index + 1}: ${story.name}`}
        />
      ))}
    </div>
  </div>
);

interface HeroSectionProps {
  stories: StoryObject[];
}

export function HeroSection({ stories }: HeroSectionProps) {
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  // 🔑 Memoized featured stories
  const featuredStories = useMemo(
    () => stories.slice(0, CAROUSEL_CONFIG.FEATURED_STORIES_LIMIT),
    [stories]
  );

  // 🔑 Carousel logic
  const {
    currentIndex,
    isAutoPlaying,
    goToSlide,
    toggleAutoPlay,
    pauseAutoPlay,
    resumeAutoPlay,
  } = useCarousel(featuredStories.length);

  // 🔑 Current story
  const currentStory = useMemo(
    () => featuredStories[currentIndex],
    [featuredStories, currentIndex]
  );

  // 🔑 Image loading handler
  const handleImageLoad = useCallback((storyId: string) => {
    setImageLoading((prev) => ({ ...prev, [storyId]: false }));
  }, []);

  // 🔑 Initialize image loading states
  useEffect(() => {
    const initialLoadingState = featuredStories.reduce((acc, story) => {
      acc[story._id] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setImageLoading(initialLoadingState);
  }, [featuredStories]);

  // 🔑 Early return for empty stories
  if (!stories.length || !currentStory) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" />

      <div className="container relative py-16 lg:py-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory._id}
            variants={MOTION_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: CAROUSEL_CONFIG.ANIMATION_DURATION,
              ease: "easeInOut",
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Image Section */}
            <StoryImage
              story={currentStory}
              isLoading={imageLoading[currentStory._id] ?? true}
              onLoadComplete={() => handleImageLoad(currentStory._id)}
            />

            {/* Content Section */}
            <div className="flex flex-col justify-center text-center lg:text-left space-y-6">
              <CategoryBadges categories={currentStory.category} />

              <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {currentStory.name}
                </span>
              </h1>

              <StoryStats story={currentStory} />

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center lg:justify-start pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                >
                  <Link href={`/comic/${currentStory.slug}`} className="gap-2">
                    Xem chi tiết
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="gap-2 bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all"
                >
                  <Link href={`/read/${currentStory.slug}/1`}>
                    <BookOpen className="h-5 w-5" />
                    Đọc ngay
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        {featuredStories.length > 1 && (
          <CarouselControls
            stories={featuredStories}
            currentIndex={currentIndex}
            isAutoPlaying={isAutoPlaying}
            onSlideChange={goToSlide}
            onToggleAutoPlay={toggleAutoPlay}
          />
        )}
      </div>
    </section>
  );
}
