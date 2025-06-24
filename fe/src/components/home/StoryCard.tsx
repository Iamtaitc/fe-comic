//fe\src\components\home\StoryCard.tsx:
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StoryObject } from "@/lib/api/comic/types";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface StoryCardProps {
  story: StoryObject;
  priority?: boolean;
}

export function StoryCard({ story, priority = false }: StoryCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const truncateName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const isTruncated = story.name.length > 15;
  const displayName = truncateName(story.name, 15);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className="manga-card group relative"
          whileHover={{
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          <Link href={`/comic/${story.slug}`} className="block">
            <div className="manga-cover relative">
              <Image
                src={story.thumb_url}
                alt={story.name}
                fill
                className={`object-cover transition-all duration-500 ${
                  isLoading ? "blur-sm scale-110" : "blur-0 scale-100"
                }`}
                onLoadingComplete={() => setIsLoading(false)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex items-center gap-2 text-white">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">{story.views} lượt đọc</span>
                </div>
              </div>
              {story.status === "completed" && (
                <Badge className="absolute right-2 top-2 bg-primary">Hoàn thành</Badge>
              )}
              {story.status === "ongoing" && (
                <Badge className="absolute right-2 top-2 bg-accent text-accent-foreground">Đang phát hành</Badge>
              )}
            </div>
            <div className="p-3">
              <h3 className="manga-title group-hover:text-primary line-clamp-2">
                {displayName}
              </h3>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">
                  {story.ratingValue.toFixed(1)} ({story.ratingCount})
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {story.category.slice(0, 2).map((cat) => (
                  <span
                    key={cat._id}
                    className="inline-block rounded-full bg-muted px-2 py-1 text-[10px]"
                  >
                    {cat.name}
                  </span>
                ))}
                {story.category.length > 2 && (
                  <span className="inline-block rounded-full bg-muted px-2 py-1 text-[10px]">
                    +{story.category.length - 2}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      </TooltipTrigger>
      {isTruncated && (
        <TooltipContent
          side="top"
          align="center"
          className="z-50 bg-background text-foreground border border-border p-3 text-base font-medium max-w-xs break-words"
          style={{ transform: "translateY(-10px)" }}
        >
          {story.name}
        </TooltipContent>
      )}
    </Tooltip>
  );
}