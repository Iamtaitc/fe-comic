"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ChevronRight, Star } from "lucide-react";
import { StoryObject } from "@/lib/api/comic";

interface HeroSectionProps {
  stories: StoryObject[];
}

export function HeroSection({ stories }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const featuredStories = stories.slice(0, 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === featuredStories.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredStories.length]);

  if (stories.length === 0) return null;

  const currentStory = featuredStories[currentIndex];

  return (
    <section className="relative w-full overflow-hidden py-12">
      <div className="container relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          >
            {/* Image Section */}
            <div className="relative w-full max-w-[400px] mx-auto lg:max-w-[500px]">
              <Image
                src={currentStory.thumb_url}
                alt={currentStory.name}
                width={500}
                height={750}
                className={`object-contain brightness-75 rounded-lg ${
                  isLoading ? "blur-2xl scale-110" : "blur-0 scale-100"
                }`}
                sizes="(max-width: 1024px) 400px, 500px"
                priority
                onLoadingComplete={() => setIsLoading(false)}
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center text-center lg:text-left relative">
              {/* Gradient Background */}

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {currentStory.category.slice(0, 3).map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/80 text-primary-foreground hover:bg-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {currentStory.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-white">
                    {currentStory.ratingValue.toFixed(1)} (
                    {currentStory.ratingCount} đánh giá)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-5 w-5 text-white" />
                  <span className="text-sm font-medium text-white">
                    {currentStory.views} lượt đọc
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge
                    variant={
                      currentStory.status === "completed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {currentStory.status === "completed"
                      ? "Hoàn thành"
                      : "Đang phát hành"}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 flex gap-4 justify-center lg:justify-start">
                <Button asChild>
                  <Link href={`/comic/${currentStory.slug}`} className="gap-2">
                    Xem chi tiết
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="gap-2 bg-transparent text-white hover:text-white hover:bg-white/20"
                >
                  <Link href={`/read/${currentStory.slug}/1`}>
                    <BookOpen className="h-4 w-4" />
                    Đọc ngay
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center gap-2">
          {featuredStories.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-8 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}