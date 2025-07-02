// components/home/hero/StoryStats.tsx
"use client";

import { memo } from "react";
import { Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StoryObject } from "@/lib/api/comic/types";

interface StoryStatsProps {
  story: StoryObject;
  className?: string;
}

// 🔧 Utility functions
const formatViews = (views?: number): string => {
  if (!views) return '0';
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
};

const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'completed': 'Hoàn thành',
    'ongoing': 'Đang cập nhật',
    'upcoming': 'Sắp ra mắt',
    'paused': 'Tạm dừng'
  };
  return statusMap[status] || 'Chưa rõ';
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'ongoing':
      return 'secondary';
    case 'paused':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const StoryStats = memo(function StoryStats({ 
  story, 
  className = "" 
}: StoryStatsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 justify-center lg:justify-start ${className}`}>
      {/* Rating */}
      {story.ratingValue > 0 && (
        <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-white">
            {story.ratingValue.toFixed(1)}
          </span>
          {story.ratingCount > 0 && (
            <span className="text-xs text-white/70">
              ({story.ratingCount.toLocaleString()})
            </span>
          )}
        </div>
      )}

      {/* Views */}
      {story.views && story.views > 0 && (
        <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
          <Eye className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">
            {formatViews(story.views)}
          </span>
        </div>
      )}

      {/* Weekly Views (if available) */}
      {story.weeklyViewCount && story.weeklyViewCount > 0 && (
        <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
          <Eye className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-white">
            {formatViews(story.weeklyViewCount)}/tuần
          </span>
        </div>
      )}

      {/* Status Badge */}
      <Badge
        variant={getStatusVariant(story.status)}
        className="backdrop-blur-sm px-3 py-1 text-sm font-medium"
      >
        {getStatusLabel(story.status)}
      </Badge>
    </div>
  );
});

StoryStats.displayName = "StoryStats";

export default StoryStats;