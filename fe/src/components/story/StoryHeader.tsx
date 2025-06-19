// src/components/story/StoryHeader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Heart, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StoryObject } from "@/lib/api/comic/types";

interface StoryHeaderProps {
  story: StoryObject;
}

export function StoryHeader({ story }: StoryHeaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div className="bg-accent/30 py-8">
      <div className="container">
        <div className="grid items-start gap-6 md:grid-cols-[250px_1fr]">
          {/* Thumbnail */}
          <div className="mx-auto w-full max-w-[250px] overflow-hidden rounded-lg border shadow-lg md:mx-0">
            <div className="relative aspect-[2/3]">
              <Image
                src={story.thumb_url}
                alt={story.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  isLoading ? "blur-sm scale-110" : "blur-0 scale-100"
                }`}
                onLoadingComplete={() => setIsLoading(false)}
                sizes="(max-width: 768px) 80vw, 250px"
                priority
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-manga-orange border-t-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* Thông tin truyện */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">{story.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">
                  {story.ratingValue.toFixed(1)} ({story.ratingCount} đánh giá)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {story.views.toLocaleString()} lượt đọc
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Cập nhật 2 giờ trước</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {story.category.map((cat) => (
                <Link key={cat._id} href={`/category/${cat.slug}`}>
                  <Badge variant="secondary" className="cursor-pointer bg-manga-orange/20 hover:bg-manga-orange/30">
                    {cat.name}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="manga" className="gap-2">
                <Link href={`/read/${story.slug}/1`}>
                  <BookOpen className="h-4 w-4" />
                  Đọc ngay
                </Link>
              </Button>
              <Button
                variant={isBookmarked ? "secondary" : "outline"}
                onClick={toggleBookmark}
                className="gap-2"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isBookmarked ? "fill-manga-orange text-manga-orange" : ""
                  }`}
                />
                {isBookmarked ? "Đã lưu" : "Lưu truyện"}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Chia sẻ</span>
              </Button>
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Giới thiệu</h2>
              <p className="mt-2 text-muted-foreground">
                {story.description || "Đang cập nhật..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}