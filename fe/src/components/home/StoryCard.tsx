// components/common/StoryCard.tsx - Optimized version
"use client";

import { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { StoryObject } from "@/lib/api/comic/types";

interface StoryCardProps {
  story: StoryObject;
  priority?: boolean;
  className?: string;
}

// 🔑 Status configuration
const STATUS_CONFIG = {
  completed: { label: "Hoàn thành", className: "bg-green-500 text-white" },
  ongoing: { label: "Đang phát hành", className: "bg-blue-500 text-white" },
  upcoming: { label: "Sắp ra mắt", className: "bg-purple-500 text-white" },
  paused: { label: "Tạm dừng", className: "bg-orange-500 text-white" },
} as const;

// 🔑 Utility functions
const truncateName = (name: string, maxLength: number = 15): string => {
  return name.length <= maxLength ? name : `${name.substring(0, maxLength)}...`;
};

const formatViews = (views?: number): string => {
  if (!views) return "0";
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

export const StoryCard = memo(function StoryCard({
  story,
  priority = false,
  className = "",
}: StoryCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const {
    _id,
    name,
    slug,
    thumb_url,
    status,
    category,
    ratingValue,
    ratingCount,
    views,
  } = story;

  const displayName = truncateName(name);
  const isTruncated = name.length > 15;
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={`manga-card group relative ${className}`}
          whileHover={{
            y: -5,
            transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
          }}
          layout
        >
          <Link href={`/comic/${slug}`} className="block">
            {/* Thumbnail Container */}
            <div className="manga-cover relative overflow-hidden rounded-lg">
              <Image
                src={thumb_url || "/placeholder-manga.jpg"}
                alt={name}
                fill
                className={`object-cover transition-all duration-500 ${
                  isLoading ? "blur-sm scale-110" : "blur-0 scale-100"
                } group-hover:scale-105`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7OAPS4SBVgvmZnpOB8+EtM8+zz2mEr0LRGmtDjTaEL2hx+PLDgc+vdXgJbSbB0LiV7V7v9rUcZAMLAAtYx8P8+tHDxDMUJT20HmHGe0KM0pNRJJ8QoBq1cQo5SjY9AcgN+R8pJI2fFjdlJU3yK8LNxcAffnfC5sVCmwK6RjmbhnsadIh/s=D4"
              />

              {/* Loading Spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span className="text-xs">
                      {formatViews(views)} lượt đọc
                    </span>
                  </div>
                  {ratingValue > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{ratingValue.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              {statusConfig && (
                <Badge
                  className={`absolute right-2 top-2 text-xs ${statusConfig.className} border-0`}
                >
                  {statusConfig.label}
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              {/* Title */}
              <h3 className="manga-title group-hover:text-primary transition-colors duration-200 line-clamp-2 font-medium text-sm">
                {displayName}
              </h3>

              {/* Rating */}
              {ratingValue > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">
                    {ratingValue.toFixed(1)} ({ratingCount || 0})
                  </span>
                </div>
              )}

              {/* Categories */}
              {category && category.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {category.slice(0, 2).map((cat) => (
                    <Badge
                      key={cat._id}
                      variant="secondary"
                      className="text-[10px] px-2 py-0 h-4 bg-muted/50 hover:bg-muted/70 transition-colors"
                    >
                      {cat.name}
                    </Badge>
                  ))}
                  {category.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0 h-4 bg-muted/50"
                    >
                      +{category.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      </TooltipTrigger>

      {/* Tooltip for truncated names */}
      {isTruncated && (
        <TooltipContent
          side="top"
          align="center"
          className="z-50 max-w-xs break-words border border-border bg-background p-3 text-sm font-medium text-foreground"
          sideOffset={8}
        >
          {name}
        </TooltipContent>
      )}
    </Tooltip>
  );
});

StoryCard.displayName = "StoryCard";
