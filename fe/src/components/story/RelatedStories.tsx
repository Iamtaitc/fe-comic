// src/components/story/RelatedStories.tsx
"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/home/StoryCard";
import { StoryObject } from "@/lib/api/comic";

interface RelatedStoriesProps {
  stories: StoryObject[];
}

export function RelatedStories({ stories }: RelatedStoriesProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(carouselRef, { once: true });
  
  const scrollPrev = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: -carouselRef.current.offsetWidth / 2,
      behavior: "smooth",
    });
  };
  
  const scrollNext = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: carouselRef.current.offsetWidth / 2,
      behavior: "smooth",
    });
  };
  
  if (stories.length === 0) return null;
  
  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="manga-section-title">
            <Sparkles className="h-6 w-6 text-manga-orange" />
            Truyện liên quan
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Trước</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Sau</span>
            </Button>
          </div>
        </div>
        
        <div
          ref={carouselRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "none" : "translateY(20px)",
            transition: "all 0.5s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
          }}
        >
          {stories.map((story) => (
            <div key={story._id} className="w-[180px] flex-shrink-0 sm:w-[200px]">
              <StoryCard story={story} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}